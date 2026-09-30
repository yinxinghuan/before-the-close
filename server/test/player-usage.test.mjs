import test from 'node:test';
import assert from 'node:assert/strict';
import {openAsyncSqliteAuthorityStore} from '../packages/authority-session/async.mjs';
import {createPlayerUsage} from '../packages/dynamic-pipeline/player-usage.mjs';
import {createModelGateway} from '../packages/dynamic-pipeline/model-gateway.mjs';
import {createModelQueue} from '../packages/dynamic-pipeline/model-queue.mjs';
import {financeRoute} from '../integrations/before-the-close/http-routes.mjs';
import {Readable} from 'node:stream';
import {AuthorityError} from '../packages/authority-session/error.mjs';
const id=n=>'usage-request-'+String(n).padStart(10,'0');
function setup(t,limits){let time=86400000+1000;const store=openAsyncSqliteAuthorityStore({worldId:'usage-test',gameId:'fixture'});t.after(()=>store.close());return {store,usage:createPlayerUsage({store,now:()=>time,...limits?{limits}:{} }),advance:n=>{time+=n;}};}
test('player request allowance: once per request, failures released, owner isolation and midnight reset',async t=>{
 const {usage,advance}=setup(t,{dialogue:{daily:2,minute:20,lease:90000},room:{daily:2,minute:3,lease:330000}});
 await usage.reserve('alice','dialogue',id(1),{text:'a'});
 assert.equal((await usage.status('alice')).dialogue.pending,1);
 await assert.rejects(usage.reserve('alice','dialogue',id(2),{}),/AI_REQUEST_IN_PROGRESS/);
 assert.equal((await usage.reserve('alice','dialogue',id(1),{text:'a'})).replay,true);
 await assert.rejects(usage.reserve('alice','dialogue',id(1),{text:'changed'}),/AI_REQUEST_CONFLICT/);
 await usage.settle('alice','dialogue',id(1),true);
 await usage.reserve('alice','dialogue',id(2),{});await usage.settle('alice','dialogue',id(2),false);
 assert.equal((await usage.status('alice')).dialogue.remaining,1);
 await usage.reserve('alice','dialogue',id(3),{});await usage.settle('alice','dialogue',id(3),true);
 await assert.rejects(usage.reserve('alice','dialogue',id(4),{}),/AI_DIALOGUE_DAILY_LIMIT/);
 assert.equal((await usage.status('bob')).dialogue.remaining,2);
 advance(86400000);assert.equal((await usage.status('alice')).dialogue.remaining,2);
 assert.equal((await usage.reserve('alice','dialogue',id(1),{text:'a'})).replay,true);
 assert.equal((await usage.status('alice')).dialogue.used,0);
});
test('failed attempts still cool down; lease crosses midnight and expired jobs release allowance',async t=>{
 const {usage,advance}=setup(t,{dialogue:{daily:10,minute:2,lease:90000},room:{daily:10,minute:3,lease:330000}});
 for(let n=1;n<=2;n++){await usage.reserve('alice','dialogue',id(n),{});await usage.settle('alice','dialogue',id(n),false);}
 await assert.rejects(usage.reserve('alice','dialogue',id(3),{}),/AI_COOLDOWN/);
 assert.equal((await usage.status('alice')).dialogue.retryAt,86461000);
 advance(60000);await usage.reserve('alice','dialogue',id(3),{});
 advance(90000);assert.equal((await usage.status('alice')).dialogue.remaining,10);
 advance(86400000-152000);await usage.reserve('alice','room',id(4),{});advance(2000);
 await assert.rejects(usage.reserve('alice','room',id(5),{}),/AI_REQUEST_IN_PROGRESS/);
});
test('room stages reconcile from durable proposals after service restart; one successful request only',async t=>{
 const {store,usage}=setup(t);const owner='alice',request=id(1);
 await usage.reserve(owner,'room',request,{});
 await store.transaction(r=>r.addProposal(owner,request,id(99),'digest','running',86401000,{status:'running'}));
 assert.equal((await usage.status(owner)).room.pending,1);
 await store.transaction(r=>r.writeProposal(owner,request,'ready',{status:'ready'}));
 const reopened=createPlayerUsage({store,now:()=>86401001});
 assert.equal((await reopened.status(owner)).room.used,1);
 await reopened.reserve(owner,'room',request,{});assert.equal((await reopened.status(owner)).room.used,1);
 await reopened.reserve(owner,'room',id(2),{});
 await store.transaction(r=>r.addProposal(owner,id(2),id(99),'digest','failed',86401001,{status:'failed'}));
 assert.equal((await reopened.status(owner)).room.remaining,99);
});
test('atomic simultaneous admission allows only one pending request',async t=>{
 const {usage}=setup(t);const results=await Promise.allSettled([usage.reserve('alice','dialogue',id(1),{}),usage.reserve('alice','dialogue',id(2),{})]);
 assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
});
test('metering only keeps the old ledger and actual counts beyond its historical maximum',async t=>{
 const {store}=setup(t);let calls=0;const config={store,budgetId:'old-approval',maximum:1,ownerLimits:{qa:1},transport:async()=>{calls++;return 'fixture';}};
 let gateway=await createModelGateway(config);const request={owner:'qa',id:id(1),purpose:'dialogue',payload:{messages:[]}};
 await gateway.call(request);
 gateway=await createModelGateway({...config,requireExisting:true,meteringOnly:true});
 await gateway.call({...request,id:id(2)});await gateway.call(request);
 assert.equal(calls,2);assert.equal((await gateway.usage()).maximum,null);
 assert.deepEqual(await store.transaction(r=>r.modelBudget('old-approval')),{maximum:1,used:2});
 await assert.rejects(gateway.call({...request,owner:'stranger'}),/MODEL_OWNER_FORBIDDEN/);
});
test('bounded FIFO exposes real position, rejects overflow and never starts timed out work',async()=>{
 const queue=createModelQueue({concurrency:1,capacity:1,waitMs:30});let release,calls=0;
 const first=queue.execute('first',()=>new Promise(r=>release=r));await new Promise(r=>setImmediate(r));
 const second=queue.execute('second',()=>{calls++;});assert.equal(queue.position('second'),1);
 await assert.rejects(queue.execute('third',()=>{}),/AI_QUEUE_FULL/);
 await assert.rejects(second,/AI_QUEUE_TIMEOUT/);assert.equal(queue.position('second'),0);
 release();await first;assert.equal(calls,0);
});
test('HTTP route charges successful free dialogue only; rejected room replay cannot bypass admission',async t=>{
 const {usage}=setup(t);let actions=0,submits=0;
 const authority={action:async(_owner,_id,b)=>{actions++;if(b.input.text==='fail')throw new AuthorityError('MODEL_TIMEOUT',503);return {accepted:true};}};
 const dynamic={proposals:{submit:async()=>{submits++;throw new AuthorityError('SERVICE_BUSY',429);},get:async()=>{throw new AuthorityError('PROPOSAL_NOT_FOUND',404);}}};
 const route=(path,payload)=>financeRoute({req:Object.assign(Readable.from([JSON.stringify(payload)]),{method:'POST'}),path,owner:'alice',policy:{},authority,dynamic,usage});
 await route('/sessions/'+id(99)+'/actions',{action_id:id(1),input:{kind:'collect'}});
 assert.equal((await usage.status('alice')).dialogue.used,0);
 await route('/sessions/'+id(99)+'/actions',{action_id:id(2),input:{kind:'free-talk',text:'hello'}});
 await route('/sessions/'+id(99)+'/actions',{action_id:id(2),input:{kind:'free-talk',text:'hello'}});
 assert.equal((await usage.status('alice')).dialogue.used,1);
 await assert.rejects(route('/sessions/'+id(99)+'/actions',{action_id:id(3),input:{kind:'free-talk',text:'fail'}}),/MODEL_TIMEOUT/);
 assert.equal((await usage.status('alice')).dialogue.remaining,999);
 const room={request_id:id(4),session_id:id(99),expected_version:0};
 await assert.rejects(route('/dynamic/proposals',room),/SERVICE_BUSY/);
 await assert.rejects(route('/dynamic/proposals',room),/AI_RETRY_NEW_REQUEST/);
 assert.equal(submits,1);assert.equal((await usage.status('alice')).room.remaining,100);
});
