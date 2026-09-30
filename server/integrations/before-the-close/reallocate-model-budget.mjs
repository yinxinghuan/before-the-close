import {canonical,sha256} from '../../packages/rule-compiler/index.mjs';
import {financeCloudModelApproval} from './cloud-model-approval.mjs';

// Explicit one-time operator action, never invoked by a game request/startup.
export async function reallocateFinanceModelBudget({store,config,meta,now=Date.now}){
 const approval=financeCloudModelApproval(config,meta,{now});
 if(config.model.allocation!=='user-approved-qa45-player55-20260930'||store.worldId!==config.base.slice(1)||store.gameId!=='before-the-close')throw Error('MODEL_REALLOCATION_SCOPE');
 const qa=config.accounts.find(a=>a.name==='reviewer-two'),player=config.accounts.find(a=>a.name==='yin');
 const ownerId=owner=>'owner-'+sha256(canonical({budgetId:approval.budgetId,owner}));
 if(config.goalQaProposalApproval==='user-approved-qa-budget-only-20261001')return store.transaction(async r=>{
  const total=await r.modelBudget(approval.budgetId),q=await r.modelBudget(ownerId(qa.owner)),p=await r.modelBudget(ownerId(player.owner));
  if(!total||!q||!p||total.maximum!==100||total.used!==q.used+p.used||![45,100].includes(q.maximum)||p.maximum!==55||q.used>q.maximum||p.used>55)throw Error('MODEL_REALLOCATION_LEDGER_MISMATCH');
  const already=q.maximum===100;
  if(!already){await r.resizeModelBudget(ownerId(qa.owner),45,100);await r.addDynamicAudit('qa-global-budget-only-20261001',now(),sha256('user-approved-operator'),'model-budget-reallocation',sha256(canonical({budgetId:approval.budgetId,before:{total,q,p},qaMaximum:100,globalMaximum:100})));}
  return {alreadyApplied:already,model:total,accounts:[{name:qa.name,maximum:100,used:q.used},{name:player.name,maximum:55,used:p.used}]};
 });
 return store.transaction(async r=>{
  const total=await r.modelBudget(approval.budgetId),q=await r.modelBudget(ownerId(qa.owner)),p=await r.modelBudget(ownerId(player.owner));
  if(!total||!q||!p||total.maximum!==100||total.used!==q.used+p.used||q.used>45||p.used>55)throw Error('MODEL_REALLOCATION_LEDGER_MISMATCH');
  const already=q.maximum===45&&p.maximum===55;
  if(!already){
   if(q.maximum!==30||p.maximum!==70)throw Error('MODEL_REALLOCATION_LEDGER_MISMATCH');
   await r.resizeModelBudget(ownerId(qa.owner),30,45);
   await r.resizeModelBudget(ownerId(player.owner),70,55);
   await r.addDynamicAudit('model-allocation-qa45-player55-20260930',now(),sha256('user-approved-operator'),'model-budget-reallocation',sha256(canonical({budgetId:approval.budgetId,before:{total,q,p},after:{qa:45,player:55}})));
  }
  return {alreadyApplied:already,model:total,accounts:[{name:qa.name,maximum:45,used:q.used},{name:player.name,maximum:55,used:p.used}]};
 });
}
