// One explicit user approval, bound to the existing isolated world and deadline.
// The private deployment config assigns accounts; no credentials or secrets here.
export function financeCloudModelApproval(config,meta,{now=Date.now}={}){
 const deadline=config.stopExtension==='user-approved-24h-20260930'?Date.parse('2026-10-01T10:02:00Z'):Date.parse('2026-09-30T10:02:00Z');
 if(meta.dynamicMode!=='budgeted-live-v1'||config?.model?.budgetId!=='user-approved-hundred-20260930-cloud1'||config.model.maximum!==100||config.base!=='/e26be59b-9c31-43f2-844e-0dfed527bc71'||meta.sourceHash!=='a0b71d5b3a10e5671fc71e7a6c0cfda109c5a46082e523339f071492b2985cc4'||!Number.isSafeInteger(config.expiresAt)||config.expiresAt>deadline||config.expiresAt<=now())throw Error('CLOUD_MODEL_APPROVAL_MISMATCH');
 const qa=config.accounts.find(a=>a.name==='reviewer-two'),player=config.accounts.find(a=>a.name==='yin');
 if(!qa||!player||qa.owner===player.owner||config.accounts.length!==2)throw Error('CLOUD_MODEL_ACCOUNTS_MISMATCH');
 return {budgetId:config.model.budgetId,maximum:100,expiresAt:config.expiresAt,ownerLimits:{[qa.owner]:30,[player.owner]:70}};
}

// User approved QA-only six proposals on 2026-09-30. Existing rows still count.
// No extra model calls, player allowance, production policy or deadline granted.
export function financeCloudProposalApproval(config,meta,options){
 financeCloudModelApproval(config,meta,options);
 if(meta.series!=='finance-two-generation-v1')throw Error('CLOUD_PROPOSAL_APPROVAL_MISMATCH');
 return {owner:config.accounts.find(a=>a.name==='reviewer-two').owner,maximum:6,startsAt:Date.parse('2026-09-30T00:00:00Z'),expiresAt:Math.min(config.expiresAt,Date.parse('2026-09-30T10:02:00Z'))};
}

// Separate, explicit grant for the EXISTING synthetic public QA identity.
// No actor is embedded in distributable source, and ordinary players stay at 3.
export function financePublicQaProposalApproval(config,meta,options){
 const g=config.public?.qaProposalApproval;if(g===undefined)return undefined;
 financeCloudModelApproval(config,meta,options);
 if(meta.series!=='finance-two-generation-v1'||!g||Object.keys(g).sort().join(',')!=='approval,owner'||g.approval!=='user-approved-synthetic-qa-20260930'||!/^player-[a-f0-9]{64}$/.test(g.owner??''))throw Error('PUBLIC_QA_PROPOSAL_APPROVAL_MISMATCH');
 return {owner:g.owner,maximum:6,startsAt:Date.parse('2026-09-30T00:00:00Z'),expiresAt:Math.min(config.expiresAt,Date.parse('2026-09-30T16:00:00Z'))};
}
