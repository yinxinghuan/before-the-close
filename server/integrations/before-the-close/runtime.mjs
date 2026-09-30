import {AuthorityError} from '../../packages/authority-session/index.mjs';
import {createRuleRuntime} from '../../packages/rule-adoption/runtime.mjs';
import {domainPatch} from '../../packages/rule-compiler/index.mjs';
import {decodeEffects} from '../../packages/rule-adoption/decode-effects.mjs';
import {recordIds,findingPairs,peopleIds,revisionFlags,nativeFacts} from './rules.mjs';
const fail=code=>{throw new AuthorityError(code,422);};
const exact=(o,keys)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))fail('INVALID_ACTION');};
const oneOf=(value,values)=>{if(!values.includes(value))fail('INVALID_ACTION');return value;};
// Native reducer resets its per-round sessionEnded flag when a new scene is
// applied. The signed decision fact, NOT this flag, seals the recommendation.
// Re-reading an unchanged record bypasses that reducer in native collect().
export function financeRoundEnded(before,effects,input) {
  const session=effects.find(e=>e.type==='session');if(session)return session.ended;
  const startsRound=input.kind!=='collect'||effects.some(e=>e.type==='fact'&&before.state.facts[e.id]!==e.value);
  return startsRound?false:Boolean(before.ended);
}
/** Mapping validates intent shape, not saved-world prerequisites. */
export function routeFinanceIntent(input) {
  switch(input?.kind){
    case 'collect':{exact(input,['kind','record']);const id=oneOf(input.record,recordIds);return ['collect-'+id,...(revisionFlags[id]?['collect-'+id+'-revision']:[])];}
    case 'conclude':{
      exact(input,['kind','finding','sources','choice']);const id=oneOf(input.finding,Object.keys(findingPairs));
      if(input.choice!=='supported'||!Array.isArray(input.sources)||input.sources.length!==2||new Set(input.sources).size!==2||!findingPairs[id].every(p=>input.sources.includes(p)))fail('INVALID_ACTION');
      return ['conclude-'+id];
    }
    case 'meet':exact(input,['kind','person']);return ['meet-'+oneOf(input.person,peopleIds)];
    case 'chapter':exact(input,['kind','choice']);return ['chapter-'+oneOf(input.choice,['replace','dissent','budget','boundary','reconcile','echo-founder','echo-finance','echo-client'])];
    case 'negotiate':exact(input,['kind','term']);return ['negotiate-'+oneOf(input.term,['tranche','reprice'])];
    case 'decide':exact(input,['kind','decision']);return ['decide-'+oneOf(input.decision,['proceed','conditional','pause'])];
    case 'archive':case 'accept-project':case 'client-accept':exact(input,['kind']);return [input.kind];
    default:fail('INVALID_ACTION');
  }
}

/** Backend-only projected-state candidate. NO HTTP/production/spatial use. */
export function createFinanceRuntime({definition,compiled,runProlog,canaryOnly}) {
  if(canaryOnly!==true)throw Error('FINANCE_SPATIAL_ADAPTER_NOT_READY');
  const config={definition,compiled,loadBound:()=>fail('FINANCE_DYNAMIC_BINDING_NOT_READY'),
    spawn:()=>({x:0,y:0}),validatePosition:(_scene,p)=>{if(p?.x!==0||p?.y!==0)fail('FINANCE_SPATIAL_ADAPTER_NOT_READY');return{x:0,y:0};}};
  const base=createRuleRuntime({...config,runProlog});
  return {...base,
    initial:(locale,id)=>({...base.initial(locale,id),canary:'finance-domain-r15',chapterVersion:1,ended:false}),
    validateAction:body=>{exact(body,['action_id','expected_version','sceneId','type','input']);if(body.type!=='finance')fail('INVALID_ACTION');routeFinanceIntent(body.input);},
    prepare:async(head,body)=>{
      if(head.binding)fail('FINANCE_DYNAMIC_BINDING_NOT_READY');
      if(head.canary!=='finance-domain-r15'||head.chapterVersion!==1)fail('FINANCE_LEGACY_IMPORT_UNSUPPORTED');
      if(head.version!==body.expected_version||head.state.location!==body.sceneId)throw new AuthorityError('VERSION_CONFLICT',409);
      const ids=routeFinanceIntent(body.input);
      const replies=await runProlog(compiled,ids.map(action_id=>({action_id,state:head.state})));
      if(!Array.isArray(replies)||replies.length!==ids.length)fail('RULE_OUTPUT_INVALID');
      const cartridge=domainPatch(definition.rules,head.locale);
      for(const reply of replies)decodeEffects(reply,definition,cartridge,{...head.state,locale:head.locale,map:cartridge.initialMap});
      const accepted=replies.flatMap((reply,i)=>reply.accepted?[i]:[]);
      if(!accepted.length)fail('INVALID_ACTION');
      if(accepted.length!==1)fail('AMBIGUOUS_RULE_RESULT');
      const i=accepted[0];
      // Reuse the common bounded effect applier with THIS invocation's result.
      // No JS rule evaluation, re-query, shared cache, or local effects veto.
      const applier=createRuleRuntime({...config,runProlog:async()=>[replies[i]]});
      const result=await applier.prepare(head,{...body,type:'rule',rule_id:ids[i]});
      result.head.ended=financeRoundEnded(head,result.effects,body.input);
      if(head.state.facts.decision==='none'&&result.head.state.facts.decision!=='none'){
        const before=nativeFacts(head.state.facts);
        result.head.decisionSnapshot={findings:Object.keys(findingPairs).filter(id=>before[id]),...(before.terms?{terms:before.terms}:{})};
      }
      return {...result,rule_id:ids[i]};
    },
  };
}
