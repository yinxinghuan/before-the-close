import type {Journey} from './state';
import type {Pair,PersonId,Topic} from './content';
export const inPrologue=(j:Journey)=>j.prologueVersion===1&&!j.save.facts['orientation-ready'];
export function prologueStep(j:Journey){
 const f=j.save.facts;
 if(!f['welcome-read'])return 'welcome';
 if(!f['orientation-role'])return 'role';
 if(!f['met-analyst'])return 'colleague';
 if(!f.memo)return 'brief';
 if(!f['orientation-check'])return 'check';
 if(!f['orientation-file'])return 'file';
 return 'ready';
}
export function prologueObjective(j:Journey):Pair{
 return ({welcome:['自己的办公室：走近办公桌，读欢迎便笺','Your office: approach your desk and read the welcome note'],role:['合伙人办公室：认识玛拉，问问今天从哪里开始','Partner office: meet Mara and ask where to begin'],colleague:['项目组办公区：向抱着材料的同事打个招呼','Deal-team room: say hello to the colleague holding a file'],brief:['项目组办公区：查看办公桌上的摘要','Deal-team room: read the brief on the desk'],check:['项目组办公区：与丹尼尔核对摘要中的一句话','Deal-team room: discuss one sentence with Daniel'],file:['基金资料室：打开案卷，回看刚才的摘要','Fund archive: open the case and revisit the brief'],ready:['合伙人办公室：告诉玛拉，你准备去核实什么','Partner office: tell Mara what you plan to verify']} as Record<string,Pair>)[prologueStep(j)];
}
export const welcome:Pair=['桌上摆着一张写有“Ava”的名牌，旁边是还没拆开的笔记本。你刚加入 Northline，负责研究值得投资的企业；这家公司怎样做决定，你还不熟悉。\n\n便笺上写着：“欢迎，艾娃。安顿好以后，来我的办公室聊聊。今天先从一件小事开始。——玛拉”','A nameplate reading “Ava” sits beside an unopened notebook. You have just joined Northline to research businesses the firm might invest in. You do not yet know how this team makes its decisions.\n\nA note reads: “Welcome, Ava. Once you’re settled, stop by my office. We’ll start with one small thing today. —Mara”'];
export const starterBrief:Pair=['RelayOps 为连锁门店提供运营软件。项目组正在研究是否投资这家公司。\n\n丹尼尔在摘要旁写了一句自己的概括，又把它圈了起来：“客户已经付款，因此业务验证已经完成。”\n\n丹尼尔在旁边写了一个问号。先不用记金额；你们要讨论的是，这句话能不能直接成立。','RelayOps makes operations software for retail chains. Your team is considering an investment.\n\nDaniel has written and circled his own interpretation in the margin: “The customer has paid, so business validation is complete.”\n\nDaniel has pencilled a question mark beside it. Set the figures aside for now. Is that sentence enough to support its conclusion?'];
export function prologueTopics(j:Journey,person:PersonId):Topic[]{
 const step=prologueStep(j);const topic=(id:string,label:Pair,reply:Pair,effects:string[]=[]):Topic=>({id,label,reply,effects});
 if(person==='partner'&&step==='role')return [topic('orientation-role',['我刚加入，今天先从什么做起？','I’m new here. Where should I start?'],['玛拉把一叠文件移到一旁。“先别急着读完。我们替基金判断一家公司值不值得投钱，你的工作是把依据弄清楚，不是替任何人保证成功。”\n\n“项目组的丹尼尔在整理一家软件公司的材料。去认识一下他，看看他桌上圈出的那句话。带着问题回来就行。”','Mara pushes a stack of files aside. “No need to read all of this yet. We decide whether a business merits the fund’s money. Your job is to make the evidence clear, not guarantee success.”\n\n“Daniel is reviewing a software company in the deal-team room. Meet him and look at the sentence circled on his desk. Come back with a question.”'],['orientation-role'])];
 if(person==='analyst'&&step==='check')return [
 topic('orientation-assume',['既然付款了，就可以认为客户满意？','If they paid, can we assume they are satisfied?'],['丹尼尔摇头。“也可能只是预付款。我也差点把两件事当成一件事。钱到了，能证明有一笔付款；软件好不好用，还得听使用它的人怎么说。”\n\n他把笔递给你。“试试给这句话留一点余地？”','Daniel shakes his head. “It could be an advance. I nearly conflated those too. A payment establishes that money moved; whether the software works takes evidence from the people using it.”\n\nHe offers his pencil. “How would you leave room for that uncertainty?”']),
 topic('orientation-check',['付款是一条线索，使用情况还需要核实','Payment is a clue. Actual use still needs checking'],['“对。这就是我们要做的。”丹尼尔在摘要旁写下“使用情况待核实”。\n\n“这不是说公司不好，只是别让一句话替你下结论。我把摘要留进你的资料夹。去基金资料室回看一下；以后找到的新材料，也可以在那里查。”','“Exactly.” Daniel writes “Actual use still to verify” beside the sentence.\n\n“That does not make it a bad company. We just shouldn’t let a sentence decide for us. The brief is in your case file. Revisit it in the fund archive; that’s also where you can look back at new evidence.”'],['orientation-check'])];
 if(person==='partner'&&step==='ready')return [topic('orientation-ready',['我想先查清：付款是不是代表客户真的在用','I want to check whether payment means the customer is using it'],['“这是一个可以带去现场的问题。”玛拉把来访安排推给你。“RelayOps 的创始人马特奥会接待你。先让他介绍业务，再看客户合同。你不必现在就给投资建议。”\n\n“从中央接待区下方出口出发。明早讨论前，回来告诉我你看见了什么、哪些还不确定。我们一起把你的第一份建议讲清楚。”','“That is a question you can take into the field.” Mara slides over a visit arrangement. “Mateo, the founder of RelayOps, will meet you. Let him explain the business, then read the customer contract. You do not owe us a recommendation yet.”\n\n“Leave through the bottom exit in central reception. Before tomorrow’s discussion, bring back what you saw and what remains uncertain. We’ll work through your first recommendation together.”'],['orientation-ready','project-accepted'])];
 return [topic('orientation-direction-'+step,['我下一步去哪里？','Where should I go next?'],prologueObjective(j))];
}
