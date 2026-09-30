// Candidate adapter only: explicit review-runtime opt-in, not public default.
// Read goals from the existing authority state; never accept client "memory".
import {createGoalDirector,goalKey} from '../../packages/dynamic-pipeline/goal-director.mjs';
import {financeKnownRecords,financeKnownRevisions,financeDialogueProgress} from './model-context.mjs';
import {financeSeriesNotes,financeSeriesVersion} from './series-contract.mjs';
import {financeInvestigation} from './investigations.mjs';
import {findingPairs} from './rules.mjs';
import {financeGoalDomain,financeGoalSeriesVersion,financeGoalNotes} from './goal-series-contract.mjs';

export function financeGoalSnapshot(source,head){
 const facts=head.state.facts;
 const records=financeKnownRecords(source,facts).map(r=>({...r,rootId:r.id,kind:'primary'}));
 records.push(...financeKnownRevisions(source,facts).map(({originalId,...r})=>({...r,rootId:originalId})));
 // Both source pairs used by a completed native finding and a fully read
 // supplemental room are consumed. Native finding != generated content.
 const completedKeys=[];
 for(const [finding,pair]of Object.entries(findingPairs))if(facts[finding]===true)completedKeys.push(goalKey(...pair));
 if(head.dynamic?.format===financeSeriesVersion)for(const entry of head.dynamic.entries){
  if(entry.actions.every(a=>facts[a.doneFact]===true))completedKeys.push(goalKey(...financeInvestigation(entry.investigationId).requiredOrigins));
 }
 if(head.dynamic?.format===financeGoalSeriesVersion)for(const entry of head.dynamic.entries){
  if(entry.goalCompletion&&entry.actions.every(a=>facts[a.doneFact]===true))completedKeys.push(entry.goalReceipt.goal.key);
 }
 const notes=head.dynamic?.format===financeGoalSeriesVersion?financeGoalNotes(head):financeSeriesNotes(head);
 const progress=Object.fromEntries(['zh','en'].map(l=>[l,financeDialogueProgress(source,head.journey,l)]));
 const nativeNotes=progress.en.completedFindings.map(n=>({id:'native-'+n.id,text:{en:n.result,zh:progress.zh.completedFindings.find(z=>z.id===n.id).result},originIds:n.sourceIds}));
 return {records,analysis:[...nativeNotes,...notes.map(n=>({id:n.id,text:n.text,originIds:n.originIds}))],completedKeys:[...new Set(completedKeys)],closed:head.ended===true||facts.decision!=='none'};
}

export function createFinanceGoalDirector({source,policy,sourceHash,worldId,gateway}){
 return createGoalDirector({sourceHash,worldId,gateway,adapter:{
  domain:financeGoalDomain,
  validateSource:head=>policy.assertReadable(head),snapshot:head=>financeGoalSnapshot(source,head),
 }});
}
