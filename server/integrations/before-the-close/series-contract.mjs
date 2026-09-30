// Explicit local candidate. Existing single-room profiles and saves unchanged.
import {financeInvestigation} from './investigations.mjs';
import {verificationLayout} from './dynamic-space.mjs';
import {createSlotSpace} from '../../packages/spatial-slots/index.mjs';
export const financeSeriesVersion='finance-two-generation-v1';
export function financeSeriesNodes(ids=['income','funding']){
 if(!Array.isArray(ids)||ids.length<1||ids.length>2||new Set(ids).size!==ids.length)throw Error('SERIES_NODE_CONFIG_INVALID');
 return ids.map((id,index)=>{
  const node=financeInvestigation(id),layout=verificationLayout();
  layout.sceneId='dyn-series-'+id;
  layout.entrance.at.y+=index*96;layout.entrance.approach.y+=index*96;
  return {...node,layout,profile:{...node.profile,id:'finance-series-'+id+'-v1',gateFacts:[...node.profile.gateFacts,...(index?[ids[index-1]]:[])],maxChainDepth:2}};
 });
}
export function financeSeriesSpaces(head,nodes=financeSeriesNodes()){
 if(!head.binding)return [];
 return head.dynamic.entries.map((entry,i)=>createSlotSpace(nodes[i].layout)(head.catalog[i],entry.actions));
}
// Analysis remains distinct from primary evidence, and retains ORIGINAL
// artifact identity after a later composite artifact includes the old room.
export function financeSeriesNotes(head){
 if(!head.binding||head.dynamic?.format!==financeSeriesVersion)return [];
 return head.dynamic.entries.flatMap(e=>e.actions.filter(a=>head.state.facts[a.doneFact]===true).map(a=>({id:a.id,artifact_hash:e.artifactHash,title:a.label,text:a.successText,originIds:[...e.origins],kind:'analysis-note',finding:e.investigationId})));
}
