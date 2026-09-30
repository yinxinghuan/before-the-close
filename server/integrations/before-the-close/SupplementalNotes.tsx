import {supplementalNotes,supplementalFinding,supplementalComparisons} from './supplemental-evidence.mjs';

export function SupplementalNotes({head,locale,selected=[],onToggle,recordTitles,finding}:any){
 const notes=supplementalNotes(head).filter((n:any)=>!finding||n.finding===finding),t=(zh:string,en:string)=>locale==='zh'?zh:en;
 if(!notes.length)return null;
 return <section className="bc-supplemental-notes" aria-label={t('补充核验笔记','Supplemental analysis notes')}>
  <h3>{t('补充核验笔记','Supplemental analysis notes')}</h3>
  <p>{head.dynamic?.format==='finance-two-generation-v1'?t('这些笔记整理你已读过的材料，不是独立证据。每项判断仍须核对对应的两份原始资料。','These notes analyze records you have read, not independent evidence. Each finding still requires its two original sources.'):(finding??supplementalFinding(head))==='funding'?t('这些笔记整理你已读过的材料，不是新的独立证据。资金判断仍需现金记录与财务预测。','These notes analyze records you already read; they are not independent evidence. The funding finding still requires the cash record and forecast.'):t('这些笔记整理你已读过的材料，不是新的独立证据。收入判断仍需银行回单和补充协议。','These notes analyze records you already read; they are not independent evidence. The income finding still requires the bank receipt and supplement.')}</p>
  {notes.map((note:any)=><details className="bc-finding" key={note.id}>
   <summary>{note.title[locale]}</summary>
   <p>{note.text[locale]}</p>
   <small>{note.finding==='funding'?t('用途：资金核对','For: funding comparison'):t('用途：收入核对','For: income comparison')}</small>
   <small>{t('准备时已知材料：','Records known when prepared: ')}{note.originIds.map((id:string)=>recordTitles[id]??id).join(' · ')}</small>
   {onToggle&&<button type="button" aria-pressed={selected.includes(note.id)} onClick={()=>onToggle(note.id)}>{selected.includes(note.id)?t('取消附入本次核对','Remove from this comparison'):t('附入本次核对（可选）','Attach to this comparison (optional)')}</button>}
  </details>)}
 </section>;
}

export function SupplementalComparison({head,locale}:any){
 return <>{supplementalComparisons(head).map(({finding,comparison,sealed}:any)=>{
 const notes=supplementalNotes(head).filter((n:any)=>comparison.action_ids.includes(n.id));
 return <aside className="bc-finding" key={finding}><h3>{finding==='funding'?(locale==='zh'?'资金核对的附带笔记':'Notes attached to the funding comparison'):(locale==='zh'?'收入核对的附带笔记':'Notes attached to the income comparison')}</h3>
  {notes.map((n:any)=><p key={n.id}>{n.title[locale]}</p>)}
  <small>{sealed?(locale==='zh'?'随本次签署意见封存；原始证据和结论不变。':'Frozen with this recommendation; original evidence and findings are unchanged.'):(locale==='zh'?'已随核对保存；尚未签署投资意见。':'Saved with the comparison; no investment recommendation has been signed.')}</small>
 </aside>;})}</>;
}
