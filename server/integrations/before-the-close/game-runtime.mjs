import {randomUUID} from 'node:crypto';
import {AuthorityError} from '../../packages/authority-session/index.mjs';
import {compile,canonical,sha256} from '../../packages/rule-compiler/index.mjs';
import {createRuleRuntime} from '../../packages/rule-adoption/runtime.mjs';
import {financeRules,nativeFacts,peopleIds} from './rules.mjs';
import {createFinanceRuntime} from './runtime.mjs';
import {financeTravelRules,createFinanceTravelRuntime,travelWalkable} from './spatial.mjs';
import {advanceResident,initialResident} from './npc-motion.mjs';
import {prologueRules} from './prologue.mjs';
const fail=(code,status=422)=>{throw new AuthorityError(code,status);};
const exact=(o,keys)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))fail('INVALID_ACTION');};
const fact=(id,value=true)=>({op:'fact',id,cmp:'eq',value});
const all=(...rules)=>({op:'all',rules});
const at=nodeId=>({op:'map-is',nodeId});
const done=(person,id)=>'spoken-'+person+'-'+id;
const wire=v=>JSON.parse(JSON.stringify(v));
const visibleFacts=f=>nativeFacts(Object.fromEntries(Object.entries(f).filter(([id])=>!id.startsWith('spoken-'))));
const chapterPeople={replace:'founder',dissent:'founder',budget:'finance',boundary:'client',reconcile:'partner','echo-founder':'founder','echo-finance':'finance','echo-client':'client'};

