import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {testPool} from '../test-support/pg/harness.mjs';
import {initializeCandidateSchema,registerCandidateWorld} from '../packages/pg-candidate/index.mjs';
import {initializeAsyncAuthoritySchema,openPgAuthorityStore} from '../packages/authority-session/async.mjs';
import {createPlayerUsage} from '../packages/dynamic-pipeline/player-usage.mjs';
test('PG player allowances: shared handles serialize admission, reconcile receipts, persist counts',async t=>{
 const env=await testPool();t.after(env.close);const options={pool:env.pool,schema:'kit_test_'+randomUUID().replaceAll('-',''),worldId:randomUUID(),gameId:'usage-test',environment:'test',driver:env.driver};
 const admin=await env.pool.connect();try{await initializeCandidateSchema(admin,options);await initializeAsyncAuthoritySchema(admin,options);await registerCandidateWorld(admin,options);}finally{admin.release();}
 const a=await openPgAuthorityStore(options),b=await openPgAuthorityStore(options);t.after(()=>a.close());t.after(()=>b.close());
 const one=createPlayerUsage({store:a}),two=createPlayerUsage({store:b}),ids=[randomUUID(),randomUUID()];
 const results=await Promise.allSettled(ids.map((id,i)=>(i?two:one).reserve('alice','dialogue',id,{id})));
 assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
 const success=ids[results.findIndex(x=>x.status==='fulfilled')];
 await a.transaction(r=>r.addReceipt('alice',success,'fixture',{accepted:true}));
 assert.equal((await two.status('alice')).dialogue.used,1);
 assert.equal((await two.status('alice')).dialogue.remaining,999);
 assert.equal((await one.status('bob')).dialogue.used,0);
});
