// Public players reach this endpoint only through the authenticated game edge.
// No test-account login, arbitrary owner header, fixture, or operator route.
import {timingSafeEqual} from 'node:crypto';
import {AuthorityError} from '../../packages/authority-session/error.mjs';
import {financeRoute} from './http-routes.mjs';
export function financePublicHandler({authority,policy,dynamic,sourceHash,config,edgeToken,modelStatus,recoveryNamespace='public-player-v1',now=Date.now,usage}){
 if(config?.mode!=='public-player-v1'||!/^https:\/\/[a-z0-9.-]+$/.test(config.origin)||!/^\/[0-9a-f-]{36}$/.test(config.base)||!Number.isSafeInteger(config.expiresAt)||!/^\w{64}$/.test(edgeToken??''))throw Error('INVALID_PUBLIC_CONFIG');
 const base=config.base+'/public/api/story',secret=Buffer.from(edgeToken);let active=0;
 return async(req,res)=>{
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Lab-Time':String(now())};
  const send=(status,value)=>{res.writeHead(status,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify(value));};let entered=false;
  try{
   if(req.socket.remoteAddress!==undefined||req.headers['x-forwarded-proto']!=='https')throw new AuthorityError('TLS_REQUIRED',403);
   const token=req.headers['x-rpg-edge-token'];
   if(typeof token!=='string'||token.length!==secret.length||!timingSafeEqual(Buffer.from(token),secret))throw new AuthorityError('EDGE_AUTH_REQUIRED',403);
   const owner=req.headers['x-rpg-owner'];if(typeof owner!=='string'||!/^player-[a-f0-9]{64}$/.test(owner))throw new AuthorityError('PLAYER_IDENTITY_REQUIRED',403);
   if(now()>=config.expiresAt)throw new AuthorityError('PLAY_WINDOW_CLOSED',410);
   if(req.headers.origin&&req.headers.origin!==config.origin||req.headers['sec-fetch-site']==='cross-site')throw new AuthorityError('ORIGIN_FORBIDDEN',403);
   if(!['GET','POST'].includes(req.method))throw new AuthorityError('METHOD_NOT_ALLOWED',405);
   if(req.method==='POST'&&(req.headers.origin!==config.origin||req.headers['content-type']!=='application/json'))throw new AuthorityError('INVALID_WRITE_ORIGIN',403);
   const raw=req.url??'';
   if(!raw.startsWith(base+'/')||raw.length>2048||/[\\%#]/.test(raw)||raw.split('?')[0].split('/').some(p=>p==='.'||p==='..'))throw new AuthorityError('NOT_FOUND',404);
   const url=new URL(raw,config.origin),path=url.pathname.slice(base.length);
   if(active>=8)throw new AuthorityError('SERVICE_BUSY',503);active++;entered=true;
   // A public world must never expose fixture installation even if a caller
   // accidentally supplies a fixture-enabled runtime.
   if(/\/(fixture|review|approve|reject|inspect)(\/|$)/.test(path))throw new AuthorityError('NOT_FOUND',404);
   return send(200,await financeRoute({req,path,searchParams:url.searchParams,authority,policy,owner,sourceHash,mode:'public-player-v1',dynamic,modelStatus,now,recoveryNamespace,usage}));
  }catch(e){send(e instanceof AuthorityError?e.status:503,{error:e instanceof AuthorityError?e.code:'SERVICE_UNAVAILABLE'});}
  finally{if(entered)active--;}
 };
}
