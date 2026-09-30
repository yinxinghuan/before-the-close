// Trusted server composition. No retry/repair loop and no implicit transport.
// Generation and semantic review use the SAME approved durable model gateway.
import {AuthorityError} from '../../packages/authority-session/index.mjs';
import {createProposalBuilder} from '../../packages/dynamic-pipeline/proposal-builder.mjs';
import {financeInvestigation} from './investigations.mjs';
import {prepareFinanceDraft} from './dynamic-fixture.mjs';
import {financeGenerationMessages,financeReviewMessages,parseFinanceReview,validateFinanceModelDraft} from './model-prompts.mjs';
const fail=code=>{throw new AuthorityError(code);};

export function validateFinanceProposalSource(head,investigationId='income'){
  const {profile,finding}=financeInvestigation(investigationId);
  if(head?.world!=='before-the-close'||head.binding||head.ended||!profile.parents.includes(head.state?.location)||head.state.facts.decision!=='none'||profile.gateFacts.some(k=>head.state.facts[k]!==true)||head.state.facts[finding]!==false)fail('PROPOSAL_GATE_CLOSED');
}

export function createFinanceProposalBuilder({source,sourceHash,policy,gateway,worldId}){
  return createProposalBuilder({sourceHash,worldId,gateway,adapter:{
    reviewFormat:'finance-proposal-review-v1',
    validateSource(head){validateFinanceProposalSource(head,policy.investigationId);policy.assertReadable(head);},
    generationMessages:head=>financeGenerationMessages(source,head,policy.investigationId),
    parseDraft:raw=>validateFinanceModelDraft(JSON.parse(raw)),
    prepareDraft:input=>prepareFinanceDraft({...input,policy}),
    reviewMessages:(head,draft)=>financeReviewMessages(source,head,draft,policy.investigationId),
    parseReview:parseFinanceReview,
    knownContext:messages=>JSON.parse(messages[1].content),
  }});
}
