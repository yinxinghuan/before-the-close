// Authored, bilingual offline fixture. NOT model output or a live semantic review.
import {sha256,canonical} from '../../packages/rule-compiler/index.mjs';
import {prepareRuleDelta} from '../../packages/rule-delta/index.mjs';
import {assembleSlots} from '../../packages/dynamic-pipeline/slots.mjs';
import {verificationSceneId} from './dynamic-space.mjs';
const hash=v=>sha256(canonical(v)),bi=(zh,en)=>({zh,en});
export const verificationDraft={motivation:bi('核对银行回单与客户合同的收入疑点。','Cross-check the receipt against the customer contract.'),room:{label:bi('回款核验室','Receipt verification room'),detail:bi('这里保留着两份待核对的补充记录。','Two supplemental records await comparison.'),lore:bi('财务团队在此核验收款来源。','The finance team checks payment sources here.')},investigations:[{label:bi('阅读汇款附注','Read remittance note'),successText:bi('回单注明项目预付款；到账不等于收入已经确认。','The receipt describes a project advance; cash received is not proof of recognized revenue.'),rejectionText:bi('目前不能读取。','Not available yet.')},{label:bi('核对协议索引','Check agreement index'),successText:bi('回单项目编号指向补充协议；仍需阅读原文，不能用本笔记代替收入判断。','The receipt project code points to the supplement. Read the original; this note cannot replace your income finding.'),rejectionText:bi('先阅读汇款附注。','Read the remittance note first.')}]};
export async function prepareFinanceFixture({head,cursor,policy}){
  const draft=policy.investigationId==='funding'?fundingDraft:verificationDraft;
  return prepareFinanceDraft({head,cursor,policy,draft,proposalId:'verification-fixture',semantic:{passed:true,mode:'authored-fixture-only',locales:['en','zh']}});
}
export const fundingDraft={motivation:bi('比较现金记录与预测中的近期支出。','Compare cash records with forecast near-term obligations.'),room:{label:bi('资金核验室','Liquidity review room'),detail:bi('现金记录与预测在这里分开核对。','Cash records and forecasts are compared separately here.'),lore:bi('分析笔记不等同于资金到账。','Analysis notes are not evidence of funds received.')},investigations:[{label:bi('区分现金与预测','Distinguish cash from forecasts'),successText:bi('先保留现金记录和预测各自的口径，不把预计资金当成已到账资金。','Keep the cash record and forecast distinct; expected funding is not received cash.'),rejectionText:bi('目前不能读取。','Not available yet.')},{label:bi('核对支付前提','Review payment assumptions'),successText:bi('回原始资料核对支付前提；这份笔记不保证近期义务能够支付。','Check payment assumptions against the original records; this note does not guarantee obligations can be paid.'),rejectionText:bi('目前不能读取。','Not available yet.')}]};
// Internal trusted assembly, never an arbitrary client artifact upload.
// A non-reviewed draft can be compiled here, but stage() will reject it.
export async function prepareFinanceDraft({head,cursor,policy,draft,proposalId,semantic={passed:false,mode:'not-reviewed',locales:[]}}){
  const snapshot={session_id:head.id,version:head.version,cursor},profile=policy.profile;
  const base={registry_game_id:'12345678-1234-1234-1234-123456789abc',ruleset_version:policy.parent.rules.rulesetVersion,artifact_hash:hash(policy.compiled)};
  const slot=assembleSlots(draft,{profile,proposalId,parentId:'records'});slot.add.locations[0].id=verificationSceneId;
  const prepared=await prepareRuleDelta({parent:policy.parent,parentBinding:base,snapshot,profile,lineage:{depth:0,proposals:[],rewardAllocations:{},locations:[]},proposal:{format:'alteru-rule-delta-v1',contract_version:2,profile:profile.id,proposal_id:proposalId,base,grounding:{source:snapshot,motivation:slot.motivation},add:slot.add}});
  Object.assign(prepared.descriptor,{source_head_hash:hash(head),parent_composite_hash:null,native_runtime_hash:head.mapVersion,dynamic_runtime_hash:policy.dynamicRuntimeHash});prepared.artifact_hash=hash(prepared.descriptor);
  const a={prepared,profile,source_head_hash:hash(head),source_state_hash:hash(head.state),lineage:prepared.lineage,semantic};
  policy.validateDynamicArtifact(head,a);return a;
}
