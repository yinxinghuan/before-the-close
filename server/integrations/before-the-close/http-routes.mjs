// Transport-independent routes. The caller MUST authenticate and supply owner.
import {AuthorityError} from '../../packages/authority-session/index.mjs';
const error=(code,status=422)=>{throw new AuthorityError(code,status);};
const exact=(b,keys)=>{if(!b||typeof b!=='object'||Array.isArray(b)||Object.keys(b).length!==keys.length||keys.some(k=>!Object.hasOwn(b,k)))error('INVALID_REQUEST');};
async function body(req){const chunks=[];let size=0;for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>16384)error('BODY_TOO_LARGE',413);chunks.push(Buffer.from(chunk));}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{error('INVALID_JSON',400);}}
export async function financeRoute({req,path,searchParams,authority,policy,owner,sourceHash,mode,now=Date.now,dynamic,recoveryNamespace='',modelStatus,usage}){
  if(typeof owner!=='string'||!owner)error('AUTH_REQUIRED',401);
  const method=req.method;
  if(usage&&path==='/usage'&&method==='GET')return usage.status(owner);
  if(dynamic?.proposals&&path==='/dynamic/proposals'&&method==='POST'){
    const b=await body(req);if(!usage)return dynamic.proposals.submit(owner,b);
    const reservation=await usage.reserve(owner,'room',b?.request_id,b);
    if(reservation.replay&&reservation.status==='released'){
      // A terminal existing job remains recoverable. A rejected submission
      // without a job must use a fresh identity and pass allowance admission.
      try{return await dynamic.proposals.get(owner,b.request_id);}catch(e){if(e.code!=='PROPOSAL_NOT_FOUND')throw e;}
      error('AI_RETRY_NEW_REQUEST',409);
    }
    try{return await dynamic.proposals.submit(owner,b);}catch(e){await usage.settle(owner,'room',b.request_id,false);throw e;}
  }
  const job=path.match(/^\/dynamic\/proposals\/([a-zA-Z0-9-]{16,80})$/);
  if(dynamic?.proposals&&job&&method==='GET')return dynamic.proposals.get(owner,job[1]);
  if(dynamic?.proposals&&path==='/dynamic/proposals'&&method==='GET')return {proposal:await dynamic.proposals.latest(owner,searchParams.get('session_id'))};
  if(dynamic?.fixture&&method==='POST'&&path==='/dynamic/fixture'){
    const b=await body(req);exact(b,['session_id']);return dynamic.fixture(owner,b.session_id);
  }
  if(dynamic&&method==='POST'&&path==='/dynamic/adopt')return dynamic.adopt(owner,await body(req));
  if(method==='GET'&&path==='/info'){const model=await modelStatus?.();return {mode,identity:owner,sourceHash,recoveryNamespace,modelCalls:model?.used??0,...(model?{model}:{}),productionReady:false};}
  if(path==='/sessions'){
    if(method==='GET')return {sessions:await authority.directory(owner)};
    if(method==='POST'){const b=await body(req);exact(b,['enrollment_id','locale']);return authority.create(owner,b.enrollment_id,b.locale);}
  }
  const match=path.match(/^\/sessions\/([a-zA-Z0-9-]{16,80})(?:\/(actions|checkpoint|events|presence))?$/);
  if(!match)error('NOT_FOUND',404);const [,id,route]=match;
  if(method==='GET'&&!route)return authority.get(owner,id);
  if(method==='GET'&&route==='presence')return {npc:policy.npcView(await authority.get(owner,id)),serverNow:now()};
  if(method==='GET'&&route==='events')return {events:await authority.events(owner,id,Number(searchParams.get('after')??0))};
  if(method==='POST'&&route==='actions'){
    const b=await body(req);if(!usage||b?.input?.kind!=='free-talk')return authority.action(owner,id,b);
    const reservation=await usage.reserve(owner,'dialogue',b.action_id,{id,body:b});
    if(reservation.replay&&reservation.status==='released')error('AI_RETRY_NEW_REQUEST',409);
    let result;
    try{result=await authority.action(owner,id,b);}
    catch(e){if(e.code!=='MODEL_CALL_PENDING_OR_INTERRUPTED')await usage.settle(owner,'dialogue',b.action_id,false);throw e;}
    await usage.settle(owner,'dialogue',b.action_id,!result.rejectionCode);return result;
  }
  if(method==='POST'&&route==='checkpoint'){await authority.checkpoint(owner,id,await body(req));return authority.get(owner,id);}
  error('METHOD_NOT_ALLOWED',405);
}
