// A release view over the SAME world and owner. Hide obsolete journeys without
// deleting them, creating a new budget or resetting the daily proposal count.
import {financeGoalSeriesVersion} from './goal-series-contract.mjs';
import {AuthorityError} from '../../packages/authority-session/error.mjs';
export const financeGoalPublicVersion='public-'+financeGoalSeriesVersion;
const current=h=>h?.experienceVersion===financeGoalPublicVersion;
const rowCurrent=r=>r&&current(JSON.parse(r.data));
export function financeGoalPublicStore(store){
 if(store.gameId!=='before-the-close'||!store.worldId.endsWith(':public-player-v1'))throw Error('GOAL_PUBLIC_WORLD_REQUIRED');
 return Object.freeze({...store,transaction:work=>store.transaction(r=>{
  const session=async(o,id)=>{const v=await r.session(o,id);return rowCurrent(v)?v:null;};
  const response=async p=>{const v=await p;return v&&current(JSON.parse(v.response).head)?v:null;};
  return work(Object.freeze({...r,session,
   sample:async()=>{const v=await r.sample();return rowCurrent(v)?v:null;},
   list:async o=>(await r.list(o)).filter(rowCurrent),
   receipt:(o,id)=>response(r.receipt(o,id)),
   adoption:(o,id)=>response(r.adoption(o,id)),
   proposal:async(o,id)=>{const v=await r.proposal(o,id);return v&&await session(o,v.session)?v:null;},
   proposals:async(o,id)=>await session(o,id)?r.proposals(o,id):[],
   insert:(o,enrollment,digest,h,at)=>{if(!current(h))throw new AuthorityError('GOAL_RELEASE_REQUIRED',409);return r.insert(o,enrollment,digest,h,at);},
   write:(o,h,cursor,at)=>{if(!current(h))throw new AuthorityError('GOAL_RELEASE_REQUIRED',409);return r.write(o,h,cursor,at);},
   // proposalCount, activeProposals, count and all model methods deliberately
   // remain unfiltered. Failed and previous-release attempts still count.
  }));
 })});
}
export function financeGoalPublicPolicy(policy){
 if(policy.seriesVersion!==financeGoalSeriesVersion)throw Error('GOAL_PUBLIC_POLICY_REQUIRED');
 return {...policy,initial:(...args)=>({...policy.initial(...args),experienceVersion:financeGoalPublicVersion})};
}
