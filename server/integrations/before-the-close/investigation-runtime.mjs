// One authority/runtime can read both reviewed node kinds. No new public
// creation route, chain depth, second writer or automatic source conversion.
import {createFinanceDynamicRuntime} from './dynamic-runtime.mjs';
import {AuthorityError} from '../../packages/authority-session/index.mjs';
const fail=()=>{throw new AuthorityError('FINANCE_INVESTIGATION_BINDING_INVALID');};
export async function createFinanceInvestigationRuntime(options){
 const policies=new Map();
 for(const investigationId of ['income','funding'])policies.set(investigationId,await createFinanceDynamicRuntime({...options,investigationId}));
 const forInvestigation=id=>{const p=policies.get(id);if(!p)fail();return p;};
 const byHead=head=>head.binding?forInvestigation(head.dynamic?.evidence?.finding??'income'):options.base;
 const byArtifact=artifact=>{const p=[...policies.values()].find(p=>p.profile.id===artifact?.profile?.id);if(!p)fail();return p;};
 return {...options.base,forInvestigation,
  assertReadable:head=>byHead(head).assertReadable(head),
  upgrade:head=>byHead(head).upgrade(head),
  position:(head,p)=>byHead(head).position(head,p),
  spatialContext:(head,b)=>byHead(head).spatialContext(head,b),
  spatialWorld:head=>head.binding?byHead(head).spatialWorld(head):options.contract.world,
  validateDynamicArtifact:(head,artifact)=>byArtifact(artifact).validateDynamicArtifact(head,artifact),
  projectAdoption:(next,head,artifact)=>byArtifact(artifact).projectAdoption(next,head,artifact),
  prepare:(head,b,allowNarration,scope)=>byHead(head).prepare(head,b,allowNarration,scope),
  preserveConcurrent(candidate,current){
   if((candidate.binding?.artifact_hash??null)!==(current.binding?.artifact_hash??null))fail();
   byHead(current).preserveConcurrent(candidate,current);
  },
 };
}
