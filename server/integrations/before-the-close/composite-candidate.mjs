import {composeRules,verifyComposite} from '../../packages/rule-composer/index.mjs';
import {peopleIds} from './rules.mjs';
import {orientationFlags} from './prologue.mjs';

/** Review bridge only. Does not replace the R15 HTTP authority or enable dynamic bindings.
 * Semantic ownership is explicit; it is not inferred from arbitrary generated effects. */
export function financeCompositeInput({modules,sourceHash,contract,profile,envelope}){
  const units=[{id:'domain',rules:modules.domain.definition.rules},
    {id:'travel',rules:modules.travel.definition.rules},
    {id:'prologue',rules:modules.prologue.definition.rules},
    ...peopleIds.map(person=>({id:'person-'+person,rules:modules.topics[person].definition.rules}))]
    .map(u=>({...u,exposedActions:u.rules.actions.filter(a=>(!u.id.startsWith('person-')||a.id.startsWith('topic-'))
      &&(u.id!=='prologue'||!['main-flow','allow-memo'].includes(a.id))).map(a=>a.id)}));
  const allFacts=new Set(units.flatMap(u=>u.rules.facts.map(f=>f.id)));
  const domainFacts=new Set(modules.domain.definition.rules.facts.map(f=>f.id));
  const factWriters={};
  for(const f of allFacts){
    const writers=[];
    if(domainFacts.has(f))writers.push('domain');
    // Prologue can reassert already-known introductions for no-op hints, but
    // must never gain investment decision/archive authority.
    if([...orientationFlags,'met-partner','met-analyst','project-accepted'].includes(f))writers.push('prologue');
    const topicWrite={analyst:'analyst-corrected',founder:'founder-disclosed',finance:'finance-stress',client:'client-confirmed'};
    for(const person of peopleIds)if(f==='met-'+person||f.startsWith('spoken-'+person+'-')||f===topicWrite[person])writers.push('person-'+person);
    factWriters[f]=writers;
  }
  return {format:'alteru-composite-source-v1',sourceHash,spatialContract:contract,profile,envelope,units,factWriters};
}
export async function reviewFinanceComposite(options,runProlog){
  const bundle=await composeRules(financeCompositeInput(options));
  const runtime=await verifyComposite(bundle,runProlog);
  return {bundle,runtime};
}
