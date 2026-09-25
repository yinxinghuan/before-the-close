import type {Journey} from './state';
import type {Pair,PersonId} from './content';
import type {SceneId} from './world';
export const projects=[{id:'relayops',title:['RelayOps · 成长轮尽调','RelayOps · Growth investment'] as Pair,company:'RelayOps',brief:['你已跟进半年。明早投委会需要区分客户使用、首款条件与资金用途。先与项目组核对，再去现场。','You have led this deal for six months. Tomorrow’s committee needs clarity on customer use, payment conditions and funding needs. Brief with your team, then visit the sites.'] as Pair,entry:'office' as SceneId}];
export const headquartersRooms:SceneId[]=['study','fund','archive','partnerroom','meeting'];
export function projectAccepted(j:Journey){return !!j.save.facts['project-accepted']||!!j.save.facts.memo||!!j.save.facts.decision||!headquartersRooms.includes(j.scene)}
export function projectStatus(j:Journey):Pair{return j.save.facts.decision&&!j.chapterVersion?['此前已结束','Previously closed']:j.save.facts['case-archived']?['已归档','Archived']:j.save.facts.decision?['已提交 · 跟进回音','Submitted · Follow up']:projectAccepted(j)?['尽调进行中','Diligence in progress']:['待接手','Ready to take on']}
export function canArchive(j:Journey){return !!j.save.facts.decision&&['echo-founder','echo-finance','echo-client'].every(k=>j.save.facts[k])}
export const encounter:Record<PersonId,{context:Pair;action:Pair;greeting:Pair}>={
 partner:{context:['玛拉是带你做这个项目的合伙人。她把笔记本转向你，准备听你的判断。','Mara is the partner sponsoring your deal. She turns her notebook toward you, ready for your assessment.'],action:['和玛拉讨论项目','Discuss the deal with Mara'],greeting:['玛拉，我们核对一下明早需要讲清的问题。','Mara, let’s review what we need to explain tomorrow.']},
 analyst:{context:['你的项目组同事丹尼尔抱着刚标注的材料。他已经在等你一起核对。','Your deal-team colleague Daniel is waiting with the files he has just annotated.'],action:['和丹尼尔核对材料','Review the files with Daniel'],greeting:['丹尼尔，你刚才标出的疑点是什么？','Daniel, what caught your attention in the files?']},
 founder:{context:['你已和马特奥跟进这轮融资半年。他认出你，放下手里的交付排期。','You have worked with Mateo on this round for six months. He recognizes you and puts down the delivery schedule.'],action:['与马特奥谈项目进展','Catch up with Mateo'],greeting:['马特奥，投委会之前有几处情况需要当面核实。','Mateo, I need to verify a few things before the committee.']},
 finance:{context:['财务负责人核对你的来访授权，把付款表转向你。','The finance lead checks your visit authorization and turns the payment schedule toward you.'],action:['说明核查范围','Explain the review'],greeting:['你好，我是 Northline 的艾娃，来核对项目财务。','Hello, I’m Ava from Northline, here to review the project finances.']},
 client:{context:['运营负责人结束手里的工作，等你说明这次拜访的目的。','The operations lead finishes her task and waits to hear what you need from this visit.'],action:['说明来访目的','Introduce your visit'],greeting:['你好，我想了解 RelayOps 在现场的实际使用情况。','Hello, I’d like to understand how RelayOps works on site.']}
};
