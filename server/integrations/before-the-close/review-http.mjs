// Private, expiring QA accounts only. NOT platform authentication or production.
import {createHash,timingSafeEqual,randomBytes} from 'node:crypto';
import {realpath,open} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {AuthorityError} from '../../packages/authority-session/index.mjs';
import {financeRoute} from './http-routes.mjs';
const fail=(code,status=403)=>{throw new AuthorityError(code,status);};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.tmx':'application/xml','.tsx':'application/xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg','.txt':'text/plain; charset=utf-8'};
export async function financeReviewHandler({authority,policy,sourceHash,dist,config,now=Date.now,trustedUnixSocket=false,dynamic,modelStatus,mount=''}){
  if(!['','/series'].includes(mount))throw Error('INVALID_REVIEW_MOUNT');
  if(!config||config.mode!=='isolated-review'||!/^https:\/\/[a-zA-Z0-9.:-]+$/.test(config.origin)||new URL(config.origin).origin!==config.origin||!/^\/[0-9a-f-]{36}$/.test(config.base)||!Number.isSafeInteger(config.expiresAt)||config.expiresAt<=now()||config.expiresAt-now()>48*3600000)throw Error('INVALID_REVIEW_CONFIG');
  if(!Array.isArray(config.accounts)||config.accounts.length<2||config.accounts.length>8)throw Error('INVALID_REVIEW_ACCOUNTS');
  const accounts=new Map();const owners=new Set();
  for(const a of config.accounts){if(!a||!/^[a-z0-9-]{3,32}$/.test(a.name)||!/^[a-z0-9-]{3,80}$/.test(a.owner)||!/^[a-f0-9]{64}$/.test(a.passwordHash)||accounts.has(a.name)||owners.has(a.owner))throw Error('INVALID_REVIEW_ACCOUNTS');accounts.set(a.name,{owner:a.owner,hash:Buffer.from(a.passwordHash,'hex')});owners.add(a.owner);}
  const root=await realpath(dist),origin=config.origin,host=new URL(origin).host,base=config.base+mount,expiresAt=config.expiresAt;
  const sessions=new Map(),cookieName=mount?'__Secure-rpg-series-review':'__Secure-rpg-review';
  const passwordAccount=(name,password)=>{const a=accounts.get(name),hash=createHash('sha256').update(password).digest();return timingSafeEqual(hash,a?.hash??Buffer.alloc(32))&&a?a:null;};
  const loginPage=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private game review</title><style>html{background:#142b35;color:#f2eddf;font:16px/1.6 system-ui}body{margin:0;padding:24px}main{max-width:420px;margin:10vh auto}h1{font:30px/1.2 Georgia,serif}label{display:block;margin-top:18px}input,button{box-sizing:border-box;width:100%;min-height:48px;border-radius:4px;font:inherit}input{padding:10px;background:#fffaf0;color:#142b35;border:2px solid #bac9c9}button{margin-top:24px;background:#dfb982;color:#142b35;border:0;font-weight:700;cursor:pointer}:focus-visible{outline:3px solid #dfb982;outline-offset:3px}small{display:block;margin-top:24px;color:#c2d0d2}</style><main><h1>Before the Close<br>Private review</h1><p>Sign in with your test account.<br>请使用独立测试账号登录。</p><form method="post" action="${base}/review-login"><label for="name">Account / 账号</label><input id="name" name="name" autocomplete="username" required maxlength="32" autocapitalize="none"><label for="password">Password / 密码</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="64"><button type="submit">Enter game / 进入游戏</button></form><small>${modelStatus?'Isolated cloud test · Limited live AI<br>独立云端测试 · 限额实时 AI':'Isolated cloud test · No live model<br>独立云端测试 · 不调用真实模型'}</small></main></html>`;
  let active=0,failed=0,windowStart=now();
  return async(req,res)=>{
    // no-referrer turns the Origin of native form POSTs into null. Preserve it
    // for our own login form, while still sending no referrer to other origins.
    const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'DENY','Content-Security-Policy':"frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",'X-Lab-Time':String(now())};
    const send=(status,value,extra={})=>{res.writeHead(status,{...headers,'Content-Type':'application/json',...extra});res.end(JSON.stringify(value));};
    let counted=false;
    try{
      // A Unix socket must be private to the HTTPS edge and this service. Never
      // trust X-Forwarded-Proto from an arbitrary TCP client, including loopback.
      if(!(req.socket.encrypted===true||(trustedUnixSocket&&req.socket.remoteAddress===undefined&&req.headers['x-forwarded-proto']==='https')))fail('TLS_REQUIRED');
      if(req.headers.host!==host)fail('HOST_FORBIDDEN');
      if(now()>=expiresAt)fail('REVIEW_EXPIRED',410);
      if(req.headers.origin&&req.headers.origin!==origin)fail('ORIGIN_FORBIDDEN');
      if(req.headers['sec-fetch-site']==='cross-site')fail('ORIGIN_FORBIDDEN');
      if(now()-windowStart>=60000){failed=0;windowStart=now();}
      if(failed>=100)fail('REVIEW_RATE_LIMIT',429);
      // Explicit login page also permits switching reviewers on one browser.
      // This GET changes no session or game state.
      if(req.method==='GET'&&req.url===base+'/review-login'){res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8'});return res.end(loginPage);}
      if(req.method==='POST'&&req.url===base+'/review-login'){
        if(req.headers.origin!==origin||req.headers['content-type']!=='application/x-www-form-urlencoded')fail('INVALID_WRITE_ORIGIN');
        let text='';for await(const chunk of req){text+=chunk;if(Buffer.byteLength(text)>1024)fail('BODY_TOO_LARGE',413);}
        const form=new URLSearchParams(text),name=form.get('name')??'',password=form.get('password')??'';
        const a=/^[a-z0-9-]{3,32}$/.test(name)&&/^[a-f0-9]{64}$/.test(password)?passwordAccount(name,password):null;
        if(!a){failed++;return send(401,{error:'AUTH_REQUIRED'});}
        if(sessions.size>=32)sessions.delete(sessions.keys().next().value);
        const token=randomBytes(32).toString('hex');sessions.set(createHash('sha256').update(token).digest('hex'),a);
        res.writeHead(303,{...headers,Location:base+'/','Set-Cookie':`${cookieName}=${token}; Path=${base}/; Secure; HttpOnly; SameSite=Strict; Max-Age=${Math.max(0,Math.floor((expiresAt-now())/1000))}`});return res.end();
      }
      const h=req.headers.authorization??'';let account,valid=false;
      if(typeof h==='string'&&/^Basic [A-Za-z0-9+/=]{1,256}$/.test(h)){
        const text=Buffer.from(h.slice(6),'base64').toString('utf8'),match=text.match(/^([a-z0-9-]{3,32}):([a-f0-9]{64})$/);
        if(match){account=passwordAccount(match[1],match[2]);valid=!!account;}
      }
      if(!valid&&!h){const token=(req.headers.cookie??'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(/^[a-f0-9]{64}$/.test(token??'')){account=sessions.get(createHash('sha256').update(token).digest('hex'));valid=!!account;}}
      if(!valid){
        if(!h&&req.method==='GET'&&req.url===base+'/'){res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8'});return res.end(loginPage);}
        failed++;return send(401,{error:'AUTH_REQUIRED'});
      }
      if(active>=8)fail('REVIEW_BUSY',503);active++;counted=true;
      const raw=req.url??'';
      if(!raw.startsWith(base+'/')||raw.includes('#')||raw.includes('\\')||raw.length>2048)fail('NOT_FOUND',404);
      const rawPath=raw.split('?')[0];if(rawPath.includes('%')||rawPath.split('/').some(s=>s==='.'||s==='..'))fail('NOT_FOUND',404);
      const parsed=new URL(raw,origin);if(parsed.origin!==origin||!parsed.pathname.startsWith(base+'/'))fail('NOT_FOUND',404);
      const path=decodeURIComponent(parsed.pathname);
      if(path!==parsed.pathname||path.split('/').some(s=>s==='..'||s==='.'||s.startsWith('.')))fail('NOT_FOUND',404);
      const api=base+'/api/story';
      if(path.startsWith(api+'/')){
        if(req.method==='POST'&&(req.headers.origin!==origin||req.headers['content-type']!=='application/json'))fail('INVALID_WRITE_ORIGIN');
        return send(200,await financeRoute({req,path:path.slice(api.length),searchParams:parsed.searchParams,authority,policy,owner:account.owner,sourceHash,mode:'isolated-cloud-review',now,dynamic,modelStatus}));
      }
      if(req.method!=='GET'&&req.method!=='HEAD')fail('METHOD_NOT_ALLOWED',405);
      const relative=path.slice(base.length+1)||'index.html',type=mime[extname(relative)];if(!type)fail('NOT_FOUND',404);
      const filename=await realpath(resolve(root,relative));if(!filename.startsWith(root+sep))fail('NOT_FOUND',404);
      const file=await open(filename,'r');try{
        const stat=await file.stat();if(!stat.isFile()||stat.size>32*1024*1024)fail('NOT_FOUND',404);
        const data=req.method==='HEAD'?null:await file.readFile();res.writeHead(200,{...headers,'Content-Type':type,'Content-Length':stat.size});res.end(data);
      }finally{await file.close();}
    }catch(e){if(!res.headersSent)send(e instanceof AuthorityError?e.status:e?.code==='ENOENT'?404:503,{error:e instanceof AuthorityError?e.code:e?.code==='ENOENT'?'NOT_FOUND':'REVIEW_UNAVAILABLE'});else res.destroy();}
    finally{if(counted)active--;}
  };
}
