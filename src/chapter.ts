import {records,type Pair,type PersonId,type Topic} from './content'
import type {Journey} from './state'
const has=(j:Journey,id:string)=>Boolean(j.save.facts[id])
export const chapterEnabled=(j:Journey)=>j.chapterVersion===1||!has(j,'decision')
export const chapterReviewed=(j:Journey)=>has(j,'committee-reconciled')
export const chapterComplete=(j:Journey)=>['echo-founder','echo-finance','echo-client'].every(id=>has(j,id))
export function chapterStage(j:Journey):Pair{
 if(has(j,'decision'))return chapterEnabled(j)?chapterComplete(j)?['第五幕 · 留下的责任','V · What remains yours']:['尾声 · 周一的回音','EPILOGUE · Monday replies']:['已封存的调查','ARCHIVED INVESTIGATION']
 if(chapterReviewed(j))return ['第四幕 · 你的名字在意见上','IV · Your name on the recommendation']
 if(has(j,'chapter-confronted'))return ['第三幕 · 承诺需要边界','III · What a promise can carry']
 if(has(j,'income'))return ['第二幕 · 材料没有写出的部分','II · What the brief left out']
 return ['第一幕 · 签字之前','I · Before you sign']
}
export function chapterObjective(j:Journey):Pair|undefined{
 if(!chapterEnabled(j))return
 if(has(j,'decision')){
  if(!has(j,'echo-founder'))return ['周一：去 RelayOps 听取创始人的安排','Monday: return to RelayOps for the founder’s response']
  if(!has(j,'echo-finance'))return ['去资料会议室，确认财务如何安排接下来的一周','Visit finance for the coming week’s cash plan']
  if(!has(j,'echo-client'))return ['去客户现场，听取运营的最后回音','Visit the customer for the final reply']
  return ['本章结束：回顾意见，或开始另一段独立调查','Chapter complete: revisit your recommendation or begin anew']
 }
 if(has(j,'income')&&!has(j,'chapter-confronted'))return ['回 RelayOps，问创始人为何仍要保留原摘要','Return to RelayOps: challenge the unchanged brief']
 if(has(j,'chapter-confronted')){
  if(!has(j,'delivery-log'))return ['去交付作战室查阅故障交接单','Visit the delivery room for the handover log']
  if(!has(j,'settlement-review'))return ['去渠道结算办公室核对付款链条','Visit the settlement office to reconcile the payment']
  if(!has(j,'committee-draft'))return ['去基金小会议室查看上次讨论留痕','Visit the fund breakout room for the prior discussion notes']
  if(!has(j,'budget-revision'))return ['重访资料会议室的付款台，取修订预算','Revisit the payment schedule in the data room for the revision']
  if(!has(j,'budget-confirmed'))return ['向财务追问修订预算的压力情境','Ask finance what the revised budget still leaves exposed']
  if(!has(j,'acceptance-revision'))return ['重访客户的验收台，取带日期的说明','Revisit the customer’s acceptance note for the dated update']
  if(!has(j,'boundary-confirmed'))return ['请客户明确可以引用的承诺边界','Ask the customer what you may actually promise']
  if(!has(j,'committee-reconciled'))return ['回基金找合伙人，把更正和未决风险一起提交','Return to the partner with corrections and unresolved risks']
 }
}
export const revisionDefinitions=[
 {source:'cash',flag:'budget-revision',title:['修订预算 · 周五晚','Revised budget · Friday evening'] as Pair,body:['普里娅将原表留在左侧，另夹了一页。\n\n第一优先是工资、税费和已有供应商义务；第二优先是保住驻场实施团队，扩张招聘暂缓。客户退款尚未确定，不能当作零。供应商展期仍未签字。\n\n页脚手写：“投资意见不是银行到账。周一之前，我需要知道能够动用什么。”请向她核实预算承诺。','Priya leaves the original on the left and clips on a revision.\n\nPayroll, taxes and existing supplier obligations come first, followed by the on-site delivery team. Expansion hiring is deferred. A possible customer refund cannot be assumed to be zero. Supplier extensions remain unsigned.\n\nIn the margin: “An investment recommendation is not money in the bank. Before Monday, I need to know what is available.” Ask her which commitments this plan can support.'] as Pair},
 {source:'acceptance',flag:'acceptance-revision',title:['验收边界说明 · 周五晚','Acceptance boundaries · Friday evening'] as Pair,body:['乔丹把采购邮件放到一旁，在运营意见上补了日期。\n\n周一只安排已经上线门店的数据同步复核。剩余二十家暂不扩店；是否恢复排期，要看复核结果。退款权按原合同保留。\n\n“我允许你引用我们愿意继续验证，不允许你写成已经全量验收。”这不是终止合作通知，也不是成功保证。','Jordan sets procurement’s email aside and dates the operations note.\n\nMonday is reserved for synchronization checks at stores already live. The remaining twenty will not expand until those results are reviewed. Contractual refund rights remain intact.\n\n“You may say we will keep testing. You may not say we have accepted the full rollout.” This is neither a termination notice nor a guarantee of success.'] as Pair}
]
export function roomRevision(j:Journey,id:string){return chapterEnabled(j)&&has(j,'chapter-confronted')&&!has(j,'decision')?revisionDefinitions.find(r=>r.source===id):undefined}
export function chapterDocument(j:Journey,id:string){
 const record=records.find(r=>r.id===id);if(!record)return undefined
 const revision=chapterEnabled(j)&&has(j,'chapter-confronted')?revisionDefinitions.find(r=>r.source===id):undefined
 return revision?{...record,title:revision.title,body:revision.body,summary:revision.body}:record
}
export function chapterTopics(j:Journey,person:PersonId):Topic[]{
 if(!chapterEnabled(j))return []
 const f=j.save.facts
 if(f.decision){
  const reply:Record<string,Pair>={
   founder:f.decision==='pause'?['马特奥的袖子仍卷着。“我们先停扩张招聘，今天谈供应商展期。你没有答应救我们，我也不会向员工说资金已经到了。等同步复核出来，我会再发给你。”','Mateo still has his sleeves rolled up. “Expansion hiring is on hold. Today we ask suppliers for time. You haven’t promised a rescue, and I won’t tell staff the money has arrived. I’ll send you the synchronization review.”']:f.decision==='conditional'?f.terms==='tranche'?['“我把首期用途单独列了。投委会支持不等于首期已经到账；法律文件和交割条件还得完成。后续那笔钱不能拿来承诺本周工资。”','“The first tranche has its own uses schedule. Committee support is not cash received; documentation and closing conditions remain. I cannot promise this week’s payroll from a later tranche.”']:['“我接受了稀释，今天把用途表发给董事会。价格变了，实施团队面对的同步问题没变。钱也要等文件和条件落实。”','“I accepted the dilution and sent the uses schedule to the board. The price changed; the delivery team’s synchronization problem did not. Funding still waits on documentation and conditions.”']:['“我已经通知团队你支持继续，但没有说钱到了。客户仍按原合同验收。我知道，你签的是承担这些风险的意见，不是保证我们一定成功。”','“I told the team you support proceeding, not that money arrived. The customer still follows the contract. Your signature accepts these risks; it does not guarantee our success.”'],
   finance:['普里娅给你看周一的付款表。“工资和履约排在前面，展期没有签字就不算到账来源。我会把实际余额和原预测并排给你；如果条件变了，请别等到下次会议才回应。”','Priya shows Monday’s schedule. “Payroll and delivery come first. Unsigned extensions are not a funding source. You’ll see actual balances beside the forecast. If conditions change, please don’t wait for another meeting to respond.”'],
   client:['乔丹朝正在核对表格的同事点头。“今天继续复核已上线的店。投资人怎么决定，都不会替我们完成验收。等结果出来，我会告诉你什么变好了、什么还没好。”\n\n你把这句话补进案件末页。交易有了去向，未完成的责任也有了名字。','Jordan nods toward the checklists. “Today we review the stores already live. An investor’s decision cannot perform acceptance for us. I’ll tell you what improved and what did not.”\n\nYou add that sentence to the case. The transaction has a direction; its unfinished responsibilities have owners.']}
  return reply[person]&&!has(j,'echo-'+person)?[{id:'chapter-echo-'+person,label:['周一了，接下来如何安排？','It’s Monday. What happens next?'],reply:reply[person],effects:['echo-'+person]}]:[]
 }
 if(person==='founder'&&f.income&&!f['chapter-confronted'])return [
  {id:'chapter-replace',label:['退款条款不能省略：请替换投委会摘要','Replace the brief: the refund terms must be included'],reply:['马特奥把电脑屏幕转回来。“我本来想等交割后再解释。换摘要，会让你们重新讨论，对吧？”\n\n你点头。他最终同意发修订版，让财务列出履约预算，并让客户重新写清验收边界。“我不要求你替我们保证。但请把六家店的价值也带回去。”','Mateo turns the screen back. “I wanted to explain after closing. Replacing the brief means reopening the discussion, doesn’t it?”\n\nYou nod. He agrees to circulate a correction, have finance separate delivery costs, and ask the customer to restate acceptance boundaries. “Do not guarantee us. But bring back the value in those six stores, too.”'],effects:['chapter-confronted','brief-replaced','founder-disclosed']},
  {id:'chapter-dissent',label:['保留原稿，但把我的具名异议一起送审','Keep the original, with my signed dissent attached'],reply:['“那份材料已经发出去了。”马特奥没有收走原稿。你要求把退款风险与未验收范围作为具名异议同等送审，不能藏在附件末尾。\n\n他同意财务和客户补充说明。这样保留了原始说法，也意味着你要在会上亲口指出分歧，不能假设每个人都会读附件。','“The original has already circulated.” Mateo leaves it on the table. You require your signed dissent on refunds and unaccepted scope to receive equal attention.\n\nHe agrees to finance and customer updates. The original account remains visible, but you must explain the disagreement in the meeting; you cannot assume everyone reads attachments.'],effects:['chapter-confronted','brief-dissent','founder-disclosed']}
 ]
 if(person==='finance'&&f['budget-revision']&&!f['budget-confirmed'])return [{id:'chapter-budget',label:['这份修订预算还能承受什么变化？','What can this revised budget actually withstand?'],reply:['“不是每种变化都承受得住。”普里娅把退款栏留白。“展期未签、验收未过，不能填成有利结果。首期太小，实施做不完；全款到位，也不代表可以马上扩张。”\n\n你记下：融资条件必须支持履约，而且不能把客户的权利算没了。','“Not every change.” Priya leaves the refund line unresolved. “Unsigned extensions and unfinished acceptance cannot become favorable assumptions. Too little upfront and delivery fails; full funding still does not justify immediate expansion.”\n\nYou note that financing must support delivery without erasing the customer’s rights.'],effects:['budget-confirmed','finance-stress']}]
 if(person==='client'&&f['acceptance-revision']&&!f['boundary-confirmed'])return [{id:'chapter-boundary',label:['我能向投委会承诺到哪一步？','What exactly may I tell the committee?'],reply:['“你可以说六家老店有价值，我们愿意继续核验。你不能替我承诺剩余二十家的验收，也不能把保留退款权写成一定退款。”\n\n乔丹让你保留带日期的说明。“投资人需要确定性，我理解。但别从我们这里借一个不存在的保证。”','“Say the six established stores have value and we will continue testing. Do not promise acceptance for the other twenty on my behalf, or turn retained refund rights into a definite demand.”\n\nJordan lets you keep the dated note. “I understand investors want certainty. Do not borrow a guarantee we never gave.”'],effects:['boundary-confirmed','client-confirmed']}]
 if(person==='partner'&&f['delivery-log']&&f['settlement-review']&&f['committee-draft']&&f['budget-confirmed']&&f['boundary-confirmed']&&!f['committee-reconciled'])return [{id:'chapter-reconcile',label:['更正已经落实，但这些风险仍未消失','The corrections are in. These risks remain'],reply:f['brief-replaced']?['玛拉把新版放到原稿上。“我会重新开场，不把这个更正说成笔误。你保住了我们据实讨论的机会，也延后了本来以为谈妥的共识。”\n\n“现在写你的建议。支持，就说清接受什么；暂停，就说清靠什么重开。我的名字不会替你签。”','Mara lays the revision over the original. “I’ll reopen the discussion. This is not a typo. You preserved an honest decision, and delayed a consensus we thought we had.”\n\n“Now make your recommendation. If you support it, name the risks. If you pause, name what would reopen it. My name cannot sign for yours.”']:['玛拉把你的异议放在摘要第一页。“我会给你时间直接讲。保留原稿能让大家看到分歧的来源，但没人可以用没看附件当理由。”\n\n“现在写你的建议。你不需要同意我，但必须让人理解你愿意承担什么。”','Mara places your dissent at the front. “You’ll have time to explain it. Keeping the original shows where we differed. Nobody can say they missed an attachment.”\n\n“Now make your recommendation. You do not have to agree with me. You must make clear what you are willing to own.”'],effects:['committee-reconciled']}]
 return []
}
export function chapterRoomNote(j:Journey):Pair|undefined{
 if(!chapterEnabled(j))return
 if(has(j,'decision'))return ['周一早晨。交易意见已送出，回复陆续回来。','Monday morning. The recommendation is out; replies are arriving.']
 if(!has(j,'chapter-confronted'))return
 return ({fund:['原摘要仍在桌上，等待你带回更正与异议。','The original brief waits for your corrections and dissent.'],office:['白板上的扩张计划暂未擦去，创始人开始重整材料。','The expansion plan remains on the board while the founder revises the case.'],records:['付款台夹入了一页修订预算，原始付款表仍保留。','A revised budget is clipped to the payment schedule. The original remains.'],client:['验收台补上了带日期的说明，扩店排期暂缓。','A dated acceptance note is on the desk. Further rollout is on hold.']} as Record<string,Pair>)[j.scene]
}
