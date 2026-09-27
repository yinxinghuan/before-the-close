import {inPrologue} from './prologue';
import type {Journey} from './state';
import type {Pair,PersonId} from './content';
import type {SceneId} from './world';
export const projects=[{id:'relayops',title:['RelayOps · 成长轮尽调','RelayOps · Growth investment'] as Pair,company:'RelayOps',brief:['这是你加入团队后的第一个项目。先在总部和同事一起读一份摘要，再带着具体的问题去拜访公司。','This is your first assignment with the team. Review a brief with your colleagues at headquarters, then visit the company with a specific question.'] as Pair,entry:'office' as SceneId}];
export const headquartersRooms:SceneId[]=['lobby','study','fund','archive','partnerroom','meeting'];
export function projectAccepted(j:Journey){return !inPrologue(j)&&(!!j.save.facts['project-accepted']||!!j.save.facts.memo||!!j.save.facts.decision||!headquartersRooms.includes(j.scene))}
export function projectStatus(j:Journey):Pair{return j.save.facts.decision&&!j.chapterVersion?['此前已结束','Previously closed']:j.save.facts['case-archived']?['已归档','Archived']:j.save.facts.decision?['已提交 · 跟进回音','Submitted · Follow up']:projectAccepted(j)?['尽调进行中','Diligence in progress']:['待接手','Ready to take on']}
export function canArchive(j:Journey){return !!j.save.facts.decision&&['echo-founder','echo-finance','echo-client'].every(k=>j.save.facts[k])}
export const encounter:Record<PersonId,{context:Pair;action:Pair;greeting:Pair}>={
 partner:{context:['窗边的女人朝门口招手。“艾娃？我是玛拉，带你熟悉项目的合伙人。进来坐。”','The woman by the window waves you in. “Ava? I’m Mara, the partner helping you settle into the team. Come in.”'],action:['和玛拉讨论项目','Discuss the deal with Mara'],greeting:['玛拉，我们核对一下明早需要讲清的问题。','Mara, let’s review what we need to explain tomorrow.']},
 analyst:{context:['抱着材料的年轻人从桌边抬头。“你就是新来的艾娃吧？我是丹尼尔，项目组的分析师。”','The young man holding a file looks up. “You must be Ava. I’m Daniel, an analyst on the deal team.”'],action:['和丹尼尔核对材料','Review the files with Daniel'],greeting:['丹尼尔，你刚才标出的疑点是什么？','Daniel, what caught your attention in the files?']},
 founder:{context:['白板前的男人卷着袖子。他放下交付排期，问你是否来自 Northline。','A man with rolled sleeves puts down a delivery schedule and asks whether you are from Northline.'],action:['与马特奥谈项目进展','Catch up with Mateo'],greeting:['马特奥，投委会之前有几处情况需要当面核实。','Mateo, I need to verify a few things before the committee.']},
 finance:{context:['财务负责人核对你的来访授权，把付款表转向你。','The finance lead checks your visit authorization and turns the payment schedule toward you.'],action:['说明核查范围','Explain the review'],greeting:['你好，我是 Northline 的艾娃，来核对项目财务。','Hello, I’m Ava from Northline, here to review the project finances.']},
 client:{context:['运营负责人结束手里的工作，等你说明这次拜访的目的。','The operations lead finishes her task and waits to hear what you need from this visit.'],action:['说明来访目的','Introduce your visit'],greeting:['你好，我想了解 RelayOps 在现场的实际使用情况。','Hello, I’d like to understand how RelayOps works on site.']}
};
