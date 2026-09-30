import {financeRules} from './rules.mjs';
export const orientationFlags=['welcome-read','orientation-role','orientation-check','orientation-file','orientation-ready'];
const fact=(id,value=true)=>({op:'fact',id,cmp:'eq',value});
const all=(...rules)=>({op:'all',rules});
const at=nodeId=>({op:'map-is',nodeId});
export function prologueRules(source){
  const root=financeRules(),gates={};
  const sequence=[['welcome','welcome-read'],['role','orientation-role'],['colleague','met-analyst'],['brief','memo'],['check','orientation-check'],['file','orientation-file']];
  for(let i=0;i<sequence.length;i++)gates[sequence[i][0]]=all(fact('orientation-ready',false),...sequence.slice(0,i).map(([,id])=>fact(id)),fact(sequence[i][1],false));
  gates.ready=all(fact('orientation-ready',false),...sequence.map(([,id])=>fact(id)));
  const actions=[],copy={};
  // Full authored copy stays in the bound source, not the DSL's short status field.
  const add=(id,when,flags)=>{actions.push({id,label:{zh:id,en:id},when,effects:flags.map(id=>({type:'fact',id,value:true})),next:[],successText:{zh:'进展已记录。',en:'Progress recorded.'},rejectionText:{zh:'请先完成眼前的步骤。',en:'Complete the current step first.'}});};
  add('welcome-read',all(at('study'),gates.welcome),['welcome-read'],source.welcome);
  add('orientation-file',all(at('archive'),gates.file),['orientation-file'],source.starterBrief);
  // A read-only SWI admission query. Its returned effect is never applied.
  add('main-flow',fact('orientation-ready'),['orientation-ready'],['继续调查','Continue investigation']);
  add('allow-memo',{op:'any',rules:[fact('orientation-ready'),all(at('fund'),fact('orientation-role'),fact('met-analyst'))]},['met-analyst'],source.starterBrief);
  for(const [step] of [...sequence,['ready',null]])for(const person of ['partner','analyst']){
    const facts=Object.fromEntries(sequence.slice(0,step==='ready'?sequence.length:sequence.findIndex(s=>s[0]===step)).map(([,id])=>[id,true]));
    const journey={...source.newJourney(),save:{facts}};
    if(source.prologueStep(journey)!==step)throw Error('PROLOGUE_SOURCE_CHANGED');
    for(const topic of source.prologueTopics(journey,person)){
      const id=person+'-'+topic.id;
      if(copy[id])throw Error('DUPLICATE_PROLOGUE_TOPIC');
      copy[id]=topic;
      // Hint/assumption replies have no gameplay mutation; reassert a proven
      // introduction so the bounded effects vocabulary remains nonempty.
      add(id,all(at(person==='partner'?'partnerroom':'fund'),fact('met-'+person),gates[step]),topic.effects?.length?topic.effects:['met-'+person],topic.reply);
    }
  }
  return {rules:{...root,locations:Object.keys(source.rooms).map(id=>({id,label:{zh:id,en:id}})),facts:[...root.facts,...orientationFlags.map(id=>({id,initial:false}))],actions,walkthrough:['welcome-read']},copy};
}