/** Trusted source exports are injected by the server build, never by HTTP. */
export async function createFinanceGameRuntime({source,sourceHash,contract,runProlog,canaryOnly,now=Date.now,narrator}){
  if(canaryOnly!==true)throw Error('FINANCE_GAME_CANARY_ONLY');
  const entities=Object.values(source.rooms).flatMap(room=>room.entities.map(e=>({...e,scene:room.id})));
  const people=Object.fromEntries(peopleIds.map(id=>[id,entities.find(e=>e.person===id)]));
  if(peopleIds.some(id=>!people[id]))throw Error('PERSON_BINDING_MISSING');
  const table=kind=>{const matches=entities.filter(e=>e.kind===kind);if(matches.length!==1)throw Error('ENTITY_BINDING_AMBIGUOUS');return matches[0];};
  const desks={projects:table('projects'),committee:table('committee'),archive:table('archive')};
  const domainRules=financeRules();
  const domainTarget=id=>{
    if(id.startsWith('collect-'))return entities.find(e=>e.record===id.slice(8).replace(/-revision$/,''));
    if(id.startsWith('meet-'))return people[id.slice(5)];
    if(id.startsWith('chapter-'))return people[chapterPeople[id.slice(8)]];
    if(id.startsWith('negotiate-'))return people.founder;
    if(id.startsWith('decide-'))return desks.committee;
    return {'accept-project':desks.projects,archive:desks.archive,'client-accept':people.client}[id];
  };
  domainRules.locations=Object.keys(source.rooms).map(id=>({id,label:{zh:id,en:id}}));
  // Witness for the original non-spatial package is not a spatial proof. The
  // end-to-end tests below provide actual walking/target-aware journeys.
  domainRules.walkthrough=['accept-project'];
  for(const a of domainRules.actions){
    const target=domainTarget(a.id);if(target)a.when=all(a.when,at(target.scene));
    if(a.id.startsWith('meet-'))a.when=all(a.when,fact('met-'+a.id.slice(5),false));
    else if(target?.person)a.when=all(a.when,fact('met-'+target.person));
  }
  const domainDef={format:'alteru-rule-package-v1',rules:domainRules},domainCompiled=await compile(domainRules);
  const domain=createFinanceRuntime({definition:domainDef,compiled:domainCompiled,runProlog,canaryOnly:true});
  const travelDef={format:'alteru-rule-package-v1',rules:financeTravelRules(contract)},travelCompiled=await compile(travelDef.rules);
  const travel=createFinanceTravelRuntime({contract,definition:travelDef,compiled:travelCompiled,runProlog,canaryOnly:true});
  const travelBinding=travel.initial('en','internal').mapVersion;
  const opening=prologueRules(source),openingDef={format:'alteru-rule-package-v1',rules:opening.rules},openingCompiled=await compile(opening.rules);
  const openingPolicy=createRuleRuntime({definition:openingDef,compiled:openingCompiled,loadBound:()=>fail('DYNAMIC_BINDING_NOT_READY'),runProlog,spawn:id=>contract.world.scenes[id].spawn,validatePosition:(scene,p)=>position(scene,p)});
  const admit=async(h,id)=>{const output=await runProlog(openingCompiled,[{action_id:id,state:h.state}]);if(output?.length!==1||output[0].accepted!==true)fail('PROLOGUE_REQUIRED');};
  const topics={};
  for(const person of peopleIds){
    const rules=financeRules();rules.locations=domainRules.locations;
    // Module-local witness starts in the person's room and performs the SAME
    // introduction rule first. Shared fact declarations never change initial
    // values to manufacture a witness. HTTP introductions route to domain only.
    rules.initialLocation=people[person].scene;
    rules.walkthrough=['meet-'+person,'topic-'+source.topics[person].find(t=>!t.after&&!t.requires?.length).id];
    rules.facts.push({id:'analyst-corrected',initial:false},...source.topics[person].map(t=>({id:done(person,t.id),initial:false})));
    rules.actions=source.topics[person].map(t=>({id:'topic-'+t.id,label:{zh:t.label[0],en:t.label[1]},when:all(at(people[person].scene),fact('met-'+person),
      ...(t.requires??[]).map(id=>fact(id)),...(t.utility?[]:[fact(done(person,t.id),false)]),...(t.after?[fact(done(person,t.after))]:[])),
      effects:[...(t.effects??[]).map(id=>({type:'fact',id,value:true})),{type:'fact',id:done(person,t.id),value:true}],next:[],successText:{zh:t.reply[0],en:t.reply[1]},rejectionText:{zh:'当前话题不可用。',en:'This topic is not available.'}}));
    rules.actions.unshift(structuredClone(domainRules.actions.find(a=>a.id==='meet-'+person)));
    const definition={format:'alteru-rule-package-v1',rules},compiled=await compile(rules);
    topics[person]={definition,compiled,policy:createRuleRuntime({definition,compiled,loadBound:()=>fail('DYNAMIC_BINDING_NOT_READY'),runProlog,
      spawn:id=>contract.world.scenes[id].spawn,validatePosition:(scene,p)=>position(scene,p)})};
  }
  const mapVersion=sha256(canonical({sourceHash,contract,domainCompiled,travelCompiled,openingCompiled,topics:Object.fromEntries(peopleIds.map(id=>[id,topics[id].compiled]))}));
  const t=(p,locale)=>source.localizeContext(source.tx(p,locale));
  const position=(scene,p)=>{exact(p,['x','y']);if(!travelWalkable(contract,scene,p))fail('INVALID_POSITION');return {...p};};
  const npcView=h=>{const r=advanceResident(h.npc.analyst,now());return {analyst:{x:r.x,y:r.y}};};
  const near=(h,entity)=>{
    if(!entity||entity.scene!==h.state.location)fail('OFF_SCENE_ENTITY');
    const p=entity.id==='analyst'?npcView(h).analyst:entity.at;
    position(h.state.location,h.position);
    if(Math.hypot(h.position.x+7-p.x,h.position.y+5-p.y)>=65)fail('TOO_FAR');
  };
  const entityFor=(h,id)=>{const e=entities.find(e=>e.id===id&&e.scene===h.state.location);if(!e)fail('UNKNOWN_ENTITY');return e;};
  const projectDomain=h=>({...h,canary:'finance-domain-r15'});
  const projectTravel=h=>({...h,canary:'finance-travel-r15',mapVersion:travelBinding});
  const syncJourney=h=>{h.journey={...h.journey,scene:h.state.location,position:{...h.position},visited:[...h.visited],storyMinute:h.storyMinute,opened:h.opened,...(h.decisionSnapshot?{decisionSnapshot:structuredClone(h.decisionSnapshot)}:{})};};
  const assertReadable=h=>{
    if(h?.canary!=='finance-game-r15'||h.mapVersion!==mapVersion||h.world!=='before-the-close'||h.binding||h.chapterVersion!==1)fail('JOURNEY_VERSION_UNSUPPORTED',409);
    if(!Number.isSafeInteger(h.version)||h.version<0||!['en','zh'].includes(h.locale)||typeof h.opened!=='boolean'||!h.journey||h.journey.id!==h.id||!Array.isArray(h.journey.history))fail('INVALID_JOURNEY');
    position(h.state.location,h.position);
    if(h.journey.scene!==h.state.location||canonical(h.journey.position)!==canonical(h.position)||canonical(h.journey.visited)!==canonical(h.visited)||h.journey.storyMinute!==h.storyMinute||h.journey.opened!==h.opened||Boolean(h.journey.save.sessionEnded)!==h.ended)fail('NATIVE_PROJECTION_MISMATCH');
    if(canonical(visibleFacts(h.state.facts))!==canonical(h.journey.save.facts))fail('NATIVE_FACTS_MISMATCH');
    if(!h.npc?.analyst||!Number.isFinite(h.npc.analyst.epoch)||Math.abs(h.npc.analyst.x-people.analyst.at.x)>22.001||h.npc.analyst.y!==people.analyst.at.y)fail('NPC_STATE_INVALID');
  };
  const copyNative=(before,result,input,text)=>{
    let journey=structuredClone(before.journey);
    const effects=result.effects.filter(e=>!(e.type==='fact'&&e.id.startsWith('spoken-')));
    if(input.kind==='collect'){
      for(const e of effects)if(journey.save.facts[e.id]!==e.value)journey=source.facts(journey,[e],text);
    }else if(input.kind==='chapter'||input.kind==='topic'){
      for(const e of effects)journey=source.facts(journey,[e],text);
    }else if(effects.length)journey=source.facts(journey,effects,text);
    result.head.journey=wire(journey);result.head.ended=Boolean(journey.save.sessionEnded);
  };
  const validateAction=b=>{exact(b,['action_id','expected_version','sceneId','type','input']);if(b.type!=='finance-game'||typeof b.input?.kind!=='string')fail('INVALID_ACTION');};
  return {
    modules:{domain:{definition:domainDef,compiled:domainCompiled},travel:{definition:travelDef,compiled:travelCompiled},prologue:{definition:openingDef,compiled:openingCompiled},topics},entities,desks,npcView,
    initial:(locale,id)=>{
      const head={...travel.initial(locale,id),canary:'finance-game-r15',mapVersion,opened:false,npc:{analyst:initialResident(people.analyst,now())}};
      for(const person of peopleIds)for(const f of topics[person].definition.rules.facts)if(!Object.hasOwn(head.state.facts,f.id))head.state.facts[f.id]=f.initial;
      for(const f of opening.rules.facts)if(!Object.hasOwn(head.state.facts,f.id))head.state.facts[f.id]=f.initial;
      head.journey=wire({...source.newJourney(),id,created:now()});syncJourney(head);return head;
    },assertReadable,upgrade:h=>{assertReadable(h);return structuredClone(h);},scene:h=>h.state.location,validateAction,
    position:(h,p)=>position(h.state.location,p),
    spatialContext:(h,b)=>{
      exact(b,['expected_version','sceneId','position','focus']);if(b.focus!==null&&b.focus!=='analyst')fail('UNKNOWN_ENTITY');
      const p=position(h.state.location,b.position),next=structuredClone(h),r=advanceResident(h.npc.analyst,now());
      if(b.focus==='analyst'&&h.state.location!==people.analyst.scene)fail('OFF_SCENE_ENTITY');
      r.focus=b.focus==='analyst';r.paused=h.state.location===people.analyst.scene&&(r.focus||Math.hypot(p.x+7-r.x,p.y+5-r.y)<105);
      next.npc.analyst=r;next.journey.position={...p};return next;
    },
    prepare:async(h,b,_allowNarration,scope)=>{
      validateAction(b);assertReadable(h);if(h.version!==b.expected_version||h.state.location!==b.sceneId)fail('VERSION_CONFLICT',409);
      const input=b.input;let result,domainInput,entity,dialogue;
      if(input.kind==='begin'||input.kind==='locale'){
        exact(input,input.kind==='begin'?['kind']:['kind','locale']);
        if(input.kind==='locale'&&!['en','zh'].includes(input.locale))fail('INVALID_ACTION');
        const head=structuredClone(h);head.version++;if(input.kind==='begin')head.opened=true;else head.locale=input.locale;
        result={kind:'action',accepted:true,head,effects:[],receipt_id:randomUUID(),engine:'presentation-metadata'};
      }else{
        if(!h.opened)fail('OPENING_REQUIRED');
        switch(input.kind){
          case 'welcome':case 'review-brief':{
            exact(input,input.kind==='welcome'?['kind','entity']:['kind']);
            if(input.kind==='welcome'){entity=entityFor(h,input.entity);if(entity.kind!=='projects')fail('INVALID_ACTION');}
            result=await openingPolicy.prepare(h,{...b,type:'rule',rule_id:input.kind==='welcome'?'welcome-read':'orientation-file'});
            copyNative(h,result,{kind:'topic'},t(input.kind==='welcome'?source.welcome:source.starterBrief,h.locale));break;
          }
          case 'door':case 'map':result=await travel.prepare(projectTravel(h),{...b,type:'finance-travel'});result.head.canary=h.canary;result.head.mapVersion=mapVersion;break;
          case 'inspect':exact(input,['kind','entity']);entity=entityFor(h,input.entity);if(!entity.record)fail('INVALID_ACTION');await admit(h,entity.record==='memo'?'allow-memo':'main-flow');domainInput={kind:'collect',record:entity.record};break;
          case 'introduce':exact(input,['kind','entity']);entity=entityFor(h,input.entity);if(!entity.person)fail('INVALID_ACTION');domainInput={kind:'meet',person:entity.person};dialogue={person:entity.person,question:t(source.inPrologue(h.journey)?['你好，我是刚加入团队的艾娃。','Hello, I’m Ava. I’ve just joined the team.']:source.encounter[entity.person].greeting,h.locale),reply:t(source.people[entity.person].intro,h.locale)};break;
          case 'topic':{
            exact(input,['kind','entity','topic']);entity=entityFor(h,input.entity);if(!entity.person||typeof input.topic!=='string')fail('INVALID_ACTION');
            near(h,entity);const person=entity.person;
            if(input.topic.startsWith('orientation-')){
              const rule_id=person+'-'+input.topic,topic=opening.copy[rule_id];if(!topic)fail('INVALID_ACTION');
              result=await openingPolicy.prepare(h,{...b,type:'rule',rule_id});
              dialogue={person,question:t(topic.label,h.locale),reply:t(topic.reply,h.locale),topicKey:topic.id};
              if(!topic.effects?.length)result.effects=[];
              copyNative(h,result,{kind:'topic'},dialogue.reply);break;
            }
            await admit(h,'main-flow');
            if(input.topic.startsWith('chapter-')){
              const choice=input.topic.slice(8);if(chapterPeople[choice]!==person)fail('INVALID_ACTION');domainInput={kind:'chapter',choice};
              const content=source.chapterTopics(h.journey,person).find(q=>q.id===input.topic);
              dialogue={person,question:t(content?.label??['继续核查','Continue the review'],h.locale),reply:t(content?.reply??['已记录。','Recorded.'],h.locale),topicKey:input.topic};
            }else{
              const topic=source.topics[person].find(q=>q.id===input.topic);if(!topic)fail('INVALID_ACTION');
              result=await topics[person].policy.prepare(h,{...b,type:'rule',rule_id:'topic-'+topic.id});
              dialogue={person,question:t(topic.label,h.locale),reply:t(topic.reply,h.locale),topicKey:topic.id};
              copyNative(h,result,{kind:'topic'},dialogue.reply);
            }break;
          }
          case 'negotiate':exact(input,['kind','entity','term']);entity=entityFor(h,input.entity);if(entity.person!=='founder')fail('INVALID_ACTION');domainInput={kind:'negotiate',term:input.term};
            if(!source.negotiationCopy[input.term])fail('INVALID_ACTION');
            dialogue={person:'founder',question:t(source.negotiationCopy[input.term].question,h.locale),reply:t(source.negotiationCopy[input.term].reply,h.locale)};break;
          case 'decide':exact(input,['kind','entity','decision']);entity=entityFor(h,input.entity);if(entity.kind!=='committee')fail('INVALID_ACTION');domainInput={kind:'decide',decision:input.decision};break;
          case 'archive':case 'accept-project':exact(input,['kind','entity']);entity=entityFor(h,input.entity);if(entity.kind!==(input.kind==='archive'?'archive':'projects'))fail('INVALID_ACTION');domainInput={kind:input.kind};break;
          case 'conclude':domainInput=input;break;
          case 'free-talk':{
            await admit(h,'main-flow');
            exact(input,['kind','entity','text']);entity=entityFor(h,input.entity);if(!entity.person)fail('INVALID_ACTION');near(h,entity);
            if(!h.state.facts['met-'+entity.person])fail('INTRODUCTION_REQUIRED');if(typeof input.text!=='string'||!input.text.trim()||input.text.length>500)fail('INVALID_TEXT');
            if(!narrator)fail('DIALOGUE_UNAVAILABLE',503);
            const reply=await narrator({journey:structuredClone(h.journey),facts:structuredClone(h.state.facts),person:entity.person,text:input.text.trim(),locale:h.locale,actionId:b.action_id,version:h.version,mapVersion:h.mapVersion,scope});
            if(typeof reply!=='string'||!reply.trim()||reply.length>6000)fail('INVALID_NARRATION');
            result={kind:'action',accepted:true,head:structuredClone(h),effects:[],receipt_id:randomUUID(),engine:'injected-narrator'};result.head.version++;
            dialogue={person:entity.person,question:input.text.trim(),reply:reply.trim()};break;
          }
          default:fail('INVALID_ACTION');
        }
      }
      if(entity)near(h,entity);
      if(domainInput){
        if(!['meet','collect'].includes(domainInput.kind))await admit(h,'main-flow');
        result=await domain.prepare(projectDomain(h),{...b,type:'finance',input:domainInput});result.head.canary=h.canary;
        copyNative(h,result,domainInput,dialogue?.reply??t(['操作已记录。','Action recorded.'],h.locale));
      }
      if(dialogue){result.head.journey.history.push({id:b.action_id,...dialogue});result.dialogue=dialogue;}
      if(entity)result.head.entityProof={id:entity.id,scene:entity.scene};
      syncJourney(result.head);assertReadable(result.head);return result;
    },
    preserveConcurrent:(candidate,current)=>{
      if(candidate.travelProof){travel.preserveConcurrent(candidate,current);const r=advanceResident(current.npc.analyst,now());r.focus=false;r.paused=false;candidate.npc.analyst=r;}
      else {if(candidate.entityProof)near(current,entities.find(e=>e.id===candidate.entityProof.id&&e.scene===candidate.entityProof.scene));candidate.position={...current.position};candidate.npc=structuredClone(current.npc);}
      delete candidate.entityProof;syncJourney(candidate);assertReadable(candidate);
    },
  };
}
