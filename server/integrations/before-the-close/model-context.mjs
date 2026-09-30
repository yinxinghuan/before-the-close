// Supply the actual documents already collected, not abbreviated UI summaries.
// The source's Chinese contract summary omits currency suffixes needed by its
// localization map; the full contract contains those suffixes and is localized
// consistently. This projection never edits the original game or save.
export function financeKnownRecords(source,facts){
 return source.records.filter(r=>facts[r.id]===true).map(r=>{
  if(!Array.isArray(r.body)||r.body.length!==2||r.body.some(v=>typeof v!=='string'||!v))throw Error('KNOWN_DOCUMENT_BODY_REQUIRED');
  const pair=p=>({zh:source.localizeContext(p[0]),en:source.localizeContext(p[1])});
  return {id:r.id,title:pair(r.title),content:pair(r.body)};
 });
}

// A later chapter unlocking a revised document does not mean it was read.
// Keep the original record and expose its supplement only after the explicit
// collection flag, including after signing when roomRevision() is unavailable.
export function financeKnownRevisions(source,facts){
 return source.revisionDefinitions.filter(r=>facts[r.source]===true&&facts[r.flag]===true).map(r=>({
  id:r.flag,originalId:r.source,kind:'read-revision',
  title:{zh:source.localizeContext(r.title[0]),en:source.localizeContext(r.title[1])},
  content:{zh:source.localizeContext(r.body[0]),en:source.localizeContext(r.body[1])},
 }));
}

// Read-only, server-fact projection: no simulated transition or future answer.
export function financeDialogueProgress(source,journey,locale){
 const facts=journey.save.facts,t=p=>source.localizeContext(source.tx(p,locale));
 const decision=['pause','proceed','conditional'].includes(facts.decision)?facts.decision:null;
 return {
  chapter:t(source.inPrologue(journey)?['入职序章','Joining the team']:source.chapterStage(journey)),
  completedFindings:source.findings.filter(f=>facts[f.id]===true).map(f=>({id:f.id,title:t(f.title),result:t(f.result),sourceIds:[...f.pair]})),
  disclosure:facts['brief-replaced']===true?'replace':facts['brief-dissent']===true?'dissent':null,
  confirmedFollowups:['budget-confirmed','boundary-confirmed','committee-reconciled','echo-founder','echo-finance','echo-client'].filter(id=>facts[id]===true),
  negotiatedTerms:['tranche','reprice'].includes(facts.terms)?facts.terms:null,
  signedRecommendation:decision?{decision,findings:[...(journey.decisionSnapshot?.findings??[])],terms:journey.decisionSnapshot?.terms??null}:null,
  archived:facts['case-archived']===true,
 };
}
