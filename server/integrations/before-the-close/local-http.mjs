// Loopback review harness. NOT a production auth adapter or platform API base.
import {AuthorityError} from '../../packages/authority-session/index.mjs';
import {financeRoute} from './http-routes.mjs';
const error=(code,status=422)=>{throw new AuthorityError(code,status);};
export function financeLocalHandler({authority,policy,sourceHash,owner='synthetic-local-review',now=Date.now,dynamic,recoveryNamespace='',modelStatus}){
  return async(req,res,next)=>{
    if(!req.url?.startsWith('/__finance_lab/'))return next?.();
    const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Lab-Time':String(now())});res.end(JSON.stringify(value));};
    try{
      const host=req.headers.host;
      if(!/^127\.0\.0\.1:\d+$/.test(host??'')||req.socket.remoteAddress!=='127.0.0.1')error('LOOPBACK_ONLY',403);
      if(req.headers.origin&&req.headers.origin!=='http://'+host)error('ORIGIN_FORBIDDEN',403);
      if(req.headers['x-finance-local-review']!=='1')error('LOCAL_REVIEW_HEADER_REQUIRED',403);
      const url=new URL(req.url,'http://'+host);
      return send(200,await financeRoute({req,path:url.pathname.slice('/__finance_lab'.length),searchParams:url.searchParams,authority,policy,owner,sourceHash,mode:'local-source-canary',now,dynamic,recoveryNamespace,modelStatus}));
    }catch(e){send(e instanceof AuthorityError?e.status:503,{error:e instanceof AuthorityError?e.code:'LOCAL_SERVICE_UNAVAILABLE'});}
  };
}
