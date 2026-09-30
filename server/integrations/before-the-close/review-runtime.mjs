// Trusted isolated-review composition. Live mode requires an already approved
// gateway. No player-facing artifact upload or operator review capability.
import {createFinanceGameRuntime} from './game-runtime.mjs';
import {createFinanceDynamicRuntime} from './dynamic-runtime.mjs';
import {createAsyncAdoption} from '../../packages/rule-adoption/async.mjs';
import {createProposalJobs} from '../../packages/dynamic-pipeline/proposals.mjs';
import {prepareFinanceFixture} from './dynamic-fixture.mjs';
import {createFinanceProposalBuilder,validateFinanceProposalSource} from './proposal-builder.mjs';
import {createFinanceNarrator} from './narrator.mjs';
import {createFinanceSeriesRuntime} from './series-runtime.mjs';
import {financeSeriesVersion} from './series-contract.mjs';
import {verificationDraft,fundingDraft} from './dynamic-fixture.mjs';
export async function createFinanceReviewRuntime({store,source,sourceHash,hashes,contract,runProlog,dynamicMode,gateway,series,dailyApproval}){
  if(series!==undefined&&series!==financeSeriesVersion)throw Error('UNSUPPORTED_REVIEW_SERIES');
  if(series&&!dynamicMode)throw Error('SERIES_REQUIRES_DYNAMIC_MODE');
  if(dailyApproval&&(!series||dynamicMode!=='budgeted-live-v1'))throw Error('DAILY_APPROVAL_REQUIRES_LIVE_SERIES');
  if(dynamicMode!==undefined&&!['authored-fixture-v1','budgeted-live-v1'].includes(dynamicMode))throw Error('UNSUPPORTED_REVIEW_DYNAMIC_MODE');
  const live=dynamicMode==='budgeted-live-v1';
  if(live!==Boolean(gateway))throw Error('REVIEW_MODEL_GATEWAY_MISMATCH');
  const loaded={source,sourceHash,hashes,contract,runProlog,canaryOnly:true};
  let policy=await createFinanceGameRuntime({...loaded,narrator:live?createFinanceNarrator({source,gateway,worldId:store.worldId}):undefined}),adoption;
  if(!dynamicMode)return {policy,dynamic:undefined};
  policy=await (series?createFinanceSeriesRuntime:createFinanceDynamicRuntime)({...loaded,base:policy,loadBound:h=>adoption.loadForHead(h),candidate:series});
  adoption=createAsyncAdoption({store,runtime:policy,runProlog});
  const proposals=createProposalJobs({store,mode:live?'live':'authored-fixture',fixtureApproval:!live,dailyApproval,
    validateSource:series?policy.validateProposalSource:validateFinanceProposalSource,
    build:series?(live?policy.proposalBuilder({sourceHash,gateway,worldId:store.worldId}):({head,cursor})=>policy.prepareDraft({head,cursor,draft:head.binding?fundingDraft:verificationDraft,proposalId:'series-fixture-'+(head.dynamic?.entries?.length??0),semantic:{passed:true,mode:'authored-fixture-only',locales:['en','zh']}})):(live?createFinanceProposalBuilder({source,sourceHash,policy,gateway,worldId:store.worldId}):({head,cursor})=>prepareFinanceFixture({head,cursor,policy})),
    stage:(owner,a)=>adoption.stage(owner,a)});
  return {policy,dynamic:{proposals,adopt:(owner,b)=>adoption.adopt(owner,b)},modelStatus:live?async()=>({mode:'budgeted-live',...await gateway.usage()}):undefined};
}
