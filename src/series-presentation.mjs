// Read-only views of the versioned native series. No state mutations or rules.
export const seriesFormat='finance-two-generation-v1';
export const seriesEntries=h=>h?.binding&&h.dynamic?.format===seriesFormat?h.dynamic.entries:[];
export const seriesActions=h=>seriesEntries(h).flatMap(e=>e.actions);
export const seriesEntryOpen=(h,e)=>Boolean(e)&&h.ended!==true&&h.state.facts[e.investigationId]===false;
export function seriesOffer(h,live=false){
 if(!h||h.ended||h.state.location!=='records'||h.state.facts.decision!=='none'||!h.state.facts['orientation-ready'])return null;
 if(h.binding&&h.dynamic?.format!==seriesFormat)return null;
 const n=seriesEntries(h).length,f=h.state.facts;
 const suffix=live?['AI 调查','AI investigation']:['离线测试','offline test'];
 if(n===0&&f.contract&&f.payment&&!f.income)return ['追查收入疑点 · '+suffix[0],'Follow the income lead · '+suffix[1]];
 if(n===1&&f.income&&f.cash&&f.forecast&&!f.funding)return ['追查资金疑点 · '+suffix[0],'Follow the funding lead · '+suffix[1]];
 return null;
}
export function seriesAtlas(h){
 const entries=seriesEntries(h);if(!entries.length)return null;
 const points={office:[108,270],records:[296,270]},labels={},open={},edges=[];
 for(const [i,e]of entries.entries()){
  const room=h.catalog.find(r=>r.id===e.roomId);points[room.id]=[484,i?295:100];labels[room.id]=[room.label.zh,room.label.en];open[room.id]=seriesEntryOpen(h,e);
  edges.push({from:'records',to:room.id,id:room.enter_action_id,side:'E'},{from:room.id,to:'records',id:room.escape_action_id,side:'W'});
 }
 return {ids:entries.map(e=>e.roomId),labels,open,points,edges};
}
export function seriesObjective(h){
 const entries=seriesEntries(h),current=entries.find(e=>e.roomId===h.state.location);
 if(current){const next=current.actions.find(a=>!h.state.facts[a.doneFact]);return next?['下一步：'+next.label.zh,'Next: '+next.label.en]:['调查笔记已保存，可以原路返回资料室。','Notes saved. Return to the data room through the same door.'];}
 const available=entries.find(e=>seriesEntryOpen(h,e));
 if(h.state.location!=='records'||!available)return null;
 if(available.actions.some(a=>!h.state.facts[a.doneFact]))return ['从右侧入口继续补充核验；也可继续原调查。','Use the right-hand entrance for supplemental review, or continue your original investigation.'];
 return ['在「资料 → 判断」核对原始材料；已读笔记可以附入，但不是独立证据。','Compare original sources in Case → Findings. Read notes may be attached, but are not independent evidence.'];
}
