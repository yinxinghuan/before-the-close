// Platform strips the /GAME_ID prefix before dispatch. Secrets are private
// worker bindings, never constants in this source or browser bundle.
const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
const encode=new TextEncoder();
async function mac(key,value){return hex(new Uint8Array(await crypto.subtle.sign('HMAC',await crypto.subtle.importKey('raw',encode.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']),encode.encode(value))));}
const eq=(a,b)=>{if(a.length!==b.length)return false;let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a.charCodeAt(i)^b.charCodeAt(i);return mismatch===0;};
export async function handleApi(request,env){
 const fail=(error,status)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
 const origin=env.RPG_PUBLIC_ORIGIN,base=env.RPG_GAME_BASE,token=env.RPG_EDGE_TOKEN,upstream=env.RPG_UPSTREAM_ORIGIN,upstreamBase=env.RPG_UPSTREAM_BASE;
 const budgetOnly=env.RPG_PUBLIC_TIME_POLICY==='user-approved-budget-only-20261001'&&env.RPG_PUBLIC_EXPIRES_AT==='none';
 const expires=Number(env.RPG_PUBLIC_EXPIRES_AT),now=Date.now();
 if(!/^https:\/\/[a-z0-9.-]+$/.test(origin??'')||!/^https:\/\/[a-z0-9.:-]+$/.test(upstream??'')||!/^\/[0-9a-f-]{36}$/.test(upstreamBase??'')||base!=='/233b6970-d7f6-4d54-bc20-4213eefc6ba5'||!/^[a-f0-9]{64}$/.test(token??'')||!(budgetOnly||env.RPG_PUBLIC_TIME_POLICY===undefined&&Number.isSafeInteger(expires)))return fail('PUBLIC_DEPLOYMENT_UNCONFIGURED',503);
 if(!budgetOnly&&now>=expires)return fail('PLAY_WINDOW_CLOSED',410);
 const url=new URL(request.url),path=url.pathname;
 if(!path.startsWith('/api/story/')&&path!=='/api/health')return fail('NOT_FOUND',404);
 if(!['GET','POST'].includes(request.method))return fail('METHOD_NOT_ALLOWED',405);
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==origin||request.headers.get('Sec-Fetch-Site')==='cross-site')return fail('ORIGIN_FORBIDDEN',403);
 if(request.method==='POST'&&(request.headers.get('Origin')!==origin||request.headers.get('Content-Type')!=='application/json'))return fail('INVALID_WRITE_ORIGIN',403);
 if(/[\\%#]/.test(path+url.search))return fail('NOT_FOUND',404);
 const cookieName='__Secure-rpg-'+base.slice(1),cookies=(request.headers.get('Cookie')??'').split(';').map(c=>c.trim()).filter(c=>c.startsWith(cookieName+'='));
 let id=path==='/api/health'?'0'.repeat(64):undefined,setCookie;
 if(cookies.length===1){const parts=cookies[0].slice(cookieName.length+1).split('.');if(parts.length===2&&parts.every(x=>/^[a-f0-9]{64}$/.test(x))&&eq(parts[1],await mac(token,'player-v1:'+base+':'+parts[0])))id=parts[0];}
 if(!id){
  // Only bootstrap reads may mint an identity. Lost/invalid cookies on writes
  // fail rather than silently submitting an action as a new player.
  if(request.method!=='GET'||path!=='/api/story/info')return fail('PLAYER_SESSION_REQUIRED',401);
  id=hex(crypto.getRandomValues(new Uint8Array(32)));
 }
 // Refresh a verified browser identity on bootstrap without changing its owner.
 // Finite 30-day retention is independent of the cancelled testing cutoff.
 if(path==='/api/story/info'&&request.method==='GET')setCookie=cookieName+'='+id+'.'+await mac(token,'player-v1:'+base+':'+id)+'; Path='+base+'/; Secure; HttpOnly; SameSite=Strict; Max-Age='+(budgetOnly?2592000:Math.max(0,Math.floor((expires-now)/1000)));
 const headers=new Headers({'X-Rpg-Edge-Token':token,'X-Rpg-Owner':'player-'+id});
 for(const key of ['Origin','Content-Type','Sec-Fetch-Site'])if(request.headers.has(key))headers.set(key,request.headers.get(key));
 let body;
 if(request.method==='POST'){
  if(Number(request.headers.get('Content-Length'))>16384)return fail('BODY_TOO_LARGE',413);
  const reader=request.body?.getReader();if(!reader)return fail('INVALID_JSON',400);const chunks=[];let size=0;
  try{while(true){const r=await reader.read();if(r.done)break;size+=r.value.byteLength;if(size>16384){await reader.cancel();return fail('BODY_TOO_LARGE',413);}chunks.push(r.value);}}finally{reader.releaseLock();}
  body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
 }
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),75000);
 try{
  const response=await fetch(upstream+upstreamBase+'/public'+(path==='/api/health'?'/api/story/info':path)+url.search,{method:request.method,headers,body,redirect:'manual',signal:controller.signal});
  if(response.status>=300&&response.status<400)return fail('UPSTREAM_REDIRECT_REFUSED',502);
  const output=new Headers({'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  if(response.headers.has('X-Lab-Time'))output.set('X-Lab-Time',response.headers.get('X-Lab-Time'));
  if(setCookie&&response.ok)output.set('Set-Cookie',setCookie);
  if(path==='/api/health')return Response.json({ok:response.ok,game:'before-the-close',release:'finance-budget-only-20261001',timePolicy:budgetOnly?'budget-only-v1':'fixed-window-v1',backendReady:response.ok},{status:response.status,headers:output});
  return new Response(response.body,{status:response.status,headers:output});
 }catch{return fail('SERVICE_UNAVAILABLE',503);}finally{clearTimeout(timer);}
}
