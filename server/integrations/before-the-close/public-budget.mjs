// Distinct gameplay owners share only the previously approved player model
// allowance. Hash request identities to prevent cross-player cache collisions.
import {sha256,canonical} from '../../packages/rule-compiler/index.mjs';
export function financePublicBudget(gateway,budgetOwner){
 if(!gateway?.call||typeof budgetOwner!=='string'||!budgetOwner)throw Error('PUBLIC_BUDGET_CONFIG');
 return Object.freeze({usage:()=>gateway.usage(),call:({owner,id,purpose,payload})=>{
  if(!/^player-[a-f0-9]{64}$/.test(owner??'')||typeof id!=='string'||!id||id.length>100)throw Error('PUBLIC_MODEL_IDENTITY');
  return gateway.call({owner:budgetOwner,id:'public-'+sha256(canonical({owner,id})),purpose,payload});
 }});
}
