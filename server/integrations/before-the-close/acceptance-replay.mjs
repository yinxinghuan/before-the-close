// Local reviewer only. Consumes the already-verified original acceptance DB;
// never rebinds a model artifact to a different journey or calls a model.
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
export async function financeAcceptanceReplay(root,sourceHash){
 const data=join(root,'.local-tests/model-acceptance-20260929-round2');
 const read=async name=>JSON.parse(await readFile(join(data,name+'.json'),'utf8'));
 const [report,operator,review,candidate]=await Promise.all(['verification-result','operator-repair2-review','review-repair2-result','repaired2-candidate'].map(read));
 if(report.sourceHash!==sourceHash||report.mechanicallyVerified!==true||report.nativeRoomTwoCluesAndReturn!==true||operator.passed!==true||review.passed!==true||!['en','zh'].every(x=>review.locales?.includes(x))||report.artifactHash!==operator.artifactHash||report.artifactHash!==candidate.artifact.prepared.artifact_hash)throw Error('ACCEPTANCE_REPLAY_NOT_VERIFIED');
 return {path:join(data,'ledger.sqlite'),worldId:'finance-live-acceptance-20260929-round2',owner:'isolated-model-reviewer',artifactHash:report.artifactHash,forkId:report.forkId};
}
