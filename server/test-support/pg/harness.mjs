import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);

export async function testPool(){
  if(process.env.KIT_REAL_PG_TEST==='isolated-database-approved'){
    // Never read DATABASE_URL or PG* defaults. Only a deliberately isolated named DB.
    const value=process.env.KIT_TEST_PG_URL;if(!value)throw Error('KIT_TEST_PG_URL_REQUIRED');
    const url=new URL(value);
    if(!['postgres:','postgresql:'].includes(url.protocol)||!/^kit_test_[a-z0-9_]+$/.test(url.pathname.slice(1)))throw Error('ISOLATED_TEST_DATABASE_NAME_REQUIRED');
    const {Pool}=require('pg');const pool=new Pool({connectionString:value,max:4,connectionTimeoutMillis:5000});
    return {pool,driver:'pg',close:()=>pool.end(),realPg:true};
  }
  if(process.env.KIT_REAL_PG_TEST)throw Error('REAL_PG_TEST_ACK_INVALID');
  const {PGlite}=require('@electric-sql/pglite'),db=new PGlite();await db.waitReady;
  let tail=Promise.resolve();
  const pool={async connect(){
    let release;const wait=tail;tail=new Promise(r=>release=r);await wait;
    let closed=false;return {async query(sql,values=[]){if(closed)throw Error('TEST_CLIENT_RELEASED');const out=await db.query(sql,values);return {...out,rowCount:out.affectedRows};},release(){if(closed)throw Error('TEST_DOUBLE_RELEASE');closed=true;release();}};
  }};
  return {pool,driver:'pglite-test',close:()=>db.close(),realPg:false};
}
