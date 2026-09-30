// Reviewed r15 domain projection. Source-canary checks these identifiers against
// the actual game exports. Not a spatial adapter or a replacement cartridge.
export const recordIds = ['memo','payment','contract','rollout','acceptance','appendix','cash','forecast','reference','channel','delivery-log','settlement-review','committee-draft'];
export const findingPairs = {usage:['contract','rollout'],income:['payment','appendix'],funding:['cash','forecast']};
export const peopleIds = ['partner','analyst','founder','finance','client'];
export const revisionFlags = {cash:'budget-revision',acceptance:'acceptance-revision'};
const bi = (zh,en) => ({zh,en});
const fact = (id,value=true) => ({op:'fact',id,cmp:'eq',value});
const all = (...rules) => ({op:'all',rules});
const not = rule => ({op:'not',rule});
const set = (id,value=true) => ({type:'fact',id,value});
const yes = {op:'const',value:true};
const undecided = fact('decision','none');
const decided = not(undecided);

export function financeWalkthrough(decision='conditional',term='tranche',disclosure='replace') {
  if(!['proceed','conditional','pause'].includes(decision)||!['tranche','reprice'].includes(term)||!['replace','dissent'].includes(disclosure))throw Error('INVALID_SCENARIO');
  if(decision==='pause')return ['collect-memo','meet-partner','decide-pause','chapter-echo-founder','chapter-echo-finance','chapter-echo-client','archive'];
  return ['collect-memo','meet-partner','collect-payment','collect-appendix','conclude-income',
    'chapter-'+disclosure,'collect-cash-revision','chapter-budget','collect-acceptance-revision','chapter-boundary',
    'collect-delivery-log','collect-settlement-review','collect-committee-draft','chapter-reconcile',
    ...(decision==='conditional'?['collect-contract','collect-rollout','conclude-usage','collect-forecast','conclude-funding','collect-reference','meet-founder','negotiate-'+term]:[]),
    'decide-'+decision,'chapter-echo-founder','chapter-echo-finance','chapter-echo-client','archive'];
}

export function financeRules({decision='conditional',term='tranche',disclosure='replace'}={}) {
  const actions=[],facts=new Map();
  const declare=(id,initial=false)=>{if(!facts.has(id))facts.set(id,{id,initial});};
  [...recordIds,...Object.keys(findingPairs),...peopleIds.map(p=>'met-'+p),
    ...Object.values(revisionFlags),'client-confirmed','chapter-confronted','brief-replaced','brief-dissent',
    'founder-disclosed','budget-confirmed','finance-stress','boundary-confirmed','committee-reconciled',
    'echo-founder','echo-finance','echo-client','case-archived','project-accepted'].forEach(id=>declare(id));
  // DSL fact types are fixed. 'none' represents native absent enum facts.
  declare('terms','none');declare('decision','none');
  const add=(id,label,when,effects)=>actions.push({id,label,when,effects,next:[],
    successText:bi('操作已记录。','Action recorded.'),rejectionText:bi('当前条件不满足。','The current conditions are not met.')});
  for(const id of recordIds){
    const revision=revisionFlags[id],gate=all(fact('chapter-confronted'),undecided);
    add('collect-'+id,bi('读取资料：'+id,'Read source: '+id),revision?not(gate):yes,[set(id)]);
    if(revision)add('collect-'+id+'-revision',bi('读取修订资料：'+id,'Read revised source: '+id),gate,[set(id),set(revision)]);
  }
  for(const [id,pair] of Object.entries(findingPairs))add('conclude-'+id,bi('核实判断：'+id,'Establish finding: '+id),all(...pair.map(p=>fact(p))),[set(id)]);
  // Synthetic introductions in this non-spatial canary only. The graphical
  // adapter must add authoritative target/proximity and visible introduction.
  for(const id of peopleIds)add('meet-'+id,bi('认识人物：'+id,'Meet: '+id),yes,[set('met-'+id)]);
  add('accept-project',bi('接手委托','Accept assignment'),yes,[set('project-accepted')]);
  add('client-accept',bi('确认客户验收意见','Confirm customer acceptance position'),fact('rollout'),[set('client-confirmed')]);
  for(const choice of ['replace','dissent'])add('chapter-'+choice,
    choice==='replace'?bi('要求替换摘要','Request a revised brief'):bi('提交具名异议','Submit signed dissent'),
    all(undecided,fact('income'),fact('chapter-confronted',false)),
    [set('chapter-confronted'),set(choice==='replace'?'brief-replaced':'brief-dissent'),set('founder-disclosed')]);
  add('chapter-budget',bi('确认修订预算','Confirm the revised budget'),all(undecided,fact('budget-revision'),fact('budget-confirmed',false)),[set('budget-confirmed'),set('finance-stress')]);
  add('chapter-boundary',bi('确认客户承诺边界','Confirm customer boundaries'),all(undecided,fact('acceptance-revision'),fact('boundary-confirmed',false)),[set('boundary-confirmed'),set('client-confirmed')]);
  add('chapter-reconcile',bi('与合伙人复盘','Reconcile with the partner'),all(undecided,...['delivery-log','settlement-review','committee-draft','budget-confirmed','boundary-confirmed'].map(id=>fact(id)),fact('committee-reconciled',false)),[set('committee-reconciled')]);
  for(const person of ['founder','finance','client'])add('chapter-echo-'+person,bi('记录后续回音：'+person,'Record follow-up: '+person),all(decided,fact('echo-'+person,false)),[set('echo-'+person)]);
  for(const term of ['tranche','reprice'])add('negotiate-'+term,
    term==='tranche'?bi('协商分期交割','Negotiate funding tranches'):bi('协商重新定价','Negotiate repricing'),
    all(undecided,...[...Object.keys(findingPairs),'reference','client-confirmed','met-founder'].map(id=>fact(id))),[set('terms',term)]);
  for(const decision of ['proceed','conditional','pause'])add('decide-'+decision,bi('提交意见：'+decision,'Submit recommendation: '+decision),
    all(undecided,fact('memo'),fact('met-partner'),...(decision==='pause'?[]:[fact('committee-reconciled')]),...(decision==='conditional'?[not(fact('terms','none'))]:[])),
    [set('decision',decision),{type:'session',ended:true}]);
  add('archive',bi('归档意见与回音','Archive recommendation and replies'),all(decided,...['echo-founder','echo-finance','echo-client'].map(id=>fact(id)),fact('case-archived',false)),[set('case-archived')]);
  return {schemaVersion:2,gameId:'before-the-close',rulesetVersion:1,
    stats:[['research','调查','Research'],['trust','信任','Trust'],['risk','风险','Risk']].map(([id,zh,en])=>({id,label:bi(zh,en),description:bi(zh,en),min:0,max:100,initial:0})),
    locations:[{id:'study',label:bi('非空间规则测试','Non-spatial rule canary')}],initialLocation:'study',items:[],facts:[...facts.values()],actions,
    walkthrough:financeWalkthrough(decision,term,disclosure)};
}

/** Only for tests/source comparison; never imports old browser saves. */
export function nativeFacts(projected) {
  return Object.fromEntries(Object.entries(projected).filter(([id,value])=>value!==false&&!(['terms','decision'].includes(id)&&value==='none')));
}
