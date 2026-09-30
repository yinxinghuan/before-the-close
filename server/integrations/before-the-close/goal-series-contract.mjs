// Explicit candidate, two existing spatial slots, no extra reward/effect types.
import {financeInvestigation} from './investigations.mjs';
import {verificationLayout} from './dynamic-space.mjs';
import {canonical,sha256} from '../../packages/rule-compiler/index.mjs';
import {goalDirectorVersion,goalOperation,parseGoalReview} from '../../packages/dynamic-pipeline/goal-director.mjs';
export const financeGoalSeriesVersion='finance-goal-series-v1';
export const financeGoalDomain='Before the Close: fictional New York VC/PE investigation, Northline and Ava. International audience, English and Chinese localized versions of the same story. Goals are supplemental analysis, not legal or financial advice.';
export const financeGoalLayout=index=>{
 if(!Number.isInteger(index)||index<0||index>1)throw Error('GOAL_SLOT_LIMIT');
 const l=verificationLayout();l.sceneId='dyn-goal-'+(index+1);l.entrance.at.y+=index*96;l.entrance.approach.y+=index*96;return l;
};
export function assertStoredGoal(receipt){
 if(receipt?.format!==goalDirectorVersion||receipt.status!=='ready'||receipt.goal?.operation!==goalOperation||receipt.goal_hash!==sha256(canonical({binding:receipt.binding,goal:receipt.goal}))||!parseGoalReview(receipt.review).passed)throw Error('GOAL_STORED_RECEIPT_INVALID');
 return receipt;
}
export function financeGoalNode(receipt,index){
 assertStoredGoal(receipt);const goal=receipt.goal;
 const profile=financeInvestigation().profile;
 return {id:'goal-'+goal.key.slice(0,16),finding:null,requiredOrigins:[...goal.sourceIds],playerGoal:goal.question,layout:financeGoalLayout(index),profile:{...profile,id:'finance-goal-room-v1',gateFacts:['orientation-ready',...goal.sourceIds],completion:{action:'archive',fact:'case-archived'},maxChainDepth:2}};
}
export function financeGoalNotes(head){
 if(!head.binding||head.dynamic?.format!==financeGoalSeriesVersion)return [];
 return head.dynamic.entries.flatMap(e=>e.actions.filter(a=>head.state.facts[a.doneFact]===true).map(a=>({id:a.id,artifact_hash:e.artifactHash,title:a.label,text:a.successText,originIds:[...e.origins],kind:'analysis-note',goalKey:e.goalReceipt.goal.key})));
}
