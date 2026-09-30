import {getGameApiBase} from './game-id';
import {AdoptionJournal} from './kit-adoption.mjs';
import {ProposalJournal} from './kit-proposal.mjs';
import {RecoverableSessionClient,recoveryScope} from './kit-recovery.mjs';
import {advanceResident} from './kit-npc-motion.mjs';
import {financeTerminalErrors} from './recovery-policy.mjs';
import {orderJourneys} from './journey-directory.mjs';
// Replaced only in an explicitly generated, isolated review build.
const reviewDeployment=getGameApiBase();
let proposal,roomProgress=null,adoption,candidateLocked=false,head,info,client,store,serverOffset=0,positionReader,focus=null,tail=Promise.resolve();
const serial=work=>{const p=tail.then(work);tail=p.catch(()=>{});return p;};
const transport=async(path,body)=>{
 const response=await fetch((reviewDeployment?reviewDeployment+'/api/story':'/__finance_lab')+path,{method:body?'POST':'GET',credentials:'same-origin',headers:{'X-Finance-Local-Review':'1',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(body?.input?.kind==='free-talk'?75000:20000)});
 const stamp=Number(response.headers.get('X-Lab-Time'));if(Number.isFinite(stamp))serverOffset=stamp-Date.now();
 const value=await response.json();if(!response.ok)throw Error(value.error??'LOCAL_SERVICE_UNAVAILABLE');return value;
};
const assertHead=h=>{if(h?.canary!=='finance-game-r15'||h.world!=='before-the-close'||!h.journey||h.journey.id!==h.id)throw Error('WORLD_MISMATCH');};
async function refreshStore(){
 const directory=await transport('/sessions');const journeys=await Promise.all(directory.sessions.map(async x=>(x.id===head.id?head:await client.get(x.id)).journey));
 store={version:1,active:head.id,journeys:orderJourneys(journeys),locale:head.locale,localeMode:'manual',muted:store?.muted??false};return store;
}
export async function initializeAuthority(){
 if(reviewDeployment?(location.protocol!=='https:'||!location.pathname.startsWith(reviewDeployment+'/')):location.hostname!=='127.0.0.1')throw Error('REVIEW_DEPLOYMENT_MISMATCH');
 info=await transport('/info');if(info.mode!==(reviewDeployment?'public-player-v1':'local-source-canary'))throw Error('REVIEW_MODE_MISMATCH');
 client=new RecoverableSessionClient(alteruLocalStorage,recoveryScope({deployment:location.origin+(reviewDeployment??'')+':'+info.sourceHash+(info.recoveryNamespace?':'+info.recoveryNamespace:''),subject:info.identity,world:'before-the-close'}),transport,
  {assertHead,scene:h=>h.state.location,resumeFromDirectory:true,terminalErrors:financeTerminalErrors},
  (key,work)=>navigator.locks?navigator.locks.request(key,work):work());
 head=await client.enroll(navigator.language.startsWith('zh')?'zh':'en');const recovered=await client.recover();if(recovered)head=recovered.head;
 adoption=new AdoptionJournal({storage:alteruLocalStorage,prefix:recoveryScope({deployment:location.origin+':'+info.sourceHash+(info.recoveryNamespace?':'+info.recoveryNamespace:''),subject:info.identity,world:'before-the-close'})+'dynamic:',post:b=>transport('/dynamic/adopt',b),get:id=>client.get(id),assertResult:(r,b)=>{assertHead(r.head);if(r.source_id!==b.session_id||r.artifact_hash!==b.artifact_hash)throw Error('INVALID_ADOPTION_RESPONSE')},lock:(key,work)=>navigator.locks?navigator.locks.request(key,work):work()});
 const fork=await adoption.recover();if(fork)head=await client.selectSession(fork.head.id);
 proposal=new ProposalJournal({storage:alteruLocalStorage,prefix:recoveryScope({deployment:location.origin+':'+info.sourceHash+(info.recoveryNamespace?':'+info.recoveryNamespace:''),subject:info.identity,world:'before-the-close'})+'dynamic:',post:b=>transport('/dynamic/proposals',b),get:id=>transport('/dynamic/proposals/'+id),lock:(key,work)=>navigator.locks?navigator.locks.request(key,work):work()});
 if(fork)proposal.clear();
 candidateLocked=proposal.read()?.session_id===head.id;
 await refreshStore();return store;
}
export const authorityStore=()=>store;
export const readDrafts=()=>client.read('dialogue-drafts',{});
export const saveDrafts=drafts=>client.write('dialogue-drafts',drafts);
export const bindPositionReader=reader=>{positionReader=reader;};
async function checkpointNow(){
 if(!head||candidateLocked||client.hasPending())return;
 head=await transport('/sessions/'+head.id+'/checkpoint',{expected_version:head.version,sceneId:head.state.location,position:positionReader?.()??head.position,focus:head.state.location==='fund'?focus:null});
}
export const savePosition=()=>serial(checkpointNow);
export const focusResident=async(id)=>serial(async()=>{focus=id==='analyst'?'analyst':null;await checkpointNow();});
export const residentPose=()=>head?advanceResident(head.npc.analyst,Date.now()+serverOffset):null;
export const sendIntent=input=>serial(async()=>{candidateLocked=false;
 if(client.hasPending())throw Error('PENDING_ACTION');await checkpointNow();const r=await client.send(head,{type:'finance-game',input});head=r.head;await refreshStore();if(r.rejectionCode)throw Error(r.rejectionCode);return r;
});
export const recoverAuthority=()=>serial(async()=>{const fork=await adoption.recover();if(fork)head=await client.selectSession(fork.head.id);candidateLocked=false;const r=await client.recover();if(r)head=r.head;await refreshStore();return r;});
export const selectAuthority=id=>serial(async()=>{candidateLocked=false;await checkpointNow();const priorBinding=head.binding?.artifact_hash??null;head=await client.selectSession(id);candidateLocked=priorBinding!==(head.binding?.artifact_hash??null);focus=null;return refreshStore();});
export const newAuthority=()=>serial(async()=>{candidateLocked=false;await checkpointNow();head=await client.enroll(head.locale,true);focus=null;return refreshStore();});

export const authorityHead=()=>head;
export const requestRoom=()=>serial(async()=>{if(client.hasPending())throw Error('PENDING_ACTION');if(!proposal.read())await checkpointNow();candidateLocked=true;try{roomProgress=await proposal.start({session_id:head.id,expected_version:head.version});return roomProgress}catch(e){candidateLocked=false;throw e}});
export const pollRoom=()=>serial(async()=>{roomProgress=await proposal.poll();return roomProgress;});
export const retryRoom=()=>serial(async()=>{if(client.hasPending()||!['failed','rejected','stale'].includes(roomProgress?.status))throw Error('PENDING_PROPOSAL');candidateLocked=false;await checkpointNow();candidateLocked=true;try{roomProgress=await proposal.retry({session_id:head.id,expected_version:head.version});return roomProgress}catch(e){candidateLocked=false;throw e}});
export const cancelRoom=()=>{candidateLocked=false};
export const adoptRoom=candidate=>serial(async()=>{if(candidate.status!=='ready'||candidate.session_id!==head.id||candidate.expected_version!==head.version)throw Error('PROPOSAL_NOT_READY');const r=await adoption.adopt({session_id:candidate.session_id,expected_version:candidate.expected_version,artifact_hash:candidate.artifact_hash});head=await client.selectSession(r.head.id);candidateLocked=true;proposal.clear(candidate.request_id);roomProgress=null;await refreshStore();if(r.rejection)throw Error(r.rejection);return r;});
