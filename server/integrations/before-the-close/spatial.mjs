// Backend-only R15 travel candidate. Contract is built from evaluated source
// world exports, never from a client's scene/geometry payload.
import {randomUUID} from 'node:crypto';
import {AuthorityError} from '../../packages/authority-session/index.mjs';
import {canonical,sha256,initialState,domainPatch} from '../../packages/rule-compiler/index.mjs';
import {decodeEffects} from '../../packages/rule-adoption/decode-effects.mjs';
import {financeRules} from './rules.mjs';
const fail=(code,status=422)=>{throw new AuthorityError(code,status);};
const exact=(o,keys)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))fail('INVALID_ACTION');};
const bi=s=>({zh:s,en:s});
const fact=id=>({op:'fact',id,cmp:'eq',value:true});
const at=nodeId=>({op:'map-is',nodeId});
const all=(...rules)=>({op:'all',rules:rules.flatMap(rule=>rule.op==='all'?rule.rules:[rule])});
const any=rules=>rules.length===0?{op:'const',value:false}:rules.length===1?rules[0]:{op:'any',rules};
const yes={op:'const',value:true};
const not=rule=>({op:'not',rule});
export function travelRoute(contract,from,to){
  const queue=[[from]],seen=new Set([from]);
  for(let i=0;i<queue.length;i++){
    const path=queue[i],last=path.at(-1);if(last===to)return path;
    for(const d of contract.doors)if(d.from===last&&!seen.has(d.to)){seen.add(d.to);queue.push([...path,d.to]);}
  }return null;
}
// Same AABB footprint semantics as src/spatial/world.ts. Source-canary checks
// the entire grid plus exact obstacle boundaries against the original function.
export function travelWalkable(contract,scene,p){
  const s=contract.world.scenes[scene],a=contract.world.actor;
  if(!s||!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;
  const r=s.interior;
  return p.x>=r.x&&p.y>=r.y&&p.x+a.w<=r.x+r.w&&p.y+a.h<=r.y+r.h&&!s.obstacles.some(o=>p.x<o.x+o.w&&p.x+a.w>o.x&&p.y<o.y+o.h&&p.y+a.h>o.y);
}
export function financeTravelRules(contract){
  const ids=Object.keys(contract.world.scenes),root=financeRules(),actions=[];
  if(ids.length!==11||contract.doors.length!==20||!ids.includes('study'))throw Error('FINANCE_SPATIAL_SOURCE_REVIEW_REQUIRED');
  if(contract.format!=='finance-spatial-source-v1'||contract.world.actor.w!==14||contract.world.actor.h!==10||new Set(contract.doors.map(d=>d.from+':'+d.id)).size!==contract.doors.length)throw Error('INVALID_SPATIAL_CONTRACT');
  for(const id of ids)if(!['northline','relayops','customer','settlement'].includes(contract.areas[id])||!Number.isSafeInteger(contract.arrivalMinutes[id])||contract.arrivalMinutes[id]<1000||!travelWalkable(contract,id,contract.world.scenes[id].spawn))throw Error('INVALID_SPATIAL_CONTRACT');
  const allowed=all(contract.prologueVersion===1?fact('orientation-ready'):yes,any([fact('project-accepted'),fact('memo'),not({op:'fact',id:'decision',cmp:'eq',value:'none'}),...ids.filter(id=>!contract.headquarters.includes(id)).map(at)]));
  const add=(id,when,to)=>actions.push({id,label:bi(id),when:all(when,contract.prologueVersion===1&&!contract.headquarters.includes(to)?fact('orientation-ready'):yes),effects:[{type:'map',nodeId:to}],next:[],successText:bi('Travel recorded'),rejectionText:bi('Travel unavailable')});
  for(const [index,d] of contract.doors.entries()){
    if(!ids.includes(d.from)||!ids.includes(d.to)||d.from===d.to||typeof d.id!=='string')throw Error('INVALID_SPATIAL_CONTRACT');
    add('door-'+index,all(at(d.from),d.from==='lobby'&&d.to==='office'?allowed:yes),d.to);
  }
  for(const to of ids){
    const free=[],gated=[];
    for(const from of ids.filter(from=>from!==to)){
      const route=travelRoute(contract,from,to);if(!route)continue;
      const gate=route.some((s,i)=>s==='lobby'&&route[i+1]==='office');
      (gate?gated:free).push(at(from));
    }
    add('map-'+to,all(contract.areas[to]==='northline'?yes:fact('visited-'+to),any([any(free),all(any(gated),allowed)])),to);
  }
  // This short witness is NOT an all-room reachability claim. The source-canary
  // separately enumerates every door and all shortcut eligibility cases.
  return {...root,locations:ids.map(id=>({id,label:bi(id)})),facts:[
    {id:'project-accepted',initial:false},{id:'memo',initial:false},{id:'decision',initial:'none'},...(contract.prologueVersion===1?[{id:'orientation-ready',initial:false}]:[]),
    ...ids.map(id=>({id:'visited-'+id,initial:id==='study'}))],actions,
    walkthrough:['map-lobby','map-study']};
}
export function projectTravelState(head,definition){
  const state=initialState(definition.rules);state.location=head.state.location;
  for(const id of ['project-accepted','memo','decision','orientation-ready'])if(Object.hasOwn(state.facts,id))state.facts[id]=head.state.facts[id]??false;
  for(const id of head.visited)state.facts['visited-'+id]=true;
  return state;
}
export function createFinanceTravelRuntime({contract,definition,compiled,runProlog,canaryOnly}){
  if(canaryOnly!==true)throw Error('FINANCE_SPATIAL_CANARY_ONLY');
  contract=structuredClone(contract);definition=structuredClone(definition);compiled=structuredClone(compiled);
  if(canonical(definition.rules)!==canonical(financeTravelRules(contract)))throw Error('SPATIAL_RULE_BINDING_MISMATCH');
  const manifest=JSON.parse(compiled['manifest.json']);
  if(manifest.sourceHash!==sha256(canonical(definition.rules))||Object.keys(compiled).length!==5||Object.keys(manifest.files).length!==4||Object.entries(manifest.files).some(([p,hash])=>typeof compiled[p]!=='string'||sha256(compiled[p])!==hash))throw Error('SPATIAL_ARTIFACT_MISMATCH');
  const binding=sha256(canonical({contract,definition,compiled})),ids=Object.keys(contract.world.scenes);
  const position=(scene,p)=>{exact(p,['x','y']);if(!travelWalkable(contract,scene,p))fail('POSITION_BLOCKED');return {...p};};
  const near=(scene,p,d)=>{
    position(scene,p);
    if(scene!==d.from||Math.hypot(p.x+contract.world.actor.w/2-d.at.x,p.y+contract.world.actor.h/2-d.at.y)>=65)fail('TARGET_OUT_OF_REACH');
  };
  const validateAction=body=>{
    exact(body,['action_id','expected_version','sceneId','type','input']);if(body.type!=='finance-travel')fail('FINANCE_ENTITY_ADAPTER_NOT_READY');
    exact(body.input,['kind',body.input?.kind==='door'?'entity':'to']);
    if(body.input.kind==='door'){if(typeof body.input.entity!=='string')fail('INVALID_ACTION');}
    else if(body.input.kind!=='map'||!ids.includes(body.input.to))fail('INVALID_ACTION');
  };
  const assertReadable=h=>{
    if(h?.canary!=='finance-travel-r15'||h.world!=='before-the-close'||h.chapterVersion!==1||h.binding||h.mapVersion!==binding)fail('JOURNEY_VERSION_UNSUPPORTED',409);
    if(typeof h.id!=='string'||!Number.isSafeInteger(h.version)||h.version<0||!ids.includes(h.state?.location)||!['en','zh'].includes(h.locale))fail('INVALID_JOURNEY');
    if(!Array.isArray(h.visited)||new Set(h.visited).size!==h.visited.length||h.visited.some(id=>!ids.includes(id))||!h.visited.includes(h.state.location)||!Number.isSafeInteger(h.storyMinute)||h.storyMinute<1000)fail('INVALID_JOURNEY');
    for(const f of financeRules().facts)if(typeof h.state.facts?.[f.id]!==typeof f.initial)fail('INVALID_JOURNEY');
    position(h.state.location,h.position);
  };
  return {
    initial:(locale,id)=>({id,world:'before-the-close',locale,version:0,mapVersion:binding,canary:'finance-travel-r15',chapterVersion:1,projectId:'relayops',binding:null,catalog:[],ended:false,
      state:initialState(financeRules()),position:position('study',contract.world.scenes.study.spawn),visited:['study'],storyMinute:1000}),
    assertReadable,upgrade:h=>{assertReadable(h);return structuredClone(h);},scene:h=>h.state.location,
    position:(h,p)=>position(h.state.location,p),validateAction,
    prepare:async(head,body)=>{
      validateAction(body);assertReadable(head);
      if(head.version!==body.expected_version||head.state.location!==body.sceneId)fail('VERSION_CONFLICT',409);
      const index=body.input.kind==='door'?contract.doors.findIndex(d=>d.id===body.input.entity&&d.from===head.state.location):-1;
      if(body.input.kind==='door'&&index<0)fail('UNKNOWN_TARGET');
      const door=index>=0?contract.doors[index]:null;if(door)near(head.state.location,head.position,door);
      const rule_id=door?'door-'+index:'map-'+body.input.to;
      const state=projectTravelState(head,definition),replies=await runProlog(compiled,[{action_id:rule_id,state}]);
      if(!Array.isArray(replies)||replies.length!==1)fail('RULE_OUTPUT_INVALID');
      const cartridge=domainPatch(definition.rules,head.locale),effects=decodeEffects(replies[0],definition,cartridge,{...state,locale:head.locale,map:cartridge.initialMap});
      if(!replies[0].accepted)fail('INVALID_ACTION');
      // Travel module's output language is deliberately map-only. This is a
      // capability boundary, not a second evaluation of gameplay conditions.
      if(effects.length!==1||effects[0].type!=='map')fail('TRAVEL_EFFECT_FORBIDDEN');
      const to=effects[0].nodeId;
      // A fixed door/shortcut cannot return a different destination: identity
      // is spatial structure, not a model-proposed effect in this static module.
      if(to!==(door?door.to:body.input.to))fail('TRAVEL_TARGET_MISMATCH');
      const arrival=door?contract.doors.find(d=>d.from===to&&d.to===head.state.location)?.approach:undefined;
      const next=structuredClone(head);next.state.location=to;next.position=position(to,arrival??contract.world.scenes[to].spawn);
      next.visited=[...new Set([...head.visited,head.state.location,to])];
      next.storyMinute=Math.max(head.storyMinute,contract.arrivalMinutes[to]);next.version++;
      // Internal candidate metadata survives prepare/commit serialization but
      // is removed inside the transaction before head, journal or receipt write.
      next.travelProof={from:head.state.location,index};
      return {kind:'action',accepted:true,head:next,effects,engine:'swi-prolog',rule_id,receipt_id:randomUUID()};
    },
    preserveConcurrent:(candidate,current)=>{
      const proof=candidate.travelProof;if(!proof||proof.from!==current.state.location)fail('INVALID_TRAVEL_CANDIDATE',409);
      if(proof.index>=0)near(current.state.location,current.position,contract.doors[proof.index]);
      delete candidate.travelProof;
    },
  };
}
