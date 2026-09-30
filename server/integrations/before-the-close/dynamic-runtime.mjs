import {randomUUID} from 'node:crypto';
import {AuthorityError} from '../../packages/authority-session/index.mjs';
import {compile,canonical,sha256} from '../../packages/rule-compiler/index.mjs';
import {createRuleRuntime} from '../../packages/rule-adoption/runtime.mjs';
import {financeRules,findingPairs,recordIds} from './rules.mjs';
import {supplementalEvidenceVersion,supplementalNotes} from './supplemental-evidence.mjs';
import {verificationSpace,verificationDoor,verificationSceneId} from './dynamic-space.mjs';
import {travelWalkable} from './spatial.mjs';
import {financeInvestigation} from './investigations.mjs';
import {assertSlotSpaceReachable} from '../../packages/spatial-slots/index.mjs';
const hash=v=>sha256(canonical(v));
const fail=(code,status=422)=>{throw new AuthorityError(code,status);};
export const financeRoomProfile=financeInvestigation().profile;

/** Native projection adapter. Existing semantic modules remain the only routes
 * to authored effects. The extension's parent is a verifier module, NEVER an
 * alternate public route to authored actions. Full native mapVersion/source
 * head are bound to each proposal, so no base module can drift independently. */
export async function createFinanceDynamicRuntime({base,source,contract,loadBound,runProlog,investigationId='income'}){
  const investigation=financeInvestigation(investigationId),financeRoomProfile=investigation.profile,finding=investigation.finding;
  const sample=base.initial('en',randomUUID()),rootFacts=new Set(Object.keys(sample.state.facts));
  const rules=financeRules();rules.locations=Object.keys(contract.world.scenes).map(id=>({id,label:{en:id,zh:id}}));rules.initialLocation='records';rules.facts.push({id:'orientation-ready',initial:false});
  const parent={format:'alteru-rule-package-v1',rules},compiled=await compile(rules),parentHash=hash(compiled);
  const spatialHash=hash(verificationSpace({id:verificationSceneId,parent_id:'records',label:{zh:'room',en:'room'},enter_action_id:'entry',escape_action_id:'exit'},['a','b'].map(id=>({id,label:{zh:id,en:id}}))));
  const legacyRuntimeHash=hash({version:1,root:sample.mapVersion,parentHash,profile:financeRoomProfile,spatialHash});
  const dynamicRuntimeHash=hash({version:2,root:sample.mapVersion,parentHash,profile:financeRoomProfile,spatialHash,supplementalEvidenceVersion});
  const shape=h=>{
    if(!h.binding)return null;
    if(h.dynamic?.root!==sample.mapVersion||![legacyRuntimeHash,dynamicRuntimeHash].includes(h.dynamic.runtimeHash)||h.catalog?.length!==1||h.catalog[0].id!==verificationSceneId||h.dynamic.actions?.length!==2||!h.binding.artifact_hash?.match(/^[a-f0-9]{64}$/))fail('DYNAMIC_BINDING_INVALID');
    const evidence=h.dynamic.evidence;
    if(h.dynamic.runtimeHash===legacyRuntimeHash){if(evidence!==undefined)fail('DYNAMIC_BINDING_INVALID');}
    else {
      if(evidence?.version!==supplementalEvidenceVersion||(evidence.finding??'income')!==finding||!Array.isArray(evidence.origins)||new Set(evidence.origins).size!==evidence.origins.length||!investigation.requiredOrigins.every(id=>evidence.origins.includes(id))||evidence.origins.some(id=>!recordIds.includes(id)||h.state.facts[id]!==true)||!evidence.comparisons||Object.keys(evidence.comparisons).some(id=>id!==finding))fail('DYNAMIC_EVIDENCE_INVALID');
      const comparison=evidence.comparisons[finding];
      if(comparison&&(comparison.artifact_hash!==h.binding.artifact_hash||!Array.isArray(comparison.action_ids)||comparison.action_ids.length<1||comparison.action_ids.length>2||new Set(comparison.action_ids).size!==comparison.action_ids.length||comparison.action_ids.some(id=>!h.dynamic.actions.some(a=>a.id===id&&h.state.facts[a.doneFact]===true))||canonical(comparison.original_sources)!==canonical(findingPairs[finding])||!h.state.facts[finding]||!Number.isSafeInteger(comparison.version)||comparison.version>h.version))fail('DYNAMIC_EVIDENCE_INVALID');
      if(h.state.facts.decision==='none'?evidence.sealed!==null:canonical(evidence.sealed)!==canonical(evidence.comparisons))fail('DYNAMIC_EVIDENCE_INVALID');
    }
    return verificationSpace(h.catalog[0],h.dynamic.actions);
  };
  const world=h=>{const s=shape(h);return s?{...contract.world,scenes:{...contract.world.scenes,[s.room.id]:s.scene}}:contract.world;};
  const validatePosition=(h,p)=>{if(!p||Object.keys(p).sort().join(',')!=='x,y'||!travelWalkable({world:world(h)},h.state.location,p))fail('INVALID_POSITION');return {...p};};
  const native=h=>{
    const n=structuredClone(h),s=shape(h);if(!s)return n;
    n.binding=null;n.catalog=[];delete n.dynamic;
    n.state.facts=Object.fromEntries(Object.entries(n.state.facts).filter(([id])=>rootFacts.has(id)));
    n.visited=n.visited.filter(id=>Object.hasOwn(contract.world.scenes,id));
    if(n.state.location===s.room.id){n.state.location='records';n.position={...verificationDoor.approach};}
    n.journey.scene=n.state.location;n.journey.position={...n.position};n.journey.visited=[...n.visited];
    return n;
  };
  const synchronize=h=>{h.journey.id=h.id;h.journey.scene=h.state.location;h.journey.position={...h.position};h.journey.visited=[...h.visited];};
  const merge=(result,h)=>{
    if(!h.binding)return result;
    const n=result.head;n.binding=structuredClone(h.binding);n.catalog=structuredClone(h.catalog);n.dynamic=structuredClone(h.dynamic);
    for(const [id,value] of Object.entries(h.state.facts))if(!rootFacts.has(id))n.state.facts[id]=value;
    n.visited=[...new Set([...h.visited,...n.visited])];synchronize(n);return result;
  };
  const near=(h,e)=>{validatePosition(h,h.position);if(Math.hypot(h.position.x+7-e.at.x,h.position.y+5-e.at.y)>=65)fail('TOO_FAR');};
  const entity=(h,id)=>{const s=shape(h);if(!s)fail('DYNAMIC_BINDING_REQUIRED');const e=h.state.location==='records'&&id===s.entrance.id?s.entrance:h.state.location===s.room.id?s.room.entities.find(e=>e.id===id):null;if(!e)fail('OFF_SCENE_ENTITY');near(h,e);return e;};
  const policy={...base,parent,compiled,dynamicRuntimeHash,profile:financeRoomProfile,investigationId,spatialWorld:world,
    assertReadable(h){
      if(!h.binding)return base.assertReadable(h);
      const s=shape(h);base.assertReadable(native(h));validatePosition(h,h.position);
      if(h.journey.id!==h.id||h.journey.scene!==h.state.location||canonical(h.journey.position)!==canonical(h.position)||canonical(h.journey.visited)!==canonical(h.visited)||new Set(h.visited).size!==h.visited.length||h.visited.some(id=>!world(h).scenes[id])||!h.visited.includes(h.state.location))fail('NATIVE_PROJECTION_MISMATCH');
      if(h.state.location!==s.room.id&&!contract.world.scenes[h.state.location])fail('UNKNOWN_SCENE');
      if(Object.entries(h.state.facts).some(([id,v])=>!rootFacts.has(id)&&typeof v!=='boolean'))fail('DYNAMIC_FACT_INVALID');
    },
    upgrade(h){policy.assertReadable(h);return structuredClone(h);},
    validateDynamicArtifact(h,a){
      if(h.binding||h.ended||h.state.facts.decision!=='none'||h.state.location!=='records'||financeRoomProfile.gateFacts.some(f=>h.state.facts[f]!==true)||h.state.facts[finding])fail('DYNAMIC_GATE_CLOSED');
      if(canonical(a.profile)!==canonical(financeRoomProfile)||a.prepared.descriptor.parent.artifact_hash!==parentHash||a.prepared.descriptor.native_runtime_hash!==sample.mapVersion||a.prepared.descriptor.dynamic_runtime_hash!==dynamicRuntimeHash)fail('DYNAMIC_ROOT_MISMATCH');
      const p=a.prepared,original=parent.rules;
      if(p.content.locations.length!==1||p.content.locations[0].id!==verificationSceneId)fail('DYNAMIC_SLOT_INVALID');
      // The prepared parent must be byte-for-byte the compiled verifier root.
      if(canonical(p.definition.rules.actions.slice(0,original.actions.length))!==canonical(original.actions)||canonical(p.definition.rules.facts.slice(0,original.facts.length))!==canonical(original.facts))fail('DYNAMIC_ROOT_MISMATCH');
      const restored={...p.definition.rules,rulesetVersion:original.rulesetVersion,locations:p.definition.rules.locations.slice(0,original.locations.length),facts:p.definition.rules.facts.slice(0,original.facts.length),actions:p.definition.rules.actions.slice(0,original.actions.length)};
      if(canonical(restored)!==canonical(original))fail('DYNAMIC_ROOT_MISMATCH');
      const actions=p.definition.rules.actions.slice(original.actions.length).filter(x=>!x.id.startsWith('sys-dyn-'));
      if(actions.length!==2)fail('DYNAMIC_SLOT_INVALID');
      const s=verificationSpace(p.content.locations[0],actions);
      try{assertSlotSpaceReachable(s,{world:contract.world,parentId:'records',walkable:(world,scene,pos)=>travelWalkable({world},scene,pos),findPath:source.findPath,reach:65});}
      catch{fail('DYNAMIC_ROUTE_BLOCKED');}
    },
    projectAdoption(next,head,a){
      policy.validateDynamicArtifact(head,a);
      const actions=a.prepared.definition.rules.actions.slice(parent.rules.actions.length).filter(x=>!x.id.startsWith('sys-dyn-')).map(({id,label,successText,effects})=>({id,label,successText,doneFact:effects.find(e=>e.type==='fact'&&e.id.startsWith('sys-dyn-done-')).id}));
      next.dynamic={root:sample.mapVersion,runtimeHash:dynamicRuntimeHash,actions,evidence:{version:supplementalEvidenceVersion,...(finding==='income'?{}:{finding}),origins:recordIds.filter(id=>head.state.facts[id]===true),comparisons:{},sealed:null}};synchronize(next);
    },
    position:(h,p)=>validatePosition(h,p),
    spatialContext(h,b){
      if(!h.binding)return base.spatialContext(h,b);
      if(Object.keys(b).sort().join(',')!=='expected_version,focus,position,sceneId')fail('INVALID_ACTION');
      if(h.state.location===shape(h).room.id){if(b.focus!==null)fail('OFF_SCENE_ENTITY');const n=structuredClone(h);n.position=validatePosition(h,b.position);synchronize(n);return n;}
      const n=merge({head:base.spatialContext(native(h),b)},h).head;n.position=validatePosition(h,b.position);synchronize(n);return n;
    },
    async prepare(h,b,allowNarration,scope){
      policy.assertReadable(h);base.validateAction(b);
      if(b.expected_version!==h.version||b.sceneId!==h.state.location)fail('VERSION_CONFLICT',409);
      if(b.input.kind!=='dynamic'){
        if(h.binding&&h.state.location===shape(h).room.id)fail('USE_DYNAMIC_EXIT');
        let input=b.input,reference;
        if(Object.hasOwn(input,'supporting')){
          const supporting=input.supporting;
          if(!h.binding||h.dynamic?.evidence?.version!==supplementalEvidenceVersion||input.kind!=='conclude'||input.finding!==finding||!supporting||Object.keys(supporting).sort().join(',')!=='action_ids,artifact_hash'||supporting.artifact_hash!==h.binding.artifact_hash||!Array.isArray(supporting.action_ids)||supporting.action_ids.length<1||supporting.action_ids.length>2||new Set(supporting.action_ids).size!==supporting.action_ids.length||supporting.action_ids.some(id=>!supplementalNotes(h).some(n=>n.id===id)))fail('INVALID_ACTION');
          const p=await loadBound(h);
          if(p.artifact_hash!==h.binding.artifact_hash||p.descriptor.dynamic_runtime_hash!==h.dynamic.runtimeHash||h.dynamic.actions.some(a=>canonical(a.successText)!==canonical(p.content.actions.find(x=>x.id===a.id)?.successText)))fail('DYNAMIC_ROOT_MISMATCH');
          reference={artifact_hash:p.artifact_hash,action_ids:[...supporting.action_ids],original_sources:[...findingPairs[finding]],source_head_hash:p.descriptor.source_head_hash,action_id:b.action_id};
          input={...input};delete input.supporting;
        }
        // The SAME original two-source rule decides. Supplemental notes never
        // become source IDs or write a finding/decision independently.
        const dialogueScope={...scope,supplementalAnalysis:input.kind==='free-talk'?supplementalNotes(h):[]};
        const result=merge(await base.prepare(native(h),{...b,input},allowNarration,dialogueScope),h);
        if(reference){result.head.dynamic.evidence.comparisons[finding]={...reference,version:result.head.version};result.supportingEvidence=structuredClone(result.head.dynamic.evidence.comparisons[finding]);}
        if(result.head.dynamic?.evidence&&h.state.facts.decision==='none'&&result.head.state.facts.decision!=='none')result.head.dynamic.evidence.sealed=structuredClone(result.head.dynamic.evidence.comparisons);
        policy.assertReadable(result.head);return result;
      }
      if(Object.keys(b.input).sort().join(',')!=='entity,kind')fail('INVALID_ACTION');
      const e=entity(h,b.input.entity),p=await loadBound(h);
      if(p.descriptor.native_runtime_hash!==sample.mapVersion||p.descriptor.dynamic_runtime_hash!==h.dynamic.runtimeHash||p.artifact_hash!==h.binding.artifact_hash||canonical(p.content.locations)!==canonical(h.catalog))fail('DYNAMIC_ROOT_MISMATCH');
      const s=shape(h);
      const engine=createRuleRuntime({definition:parent,compiled,loadBound:async()=>p,runProlog,
        spawn:id=>id===s.room.id?s.scene.spawn:verificationDoor.approach,validatePosition:(id,pos)=>validatePosition({...h,state:{...h.state,location:id}},pos)});
      const result=await engine.prepare(h,{...b,type:'rule',rule_id:e.rule});
      const n=result.head;n.visited=[...new Set([...h.visited,n.state.location])];n.dynamicProof={entity:e.id,scene:h.state.location};
      n.npc.analyst.focus=false;n.npc.analyst.paused=false;
      synchronize(n);policy.assertReadable(n);return {...result,dynamicText:p.content.actions.find(a=>a.id===e.rule).successText};
    },
    preserveConcurrent(candidate,current){
      if(!candidate.binding){base.preserveConcurrent(candidate,current);return;}
      if(candidate.dynamicProof){
        if(candidate.dynamicProof.scene!==current.state.location)fail('VERSION_CONFLICT',409);
        entity(current,candidate.dynamicProof.entity);
        if(candidate.state.location===current.state.location)candidate.position={...current.position};
        candidate.npc=structuredClone(current.npc);candidate.npc.analyst.focus=false;candidate.npc.analyst.paused=false;
        delete candidate.dynamicProof;synchronize(candidate);policy.assertReadable(candidate);return;
      }
      const n=native(candidate);base.preserveConcurrent(n,native(current));delete candidate.travelProof;delete candidate.entityProof;Object.assign(candidate,merge({head:n},candidate).head);policy.assertReadable(candidate);
    },
  };return policy;
}
