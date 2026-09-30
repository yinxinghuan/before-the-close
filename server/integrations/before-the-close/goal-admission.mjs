// Explicit candidate policy, never an expansion of the deployed r19 policy.
import {canonical} from '../../packages/rule-compiler/index.mjs';
import {financeAdmissionAdapter,decideSourceCitationAdmission} from './automatic-admission.mjs';
import {assertStoredGoal,financeGoalNode} from './goal-series-contract.mjs';
export const financeGoalAdmission='finance-goal-evidence-admission-v1';
const same=(a,b)=>canonical(a)===canonical(b);
export const financeGoalAdmissionAdapter={...financeAdmissionAdapter,policy:financeGoalAdmission,messages:a=>{
 const m=financeAdmissionAdapter.messages(a);
 m[0].content+=' This is goal-driven supplemental analysis. Both actions must address activeGoal.question and its exact sourceIds. The proposed question is NOT a fact. Reject a room that defaults to a different income/funding question, pretends the investigation was already completed, repeats priorAnalysis, or turns supplemental analysis into an authored finding. Completion requires both actual player inspections, never a model claim.';
 m[0].content+=' In evidence, field has ONLY two allowed values: investigations.0.successText or investigations.1.successText. Never emit activeInvestigation.focusRecordIds[0], activeInvestigation.focusRecordIds[1], or any other path as field. Cover the two focusRecordIds by choosing those documents as sourceId in entries for the two action successText fields. Extra citations may repeat one of those two allowed field values, not invent new fields.';
 return m;
}};
export function decideFinanceGoalAdmission(a){
 const reject=reason=>({passed:false,reason});
 try{
  const receipt=assertStoredGoal(a?.goalReceipt),known=a.review_packet?.knownContext,node=known?.activeInvestigation,depth=a.prepared?.lineage?.depth;
  if(!Number.isInteger(depth)||depth<1||depth>2)return reject('Goal room depth is outside the candidate profile.');
  const expected=financeGoalNode(receipt,depth-1),source=a.prepared.descriptor.source;
  if(a.review_packet.format!=='finance-goal-room-review-v1'||!same(a.profile,expected.profile)||node?.id!==expected.id||node.stage!==depth||!same(node.focusRecordIds,receipt.goal.sourceIds)||!same(known.activeGoal,receipt.goal))return reject('Goal, profile, and room review are not the same candidate.');
  if(receipt.binding.head_hash!==a.source_head_hash||receipt.binding.session!==source.session_id||receipt.binding.version!==source.version||receipt.binding.cursor!==source.cursor||a.prepared.descriptor.goal_hashes?.at(-1)!==receipt.goal_hash)return reject('Goal receipt is bound to a different source journey.');
  return decideSourceCitationAdmission(a,financeGoalAdmission);
 }catch{return reject('Goal admission evidence is absent or malformed.');}
}
