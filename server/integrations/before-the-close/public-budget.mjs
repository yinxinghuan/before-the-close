// Distinct gameplay owners share only the previously approved player model
// allowance. Hash request identities to prevent cross-player cache collisions.
import {sha256,canonical} from '../../packages/rule-compiler/index.mjs';
export function financePublicBudget(gateway,budgetOwner){
 if(!gateway?.call||typeof budgetOwner!=='string'||!budgetOwner)throw Error('PUBLIC_BUDGET_CONFIG');
 const pending=new Map();
 return Object.freeze({usage:()=>gateway.usage(),queuePosition:owner=>{const ids=pending.get(owner);return ids?Math.max(0,...[...ids].map(id=>gateway.queuePosition?.(budgetOwner,id)??0)):0;},call:({owner,id,purpose,payload})=>{
  if(!/^player-[a-f0-9]{64}$/.test(owner??'')||typeof id!=='string'||!id||id.length>100)throw Error('PUBLIC_MODEL_IDENTITY');
  const mapped='public-'+sha256(canonical({owner,id}));let ids=pending.get(owner);if(!ids){ids=new Set();pending.set(owner,ids);}ids.add(mapped);
  return Promise.resolve().then(()=>gateway.call({owner:budgetOwner,id:mapped,purpose,payload})).finally(()=>{ids.delete(mapped);if(!ids.size)pending.delete(owner);});
 }});
}
