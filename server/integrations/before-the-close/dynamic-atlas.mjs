import {verificationSceneId} from './dynamic-space.mjs';
import {supplementalFinding} from './supplemental-evidence.mjs';
export function supplementalObjective(head){
 if(!head?.binding||!head.dynamic?.actions?.length)return null;
 const todo=head.dynamic.actions.find(a=>head.state.facts[a.doneFact]!==true);
 if(head.state.location===verificationSceneId)return todo?['下一步：'+todo.label.zh,'Next: '+todo.label.en]:['补充核对完成，可以返回资料室；结论仍需你核实。','Supplemental review complete. Return to the data room; findings still require your verification.'];
 if(head.state.location!=='records'||!dynamicRoomEntryOpen(head))return null;
 if(todo)return ['从右侧入口继续补充核验；也可以继续原调查。','Use the right-hand entrance for supplemental review, or continue your original investigation.'];
 if(supplementalFinding(head)==='funding')return ['打开「资料 → 判断」比较现金记录与预测；笔记可附入，但不代替原始材料。','Open Case → Findings to compare cash records and forecasts. Notes are optional, not replacement sources.'];
 if(head.state.facts.appendix!==true)return ['阅读资料室的补充协议，再与银行回单核对；笔记保存在资料夹。','Read the Supplement here and compare it with the bank receipt. Your notes are in Case.'];
 return ['打开「资料 → 判断」核对收入；可附上已读笔记，但仍需两份原资料。','Open Case → Findings to compare income sources. Notes are optional; both original records are still required.'];
}

export const dynamicRoomEntryOpen=head=>Boolean(head?.binding)&&head.state?.facts?.[supplementalFinding(head)]===false&&head.ended!==true;

// Read-only navigation projection. It never grants map-travel authority.
export function dynamicAtlas(head){
 if(!head?.binding||head.catalog?.length!==1||head.catalog[0].id!==verificationSceneId)return null;
 const room=head.catalog[0];
 return {id:room.id,label:[room.label.zh,room.label.en],entryOpen:dynamicRoomEntryOpen(head),points:{office:[108,270],records:[296,270],[room.id]:[484,270]},edges:[
  {from:'records',to:room.id,id:room.enter_action_id,side:'E'},
  {from:room.id,to:'records',id:room.escape_action_id,side:'W'},
 ]};
}
