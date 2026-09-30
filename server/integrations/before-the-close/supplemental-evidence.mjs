// Read-only projection shared with the UI. These are analysis notes, NOT
// independent source documents or an alternate authority for a finding.
export const supplementalEvidenceVersion=1;
export const supplementalFinding=head=>head?.dynamic?.evidence?.finding??'income';
export function supplementalArtifact(head,finding){
 if(head?.dynamic?.format==='finance-two-generation-v1')return head.dynamic.entries.find(e=>e.investigationId===finding)?.artifactHash??null;
 return supplementalFinding(head)===finding?head?.binding?.artifact_hash??null:null;
}
export function supplementalComparisons(head){
 if(head?.dynamic?.format==='finance-two-generation-v1')return head.dynamic.entries.filter(e=>e.comparison).map(e=>({finding:e.investigationId,comparison:e.comparison,sealed:head.dynamic.sealed!==null}));
 const finding=supplementalFinding(head),comparison=head?.dynamic?.evidence?.comparisons?.[finding];return comparison?[{finding,comparison,sealed:head.dynamic.evidence.sealed!==null}]:[];
}
export function supplementalNotes(head){
 if(head?.binding&&head.dynamic?.format==='finance-two-generation-v1')return head.dynamic.entries.flatMap(e=>e.actions.filter(a=>head.state.facts[a.doneFact]===true).map(a=>({id:a.id,artifact_hash:e.artifactHash,title:a.label,text:a.successText,originIds:[...e.origins],kind:'analysis-note',finding:e.investigationId})));
 if(!head?.binding||head.dynamic?.evidence?.version!==supplementalEvidenceVersion)return [];
 return head.dynamic.actions.filter(a=>head.state.facts[a.doneFact]===true).map(a=>({
  id:a.id,artifact_hash:head.binding.artifact_hash,title:a.label,text:a.successText,
  originIds:[...head.dynamic.evidence.origins],kind:'analysis-note',finding:supplementalFinding(head),
 }));
}
