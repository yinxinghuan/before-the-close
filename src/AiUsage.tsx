import {useCallback,useEffect,useState} from 'react';
import {getGameApiBase} from './game-id';
type Kind='dialogue'|'room';
type Allowance={maximum:number;used:number;pending:number;remaining:number;nearLimit:boolean;retryAt:number|null};
type Usage={policy:string;serverNow:number;resetAt:number;queuePosition:number;dialogue:Allowance;room:Allowance};
export function useAiUsage(refreshKey:string,active:boolean){
 const [data,setData]=useState<Usage|null>(null),[unavailable,setUnavailable]=useState(false),[received,setReceived]=useState(0),[tick,setTick]=useState(Date.now());
 const refresh=useCallback(async(signal?:AbortSignal)=>{try{
  const r=await fetch(getGameApiBase()+'/api/story/usage',{credentials:'same-origin',cache:'no-store',signal:signal??AbortSignal.timeout(10000)});
  if(!r.ok)throw Error('USAGE_UNAVAILABLE');const d=await r.json();
  if(d.policy!=='player-ai-fair-use-v1'||!Number.isFinite(d.serverNow)||!Number.isFinite(d.resetAt)||!['dialogue','room'].every(k=>Number.isSafeInteger(d[k]?.remaining)&&Number.isSafeInteger(d[k]?.maximum)))throw Error('USAGE_INVALID');
  if(signal?.aborted)return;setData(d);setReceived(Date.now());setTick(Date.now());setUnavailable(false);
 }catch{if(!signal?.aborted)setUnavailable(true);}},[]);
 useEffect(()=>{const controller=new AbortController();void refresh(controller.signal);const id=active?window.setInterval(()=>void refresh(controller.signal),2000):undefined;return()=>{controller.abort();clearInterval(id);};},[refresh,refreshKey,active]);
 useEffect(()=>{if(!data)return;const id=window.setInterval(()=>setTick(Date.now()),1000);return()=>clearInterval(id);},[data]);
 const serverNow=data?data.serverNow+Math.max(0,tick-received):Date.now();
 const blocked=(kind:Kind)=>Boolean(data&&(data[kind].retryAt!>serverNow||(data[kind].remaining===0&&data.resetAt>serverNow)));
 return {data,unavailable,serverNow,blocked,refresh:()=>refresh()};
}
export type AiUsageState=ReturnType<typeof useAiUsage>;
export function aiErrorText(code:string,locale:'zh'|'en'){
 const t=(pair:[string,string])=>pair[locale==='zh'?0:1];
 if(code==='PROLOGUE_REQUIRED')return t(['这个剧情动作需要先完成眼前的引导。进度和输入已保留；这不是网络故障。自由聊天不需要完成整个序章。','This story action requires the current introduction step first. Your progress and draft are kept; this is not a network failure. Free conversation does not require completing the prologue.']);
 if(code==='AI_DIALOGUE_DAILY_LIMIT')return t(['今天的自由对话额度已用完。你写的话保留在输入框；额度恢复后可再发送，现在仍可探索或选择原有话题。','Today’s free-dialogue allowance is used up. Your draft is kept; send it after the reset. You can still explore and choose existing topics.']);
 if(code==='AI_ROOM_DAILY_LIMIT'||code==='DAILY_LIMIT')return t(['今天的新房间提议额度已用完。已有房间和原调查仍可继续，恢复时间见下方。','Today’s new-room allowance is used up. Existing rooms and the original investigation remain playable. See the reset time below.']);
 if(code==='AI_COOLDOWN')return t(['请求比较密集，请稍等片刻再发送。输入和原进度保留，不需要重新开始游戏。','Requests are arriving quickly. Please wait briefly before sending again. Your draft and progress are kept; no restart is needed.']);
 if(code==='AI_REQUEST_IN_PROGRESS'||code==='SESSION_BUSY'||code==='PENDING_PROPOSAL')return t(['已有请求正在处理，请恢复原请求或等它完成，不要重复提交。','A request is already in progress. Recover that request or wait for it to finish instead of submitting another.']);
 if(['AI_QUEUE_FULL','AI_QUEUE_TIMEOUT','SERVICE_BUSY','SERVICE_UNAVAILABLE'].includes(code))return t(['AI 服务现在比较繁忙，本次未完成。输入和原进度保留，请稍后手动重试；不会自动连续发送。','AI is busy and this request did not finish. Your draft and progress are kept. Try again shortly; requests will not be retried automatically.']);
 if(code==='PLAY_WINDOW_CLOSED'||code==='MODEL_TEST_EXPIRED')return t(['本次服务器开放时段已结束。原进度保留，需等待服务重新开放。','This server’s availability window has ended. Your progress is kept until service resumes.']);
 if(code==='DELTA_STALE'||code==='VERSION_CONFLICT')return t(['调查进度已改变。请先恢复最新进度，再按当前资料重新准备请求。','The investigation has changed. Recover the latest progress before preparing a new request.']);
 if(['MODEL_BUDGET_EXHAUSTED','MODEL_UNAVAILABLE','DIALOGUE_UNAVAILABLE'].includes(code))return t(['AI 暂不可用。输入和原进度保留，可以继续探索或选择原有话题。','AI is temporarily unavailable. Your draft and progress are kept; you can explore or use existing topics.']);
 return t(['这次请求未能完成。输入和原进度保留；先恢复进度，再手动重试或继续原调查。失败不会占用玩家日额度。','This request could not finish. Your draft and progress are kept. Recover progress, then retry manually or continue the original investigation. Failed requests do not use your daily allowance.']);
}
export function AiUsage({state,locale,full=false,kind,error=''}:{state:AiUsageState;locale:'zh'|'en';full?:boolean;kind?:Kind;error?:string}){
 const t=(pair:[string,string])=>pair[locale==='zh'?0:1],{data,serverNow}=state;
 const time=(n:number)=>new Intl.DateTimeFormat(locale==='zh'?'zh-CN':'en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(n);
 if(!full&&!error&&!data?.queuePosition&&!(kind&&data?.[kind].nearLimit)&&!(kind&&data?.[kind].retryAt!>serverNow))return null;
 const kinds:Kind[]=full?['dialogue','room']:kind?[kind]:[];
 return <section className="bc-ai-usage" aria-label={t(['AI 使用情况','AI usage'])}>
  {full&&<h3>{t(['AI 使用情况','AI USAGE'])}</h3>}
  {error&&<p role="alert">{aiErrorText(error,locale)}</p>}
  {data?.queuePosition!>0&&<p role="status">{t(['已进入 AI 等待队列，当前位置：','In the AI queue. Current position: '])}{data!.queuePosition}{t(['。无需重复发送；排队超过 10 秒会结束等待，并允许手动重试。','. No need to resend. Waiting ends after 10 seconds so you can retry manually.'])}</p>}
  {data&&kinds.map(k=><div key={k}>
   <p>{t(k==='dialogue'?['自由对话','Free dialogue']:['新房间提议','New-room requests'])} · {t(['今日剩余 ','Remaining today: '])}<strong>{data[k].remaining.toLocaleString(locale)}</strong> / {data[k].maximum.toLocaleString(locale)}{data[k].pending>0&&<> · {t(['处理中 ','In progress: '])}{data[k].pending}</>}</p>
   {data[k].nearLimit&&data[k].remaining>0&&<p>{t(['今天已经使用较多。额度恢复前仍可继续已有剧情。','You have used most of today’s allowance. Existing story content remains playable.'])}</p>}
   {data[k].retryAt!>serverNow&&<p role="status">{t(['可再次发送：','Send again at: '])}{time(data[k].retryAt!)}{t(['（约 ',' (about '])}{Math.ceil((data[k].retryAt!-serverNow)/1000)}{t([' 秒后）',' seconds)'])}</p>}
  </div>)}
  {data&&(full||kinds.some(k=>data[k].remaining===0||data[k].nearLimit))&&<p className="bc-muted">{t(['下次日额度恢复：','Next daily reset: '])}{time(data.resetAt)}{t(['（按你的本地时区显示）。',' (shown in your local time zone).'])}</p>}
  {full&&<p className="bc-muted">{t(['按当前浏览器身份计算。失败不扣日额度，刷新不重复扣次。一次房间的生成和审核合计一次提议；当前每段旅程仍最多扩展 2 间。','Allowances belong to this browser identity. Failures do not use daily allowance; refreshes are not charged twice. Room generation and reviews count as one request. Each journey currently supports up to 2 extra rooms.'])}</p>}
  {full&&!data&&!state.unavailable&&<p role="status">{t(['正在读取用量…','Loading usage…'])}</p>}
  {state.unavailable&&(full||error)&&<p>{t(['暂时无法读取最新用量，不代表额度已用完。','Latest usage is temporarily unavailable; this does not mean your allowance is exhausted.'])}<button type="button" onClick={()=>void state.refresh()}>{t(['刷新用量','Refresh usage'])}</button></p>}
 </section>;
}
