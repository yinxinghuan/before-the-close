import {seriesEntries} from './series-presentation.mjs';
// Display only. Completion and source titles come from the adopted authority.
export function GoalProgress({head,locale}:any){
 const entries=seriesEntries(head),t=(zh:string,en:string)=>locale==='zh'?zh:en;
 if(head?.dynamic?.format!=='finance-goal-series-v1'||!entries.length)return null;
 return <section className="bc-goal-progress" aria-label={t('补充调查目标','Supplemental investigation goals')}>
  <h3>{t('补充调查目标','Supplemental investigation goals')}</h3>
  {entries.map((e:any,i:number)=>{const goal=e.goalReceipt.goal,read=e.actions.filter((a:any)=>head.state.facts[a.doneFact]===true).length;
   return <article key={goal.key} className="bc-goal-progress__item">
    <small>{t('调查 ','Investigation ')+(i+1)}</small><h4>{goal.question[locale]}</h4>
    <p role="status">{e.goalCompletion?t('调查完成 · 笔记已保存','Investigation complete · notes saved'):t('已查阅 ','Read ')+read+'/'+e.actions.length}</p>
    <p>{goal.reason[locale]}</p>
    <small>{t('来源：','Sources: ')}{goal.sourceIds.map((id:string)=>e.goalSources?.find((s:any)=>s.id===id)?.title?.[locale]??id).join(' · ')}</small>
    <p>{e.goalCompletion?t('这是补充分析，不是新的独立证据或投资结论。','This is supplemental analysis, not independent evidence or an investment finding.'):t('走入对应调查室，依次查阅两个调查点。','Enter the investigation room and read its two investigation points in order.')}</p>
   </article>;
  })}
  {entries.every((e:any)=>e.goalCompletion)&&<p>{head.ended?t('意见已签署，目标和笔记保留供回顾。','Recommendation signed; goals and notes remain for review.'):entries.length<2?t('返回资料室，可以准备下一个问题。','Return to the data room to prepare another question.'):t('本轮补充调查已完成，可继续原调查。','This round of supplemental investigations is complete. Continue the original investigation.')}</p>}
 </section>;
}
