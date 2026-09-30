// Isolated test service only; all configuration and secrets remain outside code.
import {readFile,mkdir,lstat,unlink,chmod} from 'node:fs/promises';
import {createRequire} from 'node:module';import {createServer} from 'node:http';import {connect} from 'node:net';
import {join,resolve} from 'node:path';
import {sha256,canonical} from '../packages/rule-compiler/index.mjs';
import {makeProlog} from '../packages/prolog-runner/index.mjs';
import {initializeCandidateSchema,registerCandidateWorld} from '../packages/pg-candidate/index.mjs';
import {AsyncSessionAuthority,initializeAsyncAuthoritySchema,openPgAuthorityStore} from '../packages/authority-session/async.mjs';
import {createFinanceReviewRuntime} from '../integrations/before-the-close/review-runtime.mjs';
import {financeReviewHandler} from '../integrations/before-the-close/review-http.mjs';
import {financeCloudModelApproval,financeCloudProposalApproval,financePublicQaProposalApproval} from '../integrations/before-the-close/cloud-model-approval.mjs';
import {createModelGateway,createGameChatTransport} from '../packages/dynamic-pipeline/model-gateway.mjs';
import {financeSeriesVersion} from '../integrations/before-the-close/series-contract.mjs';
import {financePublicHandler} from '../integrations/before-the-close/public-http.mjs';
import {financePublicBudget} from '../integrations/before-the-close/public-budget.mjs';
const root=resolve(new URL('..',import.meta.url).pathname);
if(process.env.FINANCE_REVIEW_ACK!=='isolated-test-only')throw Error('REVIEW_ACK_REQUIRED');
const config=JSON.parse(await readFile(process.env.FINANCE_REVIEW_CONFIG,'utf8'));
if(config.mode!=='isolated-review'||!/^kit_test_[a-z0-9_]+$/.test(config.schema)||!/^kit_test_[a-z0-9_]+$/.test(config.database)||config.pgHost!=='postgres'||!/^\/[0-9a-f-]{36}$/.test(config.base))throw Error('REVIEW_CONFIG_REJECTED');
const meta=JSON.parse(await readFile(join(root,'snapshot/manifest.json'),'utf8'));
if(sha256(await readFile(join(root,'snapshot/source.mjs')))!==meta.bundleHash||sha256(canonical(meta.hashes))!==meta.sourceHash)throw Error('REVIEW_SOURCE_MISMATCH');
const source=await import('../snapshot/source.mjs');
const passwordFile=process.env.FINANCE_REVIEW_PG_SECRET;
const stat=await lstat(passwordFile);if(!stat.isFile()||stat.isSymbolicLink()||(stat.mode&0o077)!==0)throw Error('PRIVATE_PG_SECRET_REQUIRED');
const password=(await readFile(passwordFile,'utf8')).trim();if(!password)throw Error('PG_SECRET_REQUIRED');
const require=createRequire(join(root,'test-support/pg/package.json'));const {Pool}=require('pg');
const pool=new Pool({host:'postgres',database:config.database,user:'kit_test_runner',password,max:4,connectionTimeoutMillis:5000,idleTimeoutMillis:30000});
const options={pool,schema:config.schema,worldId:config.base.slice(1),gameId:'before-the-close',environment:'test',driver:'pg'};
const admin=await pool.connect();try{await initializeCandidateSchema(admin,options);await initializeAsyncAuthoritySchema(admin,options);await registerCandidateWorld(admin,options);}finally{admin.release();}
await mkdir('/tmp/prolog',{recursive:true});
const db=await openPgAuthorityStore(options);
const args=process.argv.slice(2),seriesOperation=args[0]==='--series',publicOperation=args[0]==='--public';if(seriesOperation||publicOperation)args.shift();
const [operation,account,id,artifact_hash,review_hash,reason='',...extra]=args;
if(seriesOperation&&(!meta.series||!operation||['--initialize-approved-budget','--budget-status'].includes(operation)))throw Error('INVALID_SERIES_OPERATOR_COMMAND');
if(publicOperation&&(!config.public||!operation||['--initialize-approved-budget','--budget-status'].includes(operation)))throw Error('INVALID_PUBLIC_OPERATOR_COMMAND');
if(meta.series&&meta.series!==financeSeriesVersion)throw Error('UNSUPPORTED_REVIEW_SERIES');
if(operation&&!['--initialize-approved-budget','--budget-status','--inspect-proposal','--approve-proposal','--reject-proposal'].includes(operation))throw Error('INVALID_OPERATOR_COMMAND');
if(extra.length)throw Error('INVALID_OPERATOR_COMMAND');
const live=meta.dynamicMode==='budgeted-live-v1';
if(operation&&!live)throw Error('LIVE_REVIEW_REQUIRED');
const approval=live?financeCloudModelApproval(config,meta):null;
// Only the explicit, one-time operator command can insert an approval ledger.
// Repeating it preserves used counts. Every service restart requires it exists.
const gateway=live?await createModelGateway({store:db,...approval,requireExisting:operation!=='--initialize-approved-budget',transport:createGameChatTransport(),timeoutMs:60000}):undefined;
if(['--initialize-approved-budget','--budget-status'].includes(operation)){
 if(account||id||artifact_hash||review_hash||reason)throw Error('INVALID_OPERATOR_COMMAND');
 console.log(JSON.stringify({model:await gateway.usage(),accounts:await Promise.all(config.accounts.map(async a=>({name:a.name,...await gateway.ownerUsage(a.owner)})))}));await db.close();await pool.end();process.exit(0);
}
const runtimeOptions={source,sourceHash:meta.sourceHash,hashes:meta.hashes,contract:meta.contract,runProlog:makeProlog({directory:'/tmp/prolog',utilPath:'-',swipl:'swipl'}),dynamicMode:meta.dynamicMode,gateway};
const legacy=await createFinanceReviewRuntime({...runtimeOptions,store:db});
let seriesDb,seriesRuntime;
if(meta.series){
 const seriesOptions={...options,worldId:options.worldId+':'+financeSeriesVersion};
 const client=await pool.connect();try{await registerCandidateWorld(client,seriesOptions);}finally{client.release();}
 seriesDb=await openPgAuthorityStore(seriesOptions);
 // Both runtimes use the gateway above and its ORIGINAL store/approval ledger.
 seriesRuntime=await createFinanceReviewRuntime({...runtimeOptions,store:seriesDb,series:meta.series,dailyApproval:live?financeCloudProposalApproval(config,meta):undefined,automaticAdmission:config.automaticAdmission});
}
let publicDb,publicRuntime,publicHandler;
if(config.public){
 const p=config.public;
 if(!live||p.mode!=='public-player-v1'||p.origin!=='https://game.aiwaves.tech'||p.gameBase!=='/233b6970-d7f6-4d54-bc20-4213eefc6ba5'||p.expiresAt!==config.expiresAt||p.base!==config.base)throw Error('PUBLIC_CONFIG_REJECTED');
 const po={...options,worldId:p.gameBase.slice(1)+':public-player-v1'};
 const conn=await pool.connect();try{await registerCandidateWorld(conn,po);}finally{conn.release();}
 publicDb=await openPgAuthorityStore(po);
 publicRuntime=await createFinanceReviewRuntime({...runtimeOptions,store:publicDb,series:financeSeriesVersion,gateway:financePublicBudget(gateway,config.accounts.find(a=>a.name==='yin').owner),dailyApproval:financePublicQaProposalApproval(config,meta),automaticAdmission:p.automaticAdmission});
 const secretPath=process.env.FINANCE_PUBLIC_EDGE_SECRET;const st=await lstat(secretPath);if(!st.isFile()||st.isSymbolicLink()||(st.mode&0o077)!==0)throw Error('PRIVATE_EDGE_SECRET_REQUIRED');
 publicHandler=financePublicHandler({authority:new AsyncSessionAuthority(publicDb,publicRuntime.policy),policy:publicRuntime.policy,dynamic:publicRuntime.dynamic,sourceHash:meta.sourceHash,config:p,edgeToken:(await readFile(secretPath,'utf8')).trim(),modelStatus:publicRuntime.modelStatus});
}
const {policy,dynamic,modelStatus}=publicOperation?publicRuntime:seriesOperation?seriesRuntime:legacy;
if(operation){
 const selected=publicOperation&&/^player-[a-f0-9]{64}$/.test(account??'')?{owner:account}:!publicOperation?config.accounts.find(a=>a.name===account):null;if(!selected||!id)throw Error('INVALID_OPERATOR_COMMAND');
 const result=operation==='--inspect-proposal'?await dynamic.proposals.inspect(selected.owner,id):await dynamic.proposals.review(selected.owner,id,{artifact_hash,review_hash,passed:operation==='--approve-proposal',reason});
 console.log(JSON.stringify(result));await publicDb?.close();await seriesDb?.close();await db.close();await pool.end();process.exit(0);
}
const authority=new AsyncSessionAuthority(db,policy);
const handler=await financeReviewHandler({authority,policy,sourceHash:meta.sourceHash,dist:join(root,'dist'),config,trustedUnixSocket:true,dynamic,modelStatus});
const seriesHandler=seriesRuntime?await financeReviewHandler({authority:new AsyncSessionAuthority(seriesDb,seriesRuntime.policy),policy:seriesRuntime.policy,sourceHash:meta.sourceHash,dist:join(root,'series-dist'),config,trustedUnixSocket:true,dynamic:seriesRuntime.dynamic,modelStatus:seriesRuntime.modelStatus,mount:'/series'}):null;
const socket='/run/game/review.sock';
// Restart may leave a socket inode. Never unlink a regular file or live listener.
try{const s=await lstat(socket);if(!s.isSocket())throw Error('SOCKET_PATH_NOT_SOCKET');await new Promise((resolve,reject)=>{const c=connect(socket);c.once('connect',()=>{c.destroy();reject(Error('SOCKET_IN_USE'));});c.once('error',e=>e.code==='ECONNREFUSED'?resolve():reject(e));});await unlink(socket);}catch(e){if(e.code!=='ENOENT')throw e;}
const server=createServer({maxHeaderSize:8192},(req,res)=>publicHandler&&req.url?.startsWith(config.base+'/public/')?publicHandler(req,res):seriesHandler&&req.url?.startsWith(config.base+'/series/')?seriesHandler(req,res):handler(req,res));server.requestTimeout=25000;server.headersTimeout=10000;server.keepAliveTimeout=5000;server.maxConnections=32;
server.listen(socket,async()=>{await chmod(socket,0o660);console.log(JSON.stringify({ready:true,mode:'isolated-review',sourceHash:meta.sourceHash,model:await modelStatus?.()??null,productionReady:false}));});
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>server.close(async()=>{await legacy.dynamic?.proposals?.drain();await seriesRuntime?.dynamic?.proposals?.drain();await publicRuntime?.dynamic?.proposals?.drain();await publicDb?.close();await seriesDb?.close();await db.close();await pool.end();process.exit(0);}));
