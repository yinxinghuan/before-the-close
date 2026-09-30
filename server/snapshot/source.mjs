// src/prologue.ts
var inPrologue = (j) => j.prologueVersion === 1 && !j.save.facts["orientation-ready"];
function prologueStep(j) {
  const f = j.save.facts;
  if (!f["welcome-read"]) return "welcome";
  if (!f["orientation-role"]) return "role";
  if (!f["met-analyst"]) return "colleague";
  if (!f.memo) return "brief";
  if (!f["orientation-check"]) return "check";
  if (!f["orientation-file"]) return "file";
  return "ready";
}
function prologueObjective(j) {
  return { welcome: ["\u81EA\u5DF1\u7684\u529E\u516C\u5BA4\uFF1A\u8D70\u8FD1\u529E\u516C\u684C\uFF0C\u8BFB\u6B22\u8FCE\u4FBF\u7B3A", "Your office: approach your desk and read the welcome note"], role: ["\u5408\u4F19\u4EBA\u529E\u516C\u5BA4\uFF1A\u8BA4\u8BC6\u739B\u62C9\uFF0C\u95EE\u95EE\u4ECA\u5929\u4ECE\u54EA\u91CC\u5F00\u59CB", "Partner office: meet Mara and ask where to begin"], colleague: ["\u9879\u76EE\u7EC4\u529E\u516C\u533A\uFF1A\u5411\u62B1\u7740\u6750\u6599\u7684\u540C\u4E8B\u6253\u4E2A\u62DB\u547C", "Deal-team room: say hello to the colleague holding a file"], brief: ["\u9879\u76EE\u7EC4\u529E\u516C\u533A\uFF1A\u67E5\u770B\u529E\u516C\u684C\u4E0A\u7684\u6458\u8981", "Deal-team room: read the brief on the desk"], check: ["\u9879\u76EE\u7EC4\u529E\u516C\u533A\uFF1A\u4E0E\u4E39\u5C3C\u5C14\u6838\u5BF9\u6458\u8981\u4E2D\u7684\u4E00\u53E5\u8BDD", "Deal-team room: discuss one sentence with Daniel"], file: ["\u57FA\u91D1\u8D44\u6599\u5BA4\uFF1A\u6253\u5F00\u6848\u5377\uFF0C\u56DE\u770B\u521A\u624D\u7684\u6458\u8981", "Fund archive: open the case and revisit the brief"], ready: ["\u5408\u4F19\u4EBA\u529E\u516C\u5BA4\uFF1A\u544A\u8BC9\u739B\u62C9\uFF0C\u4F60\u51C6\u5907\u53BB\u6838\u5B9E\u4EC0\u4E48", "Partner office: tell Mara what you plan to verify"] }[prologueStep(j)];
}
var welcome = ["\u684C\u4E0A\u6446\u7740\u4E00\u5F20\u5199\u6709\u201CAva\u201D\u7684\u540D\u724C\uFF0C\u65C1\u8FB9\u662F\u8FD8\u6CA1\u62C6\u5F00\u7684\u7B14\u8BB0\u672C\u3002\u4F60\u521A\u52A0\u5165 Northline\uFF0C\u8D1F\u8D23\u7814\u7A76\u503C\u5F97\u6295\u8D44\u7684\u4F01\u4E1A\uFF1B\u8FD9\u5BB6\u516C\u53F8\u600E\u6837\u505A\u51B3\u5B9A\uFF0C\u4F60\u8FD8\u4E0D\u719F\u6089\u3002\n\n\u4FBF\u7B3A\u4E0A\u5199\u7740\uFF1A\u201C\u6B22\u8FCE\uFF0C\u827E\u5A03\u3002\u5B89\u987F\u597D\u4EE5\u540E\uFF0C\u6765\u6211\u7684\u529E\u516C\u5BA4\u804A\u804A\u3002\u4ECA\u5929\u5148\u4ECE\u4E00\u4EF6\u5C0F\u4E8B\u5F00\u59CB\u3002\u2014\u2014\u739B\u62C9\u201D", "A nameplate reading \u201CAva\u201D sits beside an unopened notebook. You have just joined Northline to research businesses the firm might invest in. You do not yet know how this team makes its decisions.\n\nA note reads: \u201CWelcome, Ava. Once you\u2019re settled, stop by my office. We\u2019ll start with one small thing today. \u2014Mara\u201D"];
var starterBrief = ["RelayOps \u4E3A\u8FDE\u9501\u95E8\u5E97\u63D0\u4F9B\u8FD0\u8425\u8F6F\u4EF6\u3002\u9879\u76EE\u7EC4\u6B63\u5728\u7814\u7A76\u662F\u5426\u6295\u8D44\u8FD9\u5BB6\u516C\u53F8\u3002\n\n\u4E39\u5C3C\u5C14\u5728\u6458\u8981\u65C1\u5199\u4E86\u4E00\u53E5\u81EA\u5DF1\u7684\u6982\u62EC\uFF0C\u53C8\u628A\u5B83\u5708\u4E86\u8D77\u6765\uFF1A\u201C\u5BA2\u6237\u5DF2\u7ECF\u4ED8\u6B3E\uFF0C\u56E0\u6B64\u4E1A\u52A1\u9A8C\u8BC1\u5DF2\u7ECF\u5B8C\u6210\u3002\u201D\n\n\u4E39\u5C3C\u5C14\u5728\u65C1\u8FB9\u5199\u4E86\u4E00\u4E2A\u95EE\u53F7\u3002\u5148\u4E0D\u7528\u8BB0\u91D1\u989D\uFF1B\u4F60\u4EEC\u8981\u8BA8\u8BBA\u7684\u662F\uFF0C\u8FD9\u53E5\u8BDD\u80FD\u4E0D\u80FD\u76F4\u63A5\u6210\u7ACB\u3002", "RelayOps makes operations software for retail chains. Your team is considering an investment.\n\nDaniel has written and circled his own interpretation in the margin: \u201CThe customer has paid, so business validation is complete.\u201D\n\nDaniel has pencilled a question mark beside it. Set the figures aside for now. Is that sentence enough to support its conclusion?"];
function prologueTopics(j, person) {
  const step = prologueStep(j);
  const topic = (id, label, reply, effects = []) => ({ id, label, reply, effects });
  if (person === "partner" && step === "role") return [topic("orientation-role", ["\u6211\u521A\u52A0\u5165\uFF0C\u4ECA\u5929\u5148\u4ECE\u4EC0\u4E48\u505A\u8D77\uFF1F", "I\u2019m new here. Where should I start?"], ["\u739B\u62C9\u628A\u4E00\u53E0\u6587\u4EF6\u79FB\u5230\u4E00\u65C1\u3002\u201C\u5148\u522B\u6025\u7740\u8BFB\u5B8C\u3002\u6211\u4EEC\u66FF\u57FA\u91D1\u5224\u65AD\u4E00\u5BB6\u516C\u53F8\u503C\u4E0D\u503C\u5F97\u6295\u94B1\uFF0C\u4F60\u7684\u5DE5\u4F5C\u662F\u628A\u4F9D\u636E\u5F04\u6E05\u695A\uFF0C\u4E0D\u662F\u66FF\u4EFB\u4F55\u4EBA\u4FDD\u8BC1\u6210\u529F\u3002\u201D\n\n\u201C\u9879\u76EE\u7EC4\u7684\u4E39\u5C3C\u5C14\u5728\u6574\u7406\u4E00\u5BB6\u8F6F\u4EF6\u516C\u53F8\u7684\u6750\u6599\u3002\u53BB\u8BA4\u8BC6\u4E00\u4E0B\u4ED6\uFF0C\u770B\u770B\u4ED6\u684C\u4E0A\u5708\u51FA\u7684\u90A3\u53E5\u8BDD\u3002\u5E26\u7740\u95EE\u9898\u56DE\u6765\u5C31\u884C\u3002\u201D", "Mara pushes a stack of files aside. \u201CNo need to read all of this yet. We decide whether a business merits the fund\u2019s money. Your job is to make the evidence clear, not guarantee success.\u201D\n\n\u201CDaniel is reviewing a software company in the deal-team room. Meet him and look at the sentence circled on his desk. Come back with a question.\u201D"], ["orientation-role"])];
  if (person === "analyst" && step === "check") return [
    topic("orientation-assume", ["\u65E2\u7136\u4ED8\u6B3E\u4E86\uFF0C\u5C31\u53EF\u4EE5\u8BA4\u4E3A\u5BA2\u6237\u6EE1\u610F\uFF1F", "If they paid, can we assume they are satisfied?"], ["\u4E39\u5C3C\u5C14\u6447\u5934\u3002\u201C\u4E5F\u53EF\u80FD\u53EA\u662F\u9884\u4ED8\u6B3E\u3002\u6211\u4E5F\u5DEE\u70B9\u628A\u4E24\u4EF6\u4E8B\u5F53\u6210\u4E00\u4EF6\u4E8B\u3002\u94B1\u5230\u4E86\uFF0C\u80FD\u8BC1\u660E\u6709\u4E00\u7B14\u4ED8\u6B3E\uFF1B\u8F6F\u4EF6\u597D\u4E0D\u597D\u7528\uFF0C\u8FD8\u5F97\u542C\u4F7F\u7528\u5B83\u7684\u4EBA\u600E\u4E48\u8BF4\u3002\u201D\n\n\u4ED6\u628A\u7B14\u9012\u7ED9\u4F60\u3002\u201C\u8BD5\u8BD5\u7ED9\u8FD9\u53E5\u8BDD\u7559\u4E00\u70B9\u4F59\u5730\uFF1F\u201D", "Daniel shakes his head. \u201CIt could be an advance. I nearly conflated those too. A payment establishes that money moved; whether the software works takes evidence from the people using it.\u201D\n\nHe offers his pencil. \u201CHow would you leave room for that uncertainty?\u201D"]),
    topic("orientation-check", ["\u4ED8\u6B3E\u662F\u4E00\u6761\u7EBF\u7D22\uFF0C\u4F7F\u7528\u60C5\u51B5\u8FD8\u9700\u8981\u6838\u5B9E", "Payment is a clue. Actual use still needs checking"], ["\u201C\u5BF9\u3002\u8FD9\u5C31\u662F\u6211\u4EEC\u8981\u505A\u7684\u3002\u201D\u4E39\u5C3C\u5C14\u5728\u6458\u8981\u65C1\u5199\u4E0B\u201C\u4F7F\u7528\u60C5\u51B5\u5F85\u6838\u5B9E\u201D\u3002\n\n\u201C\u8FD9\u4E0D\u662F\u8BF4\u516C\u53F8\u4E0D\u597D\uFF0C\u53EA\u662F\u522B\u8BA9\u4E00\u53E5\u8BDD\u66FF\u4F60\u4E0B\u7ED3\u8BBA\u3002\u6211\u628A\u6458\u8981\u7559\u8FDB\u4F60\u7684\u8D44\u6599\u5939\u3002\u53BB\u57FA\u91D1\u8D44\u6599\u5BA4\u56DE\u770B\u4E00\u4E0B\uFF1B\u4EE5\u540E\u627E\u5230\u7684\u65B0\u6750\u6599\uFF0C\u4E5F\u53EF\u4EE5\u5728\u90A3\u91CC\u67E5\u3002\u201D", "\u201CExactly.\u201D Daniel writes \u201CActual use still to verify\u201D beside the sentence.\n\n\u201CThat does not make it a bad company. We just shouldn\u2019t let a sentence decide for us. The brief is in your case file. Revisit it in the fund archive; that\u2019s also where you can look back at new evidence.\u201D"], ["orientation-check"])
  ];
  if (person === "partner" && step === "ready") return [topic("orientation-ready", ["\u6211\u60F3\u5148\u67E5\u6E05\uFF1A\u4ED8\u6B3E\u662F\u4E0D\u662F\u4EE3\u8868\u5BA2\u6237\u771F\u7684\u5728\u7528", "I want to check whether payment means the customer is using it"], ["\u201C\u8FD9\u662F\u4E00\u4E2A\u53EF\u4EE5\u5E26\u53BB\u73B0\u573A\u7684\u95EE\u9898\u3002\u201D\u739B\u62C9\u628A\u6765\u8BBF\u5B89\u6392\u63A8\u7ED9\u4F60\u3002\u201CRelayOps \u7684\u521B\u59CB\u4EBA\u9A6C\u7279\u5965\u4F1A\u63A5\u5F85\u4F60\u3002\u5148\u8BA9\u4ED6\u4ECB\u7ECD\u4E1A\u52A1\uFF0C\u518D\u770B\u5BA2\u6237\u5408\u540C\u3002\u4F60\u4E0D\u5FC5\u73B0\u5728\u5C31\u7ED9\u6295\u8D44\u5EFA\u8BAE\u3002\u201D\n\n\u201C\u4ECE\u4E2D\u592E\u63A5\u5F85\u533A\u4E0B\u65B9\u51FA\u53E3\u51FA\u53D1\u3002\u660E\u65E9\u8BA8\u8BBA\u524D\uFF0C\u56DE\u6765\u544A\u8BC9\u6211\u4F60\u770B\u89C1\u4E86\u4EC0\u4E48\u3001\u54EA\u4E9B\u8FD8\u4E0D\u786E\u5B9A\u3002\u6211\u4EEC\u4E00\u8D77\u628A\u4F60\u7684\u7B2C\u4E00\u4EFD\u5EFA\u8BAE\u8BB2\u6E05\u695A\u3002\u201D", "\u201CThat is a question you can take into the field.\u201D Mara slides over a visit arrangement. \u201CMateo, the founder of RelayOps, will meet you. Let him explain the business, then read the customer contract. You do not owe us a recommendation yet.\u201D\n\n\u201CLeave through the bottom exit in central reception. Before tomorrow\u2019s discussion, bring back what you saw and what remains uncertain. We\u2019ll work through your first recommendation together.\u201D"], ["orientation-ready", "project-accepted"])];
  return [topic("orientation-direction-" + step, ["\u6211\u4E0B\u4E00\u6B65\u53BB\u54EA\u91CC\uFF1F", "Where should I go next?"], prologueObjective(j))];
}

// src/headquarters.ts
var projects = [{ id: "relayops", title: ["RelayOps \xB7 \u6210\u957F\u8F6E\u5C3D\u8C03", "RelayOps \xB7 Growth investment"], company: "RelayOps", brief: ["\u8FD9\u662F\u4F60\u52A0\u5165\u56E2\u961F\u540E\u7684\u7B2C\u4E00\u4E2A\u9879\u76EE\u3002\u5148\u5728\u603B\u90E8\u548C\u540C\u4E8B\u4E00\u8D77\u8BFB\u4E00\u4EFD\u6458\u8981\uFF0C\u518D\u5E26\u7740\u5177\u4F53\u7684\u95EE\u9898\u53BB\u62DC\u8BBF\u516C\u53F8\u3002", "This is your first assignment with the team. Review a brief with your colleagues at headquarters, then visit the company with a specific question."], entry: "office" }];
var headquartersRooms = ["lobby", "study", "fund", "archive", "partnerroom", "meeting"];
function projectAccepted(j) {
  return !inPrologue(j) && (!!j.save.facts["project-accepted"] || !!j.save.facts.memo || !!j.save.facts.decision || !headquartersRooms.includes(j.scene));
}
function projectStatus(j) {
  return j.save.facts.decision && !j.chapterVersion ? ["\u6B64\u524D\u5DF2\u7ED3\u675F", "Previously closed"] : j.save.facts["case-archived"] ? ["\u5DF2\u5F52\u6863", "Archived"] : j.save.facts.decision ? ["\u5DF2\u63D0\u4EA4 \xB7 \u8DDF\u8FDB\u56DE\u97F3", "Submitted \xB7 Follow up"] : projectAccepted(j) ? ["\u5C3D\u8C03\u8FDB\u884C\u4E2D", "Diligence in progress"] : ["\u5F85\u63A5\u624B", "Ready to take on"];
}
function canArchive(j) {
  return !!j.save.facts.decision && ["echo-founder", "echo-finance", "echo-client"].every((k) => j.save.facts[k]);
}
var encounter = {
  partner: { context: ["\u7A97\u8FB9\u7684\u5973\u4EBA\u671D\u95E8\u53E3\u62DB\u624B\u3002\u201C\u827E\u5A03\uFF1F\u6211\u662F\u739B\u62C9\uFF0C\u5E26\u4F60\u719F\u6089\u9879\u76EE\u7684\u5408\u4F19\u4EBA\u3002\u8FDB\u6765\u5750\u3002\u201D", "The woman by the window waves you in. \u201CAva? I\u2019m Mara, the partner helping you settle into the team. Come in.\u201D"], action: ["\u548C\u739B\u62C9\u8BA8\u8BBA\u9879\u76EE", "Discuss the deal with Mara"], greeting: ["\u739B\u62C9\uFF0C\u6211\u4EEC\u6838\u5BF9\u4E00\u4E0B\u660E\u65E9\u9700\u8981\u8BB2\u6E05\u7684\u95EE\u9898\u3002", "Mara, let\u2019s review what we need to explain tomorrow."] },
  analyst: { context: ["\u62B1\u7740\u6750\u6599\u7684\u5E74\u8F7B\u4EBA\u4ECE\u684C\u8FB9\u62AC\u5934\u3002\u201C\u4F60\u5C31\u662F\u65B0\u6765\u7684\u827E\u5A03\u5427\uFF1F\u6211\u662F\u4E39\u5C3C\u5C14\uFF0C\u9879\u76EE\u7EC4\u7684\u5206\u6790\u5E08\u3002\u201D", "The young man holding a file looks up. \u201CYou must be Ava. I\u2019m Daniel, an analyst on the deal team.\u201D"], action: ["\u548C\u4E39\u5C3C\u5C14\u6838\u5BF9\u6750\u6599", "Review the files with Daniel"], greeting: ["\u4E39\u5C3C\u5C14\uFF0C\u4F60\u521A\u624D\u6807\u51FA\u7684\u7591\u70B9\u662F\u4EC0\u4E48\uFF1F", "Daniel, what caught your attention in the files?"] },
  founder: { context: ["\u767D\u677F\u524D\u7684\u7537\u4EBA\u5377\u7740\u8896\u5B50\u3002\u4ED6\u653E\u4E0B\u4EA4\u4ED8\u6392\u671F\uFF0C\u95EE\u4F60\u662F\u5426\u6765\u81EA Northline\u3002", "A man with rolled sleeves puts down a delivery schedule and asks whether you are from Northline."], action: ["\u4E0E\u9A6C\u7279\u5965\u8C08\u9879\u76EE\u8FDB\u5C55", "Catch up with Mateo"], greeting: ["\u9A6C\u7279\u5965\uFF0C\u6295\u59D4\u4F1A\u4E4B\u524D\u6709\u51E0\u5904\u60C5\u51B5\u9700\u8981\u5F53\u9762\u6838\u5B9E\u3002", "Mateo, I need to verify a few things before the committee."] },
  finance: { context: ["\u8D22\u52A1\u8D1F\u8D23\u4EBA\u6838\u5BF9\u4F60\u7684\u6765\u8BBF\u6388\u6743\uFF0C\u628A\u4ED8\u6B3E\u8868\u8F6C\u5411\u4F60\u3002", "The finance lead checks your visit authorization and turns the payment schedule toward you."], action: ["\u8BF4\u660E\u6838\u67E5\u8303\u56F4", "Explain the review"], greeting: ["\u4F60\u597D\uFF0C\u6211\u662F Northline \u7684\u827E\u5A03\uFF0C\u6765\u6838\u5BF9\u9879\u76EE\u8D22\u52A1\u3002", "Hello, I\u2019m Ava from Northline, here to review the project finances."] },
  client: { context: ["\u8FD0\u8425\u8D1F\u8D23\u4EBA\u7ED3\u675F\u624B\u91CC\u7684\u5DE5\u4F5C\uFF0C\u7B49\u4F60\u8BF4\u660E\u8FD9\u6B21\u62DC\u8BBF\u7684\u76EE\u7684\u3002", "The operations lead finishes her task and waits to hear what you need from this visit."], action: ["\u8BF4\u660E\u6765\u8BBF\u76EE\u7684", "Introduce your visit"], greeting: ["\u4F60\u597D\uFF0C\u6211\u60F3\u4E86\u89E3 RelayOps \u5728\u73B0\u573A\u7684\u5B9E\u9645\u4F7F\u7528\u60C5\u51B5\u3002", "Hello, I\u2019d like to understand how RelayOps works on site."] }
};

// src/content.ts
var tx = (p, l) => p[l === "zh" ? 0 : 1];
var recordsBase = [
  { id: "memo", title: ["\u6700\u540E\u4E00\u7248\u6295\u59D4\u4F1A\u6458\u8981", "Investment committee brief"], source: ["\u8FDC\u821F\u8D44\u672C \xB7 \u9879\u76EE\u7EC4 \xB7 \u5468\u4E94 16:10", "Far Shore Capital \xB7 Friday 16:10"], tag: ["\u6295\u8D44\u903B\u8F91", "THESIS"], summary: ["\u5927\u5BA2\u6237\u5408\u540C 1,200 \u4E07\u5143\uFF0C\u9996\u6B3E 400 \u4E07\u5143\u3002", "Anchor contract: \xA512m. First payment: \xA54m."], body: ["\u6816\u4E91\u4E3A\u8FDE\u9501\u95E8\u5E97\u63D0\u4F9B\u8BA2\u8D27\u4E0E\u7ECF\u8425\u8F6F\u4EF6\u3002\u62DF\u6295\u8D44 3,000 \u4E07\u5143\uFF0C\u6295\u524D\u4F30\u503C 1.5 \u4EBF\u5143\u3002\n\n\u672C\u8F6E\u6838\u5FC3\u8BBA\u636E\uFF1A\u8FDC\u79BE\u8FDE\u9501 32 \u5BB6\u95E8\u5E97\u5408\u540C\u989D 1,200 \u4E07\u5143\uFF1B\u9996\u7B14 400 \u4E07\u5143\u5DF2\u5230\u8D26\uFF1B\u8FD9\u4E00\u6848\u4F8B\u53EF\u4EE5\u590D\u5236\u5230\u66F4\u591A\u8FDE\u9501\u5BA2\u6237\u3002\n\n\u9644\u4EF6\u4E2D\u7684\u4ED8\u6B3E\u65B9\u5374\u5199\u7740\u300C\u6865\u77F3\u5546\u52A1\u300D\uFF0C\u4E0D\u662F\u8FDC\u79BE\u3002\u5206\u6790\u5E08\u5728\u9875\u8FB9\u5199\u4E86\u4E00\u884C\uFF1A\u94B1\u5230\u8D26\u4E86\uFF0C\u4F46\u8C01\u5728\u627F\u62C5\u8D2D\u4E70\u4E49\u52A1\uFF1F\n\n\u4F60\u7684\u5DE5\u4F5C\uFF1A\u6838\u5B9E\u5BA2\u6237\u4F7F\u7528\u3001\u6536\u5165\u8D28\u91CF\u3001\u878D\u8D44\u7528\u9014\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u652F\u6301\u539F\u4EF7\u683C\u4E0E\u6761\u4EF6\u3002", "Qiyun sells ordering and operations software to retail chains. Proposed investment: \xA530m at a \xA5150m pre-money valuation.\n\nThe thesis: a \xA512m contract covering 32 Yuanhe stores; \xA54m received; a repeatable model for other chains.\n\nThe attachment names BridgeStone Commerce as payer, not Yuanhe. An analyst asks: money arrived, but who bears the obligation to buy?\n\nVerify actual use, revenue quality and cash needs before supporting the price and terms."] },
  { id: "payment", title: ["\u9996\u6B3E\u94F6\u884C\u56DE\u5355", "First-payment receipt"], source: ["\u516C\u53F8\u6388\u6743\u8D44\u6599\u5BA4 \xB7 \u94F6\u884C\u56DE\u5355", "Authorized data room \xB7 bank receipt"], tag: ["\u56DE\u6B3E", "PAYMENT"], summary: ["\u6865\u77F3\u4ED8\u6B3E 400 \u4E07\u5143\uFF0C\u9644\u8A00\u4E3A\u9879\u76EE\u9884\u4ED8\u6B3E\u3002", "BridgeStone paid \xA54m as a project advance."], body: ["\u6536\u6B3E\u4EBA\uFF1A\u6816\u4E91\u79D1\u6280\u3002\u4ED8\u6B3E\u4EBA\uFF1A\u6865\u77F3\u5546\u52A1\u3002\u91D1\u989D\uFF1A400 \u4E07\u5143\u3002\u9644\u8A00\uFF1A\u8FDC\u79BE\u95E8\u5E97\u6570\u5B57\u5316\u9879\u76EE\u9884\u4ED8\u6B3E\u3002\n\n\u94F6\u884C\u56DE\u5355\u8BC1\u660E\u5230\u8D26\u65F6\u95F4\u4E0E\u91D1\u989D\uFF0C\u4E0D\u8BC1\u660E\u5BA2\u6237\u6700\u7EC8\u9A8C\u6536\uFF0C\u4E5F\u4E0D\u8BF4\u660E\u6B3E\u9879\u662F\u5426\u53EF\u9000\u3002\u56DE\u5355\u7F16\u53F7\u4E0E\u8865\u5145\u534F\u8BAE\u4E0A\u7684\u9879\u76EE\u7F16\u53F7\u4E00\u81F4\u3002\n\n\u8D22\u52A1\u8BF4\u660E\uFF1A\u6865\u77F3\u662F\u6E20\u9053\u4F19\u4F34\uFF0C\u4EE3\u5BA2\u6237\u652F\u4ED8\u3002\u9700\u8FDB\u4E00\u6B65\u6838\u5BF9\u6E20\u9053\u5B89\u6392\u4E0E\u9000\u6B3E\u6761\u6B3E\u3002", "Payee: Qiyun. Payer: BridgeStone Commerce. Amount: \xA54m. Note: advance for Yuanhe store digitization.\n\nThe receipt proves cash arrived. It does not establish final acceptance or whether it is refundable. Its project code matches the supplemental agreement.\n\nFinance says BridgeStone is a channel partner paying on the customer\u2019s behalf. Check the channel arrangement and refund provisions."] },
  { id: "contract", title: ["\u8FDC\u79BE\u4E3B\u5408\u540C", "Yuanhe master contract"], source: ["\u516C\u53F8\u524D\u53F0\u9879\u76EE\u53F0 \xB7 \u53CC\u65B9\u7B7E\u7AE0\u526F\u672C", "Project desk \xB7 signed copy"], tag: ["\u5408\u540C", "CONTRACT"], summary: ["1,200 \u4E07\u5143\u4E2D\uFF0C\u8F6F\u4EF6\u8BA2\u9605 720 \u4E07\u3001\u5B9E\u65BD 480 \u4E07\u3002", "\xA57.2m subscription plus \xA54.8m implementation."], body: ["\u603B\u989D 1,200 \u4E07\u5143\uFF1A\u4E09\u5E74\u8F6F\u4EF6\u8BA2\u9605 720 \u4E07\u5143\uFF0C\u95E8\u5E97\u5B9E\u65BD\u4E0E\u57F9\u8BAD 480 \u4E07\u5143\u3002\u8986\u76D6 32 \u5BB6\u95E8\u5E97\uFF0C\u5206\u6279\u9A8C\u6536\u3002\n\n\u9644\u4EF6\u4E00\uFF1A\u5148\u4E0A\u7EBF 12 \u5BB6\uFF0C\u5269\u4F59 20 \u5BB6\u4EE5\u7B2C\u4E8C\u9636\u6BB5\u9A8C\u6536\u4E3A\u524D\u63D0\u3002\n\n\u8BA2\u9605\u5408\u540C\u603B\u989D\u3001\u5E74\u5EA6\u7ECF\u5E38\u6027\u6536\u5165\u548C\u5F53\u671F\u786E\u8BA4\u6536\u5165\u662F\u4E0D\u540C\u53E3\u5F84\u3002\u4E0D\u80FD\u628A\u4E09\u5E74\u5408\u540C\u603B\u989D\u5168\u90E8\u89C6\u4E3A\u4E00\u5E74\u53EF\u91CD\u590D\u7684\u8F6F\u4EF6\u6536\u5165\u3002\n\n\u7B7E\u4E86\u5408\u540C\u662F\u771F\u5B9E\u7684\uFF0C32 \u5BB6\u95E8\u5E97\u5168\u90E8\u7A33\u5B9A\u4F7F\u7528\u4ECD\u9700\u8981\u73B0\u573A\u8BC1\u636E\u3002", "Total: \xA512m, comprising \xA57.2m for three years of subscription and \xA54.8m for implementation and training. Thirty-two stores, accepted in phases.\n\nSchedule 1: twelve stores first; twenty more depend on phase-two acceptance.\n\nTotal contract value, annual recurring revenue and recognized revenue are different measures. A three-year contract is not one year of recurring software revenue.\n\nThe contract is real. Full deployment still requires operational evidence."] },
  { id: "rollout", title: ["\u95E8\u5E97\u4E0A\u7EBF\u6E05\u5355", "Store deployment list"], source: ["\u8FDC\u79BE\u8FD0\u8425\u73B0\u573A \xB7 \u672C\u5468\u503C\u73ED\u8868", "Yuanhe operations \xB7 this week"], tag: ["\u4F7F\u7528", "USAGE"], summary: ["32 \u5BB6\u7B7E\u7EA6\uFF0C12 \u5BB6\u4E0A\u7EBF\uFF0C6 \u5BB6\u6301\u7EED\u4ED8\u8D39\u4F7F\u7528\u3002", "32 contracted, 12 live, 6 established paid users."], body: ["\u7B7E\u7EA6\u95E8\u5E97 32 \u5BB6\u3002\u6B63\u5F0F\u4E0A\u7EBF 12 \u5BB6\uFF1B\u5176\u4E2D 6 \u5BB6\u4E3A\u6B64\u524D\u8BD5\u70B9\u8F6C\u4ED8\u8D39\uFF0C\u53E6\u5916 6 \u5BB6\u8FDB\u5165\u78E8\u5408\u671F\u3002\u5176\u4F59 20 \u5BB6\u4ECD\u6392\u671F\u3002\n\n\u503C\u73ED\u8BB0\u5F55\uFF1A\u6570\u636E\u5BFC\u5165\u6BD4\u8BA1\u5212\u6162\uFF0C\u5458\u5DE5\u4ECD\u7528\u65E7\u8868\u683C\u4EA4\u53C9\u68C0\u67E5\u3002\u4E24\u540D\u9A7B\u573A\u5B9E\u65BD\u4EBA\u5458\u4E00\u5468\u672A\u56DE\u516C\u53F8\u3002\n\n\u8FD9\u4E0D\u662F\u300C\u6CA1\u6709\u5BA2\u6237\u300D\uFF0C\u4F46\u4E5F\u4E0D\u662F\u300C32 \u5BB6\u5DF2\u7ECF\u9A8C\u8BC1\u300D\u3002\u5BA2\u6237\u613F\u610F\u7EE7\u7EED\u8BD5\uFF0C\u524D\u63D0\u662F\u89E3\u51B3\u4E0E\u65E7\u6536\u94F6\u7CFB\u7EDF\u7684\u6570\u636E\u8854\u63A5\u3002", "32 stores contracted. Twelve are live: six previous pilots now paying, six in stabilization. Twenty remain scheduled.\n\nData import is behind plan. Staff cross-check against old spreadsheets. Two implementation engineers have spent the week on site.\n\nThere are real customers, but not 32 proven deployments. The customer wants to continue if integration with its legacy tills improves."] },
  { id: "acceptance", title: ["\u5BA2\u6237\u9A8C\u6536\u610F\u89C1", "Customer acceptance note"], source: ["\u8FDC\u79BE\u8FD0\u8425\u7ECF\u7406 \xB7 \u53EF\u4F9B\u5C3D\u8C03\u5F15\u7528", "Operations manager \xB7 authorized for diligence"], tag: ["\u5BA2\u6237\u610F\u89C1", "CUSTOMER"], summary: ["\u91C7\u8D2D\u8BA4\u53EF\u65B9\u5411\uFF0C\u8FD0\u8425\u5C1A\u672A\u7B7E\u7F72\u5168\u91CF\u9A8C\u6536\u3002", "Procurement supports it; full acceptance is unsigned."], body: ["\u300C\u516D\u5BB6\u8001\u5E97\u8BA2\u8D27\u5DEE\u9519\u660E\u663E\u5C11\u4E86\uFF0C\u8FD9\u90E8\u5206\u4EF7\u503C\u6211\u4EEC\u8BA4\u53EF\u3002\u4F46\u6269\u5230\u5269\u4E0B\u4E8C\u5341\u5BB6\uFF0C\u6211\u9700\u8981\u770B\u5230\u7A33\u5B9A\u7684\u6570\u636E\u540C\u6B65\u3002\u300D\n\n\u91C7\u8D2D\u4E0E\u4E1A\u52A1\u56E2\u961F\u540C\u610F\u7EE7\u7EED\u5408\u4F5C\uFF0C\u4E0D\u7B49\u4E8E\u516C\u53F8\u5DF2\u7ECF\u5B8C\u6210\u7B2C\u4E8C\u9636\u6BB5\u9A8C\u6536\u3002\u8FD0\u8425\u8D1F\u8D23\u4EBA\u6CA1\u6709\u627F\u8BFA\u653E\u5F03\u9000\u6B3E\u6743\u3002\n\n\u5BA2\u6237\u5141\u8BB8\u4F60\u5411\u6295\u59D4\u4F1A\u5F15\u7528\u8FD9\u4EFD\u8BF4\u660E\uFF1B\u65E0\u9700\u79C1\u81EA\u4F20\u64AD\u5BA2\u6237\u5185\u90E8\u660E\u7EC6\u3002", "\u201COrdering errors fell in the six established stores. We value that. Before expanding to twenty more, I need reliable data synchronization.\u201D\n\nWillingness to continue is not phase-two acceptance. Operations has not waived refund rights.\n\nThe manager authorizes this statement for the committee; private customer records need not circulate."] },
  { id: "appendix", title: ["\u9879\u76EE\u8865\u5145\u534F\u8BAE", "Supplemental agreement"], source: ["\u516C\u53F8\u6388\u6743\u8D44\u6599\u5BA4 \xB7 \u7B2C\u56DB\u9875\u9644\u4EF6", "Authorized data room \xB7 appendix four"], tag: ["\u9000\u6B3E\u6761\u4EF6", "REFUND"], summary: ["\u7B2C\u4E8C\u9636\u6BB5\u672A\u901A\u8FC7\uFF0C\u9884\u4ED8\u6B3E\u5269\u4F59\u90E8\u5206\u53EF\u9000\u3002", "Unaccepted work leaves a refundable advance."], body: ["\u7B2C\u4E8C\u9636\u6BB5\u672A\u5728\u7EA6\u5B9A\u65E5\u671F\u901A\u8FC7\u9A8C\u6536\uFF0C\u5BA2\u6237\u53EF\u7EC8\u6B62\u672A\u5B9E\u65BD\u95E8\u5E97\u90E8\u5206\u3002\u9879\u76EE\u9884\u4ED8\u6B3E\u6263\u9664\u5DF2\u9A8C\u6536\u3001\u5E94\u4ED8\u7684\u670D\u52A1\u540E\uFF0C\u4F59\u989D\u6309\u7EA6\u5B9A\u9000\u56DE\u3002\u6E20\u9053\u65B9\u6536\u5230\u9000\u6B3E\u540E\u4E0E\u5BA2\u6237\u7ED3\u7B97\u3002\n\n400 \u4E07\u5143\u5230\u8D26\u662F\u771F\u5B9E\u4E8B\u5B9E\uFF0C\u4F46\u5176\u53EF\u81EA\u7531\u4F7F\u7528\u53CA\u6700\u7EC8\u7559\u5B58\u7A0B\u5EA6\u53D7\u5408\u540C\u5C65\u884C\u5F71\u54CD\u3002\u4E0D\u80FD\u76F4\u63A5\u63A8\u65AD\u516C\u53F8\u9020\u5047\uFF1B\u9700\u8981\u8FFD\u95EE\u4E3A\u4F55\u6295\u59D4\u4F1A\u6458\u8981\u6CA1\u6709\u8BF4\u660E\u8FD9\u4E00\u6761\u4EF6\u3002", "If phase two misses acceptance, the customer may terminate the undeployed portion. After accepted services are deducted, the remaining advance is refundable under the agreement. The channel settles with the customer.\n\nThe \xA54m is real cash, but its ultimate retention depends on performance. This alone does not prove fraud. Ask why the committee brief omitted this condition."] },
  { id: "cash", title: ["\u672A\u6765\u56DB\u5468\u4ED8\u6B3E\u6392\u671F", "Four-week payment schedule"], source: ["\u8D22\u52A1\u6388\u6743\u5DE5\u4F5C\u53F0 \xB7 \u5468\u4E94 17:05", "Finance workstation \xB7 Friday 17:05"], tag: ["\u73B0\u91D1", "CASH"], summary: ["\u53EF\u7528\u8D44\u91D1 87 \u4E07\uFF0C\u56DB\u5468\u521A\u6027\u652F\u51FA 230 \u4E07\u3002", "\xA50.87m available against \xA52.3m due."], body: ["\u8D26\u9762\u8D27\u5E01\u8D44\u91D1\u5E76\u4E0D\u5168\u90E8\u53EF\u7528\u3002\u6263\u9664\u53D7\u9650\u4FDD\u8BC1\u91D1\u540E\uFF0C\u53EF\u7528\u4F59\u989D 87 \u4E07\u5143\u3002\u672A\u6765\u56DB\u5468\u5DE5\u8D44\u3001\u7A0E\u8D39\u53CA\u4F9B\u5E94\u5546\u5230\u671F\u6B3E\u5408\u8BA1 230 \u4E07\u5143\u3002\n\n\u8868\u4E2D\u5C1A\u672A\u8BA1\u5165\u53EF\u80FD\u7684\u5BA2\u6237\u9000\u6B3E\u3002\u516C\u53F8\u6B63\u5728\u4E89\u53D6\u4F9B\u5E94\u5546\u5C55\u671F\uFF0C\u4F46\u6CA1\u6709\u5DF2\u7B7E\u7F72\u7684\u786E\u8BA4\u3002\n\n\u8FD9\u8BC1\u660E\u8FD1\u671F\u8D44\u91D1\u7F3A\u53E3\uFF0C\u9700\u8981\u660E\u786E\u878D\u8D44\u5230\u8D26\u524D\u7684\u5E94\u5BF9\u3002\u5B83\u4E0D\u80FD\u5355\u72EC\u8BC1\u660E\u4EA7\u54C1\u65E0\u4EF7\u503C\u3002", "After restricted deposits, \xA50.87m is available. Payroll, taxes and supplier payments total \xA52.3m over four weeks.\n\nPotential customer refunds are excluded. Supplier extensions are being discussed, but none is signed.\n\nThere is a near-term cash gap requiring a credible response before funding. This does not, by itself, invalidate the product."] },
  { id: "forecast", title: ["\u878D\u8D44\u7528\u9014\u4E0E\u73B0\u91D1\u9884\u6D4B", "Use of funds and cash forecast"], source: ["\u521B\u59CB\u4EBA\u5171\u4EAB\u8D44\u6599 \xB7 \u7248\u672C 7", "Founder\u2019s shared materials \xB7 version 7"], tag: ["\u8D44\u91D1\u7528\u9014", "USE OF FUNDS"], summary: ["\u9884\u7B97\u5199\u7740\u6269\u5F20\uFF0C\u9884\u6D4B\u4F9D\u8D56\u672C\u6708\u5E95\u878D\u8D44\u5230\u8D26\u3002", "Expansion plan assumes funding closes this month."], body: ["\u5C55\u793A\u9875\uFF1A\u672C\u8F6E\u8D44\u91D1\u7528\u4E8E\u7814\u53D1\u548C\u5E02\u573A\u62D3\u5C55\u3002\n\n\u5E95\u5C42\u9884\u6D4B\uFF1A\u878D\u8D44\u5148\u8986\u76D6\u65E7\u6709\u4ED8\u6B3E\u4E49\u52A1\uFF0C\u518D\u589E\u52A0\u5B9E\u65BD\u4EBA\u5458\uFF1B\u82E5\u6708\u5E95\u672A\u5230\u8D26\uFF0C\u4E0B\u6708\u9700\u63A8\u8FDF\u90E8\u5206\u4ED8\u6B3E\u3002\n\n\u7BA1\u7406\u5C42\u6309 32 \u5BB6\u95E8\u5E97\u6536\u5165\u6D4B\u7B97\u62DB\u8058\u89C4\u6A21\uFF0C\u5374\u6CA1\u6709\u628A\u7B2C\u4E8C\u9636\u6BB5\u9A8C\u6536\u5EF6\u8BEF\u4F5C\u4E3A\u538B\u529B\u60C5\u5883\u3002\n\n\u5E94\u5C06\u57FA\u7840\u507F\u4ED8\u3001\u5C65\u7EA6\u6295\u5165\u548C\u65B0\u589E\u6269\u5F20\u5206\u522B\u5217\u660E\u3002\u5206\u671F\u4EA4\u5272\u82E5\u9996\u671F\u592A\u5C11\uFF0C\u4E5F\u53EF\u80FD\u4F7F\u5C65\u7EA6\u6761\u4EF6\u6C38\u8FDC\u65E0\u6CD5\u5B8C\u6210\u3002", "Slide: proceeds fund R&D and expansion.\n\nUnderlying forecast: first cover existing obligations, then add implementation staff. Without month-end funding, payments slip next month.\n\nHiring assumes revenue from all 32 stores, without an acceptance-delay stress case.\n\nSeparate existing obligations, delivery investment and expansion. An undersized first tranche could make later milestones impossible."] },
  { id: "reference", title: ["\u516D\u5BB6\u8BD5\u70B9\u590D\u8D2D\u8BB0\u5F55", "Six-store renewal record"], source: ["\u5BA2\u6237\u6388\u6743\u6837\u672C \xB7 \u5DF2\u8131\u654F", "Authorized customer sample \xB7 anonymized"], tag: ["\u4EA7\u54C1\u4EF7\u503C", "PRODUCT VALUE"], summary: ["\u516D\u5BB6\u8FDE\u7EED\u7EED\u8D39\uFF0C\u4F7F\u7528\u4EF7\u503C\u6709\u72EC\u7ACB\u8BC1\u636E\u3002", "Six stores renewed; value has independent support."], body: ["\u516D\u5BB6\u8BD5\u70B9\u95E8\u5E97\u8FDE\u7EED\u4E24\u4E2A\u5468\u671F\u7EED\u8D39\uFF0C\u5747\u6709\u5BA2\u6237\u76F4\u63A5\u652F\u4ED8\u4E0E\u5B9E\u9645\u4F7F\u7528\u8BB0\u5F55\u3002\n\n\u8FD0\u8425\u53CD\u9988\uFF1A\u8BA2\u8D27\u5DEE\u9519\u51CF\u5C11\uFF0C\u5E97\u957F\u613F\u610F\u7EE7\u7EED\u4F7F\u7528\u3002\u6837\u672C\u6765\u81EA\u65E9\u671F\u914D\u5408\u7A0B\u5EA6\u8F83\u9AD8\u7684\u95E8\u5E97\uFF0C\u4E0D\u80FD\u673A\u68B0\u5916\u63A8\u5230\u6240\u6709\u95E8\u5E97\u3002\n\n\u8FD9\u9879\u8BC1\u636E\u652F\u6301\u4EA7\u54C1\u5B58\u5728\u771F\u5B9E\u4EF7\u503C\uFF0C\u4E5F\u89E3\u91CA\u4E86\u4E3A\u4EC0\u4E48\u6682\u505C\u6295\u8D44\u4ECD\u6709\u673A\u4F1A\u6210\u672C\u3002", "Six pilot stores renewed for two consecutive periods, with direct customer payments and usage records.\n\nManagers report fewer ordering errors and want to continue. These were cooperative early adopters; results cannot simply be extrapolated to every store.\n\nThis supports genuine product value and explains the opportunity cost of walking away."] },
  { id: "channel", title: ["\u6E20\u9053\u670D\u52A1\u5B89\u6392", "Channel service arrangement"], source: ["\u6388\u6743\u8D44\u6599\u5BA4 \xB7 \u6E20\u9053\u8865\u5145\u8BF4\u660E", "Authorized data room \xB7 channel disclosure"], tag: ["\u6E20\u9053", "CHANNEL"], summary: ["\u6865\u77F3\u6536\u53D6\u670D\u52A1\u8D39\uFF0C\u4EE3\u4ED8\u4E0D\u7B49\u4E8E\u9020\u5047\u3002", "BridgeStone earns fees; third-party payment is not proof of fraud."], body: ["\u6865\u77F3\u8D1F\u8D23\u5F15\u8350\u3001\u5B9E\u65BD\u534F\u8C03\u4E0E\u4EE3\u7ED3\u7B97\uFF0C\u5E76\u6309\u5408\u540C\u6536\u53D6\u670D\u52A1\u8D39\u3002\u80A1\u6743\u767B\u8BB0\u672A\u663E\u793A\u4E0E\u6816\u4E91\u63A7\u80A1\u80A1\u4E1C\u91CD\u5408\u3002\n\n\u672C\u6B21\u6838\u9A8C\u672A\u53D1\u73B0\u8D44\u91D1\u4ECE\u6816\u4E91\u8F6C\u51FA\u518D\u8F6C\u56DE\u7684\u8BC1\u636E\u3002\u4F46\u8FD9\u4E0D\u80FD\u514D\u9664\u5BF9\u9000\u6B3E\u6761\u6B3E\u3001\u51C0\u6536\u5165\u548C\u6E20\u9053\u4F9D\u8D56\u7684\u5206\u6790\u3002\n\n\u5206\u6790\u5E08\u6B64\u524D\u628A\u300C\u7B2C\u4E09\u65B9\u4ED8\u6B3E\u300D\u6807\u6210\u300C\u7591\u4F3C\u5FAA\u73AF\u56DE\u6B3E\u300D\uFF1B\u9700\u8981\u66F4\u6B63\u8FD9\u4E00\u8FC7\u5EA6\u5224\u65AD\u3002", "BridgeStone introduces clients, coordinates implementation and handles settlement for a contractual fee. The disclosed ownership does not overlap with Qiyun\u2019s controlling shareholder.\n\nThis review found no evidence of Qiyun sending the same money out and back. Refund terms, net revenue and channel dependence still matter.\n\nThe analyst\u2019s \u201Cpossible circular payment\u201D label goes beyond the evidence and should be corrected."] }
];
var contextTerms = [
  ["\u9996\u671F 1,200 \u4E07", "\u9996\u671F 480 \u4E07\u7F8E\u5143"],
  ["\u5269\u4F59 1,800 \u4E07", "\u5269\u4F59 720 \u4E07\u7F8E\u5143"],
  ["\u6295\u524D\u4F30\u503C\u8C03\u5230 1.2 \u4EBF\uFF0C3,000 \u4E07\u4E00\u6B21\u4EA4\u5272", "\u6295\u524D\u4F30\u503C\u8C03\u5230 4,800 \u4E07\u7F8E\u5143\uFF0C1,200 \u4E07\u7F8E\u5143\u4E00\u6B21\u4EA4\u5272"],
  ["\u201C\xA512m first", "\u201C$4.8m first"],
  ["remaining \xA518m", "remaining $7.2m"],
  ["\u201C\xA5120m pre-money, \xA530m at closing", "\u201C$48m pre-money, $12m at closing"],
  ["\u8FDC\u821F\u8D44\u672C", "\u5317\u7EBF\u8D44\u672C"],
  ["\u6816\u4E91\u79D1\u6280", "RelayOps"],
  ["\u6816\u4E91", "RelayOps"],
  ["\u8FDC\u79BE", "Harbor & Pine"],
  ["\u6865\u77F3\u5546\u52A1", "BridgeStone Commerce"],
  ["\u6865\u77F3", "BridgeStone"],
  ["3,000 \u4E07\u5143", "1,200 \u4E07\u7F8E\u5143"],
  ["1.5 \u4EBF\u5143", "6,000 \u4E07\u7F8E\u5143"],
  ["1,200 \u4E07\u5143", "120 \u4E07\u7F8E\u5143"],
  ["720 \u4E07\u5143", "72 \u4E07\u7F8E\u5143"],
  ["480 \u4E07\u5143", "48 \u4E07\u7F8E\u5143"],
  ["400 \u4E07\u5143", "40 \u4E07\u7F8E\u5143"],
  ["87 \u4E07\u5143", "8.7 \u4E07\u7F8E\u5143"],
  ["230 \u4E07\u5143", "23 \u4E07\u7F8E\u5143"],
  ["\u9648\u6BD3", "\u739B\u62C9"],
  ["\u6797\u6F88", "\u4E39\u5C3C\u5C14"],
  ["\u8BB8\u8861", "\u9A6C\u7279\u5965"],
  ["\u59DC\u5C9A", "\u666E\u91CC\u5A05"],
  ["\u7F57\u73CA", "\u4E54\u4E39"],
  ["\u5468\u5B81", "\u827E\u5A03"],
  ["Chen Yu", "Mara"],
  ["Lin Che", "Daniel"],
  ["Xu Heng", "Mateo"],
  ["Jiang Lan", "Priya"],
  ["Luo Shan", "Jordan"],
  ["Zhou Ning", "Ava"],
  ["Far Shore Capital", "Northline Capital"],
  ["Far Shore", "Northline"],
  ["Qiyun", "RelayOps"],
  ["Yuanhe", "Harbor & Pine"],
  ["\xA530m", "$12m"],
  ["\xA5150m", "$60m"],
  ["\xA512m", "$1.2m"],
  ["\xA57.2m", "$720k"],
  ["\xA54.8m", "$480k"],
  ["\xA54m", "$400k"],
  ["\xA50.87m", "$87k"],
  ["\xA52.3m", "$230k"]
];
var localizeContext = (value) => contextTerms.reduce((text, [from, to]) => text.replaceAll(from, to), value);
var mapPair = (pair) => [localizeContext(pair[0]), localizeContext(pair[1])];
var records = recordsBase.map((record) => ({ ...record, title: mapPair(record.title), source: mapPair(record.source), summary: mapPair(record.summary), body: mapPair(record.body) }));
var people = {
  partner: { name: ["\u739B\u62C9\xB7\u57C3\u91CC\u68EE", "Mara Ellison"], unknown: ["\u7A97\u8FB9\u7684\u5408\u4F19\u4EBA", "Partner by the window"], role: ["\u5317\u7EBF\u8D44\u672C \xB7 \u5408\u4F19\u4EBA", "Northline \xB7 Partner"], portrait: 0, row: 0, intro: ["\u739B\u62C9\u5408\u4E0A\u7B14\u8BB0\u672C\uFF0C\u7ED9\u4F60\u8BA9\u51FA\u6905\u5B50\u3002\u201C\u7B2C\u4E00\u5468\u603B\u6709\u592A\u591A\u540D\u5B57\u8981\u8BB0\u3002\u5148\u4E0D\u7528\u6025\u7740\u8BC1\u660E\u81EA\u5DF1\u3002\u4F60\u4EE5\u524D\u505A\u8FC7\u7814\u7A76\uFF0C\u4F46\u6211\u4EEC\u8FD9\u8FB9\u7684\u9879\u76EE\u3001\u540C\u4E8B\u548C\u505A\u4E8B\u65B9\u5F0F\uFF0C\u90FD\u53EF\u4EE5\u6162\u6162\u719F\u6089\u3002\u201D", "Mara closes her notebook and pulls out a chair. \u201CA first week brings too many names. No need to prove yourself all at once. You know how to research; our cases, colleagues and ways of working can come gradually.\u201D"] },
  analyst: { name: ["\u4E39\u5C3C\u5C14\xB7\u91D1", "Daniel Kim"], unknown: ["\u62B1\u7740\u6750\u6599\u7684\u5206\u6790\u5E08", "Analyst holding a file"], role: ["\u5317\u7EBF\u8D44\u672C \xB7 \u5206\u6790\u5E08", "Northline \xB7 Analyst"], portrait: 1, row: 1, intro: ["\u4E39\u5C3C\u5C14\u628A\u53E6\u4E00\u5F20\u6905\u5B50\u4E0A\u7684\u6587\u4EF6\u6536\u8D77\u6765\u3002\u201C\u6B22\u8FCE\u52A0\u5165\u3002\u6211\u4E5F\u8BB0\u5F97\u7B2C\u4E00\u5929\u627E\u4E0D\u5230\u4F1A\u8BAE\u5BA4\u3002\u8FD9\u91CC\u662F\u9879\u76EE\u7EC4\uFF0C\u6709\u95EE\u9898\u5C31\u8FC7\u6765\u95EE\u3002\u684C\u4E0A\u90A3\u4EFD\u6458\u8981\u5148\u770B\u5708\u51FA\u7684\u53E5\u5B50\u5C31\u597D\uFF0C\u6211\u4EEC\u4E00\u8D77\u60F3\u60F3\u5B83\u6709\u6CA1\u6709\u8BF4\u5F97\u592A\u6EE1\u3002\u201D", "Daniel clears a chair. \u201CWelcome aboard. I remember not finding the meeting room on my first day. This is the deal-team room; stop by whenever you need help. Start with the circled sentence on the desk. We can work out together whether it claims too much.\u201D"] },
  founder: { name: ["\u9A6C\u7279\u5965\xB7\u963F\u5C14\u74E6\u96F7\u65AF", "Mateo Alvarez"], unknown: ["\u5377\u8D77\u8896\u5B50\u7684\u8D1F\u8D23\u4EBA", "Executive with rolled sleeves"], role: ["RelayOps \xB7 \u521B\u59CB\u4EBA", "RelayOps \xB7 Founder"], portrait: 2, row: 2, intro: ["\u5377\u7740\u8896\u5B50\u7684\u7537\u4EBA\u4ECE\u767D\u677F\u524D\u8D70\u6765\u3002\u201C\u6211\u662F\u9A6C\u7279\u5965\uFF0CRelayOps \u7684\u521B\u59CB\u4EBA\u3002\u739B\u62C9\u8BF4\u4ECA\u5929\u662F\u4F60\u7B2C\u4E00\u6B21\u6765\u3002\u6211\u4EEC\u7ED9\u8FDE\u9501\u95E8\u5E97\u505A\u8FD0\u8425\u8F6F\u4EF6\uFF1B\u6211\u5E26\u4F60\u4ECE\u5B9E\u9645\u4E1A\u52A1\u770B\u8D77\u3002\u201D", "The man at the whiteboard walks over. \u201CI\u2019m Mateo, founder of RelayOps. Mara said this is your first visit. We make operations software for retail chains. Let\u2019s start with what the business actually does.\u201D"] },
  finance: { name: ["\u666E\u91CC\u5A05\xB7\u62C9\u66FC", "Priya Raman"], unknown: ["\u6838\u5BF9\u4ED8\u6B3E\u7684\u5973\u4EBA", "Woman checking payments"], role: ["RelayOps \xB7 \u8D22\u52A1\u8D1F\u8D23\u4EBA", "RelayOps \xB7 Finance lead"], portrait: 3, row: 3, intro: ["\u5979\u628A\u4ED8\u6B3E\u8868\u7FFB\u5230\u7A7A\u767D\u7684\u4E00\u9762\uFF0C\u786E\u8BA4\u4F60\u7684\u8BBF\u5BA2\u8BC1\u3002\u300C\u666E\u91CC\u5A05\xB7\u62C9\u66FC\uFF0C\u8D1F\u8D23\u8D22\u52A1\u3002\u516C\u53F8\u5DF2\u6388\u6743\u4F60\u770B\u8FD9\u6279\u6750\u6599\u3002\u4F60\u53EF\u4EE5\u95EE\uFF0C\u4F46\u8BF7\u628A\u8D26\u9762\u6570\u5B57\u548C\u4F60\u81EA\u5DF1\u7684\u63A8\u65AD\u5206\u5F00\u3002\u300D", "She checks your visitor badge before turning the payment schedule around. \u201CPriya Raman, finance. You\u2019re authorized to inspect these files. Ask anything, but separate recorded figures from your inferences.\u201D"] },
  client: { name: ["\u4E54\u4E39\xB7\u5E03\u9C81\u514B\u65AF", "Jordan Brooks"], unknown: ["\u67E5\u770B\u95E8\u5E97\u6392\u671F\u7684\u7ECF\u7406", "Manager checking store schedules"], role: ["Harbor & Pine \xB7 \u8FD0\u8425\u603B\u76D1", "Harbor & Pine \xB7 Operations"], portrait: 4, row: 4, intro: ["\u5979\u6307\u4E86\u6307\u684C\u4E0A\u7684\u65B0\u65E7\u4E24\u5957\u64CD\u4F5C\u8868\u3002\u300C\u4E54\u4E39\xB7\u5E03\u9C81\u514B\u65AF\uFF0C\u8D1F\u8D23\u95E8\u5E97\u8FD0\u8425\u3002\u4F60\u662F\u6765\u95EE\u91C7\u8D2D\u7B7E\u6CA1\u7B7E\uFF0C\u8FD8\u662F\u6765\u95EE\u5E97\u957F\u613F\u4E0D\u613F\u610F\u7528\uFF1F\u8FD9\u4E24\u4EF6\u4E8B\uFF0C\u7B54\u6848\u53EF\u80FD\u4E0D\u4E00\u6837\u3002\u300D", "She points to two operating checklists, old and new. \u201CJordan Brooks, store operations. Are you asking whether procurement signed, or whether store managers want to use it? Those can have different answers.\u201D"] }
};
var topicsBase = {
  partner: [{ id: "mandate", label: ["\u4F60\u5E0C\u671B\u6211\u5E26\u56DE\u4EC0\u4E48\uFF1F", "What do you need from me?"], reply: ["\u300C\u5148\u8BF4\u54EA\u6761\u6295\u8D44\u903B\u8F91\u4ECD\u6210\u7ACB\uFF0C\u518D\u8BF4\u54EA\u6761\u53D8\u4E86\u3002\u628A\u4F60\u4E0D\u77E5\u9053\u7684\u5730\u65B9\u4E5F\u5199\u51FA\u6765\u3002\u4F60\u4E0D\u662F\u6765\u66FF\u6211\u8BC1\u660E\u539F\u5224\u65AD\u6B63\u786E\u7684\u3002\u300D\u5979\u628A\u6295\u59D4\u4F1A\u5E2D\u4F4D\u7559\u7ED9\u4F60\u3002", "\u201CTell me what still holds, then what changed. Include what you don\u2019t know. You\u2019re not here to prove my original view right.\u201D She leaves the committee presentation to you."] }, { id: "relationship", label: ["\u4F60\u4E0E\u521B\u59CB\u4EBA\u5F88\u719F\uFF0C\u4F1A\u5F71\u54CD\u51B3\u5B9A\u5417\uFF1F", "Does your history with the founder matter?"], reply: ["\u300C\u8BA4\u8BC6\u4E94\u5E74\u3002\u6B63\u56E0\u4E3A\u719F\uFF0C\u6211\u66F4\u5BB9\u6613\u66FF\u4ED6\u8865\u5168\u6CA1\u8BF4\u51FA\u7684\u90E8\u5206\u3002\u300D\u5979\u505C\u4E86\u4E00\u4E0B\u3002\u300C\u8FD9\u5C31\u662F\u6211\u8BA9\u4F60\u8DD1\u73B0\u573A\u7684\u539F\u56E0\u3002\u522B\u628A\u6211\u7684\u4FE1\u4EFB\u7B97\u8FDB\u4F60\u7684\u8BC1\u636E\u3002\u300D", "\u201CFive years. Familiarity makes it easy to fill in what he leaves unsaid. That\u2019s why I sent you on site. Don\u2019t count my trust as evidence.\u201D"] }, { id: "committee", label: ["\u4EC0\u4E48\u65F6\u5019\u53EF\u4EE5\u63D0\u4EA4\u610F\u89C1\uFF1F", "When should I submit my view?"], reply: ["\u300C\u8D44\u6599\u91CC\u7684\u4E09\u6761\u5224\u65AD\u90FD\u80FD\u6838\u5BF9\u3002\u8FD8\u6CA1\u67E5\u6E05\uFF0C\u4E5F\u53EF\u4EE5\u5411\u6295\u59D4\u4F1A\u660E\u786E\u63D0\u51FA\u6682\u505C\u3002\u9644\u6761\u4EF6\u63A8\u8FDB\u8981\u5148\u786E\u8BA4\u521B\u59CB\u4EBA\u613F\u4E0D\u613F\u610F\u63A5\u53D7\uFF0C\u6761\u4EF6\u80FD\u4E0D\u80FD\u6267\u884C\u3002\u300D", "\u201CYou can investigate all three questions in your case file. If uncertainty remains, recommend a pause explicitly. Conditional funding requires executable terms that the founder accepts.\u201D"] }],
  analyst: [{ id: "payer", label: ["\u4E3A\u4EC0\u4E48\u76EF\u7740\u4ED8\u6B3E\u65B9\uFF1F", "Why focus on the payer?"], reply: ["\u300C\u6458\u8981\u5199\u5F97\u50CF\u5BA2\u6237\u5DF2\u7ECF\u5168\u989D\u8BA4\u53EF\u3002\u6865\u77F3\u662F\u8C01\uFF0C\u6211\u8FD8\u6CA1\u6838\u5B9E\u3002\u516C\u53F8\u7684\u8D44\u6599\u5BA4\u6709\u56DE\u5355\u548C\u6E20\u9053\u8BF4\u660E\uFF1B\u5982\u679C\u662F\u6B63\u5E38\u4EE3\u4ED8\uFF0C\u6211\u4F1A\u628A\u7EA2\u5B57\u6539\u6389\u3002\u300D", "\u201CThe brief reads as if the customer has fully accepted. I haven\u2019t verified BridgeStone. Finance has the receipt and channel disclosure. If it\u2019s normal settlement, I\u2019ll correct my annotation.\u201D"] }, { id: "growth", label: ["\u5408\u540C\u5927\uFF0C\u4E3A\u4EC0\u4E48\u8FD8\u9700\u8981\u53BB\u95E8\u5E97\uFF1F", "Why visit stores if the contract is signed?"], reply: ["\u300C\u5408\u540C\u544A\u8BC9\u6211\u4EEC\u53CC\u65B9\u7B54\u5E94\u4E86\u4EC0\u4E48\uFF0C\u95E8\u5E97\u544A\u8BC9\u6211\u4EEC\u4EA4\u4ED8\u4E86\u4EC0\u4E48\u3002\u4E09\u5341\u4E8C\u5BB6\u662F\u63A8\u5E7F\u8303\u56F4\uFF0C\u8FD8\u4E0D\u4E00\u5B9A\u662F\u4ECA\u5929\u7684\u4F7F\u7528\u89C4\u6A21\u3002\u300D", "\u201CContracts show promises. Stores show delivery. Thirty-two is the rollout scope, not necessarily today\u2019s active footprint.\u201D"] }, { id: "correct", label: ["\u6E20\u9053\u5B89\u6392\u5DF2\u6838\u5B9E\uFF0C\u4FEE\u6B63\u4F60\u7684\u6807\u6CE8", "Correct the circular-payment allegation"], requires: ["channel"], effects: ["analyst-corrected"], reply: ["\u4E39\u5C3C\u5C14\u5212\u6389\u300C\u5FAA\u73AF\u56DE\u6B3E\u300D\u3002\u300C\u6536\u5230\u3002\u7B2C\u4E09\u65B9\u4ED8\u6B3E\u4E0D\u7B49\u4E8E\u9020\u5047\u3002\u771F\u6B63\u9700\u8981\u5199\u6E05\u7684\u662F\u9000\u6B3E\u6761\u4EF6\u548C\u51C0\u6536\u5165\u3002\u6211\u4F1A\u628A\u66F4\u6B63\u5E26\u8FDB\u6750\u6599\u3002\u300D", "Daniel crosses out \u201Ccircular payment.\u201D \u201CUnderstood. Third-party settlement isn\u2019t fraud. Refund exposure and net revenue are the real questions. I\u2019ll correct the committee materials.\u201D"] }],
  founder: [{ id: "value", label: ["\u4F60\u6700\u6709\u628A\u63E1\u7684\u4EA7\u54C1\u4EF7\u503C\u662F\u4EC0\u4E48\uFF1F", "What gives you confidence in the product?"], reply: ["\u300C\u53BB\u95EE\u516D\u5BB6\u8001\u5E97\u3002\u6211\u4EEC\u628A\u8BA2\u8D27\u9519\u8BEF\u964D\u4E0B\u6765\u4E86\uFF0C\u6240\u4EE5\u4ED6\u4EEC\u7EED\u8D39\u3002\u65B0\u95E8\u5E97\u4EA4\u4ED8\u786E\u5B9E\u6162\uFF0C\u4F46\u6211\u4E0D\u4F1A\u8BF4\u8FD9\u662F\u4E00\u4E2A\u6CA1\u4EBA\u8981\u7684\u4EA7\u54C1\u3002\u300D", "\u201CAsk the six established stores. Ordering errors fell; they renewed. New deployments are slow, yes. But this isn\u2019t a product nobody wants.\u201D"] }, { id: "omit", label: ["\u4E3A\u4EC0\u4E48\u6458\u8981\u6CA1\u6709\u5199\u9000\u6B3E\u6761\u4EF6\uFF1F", "Why omit the refund condition?"], requires: ["income"], effects: ["founder-disclosed"], reply: ["\u300C\u6211\u4EE5\u4E3A\u90A3\u662F\u5B9E\u65BD\u5408\u540C\u7684\u5E38\u89C4\u6761\u6B3E\uFF0C\u4E0D\u662F\u6295\u8D44\u903B\u8F91\u3002\u300D\u4ED6\u770B\u7740\u8865\u5145\u534F\u8BAE\uFF0C\u58F0\u97F3\u4F4E\u4E86\u4E0B\u6765\u3002\u300C\u4F46\u6211\u77E5\u9053\u4F60\u4EEC\u628A\u5230\u8D26\u5F53\u6210\u4E86\u9A8C\u8BC1\u3002\u6211\u5E94\u8BE5\u4E3B\u52A8\u89E3\u91CA\u3002\u300D", "\u201CI treated it as a routine delivery clause, not part of the thesis.\u201D His voice lowers. \u201CBut I knew you were treating cash received as validation. I should have explained.\u201D"] }, { id: "pressure", label: ["\u878D\u8D44\u82E5\u5EF6\u540E\u4E00\u4E2A\u6708\u5462\uFF1F", "What if funding slips a month?"], requires: ["funding"], reply: ["\u300C\u6211\u4EEC\u5F97\u4E0E\u4F9B\u5E94\u5546\u8C08\u5C55\u671F\uFF0C\u5148\u5B88\u4F4F\u4EA4\u4ED8\u3002\u88C1\u6389\u5B9E\u65BD\u56E2\u961F\uFF0C\u7701\u4E86\u73B0\u91D1\uFF0C\u5BA2\u6237\u4E5F\u5C31\u6CA1\u4E86\u3002\u4F60\u63D0\u5206\u671F\u53EF\u4EE5\uFF0C\u4F46\u9996\u671F\u5FC5\u987B\u591F\u5B8C\u6210\u4EA4\u4ED8\u3002\u300D", "\u201CWe negotiate supplier extensions and protect delivery. Cut implementation staff and we lose the customer. I can discuss tranches, but the first must fund delivery.\u201D"] }],
  finance: [{ id: "scope", label: ["\u8FD9\u4E9B\u6B3E\u9879\u80FD\u76F4\u63A5\u7B97\u6536\u5165\u5417\uFF1F", "Can this cash be treated as revenue?"], reply: ["\u300C\u73B0\u91D1\u3001\u5408\u540C\u989D\u3001\u6536\u5165\u662F\u4E09\u4E2A\u53E3\u5F84\u3002\u6536\u5165\u786E\u8BA4\u8FD8\u5F97\u770B\u5C65\u7EA6\u3002\u6458\u8981\u628A\u5B83\u4EEC\u653E\u5F97\u592A\u8FD1\u4E86\u3002\u4F60\u53EF\u4EE5\u6838\u5BF9\u4E3B\u5408\u540C\u548C\u9879\u76EE\u8865\u5145\u534F\u8BAE\u3002\u300D", "\u201CCash, contract value and revenue are different measures. Recognition depends on performance. The brief puts them too close together. Read the contract and its supplement.\u201D"] }, { id: "payer", label: ["\u6865\u77F3\u4E3A\u4F55\u4EE3\u4ED8\uFF1F", "Why did BridgeStone pay?"], requires: ["payment"], reply: ["\u300C\u6E20\u9053\u670D\u52A1\u5B89\u6392\u5728\u8D44\u6599\u67B6\u4E0A\u3002\u4E0D\u8981\u53EA\u770B\u516C\u53F8\u540D\u5B57\u4E0D\u540C\u5C31\u8BF4\u5FAA\u73AF\u56DE\u6B3E\u3002\u5982\u679C\u4F60\u627E\u5230\u8D44\u91D1\u56DE\u6D41\u8BC1\u636E\uFF0C\u6211\u4EEC\u518D\u8C08\u90A3\u4E2A\u5224\u65AD\u3002\u300D", "\u201CThe channel arrangement is on the file shelf. Different names alone don\u2019t establish circular payment. If you find evidence of funds returning, bring it to me.\u201D"] }, { id: "stress", label: ["\u8FD9\u4EFD\u9884\u6D4B\u6CA1\u6709\u9A8C\u6536\u5EF6\u8BEF\u60C5\u5883", "The forecast lacks an acceptance-delay case"], requires: ["funding"], effects: ["finance-stress"], reply: ["\u5979\u628A\u539F\u9884\u7B97\u79FB\u5230\u4E00\u65C1\u3002\u300C\u662F\u3002\u56DB\u5468\u652F\u51FA\u7F3A\u53E3\u8FD8\u4E0D\u542B\u9000\u6B3E\u3002\u81F3\u5C11\u9700\u8981\u5355\u5217\u507F\u4ED8\u548C\u5C65\u7EA6\u9884\u7B97\uFF0C\u6211\u613F\u610F\u6BCF\u5468\u5411\u8463\u4E8B\u4F1A\u62A5\u53EF\u7528\u73B0\u91D1\uFF0C\u524D\u63D0\u662F\u521B\u59CB\u4EBA\u540C\u610F\u3002\u300D", "She sets the budget aside. \u201CCorrect. The four-week gap excludes refunds. We need separate obligations and delivery budgets. I\u2019ll report available cash weekly to the board if the founder agrees.\u201D"] }],
  client: [{ id: "real", label: ["\u5E97\u957F\u771F\u7684\u613F\u610F\u7EE7\u7EED\u7528\u5417\uFF1F", "Do managers want to keep using it?"], reply: ["\u300C\u516D\u5BB6\u8001\u5E97\u613F\u610F\uFF0C\u90A3\u91CC\u6709\u4EBA\u5E2E\u4ED6\u4EEC\u628A\u6D41\u7A0B\u8DD1\u987A\u4E86\u3002\u53E6\u5916\u516D\u5BB6\u8FD8\u5728\u78E8\u5408\u3002\u6211\u4EEC\u4E0D\u662F\u4E0D\u60F3\u6269\uFF0C\u53EA\u662F\u4E0D\u60F3\u8BA9\u4E8C\u5341\u5BB6\u5E97\u4E00\u8D77\u51FA\u95EE\u9898\u3002\u300D", "\u201CThe six established stores do. Someone helped them get it working. Six more are settling in. We want expansion, but not twenty stores failing at once.\u201D"] }, { id: "accept", label: ["\u4F60\u4F1A\u7B7E\u7B2C\u4E8C\u9636\u6BB5\u9A8C\u6536\u5417\uFF1F", "Will you sign phase-two acceptance?"], requires: ["rollout"], effects: ["client-confirmed"], reply: ["\u300C\u73B0\u5728\u4E0D\u4F1A\u3002\u5148\u628A\u540C\u6B65\u95EE\u9898\u89E3\u51B3\uFF0C\u8FDE\u7EED\u8FD0\u884C\u7A33\u5B9A\uFF0C\u518D\u6309\u5408\u540C\u9A8C\u6536\u3002\u8FD9\u4E2A\u8981\u6C42\u6211\u53EF\u4EE5\u4E66\u9762\u7ED9\u4F60\uFF0C\u4F46\u6211\u4E0D\u4F1A\u66FF\u4ED6\u4EEC\u627F\u8BFA\u878D\u8D44\u540E\u7684\u7ED3\u679C\u3002\u300D", "\u201CNot today. Fix synchronization, demonstrate stability, then follow contractual acceptance. I\u2019ll put that in writing. I can\u2019t promise what funding will achieve.\u201D"] }, { id: "refund", label: ["\u4F60\u4EEC\u4E00\u5B9A\u4F1A\u8981\u6C42\u9000\u6B3E\u5417\uFF1F", "Will you definitely demand a refund?"], requires: ["appendix"], reply: ["\u300C\u4E0D\u4E00\u5B9A\u3002\u6211\u4EEC\u613F\u610F\u628A\u7CFB\u7EDF\u505A\u6210\uFF0C\u4F46\u6743\u5229\u4E0D\u4F1A\u5148\u653E\u5F03\u3002\u522B\u628A\u300E\u5E0C\u671B\u7EE7\u7EED\u5408\u4F5C\u300F\u5199\u6210\u300E\u4E0D\u53EF\u80FD\u9000\u6B3E\u300F\u3002\u300D", "\u201CNot necessarily. We want this to work, but won\u2019t waive our rights first. Don\u2019t turn willingness to continue into certainty that no refund will occur.\u201D"] }]
};
var followupTopics = {
  partner: [{ id: "mandate-evidence", after: "mandate", label: ["\u5982\u679C\u8BC1\u636E\u548C\u4F60\u7684\u5224\u65AD\u51B2\u7A81\u5462\uFF1F", "What if the evidence contradicts your view?"], reply: ["\u201C\u628A\u51B2\u7A81\u5199\u6E05\u695A\u3002\u53CD\u5BF9\u6211\u4E0D\u662F\u7ED3\u8BBA\uFF0C\u8BF4\u660E\u4EC0\u4E48\u8BC1\u636E\u4F1A\u8BA9\u4F60\u6539\u53D8\u610F\u89C1\u624D\u662F\u3002\u201D", "\u201CMake the conflict explicit. Disagreeing with me is not a conclusion. Tell me what evidence would change your mind.\u201D"] }, { id: "mandate-unknown", after: "mandate-evidence", label: ["\u8FD8\u6CA1\u67E5\u6E05\u7684\u90E8\u5206\u600E\u4E48\u63D0\u4EA4\uFF1F", "How should I present what remains unknown?"], reply: ["\u201C\u533A\u5206\u4E0D\u77E5\u9053\u548C\u5DF2\u7ECF\u8BC1\u4F2A\u3002\u5199\u660E\u7F3A\u54EA\u4EFD\u6750\u6599\u3001\u8C01\u80FD\u6838\u5B9E\uFF0C\u4EE5\u53CA\u51B3\u5B9A\u662F\u5426\u5FC5\u987B\u7B49\u5B83\u3002\u201D", "\u201CSeparate unknown from disproved. Name the missing material, who can verify it, and whether the decision must wait.\u201D"] }],
  analyst: [{ id: "payer-test", after: "payer", label: ["\u4EC0\u4E48\u80FD\u8BC1\u5B9E\u6216\u63A8\u7FFB\u4F60\u7684\u6000\u7591\uFF1F", "What would confirm or disprove your concern?"], reply: ["\u201C\u6E20\u9053\u8BF4\u660E\u548C\u9000\u6B3E\u6761\u6B3E\u3002\u4ED8\u6B3E\u65B9\u4E0D\u540C\u662F\u6838\u67E5\u8D77\u70B9\uFF0C\u4E0D\u662F\u9020\u5047\u7684\u7ED3\u8BBA\u3002\u201D", "\u201CThe channel disclosure and refund terms. A different payer starts an investigation; it does not prove fraud.\u201D"] }, { id: "payer-distinction", after: "payer-test", label: ["\u6B63\u5E38\u4EE3\u4ED8\u5C31\u6CA1\u6709\u98CE\u9669\u4E86\u5417\uFF1F", "Would normal settlement remove the risk?"], reply: ["\u201C\u4E0D\u80FD\u3002\u4ED8\u6B3E\u5408\u6CD5\u548C\u6536\u5165\u53EF\u6301\u7EED\u662F\u4E24\u4E2A\u95EE\u9898\u3002\u6211\u4EEC\u8FD8\u5F97\u6838\u5BF9\u5BA2\u6237\u4F7F\u7528\u548C\u51C0\u6536\u5165\u3002\u201D", "\u201CNo. Legitimate settlement and sustainable revenue are different questions. We still need customer use and net revenue.\u201D"] }],
  founder: [{ id: "value-proof", after: "value", label: ["\u600E\u6837\u533A\u5206\u4F60\u7684\u4FE1\u5FC3\u548C\u53EF\u9A8C\u8BC1\u7684\u8BC1\u636E\uFF1F", "How do I separate confidence from evidence?"], reply: ["\u201C\u522B\u53EA\u542C\u6211\u3002\u770B\u95E8\u5E97\u7684\u4F7F\u7528\u8BB0\u5F55\uFF0C\u4E5F\u542C\u8FD0\u8425\u8D1F\u8D23\u4EBA\u8BF4\u54EA\u91CC\u8FD8\u6CA1\u505A\u597D\u3002\u201D", "\u201CDo not rely on me alone. Check store usage and ask operations what still fails.\u201D"] }, { id: "value-limit", after: "value-proof", label: ["\u8001\u5E97\u7684\u6210\u529F\u80FD\u76F4\u63A5\u63A8\u5230\u6240\u6709\u65B0\u5E97\u5417\uFF1F", "Can success in the old stores justify every new rollout?"], reply: ["\u201C\u4E0D\u80FD\u76F4\u63A5\u63A8\u3002\u4EA4\u4ED8\u80FD\u529B\u8981\u8DDF\u4E0A\u3002\u6211\u5E0C\u671B\u4F60\u770B\u5230\u4EF7\u503C\uFF0C\u4E5F\u522B\u66FF\u6211\u7701\u6389\u5C1A\u672A\u5B8C\u6210\u7684\u5DE5\u4F5C\u3002\u201D", "\u201CNot directly. Delivery has to catch up. I want you to see the value, not erase the unfinished work.\u201D"] }],
  finance: [{ id: "scope-proof", after: "scope", label: ["\u90A3\u6211\u5E94\u8BE5\u5148\u6838\u5BF9\u54EA\u4E24\u4EFD\u6750\u6599\uFF1F", "Which documents should I compare first?"], reply: ["\u201C\u56DE\u5355\u548C\u8865\u5145\u534F\u8BAE\u3002\u4E00\u4EFD\u8BC1\u660E\u94B1\u5230\u8D26\uFF0C\u4E00\u4EFD\u8BF4\u660E\u6761\u4EF6\u3002\u53EA\u770B\u5176\u4E2D\u4E00\u4EFD\u4F1A\u6F0F\u6389\u4E00\u534A\u3002\u201D", "\u201CThe payment receipt and supplemental agreement. One proves cash arrived; the other sets conditions. Either alone tells half the story.\u201D"] }, { id: "scope-downside", after: "scope-proof", label: ["\u5982\u679C\u6761\u4EF6\u6CA1\u6709\u8FBE\u5230\u5462\uFF1F", "What if those conditions are not met?"], reply: ["\u201C\u6309\u534F\u8BAE\u6838\u5BF9\u8D23\u4EFB\uFF0C\u518D\u628A\u5B83\u548C\u73B0\u91D1\u9884\u7B97\u653E\u5728\u4E00\u8D77\u770B\u3002\u4E0D\u80FD\u53EA\u6309\u987A\u5229\u4EA4\u4ED8\u7684\u60C5\u51B5\u505A\u8BA1\u5212\u3002\u201D", "\u201CCheck the contractual obligation alongside the cash budget. A plan cannot assume delivery always succeeds.\u201D"] }],
  client: [{ id: "real-evidence", after: "real", label: ["\u4F60\u770B\u4EC0\u4E48\u6765\u5224\u65AD\u95E8\u5E97\u7528\u5F97\u597D\u4E0D\u597D\uFF1F", "How do you judge whether a store is using it well?"], reply: ["\u201C\u770B\u65E5\u5E38\u5DE5\u4F5C\u80FD\u4E0D\u80FD\u9760\u5B83\u5B8C\u6210\uFF0C\u800C\u4E0D\u662F\u53EA\u770B\u8D26\u53F7\u6709\u6CA1\u6709\u5F00\u901A\u3002\u4F60\u53EF\u4EE5\u8BFB\u4E0A\u7EBF\u6E05\u5355\u3002\u201D", "\u201CWhether daily work gets done with it, not whether an account exists. Read the deployment list.\u201D"] }, { id: "real-boundary", after: "real-evidence", label: ["\u91C7\u8D2D\u7B7E\u5B57\u80FD\u4EE3\u66FF\u8FD9\u79CD\u786E\u8BA4\u5417\uFF1F", "Can procurement\u2019s signature replace that check?"], reply: ["\u201C\u91C7\u8D2D\u786E\u8BA4\u8D2D\u4E70\u5B89\u6392\uFF0C\u8FD0\u8425\u786E\u8BA4\u80FD\u4E0D\u80FD\u5DE5\u4F5C\u3002\u4F60\u9700\u8981\u4E24\u8FB9\u7684\u8BC1\u636E\uFF0C\u4E0D\u80FD\u8BA9\u4E00\u4E2A\u7B7E\u5B57\u66FF\u53E6\u4E00\u4E2A\u56DE\u7B54\u3002\u201D", "\u201CProcurement confirms the purchase arrangement. Operations confirms whether it works. You need both, not one signature answering for the other.\u201D"] }]
};
for (const person of Object.keys(topicsBase)) topicsBase[person].push(...followupTopics[person]);
topicsBase.partner.find((t2) => t2.id === "committee").utility = true;
var topics = Object.fromEntries(Object.entries(topicsBase).map(([person, items]) => [person, items.map((item) => ({ ...item, label: mapPair(item.label), reply: mapPair(item.reply) }))]));
var findingsBase = [
  { id: "usage", title: ["\u589E\u957F\u9A8C\u8BC1\u8303\u56F4", "Extent of growth validation"], pair: ["contract", "rollout"], correct: ["\u5408\u540C\u5DF2\u7B7E\uFF0C\u89C4\u6A21\u5316\u4ECD\u5F85\u9A8C\u8BC1", "Signed scope exceeds proven deployment"], wrong: ["32 \u5BB6\u95E8\u5E97\u5DF2\u5168\u90E8\u7A33\u5B9A\u4F7F\u7528", "All 32 stores are stable users"], result: ["12 \u5BB6\u4E0A\u7EBF\u30016 \u5BB6\u6210\u719F\u4ED8\u8D39\u3002\u4EA7\u54C1\u6709\u4EF7\u503C\uFF0C\u590D\u5236\u901F\u5EA6\u548C\u5B9E\u65BD\u6210\u672C\u4ECD\u9700\u9A8C\u8BC1\u3002", "Twelve live, six established paid stores. Product value exists; rollout speed and delivery costs remain unproven."] },
  { id: "income", title: ["\u9996\u6B3E\u7684\u8D28\u91CF", "Quality of the first payment"], pair: ["payment", "appendix"], correct: ["\u5230\u8D26\u5C5E\u5B9E\uFF0C\u4F46\u7559\u5B58\u9644\u5C65\u7EA6\u6761\u4EF6", "Real cash, conditional retention"], wrong: ["\u7B2C\u4E09\u65B9\u4ED8\u6B3E\u8BC1\u660E\u516C\u53F8\u9020\u5047", "Third-party payment proves fraud"], result: ["\u56DE\u5355\u8BC1\u660E\u5230\u8D26\uFF0C\u8865\u5145\u534F\u8BAE\u4FDD\u7559\u9000\u6B3E\u6743\u3002\u5E94\u4FEE\u6B63\u6458\u8981\uFF0C\u4E0D\u80FD\u628A\u4EE3\u4ED8\u76F4\u63A5\u7B49\u540C\u9020\u5047\u3002", "Receipt proves cash arrived; the supplement preserves refund rights. Correct the brief without alleging fraud solely from settlement."] },
  { id: "funding", title: ["\u878D\u8D44\u5148\u89E3\u51B3\u4EC0\u4E48", "What funding must solve first"], pair: ["cash", "forecast"], correct: ["\u5148\u8865\u8FD1\u671F\u7F3A\u53E3\uFF0C\u518D\u4FDD\u969C\u4EA4\u4ED8", "Bridge obligations and fund delivery first"], wrong: ["\u5168\u90E8\u8D44\u91D1\u90FD\u53EF\u7528\u4E8E\u65B0\u589E\u6269\u5F20", "All proceeds can fund new expansion"], result: ["\u53EF\u7528 87 \u4E07\u5BF9\u56DB\u5468 230 \u4E07\u652F\u51FA\uFF0C\u5C1A\u672A\u8BA1\u6F5C\u5728\u9000\u6B3E\u3002\u5148\u533A\u5206\u507F\u4ED8\u3001\u5C65\u7EA6\u4E0E\u6269\u5F20\u3002", "\xA50.87m available versus \xA52.3m due, before refunds. Separate obligations, delivery and expansion."] }
];
var findings = findingsBase.map((finding) => ({ ...finding, title: mapPair(finding.title), correct: mapPair(finding.correct), wrong: mapPair(finding.wrong), result: mapPair(finding.result) }));
function rawAfterDecision(id, j) {
  const decision = j.save.facts.decision;
  if (id === "partner") return decision === "pause" ? ["\u300C\u6682\u7F13\u4E5F\u8981\u8BF4\u660E\u6062\u590D\u5BA1\u8BAE\u7684\u6761\u4EF6\u3002\u300D\u9648\u6BD3\u628A\u6587\u4EF6\u7559\u5728\u684C\u4E0A\u3002\u300C\u4F60\u6CA1\u6709\u66FF\u6211\u4EEC\u6D88\u9664\u4E0D\u786E\u5B9A\u6027\uFF0C\u4F46\u81F3\u5C11\u8BA9\u6211\u4EEC\u77E5\u9053\u4E0B\u4E00\u6B65\u8981\u9A8C\u8BC1\u4EC0\u4E48\u3002\u300D", "\u201CA pause needs conditions for reopening the decision.\u201D Chen leaves the file on the desk. \u201CYou made clear what we must verify next.\u201D"] : ["\u300C\u51B3\u5B9A\u5DF2\u7ECF\u4F5C\u51FA\uFF0C\u5DE5\u4F5C\u8FD8\u6CA1\u7ED3\u675F\u3002\u300D\u9648\u6BD3\u7FFB\u56DE\u4F60\u7684\u4F9D\u636E\u9875\u3002\u300C\u4E0B\u6B21\u8463\u4E8B\u4F1A\uFF0C\u6211\u4F1A\u95EE\u8FD9\u4E9B\u5047\u8BBE\u6709\u6CA1\u6709\u53D8\u5316\u3002\u300D", "\u201CThe decision is made; the work continues.\u201D Chen turns to your evidence. \u201CAt the next board meeting, I\u2019ll ask what changed.\u201D"];
  if (id === "founder") return decision === "pause" ? ["\u8BB8\u8861\u770B\u4E86\u4E00\u773C\u624B\u673A\uFF0C\u6CA1\u6709\u7ACB\u523B\u56DE\u7B54\u3002\u300C\u6211\u5148\u53BB\u8C08\u4F9B\u5E94\u5546\u5C55\u671F\u3002\u4F60\u4E0B\u6B21\u56DE\u6765\uFF0C\u5E0C\u671B\u770B\u5230\u7684\u662F\u65B0\u9A8C\u6536\u5355\uFF0C\u4E0D\u662F\u6211\u4EEC\u7684\u544A\u522B\u4FE1\u3002\u300D", "Xu glances at his phone. \u201CI\u2019ll talk to suppliers about extensions. I hope your next visit brings new acceptance records, not our farewell letter.\u201D"] : decision === "conditional" ? ["\u300C\u6761\u4EF6\u6211\u63A5\u53D7\u3002\u4E5F\u8BF7\u8BB0\u4F4F\uFF0C\u5B9E\u65BD\u4EBA\u5458\u4E0D\u662F\u8868\u683C\u91CC\u53EF\u4EE5\u968F\u610F\u5EF6\u540E\u7684\u6570\u5B57\u3002\u300D\u4ED6\u6536\u8D77\u6E05\u5355\uFF0C\u53BB\u51C6\u5907\u5BA2\u6237\u4F1A\u8BAE\u3002", "\u201CI accept the terms. Remember that delivery staff are not numbers we can defer indefinitely.\u201D He takes the list to the customer meeting."] : ["\u300C\u8C22\u8C22\u4F60\u7684\u4FE1\u4EFB\u3002\u300D\u8BB8\u8861\u505C\u4E86\u4E00\u4E0B\u3002\u300C\u6211\u77E5\u9053\u4F60\u6CA1\u6709\u628A\u95EE\u9898\u5F53\u4F5C\u4E0D\u5B58\u5728\u3002\u4E0B\u5468\u7684\u4EA4\u4ED8\u8FDB\u5EA6\uFF0C\u6211\u4F1A\u8BA9\u4F60\u770B\u539F\u8868\u3002\u300D", "\u201CThank you for your trust. I know you haven\u2019t dismissed the issues. Next week, you\u2019ll see the original delivery schedule.\u201D"];
  if (id === "finance") return ["\u59DC\u5C9A\u628A\u4E24\u5F20\u8868\u5E76\u6392\u653E\u597D\u3002\u300C\u4E0D\u7BA1\u6700\u540E\u600E\u4E48\u6295\uFF0C\u8FD9\u5F20\u53EF\u7528\u73B0\u91D1\u8868\u90FD\u5F97\u6BCF\u5929\u66F4\u65B0\u3002\u4E0B\u6B21\u770B\u5230\u4E00\u4E2A\u5230\u8D26\u6570\u5B57\uFF0C\u5148\u95EE\u5B83\u80CC\u540E\u8FD8\u6709\u4EC0\u4E48\u4E49\u52A1\u3002\u300D", "Jiang lays two schedules side by side. \u201CWhatever the investment decision, available cash needs a daily update. Next time you see cash received, ask what obligations travel with it.\u201D"];
  if (id === "client") return ["\u300C\u6295\u8D44\u7684\u4E8B\u6211\u4E0D\u66FF\u4F60\u5224\u65AD\u3002\u300D\u7F57\u73CA\u6307\u5411\u73B0\u573A\u8FD8\u5728\u5DE5\u4F5C\u7684\u540C\u4E8B\u3002\u300C\u7CFB\u7EDF\u80FD\u4E0D\u80FD\u7A33\u5B9A\u8FD0\u884C\uFF0C\u660E\u65E9\u5F00\u5E97\u6211\u4EEC\u5C31\u77E5\u9053\u4E86\u3002\u9A8C\u6536\u8FD8\u662F\u6309\u7EA6\u5B9A\u6765\u3002\u300D", "\u201CI won\u2019t judge your investment.\u201D Luo points to her team. \u201CWe\u2019ll see how the system works when stores open tomorrow. Acceptance still follows the agreement.\u201D"];
  return j.save.facts["analyst-corrected"] ? ["\u6797\u6F88\u628A\u6539\u597D\u7684\u6458\u8981\u9012\u6765\u3002\u300C\u300E\u5FAA\u73AF\u56DE\u6B3E\u300F\u5DF2\u7ECF\u5220\u6389\u3002\u6211\u4FDD\u7559\u4E86\u4ED8\u6B3E\u65B9\u548C\u9000\u6B3E\u6761\u4EF6\uFF0C\u8BA9\u6295\u59D4\u4F1A\u81EA\u5DF1\u770B\u5230\u4E8B\u5B9E\u3002\u4E0B\u6B21\u6211\u4F1A\u5148\u6838\u5BF9\uFF0C\u518D\u753B\u7EA2\u5708\u3002\u300D", "Lin hands over the revised brief. \u201CI removed the circular-payment claim and kept the payer and refund facts. Next time I\u2019ll verify before drawing red circles.\u201D"] : ["\u6797\u6F88\u5408\u4E0A\u6587\u4EF6\u3002\u300C\u6211\u8FD8\u6B20\u8FD9\u4EFD\u6750\u6599\u4E00\u6B21\u6838\u5BF9\u3002\u770B\u5230\u5F02\u5E38\u548C\u8BC1\u660E\u9020\u5047\uFF0C\u786E\u5B9E\u4E0D\u662F\u540C\u4E00\u4EF6\u4E8B\u3002\u300D", "Lin closes the file. \u201CI still owe these materials another check. An anomaly and proof of fraud are different things.\u201D"];
}
function afterDecision(id, j) {
  return mapPair(rawAfterDecision(id, j));
}
records.push(
  { id: "delivery-log", title: ["\u4EA4\u4ED8\u5DE5\u4F4D \xB7 \u6545\u969C\u4EA4\u63A5\u5355", "Delivery bench \xB7 handover log"], source: ["RelayOps \xB7 \u5B9E\u65BD\u56E2\u961F", "RelayOps \xB7 Delivery team"], tag: ["\u4EA4\u4ED8", "DELIVERY"], summary: ["\u540C\u6B65\u6545\u969C\u5C1A\u672A\u5173\u95ED\uFF0C\u4E24\u540D\u5B9E\u65BD\u4EBA\u5458\u7EE7\u7EED\u9A7B\u573A\u3002", "Synchronization remains open; two engineers stay on site."], body: ["\u6D4B\u8BD5\u53F0\u65C1\u7684\u4EA4\u63A5\u5355\u5206\u6210\u201C\u590D\u73B0\u201D\u201C\u4FEE\u590D\u201D\u201C\u5BA2\u6237\u786E\u8BA4\u201D\u4E09\u680F\u3002\u524D\u4E24\u680F\u6709\u7B7E\u540D\uFF0C\u6700\u540E\u4E00\u680F\u4ECD\u7A7A\u7740\u3002\n\n\u590D\u73B0\u6B65\u9AA4\u5199\u7740\uFF1A\u65E7\u6536\u94F6\u7CFB\u7EDF\u665A\u95F4\u540C\u6B65\u4E2D\u65AD\uFF0C\u7B2C\u4E8C\u5929\u9700\u8981\u624B\u52A8\u6838\u5BF9\u5E93\u5B58\u3002\u8FD9\u89E3\u91CA\u4E86\u4E3A\u4EC0\u4E48\u5BA2\u6237\u8BF4\u4EA7\u54C1\u6709\u4EF7\u503C\uFF0C\u5374\u4E0D\u613F\u6269\u5927\u4E0A\u7EBF\u3002\n\n\u4EBA\u5458\u8BA1\u5212\u5C06\u4E24\u540D\u5B9E\u65BD\u5DE5\u7A0B\u5E08\u7559\u5728\u73B0\u573A\u3002\u589E\u52A0\u9500\u552E\u4E0D\u80FD\u4EE3\u66FF\u5B8C\u6210\u5BA2\u6237\u786E\u8BA4\u3002\u4F60\u62CD\u4E0B\u53EF\u4F9B\u5C3D\u8C03\u5F15\u7528\u7684\u4EA4\u63A5\u6458\u8981\uFF0C\u672A\u5E26\u8D70\u5BA2\u6237\u660E\u7EC6\u3002", "The handover log has three columns: reproduce, repair, customer confirmation. The first two are signed; the last is blank.\n\nThe legacy tills lose synchronization overnight, requiring morning inventory checks. That explains why the customer values the product but resists expansion.\n\nTwo implementation engineers remain on site. More sales cannot substitute for customer confirmation. You retain the authorized handover summary, not private customer records."] },
  { id: "settlement-review", title: ["\u6E20\u9053\u7ED3\u7B97\u6838\u5BF9\u5355", "Channel settlement reconciliation"], source: ["BridgeStone \xB7 \u6388\u6743\u7ED3\u7B97\u529E\u516C\u5BA4", "BridgeStone \xB7 Authorized settlement office"], tag: ["\u7ED3\u7B97", "SETTLEMENT"], summary: ["\u4ED8\u6B3E\u94FE\u6761\u53EF\u4EE5\u6838\u5BF9\uFF0C\u9000\u6B3E\u4E49\u52A1\u5E76\u672A\u6D88\u5931\u3002", "The payment chain reconciles; refund exposure remains."], body: ["\u7ED3\u7B97\u53F0\u4E0A\uFF0C\u4E00\u4EFD\u5BA2\u6237\u59D4\u6258\u3001\u4E00\u4EFD\u9879\u76EE\u4ED8\u6B3E\u548C\u4E00\u4EFD\u6E20\u9053\u670D\u52A1\u5B89\u6392\u6309\u7F16\u53F7\u6392\u9F50\u3002\u7ECF\u6388\u6743\u7684\u6838\u5BF9\u5355\u786E\u8BA4\u4E09\u8005\u9879\u76EE\u7F16\u53F7\u76F8\u540C\u3002\n\n\u6CA1\u6709\u6750\u6599\u652F\u6301\u201C\u8D44\u91D1\u5DF2\u7ECF\u56DE\u6D41\u201D\u7684\u8BF4\u6CD5\u3002\u7ED3\u7B97\u65B9\u4E5F\u672A\u627F\u8BFA\u66FF RelayOps \u627F\u62C5\u4EA4\u4ED8\u5931\u8D25\u540E\u7684\u9000\u6B3E\u635F\u5931\u3002\n\n\u672B\u9875\u5199\u7740\uFF1A\u201C\u8BF7\u4E0D\u8981\u628A\u4EE3\u4ED8\u7406\u89E3\u4E3A\u4FDD\u8BC1\u3002\u9000\u6B3E\u53D1\u751F\u65F6\uFF0C\u6211\u4EEC\u6309\u534F\u8BAE\u529E\u7406\u7ED3\u7B97\u3002\u201D\u4F60\u9700\u8981\u4FEE\u6B63\u6000\u7591\uFF0C\u4E5F\u8981\u4FDD\u7559\u98CE\u9669\u3002", "A customer mandate, project payment and channel service arrangement are aligned by reference number. The authorized reconciliation confirms matching project references.\n\nNothing here substantiates an allegation that money has returned to its source. The intermediary does not promise to absorb refunds if RelayOps fails delivery.\n\n\u201CSettlement is not a guarantee. If a refund is due, we settle under the agreement.\u201D Correct the allegation without deleting the exposure."] },
  { id: "committee-draft", title: ["\u5C0F\u4F1A\u8BAE\u5BA4 \xB7 \u4E0A\u6B21\u8BA8\u8BBA\u7559\u75D5", "Breakout room \xB7 prior discussion notes"], source: ["Northline \xB7 \u5185\u90E8\u4F1A\u8BAE\u8BB0\u5F55", "Northline \xB7 Internal discussion notes"], tag: ["\u5206\u6B67", "DELIBERATION"], summary: ["\u5408\u4F19\u4EBA\u7684\u4FE1\u4EFB\u4E0E\u6295\u8D44\u4F9D\u636E\u66FE\u88AB\u5199\u5728\u540C\u4E00\u884C\u3002", "Personal confidence and investment evidence shared a line."], body: ["\u767D\u677F\u65C1\u7559\u7740\u4E0A\u6B21\u4F1A\u8BAE\u8BB0\u5F55\uFF1A\u201C\u521B\u59CB\u4EBA\u53EF\u4FE1\uFF1B\u5BA2\u6237\u9996\u6B3E\u5230\u8D26\uFF1B\u53EF\u590D\u5236\u3002\u201D\u7B2C\u4E00\u53E5\u662F\u5408\u4F19\u4EBA\u7684\u5224\u65AD\uFF0C\u7B2C\u4E8C\u53E5\u662F\u4E8B\u5B9E\uFF0C\u7B2C\u4E09\u53E5\u4ECD\u662F\u5047\u8BBE\u3002\n\n\u6709\u4EBA\u5728\u4E0B\u9762\u5199\uFF1A\u201C\u5982\u679C\u4EA4\u4ED8\u6BD4\u878D\u8D44\u6162\uFF0C\u6211\u4EEC\u613F\u610F\u627F\u62C5\u591A\u4E45\uFF1F\u201D\u6CA1\u6709\u7B54\u6848\u3002\n\n\u4F60\u628A\u8FD9\u9875\u7559\u5728\u6848\u5377\u91CC\u3002\u63A5\u4E0B\u6765\u9700\u8981\u5728\u6295\u59D4\u4F1A\u4E0A\u533A\u5206\u5BF9\u4EBA\u7684\u4FE1\u4EFB\u3001\u5DF2\u7ECF\u6838\u9A8C\u7684\u7ED3\u679C\u548C\u613F\u610F\u627F\u62C5\u7684\u98CE\u9669\u3002", "The previous meeting notes read: \u201CFounder trusted; first customer payment received; repeatable.\u201D The first is the partner\u2019s judgment, the second a fact, the third still a hypothesis.\n\nBelow it: \u201CIf delivery is slower than financing, how long are we willing to carry it?\u201D No answer.\n\nYou keep the page in the case. The committee must distinguish confidence in a person, verified results and risks it is willing to carry."] }
);

// src/chapter.ts
var has = (j, id) => Boolean(j.save.facts[id]);
var chapterEnabled = (j) => j.chapterVersion === 1 || !has(j, "decision");
var chapterReviewed = (j) => has(j, "committee-reconciled");
var chapterComplete = (j) => ["echo-founder", "echo-finance", "echo-client"].every((id) => has(j, id));
function chapterStage(j) {
  if (has(j, "decision")) return chapterEnabled(j) ? chapterComplete(j) ? ["\u7B2C\u4E94\u5E55 \xB7 \u7559\u4E0B\u7684\u8D23\u4EFB", "V \xB7 What remains yours"] : ["\u5C3E\u58F0 \xB7 \u5468\u4E00\u7684\u56DE\u97F3", "EPILOGUE \xB7 Monday replies"] : ["\u5DF2\u5C01\u5B58\u7684\u8C03\u67E5", "ARCHIVED INVESTIGATION"];
  if (chapterReviewed(j)) return ["\u7B2C\u56DB\u5E55 \xB7 \u4F60\u7684\u540D\u5B57\u5728\u610F\u89C1\u4E0A", "IV \xB7 Your name on the recommendation"];
  if (has(j, "chapter-confronted")) return ["\u7B2C\u4E09\u5E55 \xB7 \u627F\u8BFA\u9700\u8981\u8FB9\u754C", "III \xB7 What a promise can carry"];
  if (has(j, "income")) return ["\u7B2C\u4E8C\u5E55 \xB7 \u6750\u6599\u6CA1\u6709\u5199\u51FA\u7684\u90E8\u5206", "II \xB7 What the brief left out"];
  return ["\u7B2C\u4E00\u5E55 \xB7 \u7B7E\u5B57\u4E4B\u524D", "I \xB7 Before you sign"];
}
function chapterObjective(j) {
  if (!chapterEnabled(j)) return;
  if (has(j, "decision")) {
    if (!has(j, "echo-founder")) return ["RelayOps \xB7 \u5F00\u653E\u529E\u516C\u533A\uFF1A\u542C\u53D6\u521B\u59CB\u4EBA\u7684\u5B89\u6392", "RelayOps \xB7 Workspace: hear the founder\u2019s response"];
    if (!has(j, "echo-finance")) return ["\u53BB\u8D44\u6599\u4F1A\u8BAE\u5BA4\uFF0C\u786E\u8BA4\u8D22\u52A1\u5982\u4F55\u5B89\u6392\u63A5\u4E0B\u6765\u7684\u4E00\u5468", "RelayOps \xB7 Data room: confirm the cash plan"];
    if (!has(j, "echo-client")) return ["Harbor & Pine \xB7 \u8FD0\u8425\u73B0\u573A\uFF1A\u542C\u53D6\u5BA2\u6237\u56DE\u97F3", "Harbor & Pine \xB7 Operations: hear the final reply"];
    return ["\u672C\u7AE0\u7ED3\u675F\uFF1A\u56DE\u987E\u610F\u89C1\uFF0C\u6216\u5F00\u59CB\u53E6\u4E00\u6BB5\u72EC\u7ACB\u8C03\u67E5", "Chapter complete: revisit your recommendation or begin anew"];
  }
  if (chapterReviewed(j)) return ["\u603B\u90E8 \xB7 \u6295\u59D4\u4F1A\u4F1A\u8BAE\u5BA4\uFF1A\u63D0\u4EA4\u4F60\u7684\u6295\u8D44\u610F\u89C1", "Northline \xB7 Committee room: submit your recommendation"];
  if (has(j, "income") && !has(j, "chapter-confronted")) return ["RelayOps \xB7 \u5F00\u653E\u529E\u516C\u533A\uFF1A\u95EE\u521B\u59CB\u4EBA\u4E3A\u4F55\u4FDD\u7559\u539F\u6458\u8981", "RelayOps \xB7 Workspace: challenge the unchanged brief"];
  if (has(j, "chapter-confronted")) {
    if (!has(j, "delivery-log")) return ["RelayOps \xB7 \u4EA4\u4ED8\u4F5C\u6218\u5BA4\uFF1A\u67E5\u770B\u6545\u969C\u4EA4\u63A5\u5355", "Visit the delivery room for the handover log"];
    if (!has(j, "settlement-review")) return ["BridgeStone \xB7 \u7ED3\u7B97\u529E\u516C\u5BA4\uFF1A\u6838\u5BF9\u4ED8\u6B3E\u94FE\u6761", "Visit the settlement office to reconcile the payment"];
    if (!has(j, "committee-draft")) return ["\u53BB\u6295\u59D4\u4F1A\u4F1A\u8BAE\u5BA4\u67E5\u770B\u4E0A\u6B21\u8BA8\u8BBA\u7559\u75D5", "Visit the committee room for the prior discussion notes"];
    if (!has(j, "budget-revision")) return ["\u91CD\u8BBF\u8D44\u6599\u4F1A\u8BAE\u5BA4\u7684\u4ED8\u6B3E\u53F0\uFF0C\u53D6\u4FEE\u8BA2\u9884\u7B97", "Revisit the payment schedule in the data room for the revision"];
    if (!has(j, "budget-confirmed")) return ["RelayOps \xB7 \u8D44\u6599\u4F1A\u8BAE\u5BA4\uFF1A\u5411\u8D22\u52A1\u8FFD\u95EE\u4FEE\u8BA2\u9884\u7B97", "RelayOps \xB7 Data room: ask finance about the revised budget"];
    if (!has(j, "acceptance-revision")) return ["\u91CD\u8BBF\u5BA2\u6237\u7684\u9A8C\u6536\u53F0\uFF0C\u53D6\u5E26\u65E5\u671F\u7684\u8BF4\u660E", "Revisit the customer\u2019s acceptance note for the dated update"];
    if (!has(j, "boundary-confirmed")) return ["Harbor & Pine \xB7 \u8FD0\u8425\u73B0\u573A\uFF1A\u5411\u5BA2\u6237\u786E\u8BA4\u627F\u8BFA\u8FB9\u754C", "Harbor & Pine \xB7 Operations: confirm what you may promise"];
    if (!has(j, "committee-reconciled")) return ["\u603B\u90E8 \xB7 \u5408\u4F19\u4EBA\u529E\u516C\u5BA4\uFF1A\u5411\u739B\u62C9\u590D\u76D8\u66F4\u6B63\u4E0E\u672A\u51B3\u98CE\u9669", "Northline \xB7 Partner office: review corrections and remaining risks"];
  }
}
var revisionDefinitions = [
  { source: "cash", flag: "budget-revision", title: ["\u4FEE\u8BA2\u9884\u7B97 \xB7 \u5468\u4E94\u665A", "Revised budget \xB7 Friday evening"], body: ["\u666E\u91CC\u5A05\u5C06\u539F\u8868\u7559\u5728\u5DE6\u4FA7\uFF0C\u53E6\u5939\u4E86\u4E00\u9875\u3002\n\n\u7B2C\u4E00\u4F18\u5148\u662F\u5DE5\u8D44\u3001\u7A0E\u8D39\u548C\u5DF2\u6709\u4F9B\u5E94\u5546\u4E49\u52A1\uFF1B\u7B2C\u4E8C\u4F18\u5148\u662F\u4FDD\u4F4F\u9A7B\u573A\u5B9E\u65BD\u56E2\u961F\uFF0C\u6269\u5F20\u62DB\u8058\u6682\u7F13\u3002\u5BA2\u6237\u9000\u6B3E\u5C1A\u672A\u786E\u5B9A\uFF0C\u4E0D\u80FD\u5F53\u4F5C\u96F6\u3002\u4F9B\u5E94\u5546\u5C55\u671F\u4ECD\u672A\u7B7E\u5B57\u3002\n\n\u9875\u811A\u624B\u5199\uFF1A\u201C\u6295\u8D44\u610F\u89C1\u4E0D\u662F\u94F6\u884C\u5230\u8D26\u3002\u5468\u4E00\u4E4B\u524D\uFF0C\u6211\u9700\u8981\u77E5\u9053\u80FD\u591F\u52A8\u7528\u4EC0\u4E48\u3002\u201D\u8BF7\u5411\u5979\u6838\u5B9E\u9884\u7B97\u627F\u8BFA\u3002", "Priya leaves the original on the left and clips on a revision.\n\nPayroll, taxes and existing supplier obligations come first, followed by the on-site delivery team. Expansion hiring is deferred. A possible customer refund cannot be assumed to be zero. Supplier extensions remain unsigned.\n\nIn the margin: \u201CAn investment recommendation is not money in the bank. Before Monday, I need to know what is available.\u201D Ask her which commitments this plan can support."] },
  { source: "acceptance", flag: "acceptance-revision", title: ["\u9A8C\u6536\u8FB9\u754C\u8BF4\u660E \xB7 \u5468\u4E94\u665A", "Acceptance boundaries \xB7 Friday evening"], body: ["\u4E54\u4E39\u628A\u91C7\u8D2D\u90AE\u4EF6\u653E\u5230\u4E00\u65C1\uFF0C\u5728\u8FD0\u8425\u610F\u89C1\u4E0A\u8865\u4E86\u65E5\u671F\u3002\n\n\u5468\u4E00\u53EA\u5B89\u6392\u5DF2\u7ECF\u4E0A\u7EBF\u95E8\u5E97\u7684\u6570\u636E\u540C\u6B65\u590D\u6838\u3002\u5269\u4F59\u4E8C\u5341\u5BB6\u6682\u4E0D\u6269\u5E97\uFF1B\u662F\u5426\u6062\u590D\u6392\u671F\uFF0C\u8981\u770B\u590D\u6838\u7ED3\u679C\u3002\u9000\u6B3E\u6743\u6309\u539F\u5408\u540C\u4FDD\u7559\u3002\n\n\u201C\u6211\u5141\u8BB8\u4F60\u5F15\u7528\u6211\u4EEC\u613F\u610F\u7EE7\u7EED\u9A8C\u8BC1\uFF0C\u4E0D\u5141\u8BB8\u4F60\u5199\u6210\u5DF2\u7ECF\u5168\u91CF\u9A8C\u6536\u3002\u201D\u8FD9\u4E0D\u662F\u7EC8\u6B62\u5408\u4F5C\u901A\u77E5\uFF0C\u4E5F\u4E0D\u662F\u6210\u529F\u4FDD\u8BC1\u3002", "Jordan sets procurement\u2019s email aside and dates the operations note.\n\nMonday is reserved for synchronization checks at stores already live. The remaining twenty will not expand until those results are reviewed. Contractual refund rights remain intact.\n\n\u201CYou may say we will keep testing. You may not say we have accepted the full rollout.\u201D This is neither a termination notice nor a guarantee of success."] }
];
function roomRevision(j, id) {
  return chapterEnabled(j) && has(j, "chapter-confronted") && !has(j, "decision") ? revisionDefinitions.find((r) => r.source === id) : void 0;
}
function chapterDocument(j, id) {
  const record = records.find((r) => r.id === id);
  if (!record) return void 0;
  const revision = chapterEnabled(j) && has(j, "chapter-confronted") ? revisionDefinitions.find((r) => r.source === id) : void 0;
  return revision ? { ...record, title: revision.title, body: revision.body, summary: revision.body } : record;
}
function chapterTopics(j, person) {
  if (!chapterEnabled(j)) return [];
  const f = j.save.facts;
  if (f.decision) {
    const reply = {
      founder: f.decision === "pause" ? ["\u9A6C\u7279\u5965\u7684\u8896\u5B50\u4ECD\u5377\u7740\u3002\u201C\u6211\u4EEC\u5148\u505C\u6269\u5F20\u62DB\u8058\uFF0C\u4ECA\u5929\u8C08\u4F9B\u5E94\u5546\u5C55\u671F\u3002\u4F60\u6CA1\u6709\u7B54\u5E94\u6551\u6211\u4EEC\uFF0C\u6211\u4E5F\u4E0D\u4F1A\u5411\u5458\u5DE5\u8BF4\u8D44\u91D1\u5DF2\u7ECF\u5230\u4E86\u3002\u7B49\u540C\u6B65\u590D\u6838\u51FA\u6765\uFF0C\u6211\u4F1A\u518D\u53D1\u7ED9\u4F60\u3002\u201D", "Mateo still has his sleeves rolled up. \u201CExpansion hiring is on hold. Today we ask suppliers for time. You haven\u2019t promised a rescue, and I won\u2019t tell staff the money has arrived. I\u2019ll send you the synchronization review.\u201D"] : f.decision === "conditional" ? f.terms === "tranche" ? ["\u201C\u6211\u628A\u9996\u671F\u7528\u9014\u5355\u72EC\u5217\u4E86\u3002\u6295\u59D4\u4F1A\u652F\u6301\u4E0D\u7B49\u4E8E\u9996\u671F\u5DF2\u7ECF\u5230\u8D26\uFF1B\u6CD5\u5F8B\u6587\u4EF6\u548C\u4EA4\u5272\u6761\u4EF6\u8FD8\u5F97\u5B8C\u6210\u3002\u540E\u7EED\u90A3\u7B14\u94B1\u4E0D\u80FD\u62FF\u6765\u627F\u8BFA\u672C\u5468\u5DE5\u8D44\u3002\u201D", "\u201CThe first tranche has its own uses schedule. Committee support is not cash received; documentation and closing conditions remain. I cannot promise this week\u2019s payroll from a later tranche.\u201D"] : ["\u201C\u6211\u63A5\u53D7\u4E86\u7A00\u91CA\uFF0C\u4ECA\u5929\u628A\u7528\u9014\u8868\u53D1\u7ED9\u8463\u4E8B\u4F1A\u3002\u4EF7\u683C\u53D8\u4E86\uFF0C\u5B9E\u65BD\u56E2\u961F\u9762\u5BF9\u7684\u540C\u6B65\u95EE\u9898\u6CA1\u53D8\u3002\u94B1\u4E5F\u8981\u7B49\u6587\u4EF6\u548C\u6761\u4EF6\u843D\u5B9E\u3002\u201D", "\u201CI accepted the dilution and sent the uses schedule to the board. The price changed; the delivery team\u2019s synchronization problem did not. Funding still waits on documentation and conditions.\u201D"] : ["\u201C\u6211\u5DF2\u7ECF\u901A\u77E5\u56E2\u961F\u4F60\u652F\u6301\u7EE7\u7EED\uFF0C\u4F46\u6CA1\u6709\u8BF4\u94B1\u5230\u4E86\u3002\u5BA2\u6237\u4ECD\u6309\u539F\u5408\u540C\u9A8C\u6536\u3002\u6211\u77E5\u9053\uFF0C\u4F60\u7B7E\u7684\u662F\u627F\u62C5\u8FD9\u4E9B\u98CE\u9669\u7684\u610F\u89C1\uFF0C\u4E0D\u662F\u4FDD\u8BC1\u6211\u4EEC\u4E00\u5B9A\u6210\u529F\u3002\u201D", "\u201CI told the team you support proceeding, not that money arrived. The customer still follows the contract. Your signature accepts these risks; it does not guarantee our success.\u201D"],
      finance: ["\u666E\u91CC\u5A05\u7ED9\u4F60\u770B\u5468\u4E00\u7684\u4ED8\u6B3E\u8868\u3002\u201C\u5DE5\u8D44\u548C\u5C65\u7EA6\u6392\u5728\u524D\u9762\uFF0C\u5C55\u671F\u6CA1\u6709\u7B7E\u5B57\u5C31\u4E0D\u7B97\u5230\u8D26\u6765\u6E90\u3002\u6211\u4F1A\u628A\u5B9E\u9645\u4F59\u989D\u548C\u539F\u9884\u6D4B\u5E76\u6392\u7ED9\u4F60\uFF1B\u5982\u679C\u6761\u4EF6\u53D8\u4E86\uFF0C\u8BF7\u522B\u7B49\u5230\u4E0B\u6B21\u4F1A\u8BAE\u624D\u56DE\u5E94\u3002\u201D", "Priya shows Monday\u2019s schedule. \u201CPayroll and delivery come first. Unsigned extensions are not a funding source. You\u2019ll see actual balances beside the forecast. If conditions change, please don\u2019t wait for another meeting to respond.\u201D"],
      client: ["\u4E54\u4E39\u671D\u6B63\u5728\u6838\u5BF9\u8868\u683C\u7684\u540C\u4E8B\u70B9\u5934\u3002\u201C\u4ECA\u5929\u7EE7\u7EED\u590D\u6838\u5DF2\u4E0A\u7EBF\u7684\u5E97\u3002\u6295\u8D44\u4EBA\u600E\u4E48\u51B3\u5B9A\uFF0C\u90FD\u4E0D\u4F1A\u66FF\u6211\u4EEC\u5B8C\u6210\u9A8C\u6536\u3002\u7B49\u7ED3\u679C\u51FA\u6765\uFF0C\u6211\u4F1A\u544A\u8BC9\u4F60\u4EC0\u4E48\u53D8\u597D\u4E86\u3001\u4EC0\u4E48\u8FD8\u6CA1\u597D\u3002\u201D\n\n\u4F60\u628A\u8FD9\u53E5\u8BDD\u8865\u8FDB\u6848\u4EF6\u672B\u9875\u3002\u4EA4\u6613\u6709\u4E86\u53BB\u5411\uFF0C\u672A\u5B8C\u6210\u7684\u8D23\u4EFB\u4E5F\u6709\u4E86\u540D\u5B57\u3002", "Jordan nods toward the checklists. \u201CToday we review the stores already live. An investor\u2019s decision cannot perform acceptance for us. I\u2019ll tell you what improved and what did not.\u201D\n\nYou add that sentence to the case. The transaction has a direction; its unfinished responsibilities have owners."]
    };
    return reply[person] && !has(j, "echo-" + person) ? [{ id: "chapter-echo-" + person, label: ["\u5468\u4E00\u4E86\uFF0C\u63A5\u4E0B\u6765\u5982\u4F55\u5B89\u6392\uFF1F", "It\u2019s Monday. What happens next?"], reply: reply[person], effects: ["echo-" + person] }] : [];
  }
  if (person === "founder" && f.income && !f["chapter-confronted"]) return [
    { id: "chapter-replace", label: ["\u9000\u6B3E\u6761\u6B3E\u4E0D\u80FD\u7701\u7565\uFF1A\u8BF7\u66FF\u6362\u6295\u59D4\u4F1A\u6458\u8981", "Replace the brief: the refund terms must be included"], reply: ["\u9A6C\u7279\u5965\u628A\u7535\u8111\u5C4F\u5E55\u8F6C\u56DE\u6765\u3002\u201C\u6211\u672C\u6765\u60F3\u7B49\u4EA4\u5272\u540E\u518D\u89E3\u91CA\u3002\u6362\u6458\u8981\uFF0C\u4F1A\u8BA9\u4F60\u4EEC\u91CD\u65B0\u8BA8\u8BBA\uFF0C\u5BF9\u5427\uFF1F\u201D\n\n\u4F60\u70B9\u5934\u3002\u4ED6\u6700\u7EC8\u540C\u610F\u53D1\u4FEE\u8BA2\u7248\uFF0C\u8BA9\u8D22\u52A1\u5217\u51FA\u5C65\u7EA6\u9884\u7B97\uFF0C\u5E76\u8BA9\u5BA2\u6237\u91CD\u65B0\u5199\u6E05\u9A8C\u6536\u8FB9\u754C\u3002\u201C\u6211\u4E0D\u8981\u6C42\u4F60\u66FF\u6211\u4EEC\u4FDD\u8BC1\u3002\u4F46\u8BF7\u628A\u516D\u5BB6\u5E97\u7684\u4EF7\u503C\u4E5F\u5E26\u56DE\u53BB\u3002\u201D", "Mateo turns the screen back. \u201CI wanted to explain after closing. Replacing the brief means reopening the discussion, doesn\u2019t it?\u201D\n\nYou nod. He agrees to circulate a correction, have finance separate delivery costs, and ask the customer to restate acceptance boundaries. \u201CDo not guarantee us. But bring back the value in those six stores, too.\u201D"], effects: ["chapter-confronted", "brief-replaced", "founder-disclosed"] },
    { id: "chapter-dissent", label: ["\u4FDD\u7559\u539F\u7A3F\uFF0C\u4F46\u628A\u6211\u7684\u5177\u540D\u5F02\u8BAE\u4E00\u8D77\u9001\u5BA1", "Keep the original, with my signed dissent attached"], reply: ["\u201C\u90A3\u4EFD\u6750\u6599\u5DF2\u7ECF\u53D1\u51FA\u53BB\u4E86\u3002\u201D\u9A6C\u7279\u5965\u6CA1\u6709\u6536\u8D70\u539F\u7A3F\u3002\u4F60\u8981\u6C42\u628A\u9000\u6B3E\u98CE\u9669\u4E0E\u672A\u9A8C\u6536\u8303\u56F4\u4F5C\u4E3A\u5177\u540D\u5F02\u8BAE\u540C\u7B49\u9001\u5BA1\uFF0C\u4E0D\u80FD\u85CF\u5728\u9644\u4EF6\u672B\u5C3E\u3002\n\n\u4ED6\u540C\u610F\u8D22\u52A1\u548C\u5BA2\u6237\u8865\u5145\u8BF4\u660E\u3002\u8FD9\u6837\u4FDD\u7559\u4E86\u539F\u59CB\u8BF4\u6CD5\uFF0C\u4E5F\u610F\u5473\u7740\u4F60\u8981\u5728\u4F1A\u4E0A\u4EB2\u53E3\u6307\u51FA\u5206\u6B67\uFF0C\u4E0D\u80FD\u5047\u8BBE\u6BCF\u4E2A\u4EBA\u90FD\u4F1A\u8BFB\u9644\u4EF6\u3002", "\u201CThe original has already circulated.\u201D Mateo leaves it on the table. You require your signed dissent on refunds and unaccepted scope to receive equal attention.\n\nHe agrees to finance and customer updates. The original account remains visible, but you must explain the disagreement in the meeting; you cannot assume everyone reads attachments."], effects: ["chapter-confronted", "brief-dissent", "founder-disclosed"] }
  ];
  if (person === "finance" && f["budget-revision"] && !f["budget-confirmed"]) return [{ id: "chapter-budget", label: ["\u8FD9\u4EFD\u4FEE\u8BA2\u9884\u7B97\u8FD8\u80FD\u627F\u53D7\u4EC0\u4E48\u53D8\u5316\uFF1F", "What can this revised budget actually withstand?"], reply: ["\u201C\u4E0D\u662F\u6BCF\u79CD\u53D8\u5316\u90FD\u627F\u53D7\u5F97\u4F4F\u3002\u201D\u666E\u91CC\u5A05\u628A\u9000\u6B3E\u680F\u7559\u767D\u3002\u201C\u5C55\u671F\u672A\u7B7E\u3001\u9A8C\u6536\u672A\u8FC7\uFF0C\u4E0D\u80FD\u586B\u6210\u6709\u5229\u7ED3\u679C\u3002\u9996\u671F\u592A\u5C0F\uFF0C\u5B9E\u65BD\u505A\u4E0D\u5B8C\uFF1B\u5168\u6B3E\u5230\u4F4D\uFF0C\u4E5F\u4E0D\u4EE3\u8868\u53EF\u4EE5\u9A6C\u4E0A\u6269\u5F20\u3002\u201D\n\n\u4F60\u8BB0\u4E0B\uFF1A\u878D\u8D44\u6761\u4EF6\u5FC5\u987B\u652F\u6301\u5C65\u7EA6\uFF0C\u800C\u4E14\u4E0D\u80FD\u628A\u5BA2\u6237\u7684\u6743\u5229\u7B97\u6CA1\u4E86\u3002", "\u201CNot every change.\u201D Priya leaves the refund line unresolved. \u201CUnsigned extensions and unfinished acceptance cannot become favorable assumptions. Too little upfront and delivery fails; full funding still does not justify immediate expansion.\u201D\n\nYou note that financing must support delivery without erasing the customer\u2019s rights."], effects: ["budget-confirmed", "finance-stress"] }];
  if (person === "client" && f["acceptance-revision"] && !f["boundary-confirmed"]) return [{ id: "chapter-boundary", label: ["\u6211\u80FD\u5411\u6295\u59D4\u4F1A\u627F\u8BFA\u5230\u54EA\u4E00\u6B65\uFF1F", "What exactly may I tell the committee?"], reply: ["\u201C\u4F60\u53EF\u4EE5\u8BF4\u516D\u5BB6\u8001\u5E97\u6709\u4EF7\u503C\uFF0C\u6211\u4EEC\u613F\u610F\u7EE7\u7EED\u6838\u9A8C\u3002\u4F60\u4E0D\u80FD\u66FF\u6211\u627F\u8BFA\u5269\u4F59\u4E8C\u5341\u5BB6\u7684\u9A8C\u6536\uFF0C\u4E5F\u4E0D\u80FD\u628A\u4FDD\u7559\u9000\u6B3E\u6743\u5199\u6210\u4E00\u5B9A\u9000\u6B3E\u3002\u201D\n\n\u4E54\u4E39\u8BA9\u4F60\u4FDD\u7559\u5E26\u65E5\u671F\u7684\u8BF4\u660E\u3002\u201C\u6295\u8D44\u4EBA\u9700\u8981\u786E\u5B9A\u6027\uFF0C\u6211\u7406\u89E3\u3002\u4F46\u522B\u4ECE\u6211\u4EEC\u8FD9\u91CC\u501F\u4E00\u4E2A\u4E0D\u5B58\u5728\u7684\u4FDD\u8BC1\u3002\u201D", "\u201CSay the six established stores have value and we will continue testing. Do not promise acceptance for the other twenty on my behalf, or turn retained refund rights into a definite demand.\u201D\n\nJordan lets you keep the dated note. \u201CI understand investors want certainty. Do not borrow a guarantee we never gave.\u201D"], effects: ["boundary-confirmed", "client-confirmed"] }];
  if (person === "partner" && f["delivery-log"] && f["settlement-review"] && f["committee-draft"] && f["budget-confirmed"] && f["boundary-confirmed"] && !f["committee-reconciled"]) return [{ id: "chapter-reconcile", label: ["\u66F4\u6B63\u5DF2\u7ECF\u843D\u5B9E\uFF0C\u4F46\u8FD9\u4E9B\u98CE\u9669\u4ECD\u672A\u6D88\u5931", "The corrections are in. These risks remain"], reply: f["brief-replaced"] ? ["\u739B\u62C9\u628A\u65B0\u7248\u653E\u5230\u539F\u7A3F\u4E0A\u3002\u201C\u6211\u4F1A\u91CD\u65B0\u5F00\u573A\uFF0C\u4E0D\u628A\u8FD9\u4E2A\u66F4\u6B63\u8BF4\u6210\u7B14\u8BEF\u3002\u4F60\u4FDD\u4F4F\u4E86\u6211\u4EEC\u636E\u5B9E\u8BA8\u8BBA\u7684\u673A\u4F1A\uFF0C\u4E5F\u5EF6\u540E\u4E86\u672C\u6765\u4EE5\u4E3A\u8C08\u59A5\u7684\u5171\u8BC6\u3002\u201D\n\n\u201C\u73B0\u5728\u5199\u4F60\u7684\u5EFA\u8BAE\u3002\u652F\u6301\uFF0C\u5C31\u8BF4\u6E05\u63A5\u53D7\u4EC0\u4E48\uFF1B\u6682\u505C\uFF0C\u5C31\u8BF4\u6E05\u9760\u4EC0\u4E48\u91CD\u5F00\u3002\u6211\u7684\u540D\u5B57\u4E0D\u4F1A\u66FF\u4F60\u7B7E\u3002\u201D", "Mara lays the revision over the original. \u201CI\u2019ll reopen the discussion. This is not a typo. You preserved an honest decision, and delayed a consensus we thought we had.\u201D\n\n\u201CNow make your recommendation. If you support it, name the risks. If you pause, name what would reopen it. My name cannot sign for yours.\u201D"] : ["\u739B\u62C9\u628A\u4F60\u7684\u5F02\u8BAE\u653E\u5728\u6458\u8981\u7B2C\u4E00\u9875\u3002\u201C\u6211\u4F1A\u7ED9\u4F60\u65F6\u95F4\u76F4\u63A5\u8BB2\u3002\u4FDD\u7559\u539F\u7A3F\u80FD\u8BA9\u5927\u5BB6\u770B\u5230\u5206\u6B67\u7684\u6765\u6E90\uFF0C\u4F46\u6CA1\u4EBA\u53EF\u4EE5\u7528\u6CA1\u770B\u9644\u4EF6\u5F53\u7406\u7531\u3002\u201D\n\n\u201C\u73B0\u5728\u5199\u4F60\u7684\u5EFA\u8BAE\u3002\u4F60\u4E0D\u9700\u8981\u540C\u610F\u6211\uFF0C\u4F46\u5FC5\u987B\u8BA9\u4EBA\u7406\u89E3\u4F60\u613F\u610F\u627F\u62C5\u4EC0\u4E48\u3002\u201D", "Mara places your dissent at the front. \u201CYou\u2019ll have time to explain it. Keeping the original shows where we differed. Nobody can say they missed an attachment.\u201D\n\n\u201CNow make your recommendation. You do not have to agree with me. You must make clear what you are willing to own.\u201D"], effects: ["committee-reconciled"] }];
  return [];
}
function chapterRoomNote(j) {
  if (!chapterEnabled(j)) return;
  if (has(j, "decision")) return ["\u5468\u4E00\u65E9\u6668\u3002\u4EA4\u6613\u610F\u89C1\u5DF2\u9001\u51FA\uFF0C\u56DE\u590D\u9646\u7EED\u56DE\u6765\u3002", "Monday morning. The recommendation is out; replies are arriving."];
  if (!has(j, "chapter-confronted")) return;
  return { fund: ["\u539F\u6458\u8981\u4ECD\u5728\u684C\u4E0A\uFF0C\u7B49\u5F85\u4F60\u5E26\u56DE\u66F4\u6B63\u4E0E\u5F02\u8BAE\u3002", "The original brief waits for your corrections and dissent."], office: ["\u767D\u677F\u4E0A\u7684\u6269\u5F20\u8BA1\u5212\u6682\u672A\u64E6\u53BB\uFF0C\u521B\u59CB\u4EBA\u5F00\u59CB\u91CD\u6574\u6750\u6599\u3002", "The expansion plan remains on the board while the founder revises the case."], records: ["\u4ED8\u6B3E\u53F0\u5939\u5165\u4E86\u4E00\u9875\u4FEE\u8BA2\u9884\u7B97\uFF0C\u539F\u59CB\u4ED8\u6B3E\u8868\u4ECD\u4FDD\u7559\u3002", "A revised budget is clipped to the payment schedule. The original remains."], client: ["\u9A8C\u6536\u53F0\u8865\u4E0A\u4E86\u5E26\u65E5\u671F\u7684\u8BF4\u660E\uFF0C\u6269\u5E97\u6392\u671F\u6682\u7F13\u3002", "A dated acceptance note is on the desk. Further rollout is on hold."] }[j.scene];
}

// src/engine-source/types.ts
var SCENE_IMAGE_PROMPT_VERSION = 7;

// src/engine-source/i18n.ts
var dictionary = {
  zh: {
    folio: "ALTERU \xB7 \u4E16\u754C\u5FD7 02",
    kicker: "\u4F1A\u8BB0\u4F4F\u4EBA\u7269\u4E0E\u9009\u62E9\u7684\u5BF9\u8BDD\u4E16\u754C",
    chooseWorld: "\u9009\u62E9\u4E16\u754C\u6A21\u5757",
    cartridge: "\u5185\u5BB9\u5305",
    demo: "\u6A21\u677F\u6F14\u793A",
    aigram: "Aigram AI \u4E16\u754C",
    aigramReady: "\u7531 AI \u7ED3\u5408\u5F53\u524D\u5B58\u6863\u6301\u7EED\u751F\u6210",
    remote: "\u8FDE\u7EED\u4E16\u754C\u63A5\u53E3",
    remoteReady: "\u4F7F\u7528\u5DF2\u7ED1\u5B9A\u7684\u8FDE\u7EED\u4E16\u754C",
    remoteUnavailable: "\u9700\u8981\u4ECE\u5E26 chat_id \u7684\u6B63\u5F0F\u4F1A\u8BDD\u8FDB\u5165",
    world: "\u6253\u5F00\u4EBA\u7269\u5173\u7CFB\u4E0E\u65C5\u9014\u624B\u518C",
    textSize: "\u6587\u5B57\u5927\u5C0F",
    textSizeSmall: "\u5C0F",
    textSizeStandard: "\u6807\u51C6",
    textSizeLarge: "\u5927",
    audioEnable: "\u5F00\u542F\u58F0\u97F3",
    audioMute: "\u9759\u97F3",
    audioUnavailable: "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u6E38\u620F\u97F3\u9891",
    stats: "\u5F53\u524D\u4E16\u754C\u6570\u503C",
    openStatDetails: "\u67E5\u770B{name}\u548C\u4EBA\u7269\u72B6\u6001\u8BE6\u60C5",
    imageAlt: "{name}\u7684\u5267\u60C5\u73B0\u573A",
    imageFailedAria: "\u573A\u666F\u56FE\u7247\u751F\u6210\u5931\u8D25",
    imageGeneratingAria: "\u573A\u666F\u56FE\u7247\u6B63\u5728\u751F\u6210",
    imageIdle: "\u7B49\u5F85\u8BB0\u5F55\u73B0\u573A",
    imageQueued: "\u5DF2\u8FDB\u5165\u7ED8\u5236\u961F\u5217",
    imageGenerating: "\u6B63\u5728\u8BB0\u5F55\u73B0\u573A\uFF0C\u4E0D\u5F71\u54CD\u7EE7\u7EED\u884C\u52A8",
    imageFailed: "\u73B0\u573A\u8BB0\u5F55\u5931\u8D25",
    imageReady: "\u73B0\u573A\u8BB0\u5F55\u5DF2\u5F52\u6863",
    retry: "\u91CD\u8BD5",
    retryAction: "\u91CD\u8BD5\u8FD9\u4E00\u6B65",
    summary: "\u9636\u6BB5\u5C0F\u7ED3 \xB7 \u5DF2\u4FDD\u5B58",
    notEnding: "\u8FD9\u4E0D\u662F\u7ED3\u5C40\uFF0C\u53EF\u4EE5\u4ECE\u8FD9\u91CC\u7EE7\u7EED\u3002",
    yourAction: "\u4F60\u7684\u884C\u52A8",
    demoFallback: "\u5207\u6362\u5230\u6A21\u677F\u6F14\u793A",
    aigramFallback: "\u6539\u7528 Aigram AI",
    reply: "\u56DE\u590D",
    customAction: "\u81EA\u5B9A\u4E49\u884C\u52A8",
    sendAction: "\u53D1\u9001\u884C\u52A8",
    worldRecord: "\u4E16\u754C\u8BB0\u5F55",
    worldData: "\u4E16\u754C\u8D44\u6599",
    closeWorldData: "\u5173\u95ED\u4E16\u754C\u8D44\u6599",
    close: "\u5173\u95ED",
    back: "\u8FD4\u56DE\u5217\u8868",
    openDetails: "\u67E5\u770B\u8BE6\u60C5",
    currentStatus: "\u5F53\u524D\u72B6\u6001",
    journeyOverview: "\u65C5\u7A0B\u6982\u51B5",
    storySegments: "\u5267\u60C5\u6BB5\u843D",
    inventoryItems: "\u884C\u56CA\u7269\u54C1",
    openWorldSection: "\u524D\u5F80\u4E16\u754C\u8D44\u6599\u7684\u5176\u4ED6\u90E8\u5206",
    abilities: "\u80FD\u529B",
    relationshipHistory: "\u5173\u7CFB\u8BB0\u5F55",
    activeCompanions: "\u540C\u884C\u4E2D",
    peopleEncountered: "\u65C5\u9014\u4E2D\u8BA4\u8BC6\u7684\u4EBA",
    relationshipOverview: "\u4EBA\u7269\u5173\u7CFB",
    relationshipOverviewSummary: "\u8BA4\u8BC6 {people} \u4EBA \xB7 \u7559\u4E0B {events} \u6BB5\u5171\u540C\u7ECF\u5386",
    relationshipOverviewHint: "\u70B9\u5F00\u4E00\u4E2A\u4EBA\uFF0C\u67E5\u770B\u4F60\u4EEC\u73B0\u5728\u7684\u5173\u7CFB\u3001\u5171\u540C\u7ECF\u5386\u548C\u6700\u8FD1\u6240\u5728\u3002",
    ownJourney: "\u6211\u7684\u65C5\u7A0B",
    noRelationshipHistory: "\u5C1A\u672A\u8BB0\u5F55\u5173\u7CFB\u53D8\u5316",
    placeOverview: "\u5730\u70B9\u73B0\u72B6",
    connections: "\u9053\u8DEF\u8FDE\u63A5",
    knownFacts: "\u5DF2\u77E5\u4E8B\u5B9E",
    noKnownFacts: "\u76EE\u524D\u53EA\u77E5\u9053\u5B83\u5728\u5730\u56FE\u4E0A\u7684\u4F4D\u7F6E\u3002\u7EE7\u7EED\u63A2\u7D22\u4F1A\u8865\u5168\u8FD9\u91CC\u3002",
    background: "\u4E16\u754C\u80CC\u666F",
    itemIllustration: "\u7269\u54C1\u56FE\u9274",
    generateItemImage: "\u751F\u6210\u7269\u54C1\u56FE",
    regenerateItemImage: "\u91CD\u65B0\u751F\u6210",
    itemImageIdle: "\u6253\u5F00\u884C\u56CA\u540E\uFF0C\u4E16\u754C\u4F1A\u81EA\u52A8\u4E3A\u5B83\u663E\u5F71",
    itemImageQueued: "\u5DF2\u8FDB\u5165\u4E16\u754C\u663E\u5F71\u961F\u5217",
    itemImageGenerating: "\u6B63\u5728\u663E\u5F71\uFF0C\u53EF\u5173\u95ED\u884C\u56CA\u7EE7\u7EED\u6E38\u620F",
    itemImageFailed: "\u672C\u6B21\u663E\u5F71\u672A\u5B8C\u6210\uFF1B\u4E0B\u6B21\u6253\u5F00\u884C\u56CA\u4F1A\u81EA\u52A8\u91CD\u8BD5",
    itemImageReady: "\u7269\u54C1\u56FE\u5DF2\u5B58\u5165\u884C\u56CA",
    itemDescription: "\u5B83\u662F\u4EC0\u4E48",
    itemEffect: "\u4F5C\u7528\u4E0E\u9650\u5236",
    itemMetrics: "\u5C5E\u6027\u6570\u503C",
    itemLore: "\u6765\u5386\u4E0E\u4E16\u754C",
    quantity: "\u6570\u91CF",
    rarity: "\u7A00\u6709\u5EA6",
    rarityCommon: "\u666E\u901A",
    rarityRare: "\u7A00\u6709",
    rarityLegendary: "\u4F20\u5947",
    noDetails: "\u8FD9\u6761\u8BB0\u5F55\u8FD8\u5F88\u7B80\u7565\u3002\u7EE7\u7EED\u8C03\u67E5\u540E\uFF0C\u4E16\u754C\u4F1A\u8865\u5168\u5B83\u3002",
    journalDetail: "\u8BB0\u5F55\u8BE6\u60C5",
    vitality: "\u6D3B\u529B",
    stress: "\u538B\u529B",
    here: "\u6B64\u5904",
    currentObjective: "\u5F53\u524D\u76EE\u6807",
    currentSituation: "\u773C\u524D",
    valueChanged: "\u6570\u503C\u53D8\u5316",
    warmer: "\u5173\u7CFB\u5347\u6E29",
    colder: "\u5173\u7CFB\u8F6C\u51B7",
    system: "\u7CFB\u7EDF",
    segmentSaved: "\u7B2C {n} \u6BB5 \xB7 \u72B6\u6001\u5DF2\u81EA\u52A8\u4FDD\u5B58",
    startOver: "\u4ECE\u5934\u5F00\u59CB",
    startOverDescription: "\u6E05\u9664\u8FD9\u4E2A\u4E16\u754C\u7684\u5730\u70B9\u3001\u6570\u503C\u3001\u7269\u54C1\u3001\u5173\u7CFB\u548C\u5267\u60C5\u8BB0\u5F55\uFF0C\u56DE\u5230\u6700\u521D\u7684\u5F00\u573A\u3002",
    startOverWarning: "\u5F53\u524D\u5B58\u6863\u4F1A\u88AB\u8986\u76D6\uFF0C\u751F\u6210\u8FC7\u7684\u56FE\u7247\u548C\u6240\u6709\u5267\u60C5\u8BB0\u5F55\u90FD\u65E0\u6CD5\u6062\u590D\u3002",
    startOverConfirm: "\u786E\u8BA4\u4ECE\u5934\u5F00\u59CB",
    startOverCancel: "\u4FDD\u7559\u5F53\u524D\u65C5\u7A0B",
    startOverBusy: "\u8BF7\u7B49\u5F85\u5F53\u524D\u884C\u52A8\u5B8C\u6210\u540E\u518D\u91CD\u65B0\u5F00\u59CB\u3002",
    restoring: "\u6B63\u5728\u6062\u590D\u4E0A\u6B21\u7684\u5BF9\u8BDD",
    resumeLatestTitle: "\u6B22\u8FCE\u56DE\u6765",
    resumeLatestDescription: "\u5DF2\u7ECF\u6062\u590D\u4E86\u4E0A\u6B21\u7684\u5B58\u6863\u3002\u4F60\u53EF\u4EE5\u4ECE\u5F00\u5934\u56DE\u987E\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u56DE\u5230\u6700\u65B0\u8FDB\u5EA6\u3002",
    resumeLatestAction: "\u7EE7\u7EED\u6E38\u620F",
    resumeFromStart: "\u91CD\u65B0\u5F00\u59CB",
    newContent: "\u6709\u65B0\u5185\u5BB9",
    actionWritten: "\u884C\u52A8\u5DF2\u5199\u5165\u4E16\u754C",
    aigramUnavailable: "AI \u4E16\u754C\u6682\u65F6\u6CA1\u6709\u56DE\u5E94\u3002\u4F60\u7684\u884C\u52A8\u548C\u6570\u503C\u90FD\u6CA1\u6709\u88AB\u63D0\u4EA4\uFF0C\u8BF7\u91CD\u8BD5\u3002",
    demoComplete: "\u6A21\u677F\u6F14\u793A\u5185\u5BB9\u5DF2\u7ECF\u8D70\u5B8C\u3002\u8BF7\u4F7F\u7528\u6B63\u5F0F Aigram AI \u4E16\u754C\u7EE7\u7EED\u6545\u4E8B\u3002",
    remoteMissing: "\u7F3A\u5C11 chat_id\uFF0C\u8FDC\u7A0B\u4E16\u754C\u53EA\u80FD\u5728\u5DF2\u521B\u5EFA\u7684\u6E38\u620F\u4F1A\u8BDD\u4E2D\u4F7F\u7528\u3002",
    remoteUnavailableError: "\u4E16\u754C\u63A5\u53E3\u6682\u4E0D\u53EF\u7528\uFF08{n}\uFF09",
    remoteEmpty: "\u4E16\u754C\u63A5\u53E3\u6CA1\u6709\u8FD4\u56DE\u53EF\u4FDD\u5B58\u7684\u5267\u60C5\u5185\u5BB9\u3002",
    worldResponding: "\u4E16\u754C\u6B63\u5728\u56DE\u5E94",
    checkingState: "\u6838\u5BF9\u4EBA\u7269\u4E0E\u6570\u503C",
    consistencyRecovery: "\u201C{action}\u201D\u8FD9\u6761\u63A8\u8350\u884C\u52A8\u6CA1\u6709\u5F97\u5230\u53EF\u9760\u7ED3\u679C\uFF0C\u5DF2\u4ECE\u5F53\u524D\u9009\u9879\u4E2D\u79FB\u9664\u3002\u4F60\u4ECD\u5728{name}\uFF0C\u6570\u503C\u3001\u7269\u54C1\u548C\u5DF2\u7ECF\u53D1\u751F\u7684\u4E8B\u90FD\u6CA1\u6709\u6539\u53D8\uFF1B\u53EF\u4EE5\u9009\u62E9\u5176\u4F59\u884C\u52A8\uFF0C\u6216\u76F4\u63A5\u5199\u4E0B\u53E6\u4E00\u79CD\u505A\u6CD5\u3002",
    consistencyRecoveryConfirmed: "\u8FD9\u6761\u65E0\u6CD5\u53EF\u9760\u63A8\u8FDB\u7684\u63A8\u8350\u884C\u52A8\u5DF2\u7ECF\u79FB\u9664\u3002\u4F60\u4ECD\u5728{name}\uFF0C\u53EF\u4EE5\u4ECE\u5176\u4F59\u53EF\u6267\u884C\u884C\u52A8\u7EE7\u7EED\u3002",
    consistencyRecoveryPaused: "\u4F60\u51B3\u5B9A\u6682\u65F6\u653E\u4E0B\u201C{action}\u201D\u3002\u8FD9\u4E0D\u4F1A\u6539\u5199\u5DF2\u7ECF\u53D1\u751F\u7684\u4E8B\uFF1B\u4F60\u4ECD\u7559\u5728{name}\uFF0C\u53EF\u4EE5\u4ECE\u5F53\u524D\u5C40\u52BF\u9009\u62E9\u53E6\u4E00\u6761\u53EF\u6267\u884C\u7684\u8DEF\u3002",
    checkSuccess: "\u6210\u529F",
    checkFailure: "\u5931\u8D25",
    dangerWarning: "\u5371\u9669\u5F81\u5146\u6B63\u5728\u663E\u73B0",
    dangerConfrontation: "\u5A01\u80C1\u5DF2\u7ECF\u903C\u5230\u773C\u524D",
    dangerResolved: "\u8FD9\u6B21\u5A01\u80C1\u5DF2\u7ECF\u5316\u89E3",
    dangerResolvedCostly: "\u4F60\u4ED8\u51FA\u4EE3\u4EF7\uFF0C\u8D8A\u8FC7\u4E86\u8FD9\u6B21\u5A01\u80C1",
    dangerFailed: "\u884C\u52A8\u5931\u8D25\uFF0C\u4E16\u754C\u8BB0\u4F4F\u4E86\u540E\u679C",
    arrived: "\u62B5\u8FBE\uFF1A{name}",
    gained: "\u83B7\u5F97",
    lost: "\u5931\u53BB",
    joined: "\u52A0\u5165\u4E86\u540C\u884C\u8005",
    left: "\u79BB\u5F00\u4E86\u540C\u884C\u8005",
    companion: "\u540C\u884C\u8005",
    knownPerson: "\u8BA4\u8BC6\u7684\u65C5\u4EBA",
    partyStatusCompanion: "\u6B63\u5728\u540C\u884C",
    partyStatusKnown: "\u5DF2\u8BA4\u8BC6",
    partyStatusDeparted: "\u5DF2\u79BB\u961F",
    unknownAbility: "\u672A\u77E5\u80FD\u529B",
    chapterPaused: "\u672C\u6BB5\u65C5\u7A0B\u544A\u4E00\u6BB5\u843D",
    you: "\u4F60",
    protagonist: "\u6545\u4E8B\u4E3B\u89D2",
    playerAvatarAlt: "{name}\u7684\u5934\u50CF"
  },
  en: {
    folio: "ALTERU \xB7 WORLD FOLIO 02",
    kicker: "A conversational world that remembers people and choices",
    chooseWorld: "Choose a world cartridge",
    cartridge: "Cartridge",
    demo: "Template demo",
    aigram: "Aigram AI world",
    aigramReady: "AI continues from the current saved state",
    remote: "Persistent world API",
    remoteReady: "Use the bound persistent world",
    remoteUnavailable: "Open from a session containing chat_id",
    world: "Open relationships and travel folio",
    textSize: "Text size",
    textSizeSmall: "Small",
    textSizeStandard: "Standard",
    textSizeLarge: "Large",
    audioEnable: "Turn sound on",
    audioMute: "Mute sound",
    audioUnavailable: "Game audio is unavailable in this browser",
    stats: "Current world values",
    openStatDetails: "View {name} and player status details",
    imageAlt: "Story scene: {name}",
    imageFailedAria: "Scene image generation failed",
    imageGeneratingAria: "Scene image is being generated",
    imageIdle: "Waiting to record the scene",
    imageQueued: "Added to the illustration queue",
    imageGenerating: "Recording the scene \u2014 you may keep playing",
    imageFailed: "Scene record failed",
    imageReady: "Scene record archived",
    retry: "Retry",
    retryAction: "Retry this action",
    summary: "Chapter note \xB7 saved",
    notEnding: "This is not the ending. You can continue from here.",
    yourAction: "Your action",
    demoFallback: "Switch to template demo",
    aigramFallback: "Use Aigram AI",
    reply: "Reply",
    customAction: "Custom action",
    sendAction: "Send action",
    worldRecord: "WORLD RECORD",
    worldData: "World record",
    closeWorldData: "Close world record",
    close: "Close",
    back: "Back to list",
    openDetails: "View details",
    currentStatus: "Current status",
    journeyOverview: "Journey overview",
    storySegments: "Story segments",
    inventoryItems: "Pack items",
    openWorldSection: "Open another part of the world record",
    abilities: "Abilities",
    relationshipHistory: "Relationship record",
    activeCompanions: "Traveling together",
    peopleEncountered: "People met along the way",
    relationshipOverview: "Relationships",
    relationshipOverviewSummary: "{people} people met \xB7 {events} shared moments",
    relationshipOverviewHint: "Open a person to see your current relationship, shared history, and where they were last seen.",
    ownJourney: "My journey",
    noRelationshipHistory: "No relationship changes recorded yet",
    placeOverview: "Current condition",
    connections: "Road connections",
    knownFacts: "Known facts",
    noKnownFacts: "Only its position on the map is known. Exploration will fill in the rest.",
    background: "World background",
    itemIllustration: "Item illustration",
    generateItemImage: "Generate item art",
    regenerateItemImage: "Generate again",
    itemImageIdle: "The world will reveal it when you open your pack",
    itemImageQueued: "Added to the world-reveal queue",
    itemImageGenerating: "Taking shape \u2014 you may close your pack and keep playing",
    itemImageFailed: "The reveal did not finish; opening your pack again will retry it",
    itemImageReady: "Item art saved in your pack",
    itemDescription: "What it is",
    itemEffect: "Use and limits",
    itemMetrics: "Attributes",
    itemLore: "Origin and world",
    quantity: "Quantity",
    rarity: "Rarity",
    rarityCommon: "Common",
    rarityRare: "Rare",
    rarityLegendary: "Legendary",
    noDetails: "This record is still sparse. The world will fill it in as you investigate.",
    journalDetail: "Record details",
    vitality: "Vitality",
    stress: "Stress",
    here: "Here",
    currentObjective: "Current objective",
    currentSituation: "Right now",
    valueChanged: "Value changed",
    warmer: "Relationship warming",
    colder: "Relationship cooling",
    system: "System",
    segmentSaved: "Segment {n} \xB7 state saved automatically",
    startOver: "Start over",
    startOverDescription: "Clear this world\u2019s locations, values, items, relationships, and story record, then return to the opening.",
    startOverWarning: "Your current save, generated images, and story record will be overwritten and cannot be recovered.",
    startOverConfirm: "Yes, start over",
    startOverCancel: "Keep this journey",
    startOverBusy: "Wait for the current action to finish before starting over.",
    restoring: "Restoring your last conversation",
    resumeLatestTitle: "Welcome back",
    resumeLatestDescription: "Your previous save is ready. Review from the beginning, or return directly to the latest point.",
    resumeLatestAction: "Continue game",
    resumeFromStart: "Start over",
    newContent: "New content",
    actionWritten: "Action entered into the world",
    aigramUnavailable: "The AI world did not respond. Your action and values were not committed; please retry.",
    demoComplete: "The finite template demo ends here. Use the Aigram AI world to continue the story.",
    remoteMissing: "Missing chat_id. The persistent world requires an existing game session.",
    remoteUnavailableError: "The world service is unavailable ({n}).",
    remoteEmpty: "The world service returned no saveable story content.",
    worldResponding: "The world is responding",
    checkingState: "Checking characters and values",
    consistencyRecovery: "The recommended action \u201C{action}\u201D did not produce a reliable result and has been removed from the current options. You remain at {name}; stats, items, and established events are unchanged. Choose another available action or write a different one.",
    consistencyRecoveryConfirmed: "The recommended action that could not advance reliably has been removed. You remain at {name} and can continue with another executable action.",
    consistencyRecoveryPaused: "You set \u201C{action}\u201D aside for now. Nothing already established is rewritten; you remain at {name} and can choose another workable course from the present situation.",
    checkSuccess: "Success",
    checkFailure: "Failure",
    dangerWarning: "Signs of danger are emerging",
    dangerConfrontation: "The threat is now immediate",
    dangerResolved: "The threat has been overcome",
    dangerResolvedCostly: "You passed the threat at a cost",
    dangerFailed: "The action failed, and the world keeps the consequence",
    arrived: "Arrived: {name}",
    gained: "Gained",
    lost: "Lost",
    joined: " joined the party",
    left: " left the party",
    companion: "Companion",
    knownPerson: "Known traveler",
    partyStatusCompanion: "Traveling together",
    partyStatusKnown: "Known",
    partyStatusDeparted: "Departed",
    unknownAbility: "Unknown ability",
    chapterPaused: "This chapter pauses here",
    you: "You",
    protagonist: "Story protagonist",
    playerAvatarAlt: "{name}'s avatar"
  }
};
function t(locale, key, vars = {}) {
  return String(dictionary[locale][key]).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
}

// src/engine-source/engine/imageDirector.ts
function lastScheduledScene(save) {
  return save.blocks.reduce((latest, block) => {
    if (block.kind !== "image") return latest;
    const match = block.id.match(/^image-(\d+)$/);
    return match ? Math.max(latest, Number(match[1])) : latest;
  }, 0);
}
function firstTrigger(triggers, allowed) {
  return triggers.find((trigger) => allowed.includes(trigger));
}
function normalizedName(value) {
  return value.toLocaleLowerCase().replace(/[\s·•.。,:：，'’"“”()（）\-—_]/g, "");
}
function substantiveDialogue(value) {
  const compact = value.replace(/\s+/g, "");
  const han = compact.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const words2 = value.match(/[a-z][a-z'-]*/gi)?.length ?? 0;
  return han >= 6 || words2 >= 5 || compact.length >= 18;
}
function expressionOwner(next, parsed) {
  const explicit = [...parsed.commands].reverse().find((command) => command.type === "dialogue_focus");
  const impactfulCommand = parsed.commands.some((command) => command.type === "state" || command.type === "map_update" || command.type === "reputation" || command.type === "party_change" || command.type === "character_update" || command.type === "job" || command.type === "encounter" || command.type === "session_end" || command.type === "skill_check");
  const importantText = /真相|秘密|线索|发现|决定|答应|承诺|警告|小心|必须|不能|不要|别|愿意|喜欢|害怕|担心|抱歉|原谅|谢谢你|再见|留下|离开|失踪|死亡|请求|邀请|任务|报酬|危险|救|trust|truth|secret|clue|discover|decid|promise|warn|careful|must|cannot|can't|don't|stay|leave|missing|dead|afraid|sorry|forgive|thank you|invite|request|task|payment|danger|save/i;
  const neutralTone = /^(?:main|neutral|ordinary|calm|polite|matter[- ]of[- ]fact|平静|中性|普通|客气|礼貌|随口)$/i;
  const dialogues = [...parsed.blocks].reverse().filter((block) => block.kind === "dialogue" && block.speaker);
  const selected = explicit?.type === "dialogue_focus" ? dialogues.find((dialogue) => normalizedName(dialogue.speaker ?? "") === normalizedName(explicit.speaker)) : dialogues.find((dialogue) => substantiveDialogue(dialogue.text) && (importantText.test(dialogue.text) || !neutralTone.test(dialogue.tone?.trim() ?? "main") || impactfulCommand));
  if (!selected?.speaker) return void 0;
  const speaker = normalizedName(selected.speaker);
  const character = next.characters.find((entry) => normalizedName(entry.name) === speaker);
  return { character, dialogue: selected, expression: explicit?.type === "dialogue_focus" ? explicit.expression : void 0 };
}
function detectTriggers(previous, next, parsed) {
  const triggers = [];
  for (const command of parsed.commands) {
    if (command.type === "map_update") {
      const known = previous.map.find((node) => node.label === command.location || node.id === command.location);
      if (!known?.visited) triggers.push("new-location");
    }
    if (command.type === "inventory" && command.action === "add" && (command.rarity === "rare" || command.rarity === "legendary")) triggers.push("rare-item");
    if (command.type === "party_change") triggers.push("party-change");
    if (command.type === "session_end") triggers.push("chapter-checkpoint");
    if (command.type === "reputation") triggers.push("relationship-change");
    if (command.type === "state" && command.value && command.value !== previous.objective) triggers.push("objective-change");
    if (command.type === "skill_check") triggers.push("skill-outcome");
  }
  if (expressionOwner(next, parsed)) triggers.push("character-expression");
  return [...new Set(triggers)];
}
function focusFor(reason, parsed, next) {
  if (reason === "new-location") {
    const node = next.map.find((entry) => entry.current);
    const evidence = [node?.detail, ...node?.facts ?? []].filter(Boolean).join("; ");
    return `the first arrival at ${next.location}${evidence ? `, visibly established through these local facts: ${evidence}` : ""}`;
  }
  if (reason === "rare-item") {
    const item = parsed.commands.find((command) => command.type === "inventory" && command.action === "add" && (command.rarity === "rare" || command.rarity === "legendary"));
    return item?.type === "inventory" ? `the discovery of ${item.item}` : "an important discovery";
  }
  if (reason === "party-change") {
    const party = parsed.commands.find((command) => command.type === "party_change");
    return party?.type === "party_change" ? `${party.character} ${party.change === "add" ? "joining" : "leaving"} the group` : "a change in the group";
  }
  if (reason === "chapter-checkpoint") return "the visible situation at this chapter checkpoint";
  if (reason === "relationship-change") {
    const relationship = parsed.commands.find((command) => command.type === "reputation");
    return relationship?.type === "reputation" ? `a relationship turning point involving ${relationship.npc}` : "a relationship turning point";
  }
  if (reason === "objective-change") return `the newly established objective: ${next.objective}`;
  if (reason === "skill-outcome") return "the visible consequence of the latest attempt";
  if (reason === "character-expression") {
    const owner = expressionOwner(next, parsed);
    return owner ? `${owner.character?.name ?? owner.dialogue.speaker}'s readable expression and gesture while saying: ${owner.dialogue.text}` : "an important character reaction";
  }
  return "the most visually distinctive visible consequence of the latest turn";
}
function visibleBeat(parsed) {
  return parsed.blocks.filter((block) => block.kind !== "change" && block.kind !== "image" && block.kind !== "choices" && block.text.trim()).slice(-4).map((block) => block.speaker ? `${block.speaker}: ${block.text}` : block.text).join(" ").replace(/\s+/g, " ").slice(0, 760);
}
function words(value) {
  return value.toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? [];
}
function pairs(value) {
  const tokens = words(value);
  return new Set(tokens.slice(0, -1).map((token, index) => `${token} ${tokens[index + 1]}`));
}
function carriesOpeningResidue(cartridge2, next, parsed, proposal) {
  if (next.location === cartridge2.opening.location) return false;
  const directionPairs = pairs(cartridge2.sceneImageDirection ?? "");
  const openingReference = `${cartridge2.opening.imagePrompt} ${cartridge2.sceneImageAvoid ?? ""}`;
  const openingPairs = pairs(openingReference);
  const proposalPairs = pairs(proposal);
  const beatPairs = pairs(visibleBeat(parsed));
  let residuePairs = 0;
  for (const phrase of proposalPairs) {
    if (openingPairs.has(phrase) && !directionPairs.has(phrase) && !beatPairs.has(phrase)) residuePairs += 1;
  }
  const directionWords = new Set(words(cartridge2.sceneImageDirection ?? ""));
  const openingWords = new Set(words(openingReference).filter((token) => !directionWords.has(token)));
  const beatWords = new Set(words(visibleBeat(parsed)));
  const proposalWords = new Set(words(proposal));
  let residueWords = 0;
  for (const token of proposalWords) {
    if (openingWords.has(token) && !beatWords.has(token)) residueWords += 1;
  }
  return residuePairs >= 1 || residueWords >= 2;
}
function latestLocation(next, parsed) {
  const scene = [...parsed.commands].reverse().find((command) => command.type === "scene_location");
  if (scene?.type === "scene_location") return scene.location;
  const update = [...parsed.commands].reverse().find((command) => command.type === "map_update");
  return update?.type === "map_update" ? update.location : next.sceneLocation ?? next.location;
}
function playerIsVisible(parsed, proposal, subject) {
  if (subject === "player") return true;
  if (subject === "environment" || subject === "others") return false;
  const shot = proposal ?? "";
  if (/\b(no people|nobody|unoccupied|environment-only|object-only)\b|无人|空镜|纯环境|物品特写/i.test(shot)) return false;
  return /\b(player protagonist|protagonist|player character|returning player|the player|traveler|wayfarer|adventurer|you)\b|玩家|主角|旅人|旅行者|冒险者|你/i.test(shot);
}
function directedPerspective(cartridge2, next, parsed, reason, proposal, playerVisible) {
  if (playerVisible) return "observer";
  const shot = proposal ?? "";
  if (/\b(first[- ]person|player[- ]eye|point[- ]of[- ]view|POV)\b|第一人称|主角视角|玩家视角/i.test(shot)) return "first-person";
  if (/\b(third[- ]person|over[- ]the[- ]shoulder|wide establishing|full[- ]body protagonist)\b|第三人称|肩后|全身主角|环境建立镜头/i.test(shot)) return "observer";
  const policy = cartridge2.imageDirector?.perspective;
  if (reason === "character-expression") return policy?.importantDialogue ?? "observer";
  if (reason === "new-location") return policy?.newLocation ?? "observer";
  const ordinary = policy?.ordinary ?? "observer";
  if (ordinary === "observer") return "observer";
  const roll = Math.max(0, Math.floor(next.scene)) % 4;
  return ordinary === "balanced" ? roll % 2 === 0 ? "first-person" : "observer" : roll === 0 ? "observer" : "first-person";
}
function buildScenePrompt(cartridge2, next, parsed, reason, aiProposal, playerVisible = false, identityCharacterId, perspective = "observer") {
  const beat = visibleBeat(parsed) || next.objective;
  const proposal = aiProposal?.replace(/\s+/g, " ").trim().slice(0, 620);
  const acceptedProposal = proposal && !carriesOpeningResidue(cartridge2, next, parsed, proposal) ? proposal : "";
  const direction = cartridge2.sceneImageDirection ?? `${cartridge2.theme.material} story-world editorial illustration`;
  const dialogueMoment = reason === "character-expression" ? expressionOwner(next, parsed) : void 0;
  return [
    "Create one fresh 4:3 cinematic illustration in the established story world.",
    acceptedProposal ? `Primary shot brief: ${acceptedProposal}.` : `Primary shot focus: ${focusFor(reason, parsed, next)}.`,
    `Latest visible story beat, which overrides older continuity hints: ${beat}.`,
    `Current location hint: ${latestLocation(next, parsed)}. Use it only when consistent with the latest visible beat; never drag an earlier location into a newer scene.`,
    `Mandatory art direction: ${direction}.`,
    perspective === "first-person" ? "FIRST-PERSON PLAYER-EYE VIEW. The camera is the protagonist\u2019s eyes inside the current scene. Do not show the protagonist\u2019s face, head, back, shoulders, silhouette, reflection, or full body, and do not use an over-the-shoulder third-person composition. Do not invent the protagonist\u2019s hands; show them only when the latest visible story explicitly establishes them. Build the foreground from the other person\u2019s gesture, a nearby object, a doorframe, work surface, or window edge." : "",
    playerVisible ? "The player protagonist is the dominant visible human in this frame and must be the same person performing the single main player action. Keep their face naturally readable and do not assign that action or identity to a companion, NPC, background figure or animal." : "",
    dialogueMoment ? `${dialogueMoment.character?.name ?? dialogueMoment.dialogue.speaker} is the one dominant visible adult seen from the protagonist\u2019s position. Use a contextual medium close-up or chest-up reaction shot. Make ${dialogueMoment.expression ? `this expression visually specific: ${dialogueMoment.expression}` : "the current expression legible through eyes, mouth, posture and one restrained hand gesture"}. Keep enough current-location background to preserve narrative context, and avoid a centered passport portrait.` : identityCharacterId ? "Use a contextual medium close-up or chest-up reaction shot from the protagonist\u2019s position. The named identity owner is the only clearly readable face; make their current emotion legible through eyes, mouth, posture and one restrained hand gesture. Keep enough current-location background to preserve narrative context, and avoid a centered passport portrait." : "",
    "Compose one readable moment with one dominant action and at most two focal subjects. Choose a camera position, scale, lighting pattern and silhouette that differ from earlier images.",
    "Ignore all cover art and opening-scene imagery. Derive the depicted location, action, subjects, props and weather only from the primary shot brief and latest visible story beat.",
    "Show only people, objects, places and consequences established in the latest visible story. No montage, split screen, flash-forward, readable text, letters, logo, border, poster layout or UI."
  ].filter(Boolean).join(" ");
}
function chooseSceneImage(previous, next, parsed, cartridge2, aiPrompt, imageSubject, imageCharacterId) {
  const director = cartridge2.imageDirector;
  const owner = expressionOwner(next, parsed);
  if (director && owner && director.guaranteedTriggers.includes("character-expression")) {
    const identityCharacterId = owner.character?.visualIdentity ? owner.character.id : void 0;
    const perspective = directedPerspective(cartridge2, next, parsed, "character-expression", void 0, false);
    return { prompt: buildScenePrompt(cartridge2, next, parsed, "character-expression", void 0, false, identityCharacterId, perspective), source: "director", reason: "character-expression", playerVisible: false, identityCharacterId, perspective };
  }
  const proposal = aiPrompt?.trim();
  if (proposal) {
    const visible2 = playerIsVisible(parsed, proposal, imageSubject);
    const identityOwner = imageSubject === "others" && imageCharacterId ? next.characters.find((character) => character.id === imageCharacterId && character.visualIdentity) : void 0;
    const perspective = directedPerspective(cartridge2, next, parsed, "cadence", proposal, visible2);
    return {
      prompt: buildScenePrompt(cartridge2, next, parsed, "cadence", proposal, visible2, identityOwner?.id, perspective),
      source: "ai",
      reason: "ai-proposal",
      playerVisible: visible2,
      identityCharacterId: identityOwner?.id,
      perspective
    };
  }
  if (!director) return {};
  const visible = owner ? false : playerIsVisible(parsed, void 0, imageSubject);
  const triggers = detectTriggers(previous, next, parsed);
  const guaranteed = firstTrigger(triggers, director.guaranteedTriggers);
  if (guaranteed) {
    const identityCharacterId = owner?.character?.visualIdentity ? owner.character.id : void 0;
    const perspective = directedPerspective(cartridge2, next, parsed, guaranteed, void 0, visible);
    return { prompt: buildScenePrompt(cartridge2, next, parsed, guaranteed, void 0, visible, identityCharacterId, perspective), source: "director", reason: guaranteed, playerVisible: visible, identityCharacterId, perspective };
  }
  const turnsSinceImage = next.scene - lastScheduledScene(previous);
  const soft = firstTrigger(triggers, director.softTriggers);
  if (soft && turnsSinceImage >= director.softCooldownTurns) {
    const identityCharacterId = owner?.character?.visualIdentity ? owner.character.id : void 0;
    const perspective = directedPerspective(cartridge2, next, parsed, soft, void 0, visible);
    return { prompt: buildScenePrompt(cartridge2, next, parsed, soft, void 0, visible, identityCharacterId, perspective), source: "director", reason: soft, playerVisible: visible, identityCharacterId, perspective };
  }
  if (turnsSinceImage >= director.maxQuietTurns) {
    const identityCharacterId = owner?.character?.visualIdentity ? owner.character.id : void 0;
    const perspective = directedPerspective(cartridge2, next, parsed, "cadence", void 0, visible);
    return { prompt: buildScenePrompt(cartridge2, next, parsed, "cadence", void 0, visible, identityCharacterId, perspective), source: "director", reason: "cadence", playerVisible: visible, identityCharacterId, perspective };
  }
  return {};
}

// src/engine-source/engine/choiceInput.ts
function encodeChoiceRecord(choices) {
  return JSON.stringify(choices.map((choice) => choice.label));
}

// src/engine-source/engine/dangerDirector.ts
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function stableHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function createInitialDangerState() {
  return { phase: "calm", safeTurns: 0, cycle: 0, cooldownTurns: 0, severity: 1, lastOutcome: "none" };
}
function normalizeDangerState(candidate) {
  const initial = createInitialDangerState();
  if (!candidate) return initial;
  const phase = candidate.phase === "warning" || candidate.phase === "confrontation" ? candidate.phase : "calm";
  const outcomes = ["none", "critical-success", "success", "costly-success", "failure", "critical-failure"];
  return {
    phase,
    safeTurns: Math.max(0, Math.floor(Number(candidate.safeTurns) || 0)),
    cycle: Math.max(0, Math.floor(Number(candidate.cycle) || 0)),
    cooldownTurns: Math.max(0, Math.floor(Number(candidate.cooldownTurns) || 0)),
    severity: clamp(Math.floor(Number(candidate.severity) || 1), 1, 5),
    currentThreat: typeof candidate.currentThreat === "string" && candidate.currentThreat.trim() ? candidate.currentThreat.trim() : void 0,
    lastOutcome: outcomes.includes(candidate.lastOutcome) ? candidate.lastOutcome : "none",
    lastResolvedScene: Number.isFinite(candidate.lastResolvedScene) ? Number(candidate.lastResolvedScene) : void 0
  };
}
function selectThreat(save, cartridge2, cycle) {
  const config = cartridge2.dangerDirector;
  const threats = config?.threatPalette ?? [];
  const currentNode = save.map.find((node) => node.current);
  const placeKey = currentNode?.id ?? save.location;
  const compatible = threats.filter((threat) => {
    const allowed = config?.threatLocations?.[threat];
    return !allowed?.length || (currentNode ? allowed.includes(currentNode.id) : false);
  });
  const candidates = compatible.length ? compatible : threats.filter((threat) => !config?.threatLocations?.[threat]?.length);
  return candidates[stableHash(`${cartridge2.id}:threat:${placeKey}:${cycle}`) % Math.max(1, candidates.length)] ?? "an immediate world-appropriate threat";
}
function cleanDangerText(value) {
  return value.toLocaleLowerCase().replace(/[\s，。！？、,.!?;；：：“”'‘’()（）\-—_/]+/g, "");
}
function dangerTextGrounded(threat, text, locale) {
  const source = cleanDangerText(text);
  const target = cleanDangerText(threat);
  if (!source || !target) return false;
  if (source.includes(target)) return true;
  if (locale === "en") {
    const stop = /* @__PURE__ */ new Set(["about", "after", "again", "before", "being", "could", "their", "there", "these", "those", "would"]);
    const terms = [...new Set(threat.toLocaleLowerCase().match(/[a-z]{4,}/g) ?? [])].filter((term) => !stop.has(term));
    const matches = terms.filter((term) => source.includes(cleanDangerText(term))).length;
    return matches >= Math.min(2, terms.length);
  }
  const pairs2 = [...new Set(Array.from({ length: Math.max(0, target.length - 1) }, (_, index) => target.slice(index, index + 2)))].filter((term) => !["\u7A81\u7136", "\u73B0\u5728", "\u5DF2\u7ECF", "\u4E8B\u60C5", "\u60C5\u51B5", "\u73B0\u573A"].includes(term));
  return pairs2.filter((term) => source.includes(term)).length >= Math.min(2, pairs2.length);
}
function dangerDirectiveEstablished(parsed, directive, locale) {
  const encounter2 = [...parsed.commands].reverse().find((command) => command.type === "encounter");
  if (encounter2?.type !== "encounter" || encounter2.phase !== directive.phase || !encounter2.kind) return false;
  if (cleanDangerText(encounter2.kind) !== cleanDangerText(directive.threat)) return false;
  const prose = parsed.blocks.filter((block) => block.kind === "narration" || block.kind === "dialogue").map((block) => `${block.speaker ?? ""} ${block.text}`).join("\n");
  return dangerTextGrounded(directive.threat, prose, locale);
}
function dangerDirectiveChoices(directive, scene) {
  return contextualDangerChoiceLabels(directive.threat, directive.methods, /[\u3400-\u9fff]/u.test(directive.methods.join("")) ? "zh" : "en").slice(0, 5).map((label, index) => ({ id: `danger-${scene}-${index}`, label }));
}
function contextualDangerChoiceLabels(threat, methods, locale) {
  const subject = (threat ?? "").replace(/[“”"'‘’。.!！?？；;：:]+/g, " ").replace(/\s+/g, " ").trim();
  if (!subject) return [...new Set(methods.map((method) => method.trim()).filter(Boolean))];
  const concise = subject.length > (locale === "zh" ? 26 : 56) ? `${subject.slice(0, locale === "zh" ? 25 : 55).trim()}\u2026` : subject;
  const labels = locale === "zh" ? [`\u786E\u8BA4${concise}\u7684\u5177\u4F53\u60C5\u51B5`, `\u7ACB\u5373\u5E94\u5BF9${concise}`, `\u64A4\u79BB${concise}\u5F71\u54CD\u7684\u73B0\u573A`] : [`Confirm the facts about ${concise}`, `Respond directly to ${concise}`, `Withdraw from the scene of ${concise}`];
  return [...new Set(labels)].filter((label) => label.length <= 96);
}
function hasMeaningfulCost(before, after, cartridge2) {
  const costs = cartridge2.dangerDirector?.resolution.fallbackCosts ?? [];
  const statCost = costs.some((cost) => {
    const previous = before.stats[cost.statId];
    const current = after.stats[cost.statId];
    return cost.operation === "remove" ? current < previous : current > previous;
  });
  if (statCost) return true;
  const inventoryCost = before.inventory.some((item) => (after.inventory.find((entry) => entry.id === item.id || entry.label === item.label)?.count ?? 0) < item.count);
  if (inventoryCost) return true;
  return before.characters.some((character) => {
    const current = after.characters.find((entry) => entry.id === character.id);
    return Boolean(current && (current.vitality < character.vitality || current.stress > character.stress));
  });
}
function applyFallbackCost(before, after, cartridge2, outcome) {
  if (outcome !== "costly-success" && outcome !== "failure" && outcome !== "critical-failure") return void 0;
  if (hasMeaningfulCost(before, after, cartridge2)) return void 0;
  const cost = cartridge2.dangerDirector?.resolution.fallbackCosts[0];
  const definition = cost ? cartridge2.statDefinitions.find((entry) => entry.id === cost.statId) : void 0;
  if (!cost || !definition) return void 0;
  const multiplier = outcome === "costly-success" ? 0.5 : outcome === "critical-failure" ? 2 : 1;
  const amount = Math.max(1, Math.ceil(cost.amount * multiplier));
  const previous = after.stats[cost.statId] ?? definition.initial;
  const requested = cost.operation === "remove" ? previous - amount : previous + amount;
  const maximum = definition.maxDelta == null ? amount : Math.min(amount, Math.max(0, definition.maxDelta));
  const delta = clamp(requested - previous, -maximum, maximum);
  const current = clamp(previous + delta, definition.min, definition.max);
  after.stats[cost.statId] = current;
  const applied = current - previous;
  if (!applied) return void 0;
  return {
    id: `danger-cost-${after.scene}`,
    kind: "change",
    text: `${definition.label} ${applied > 0 ? "+" : ""}${applied}`,
    data: { stat: definition.id, delta: applied, dangerFallback: "true" }
  };
}
function settleDangerTurn(before, after, parsed, cartridge2, directive) {
  if (!cartridge2.dangerDirector) {
    after.danger = normalizeDangerState(after.danger);
    return [];
  }
  const state = normalizeDangerState(before.danger);
  const encounter2 = [...parsed.commands].reverse().find((command) => command.type === "encounter");
  const effects = [];
  if (directive && !dangerDirectiveEstablished(parsed, directive, cartridge2.locale)) {
    after.danger = state;
    return effects;
  }
  if (directive?.phase === "warning") {
    after.danger = { ...state, phase: "warning", safeTurns: 0, severity: directive.severity, currentThreat: directive.threat };
    effects.push({ id: `danger-${after.scene}`, kind: "event", text: t(cartridge2.locale, "dangerWarning"), data: { dangerPhase: "warning", severity: directive.severity } });
    return effects;
  }
  if (directive?.phase === "confrontation") {
    after.danger = { ...state, phase: "confrontation", safeTurns: 0, severity: directive.severity, currentThreat: directive.threat };
    effects.push({ id: `danger-${after.scene}`, kind: "event", text: t(cartridge2.locale, "dangerConfrontation"), data: { dangerPhase: "confrontation", severity: directive.severity } });
    return effects;
  }
  if (directive?.phase === "resolution" && directive.check) {
    const outcome = directive.check.outcome;
    after.danger = {
      phase: "calm",
      safeTurns: 0,
      cycle: state.cycle + 1,
      cooldownTurns: cartridge2.dangerDirector.cooldownTurns,
      severity: 1,
      currentThreat: void 0,
      lastOutcome: outcome,
      lastResolvedScene: after.scene
    };
    const cost = applyFallbackCost(before, after, cartridge2, outcome);
    if (cost) effects.push(cost);
    effects.push({
      id: `danger-${after.scene}`,
      kind: "event",
      text: t(cartridge2.locale, outcome === "critical-success" || outcome === "success" ? "dangerResolved" : outcome === "costly-success" ? "dangerResolvedCostly" : "dangerFailed"),
      data: { dangerPhase: "resolution", outcome, severity: directive.severity }
    });
    return effects;
  }
  if (encounter2?.type === "encounter") {
    const severity = clamp(Math.floor(encounter2.severity ?? 2), 1, 5);
    if (encounter2.phase === "warning" || encounter2.phase === "confrontation") {
      after.danger = { ...state, phase: encounter2.phase, safeTurns: 0, severity, currentThreat: encounter2.kind ?? state.currentThreat ?? selectThreat(after, cartridge2, state.cycle) };
      return effects;
    }
    after.danger = {
      phase: "calm",
      safeTurns: 0,
      cycle: state.cycle + 1,
      cooldownTurns: cartridge2.dangerDirector.cooldownTurns,
      severity: 1,
      currentThreat: void 0,
      lastOutcome: encounter2.outcome ?? "success",
      lastResolvedScene: after.scene
    };
    return effects;
  }
  after.danger = state.cooldownTurns > 0 ? { ...state, cooldownTurns: state.cooldownTurns - 1, safeTurns: 0 } : { ...state, safeTurns: state.safeTurns + 1 };
  return effects;
}

// src/engine-source/engine/continuity.ts
function clean(value) {
  return value.toLocaleLowerCase().replace(/[\s，。！？、,.!?;；:："“”'‘’()（）\-—_/]+/g, "");
}
function authoredDecisionContext(value, visibleTurnText, locale) {
  const normalized3 = value.replace(/[\n\r\t]+/g, " ").replace(/^[“”"'‘’]+|[“”"'‘’]+$/g, "").replace(/\s+/g, " ").trim();
  const maxLength = locale === "zh" ? 28 : 96;
  if (!normalized3 || normalized3.length > maxLength) return "";
  if (/请(?:做出|作出)?选择|接下来(?:怎么|如何)做|what (?:will|do) you do|make (?:a|your) choice/i.test(normalized3)) return "";
  if (clean(visibleTurnText).includes(clean(normalized3))) return "";
  return normalized3;
}
function createTransitionBlock(save, destination, cartridge2) {
  const anchor = cartridge2.transitionAnchor?.trim();
  if (!anchor || !destination || clean(destination) === clean(save.location)) return void 0;
  const text = cartridge2.locale === "zh" ? `\u524D\u5F80${destination}\u4E4B\u524D\uFF0C\u4F60\u5148\u501F${anchor}\u56DE\u671B${save.location}\u7559\u4E0B\u7684\u884C\u52A8\u4E0E\u7EBF\u7D22\u3002\u786E\u8BA4\u4E0A\u4E00\u6BB5\u8DEF\u5DF2\u7ECF\u7ED3\u675F\u540E\uFF0C\u4F60\u624D\u7EE7\u7EED\uFF0C\u968F\u540E\u62B5\u8FBE${destination}\u3002` : `Before heading to ${destination}, you use ${anchor} to review the actions and clues left at ${save.location}. Only after closing that leg do you continue and arrive at ${destination}.`;
  return { id: `transition-${save.scene + 1}`, kind: "narration", text, data: { transitionAnchor: anchor, destination } };
}
function chineseTerms(value) {
  const generic = /(?:为什么|有什么用|尚未|当前|现在|原地|这里|那里|周围|四处|附近|下一步|具体|详细|详情|细节|进一步|更多|关于|信息|情况|局面|方式|事情|行动|工作|线索|变化|消息|原因|警告|通知|计划|机会|代价|保证|考虑|准备|建议|提出|追问|是否|如何|能否|一起|自己|这些|那个|那位|这个|其他|别的|哪条|那张|那场|一个|一份|一条|一段|今晚|明晚|明早|明天|清晨|下一站|到站后|暂时|早点|早早|先|再来|再|也|就|仍然|仍|已经|正在|即将|重新|还在|可能|需要|必须|只|请|不去|不|去|前往|前进|靠近|沿着?|循着?|跟随|跟|返回|回到|留下|留在|等待|观察|查看|看看|检查|调查|探索|搜索|询问|问问|问|聊聊|谈谈|搭话|商量|告诉|介绍|了解|说明|帮助|帮忙|帮|拒绝|接受|接下|答应|承诺|邀请|负责|保护|努力|撤退|专注|理会|进入|使用|换取|带着?|把|将|让|与|和|继续|尝试|绕到?|登上|走向|停下|休息|闭眼|坐到?|坐|陪|拿|收好|离开|加入|开始|完成|做完|整理|搬运|搬|寻找|找|追查|放弃|改走|送上|送去|送到|带去|唱给|压平|摆好|拦住|推到?|顶住?|堵住?|锁住?|守住?|选择|决定|谁|听|最|突然|紧急|临时|当地|额外|特别|背后|应对|解决|办法|方案|调整|规划|行程|交通|住宿|住处|房间|便宜|选项|安排|收入|保存|保留|突发|状况|不确定|全程|正式|时间|间隔|报酬|招工牌|招工|数据|记录|测量|管理方|赚点|环境|活|钱|处|她|他|它|对方|的|了|后|人|在|为|以|或)/gu;
  const stripped = value.replace(generic, " ");
  return [...new Set((stripped.match(/[\u3400-\u9fff]{2,8}/gu) ?? []).map((term) => term.replace(/[上旁边里内外中前后]$/u, "")).filter((term) => term.length >= 2))];
}
function englishTerms(value) {
  const generic = /* @__PURE__ */ new Set(["with", "from", "into", "about", "around", "behind", "again", "next", "current", "situation", "continue", "inspect", "observe", "check", "ask", "tell", "help", "return", "follow", "leave", "wait", "take", "make", "try", "use", "look", "move", "alone", "join", "finish", "decline", "accept", "agree", "choose", "challenge", "demand", "forge", "rent", "stay", "begin", "start", "flatten", "pocket", "trace", "discuss", "investigate", "survey", "push", "brace", "block", "lock", "guard", "hold"]);
  return [...new Set(value.toLocaleLowerCase().match(/[a-z]{4,}/g) ?? [])].filter((term) => !generic.has(term));
}
function choiceIsGrounded(choice, sources, locale, stableEntities) {
  const source = sources.join(" ");
  let termSource = choice.label;
  let groundedStableReference = false;
  if (locale === "zh") {
    for (const entity of stableEntities.sort((left, right) => right.length - left.length)) {
      if (entity.length < 2 || !clean(termSource).includes(clean(entity))) continue;
      if (!clean(source).includes(clean(entity))) return false;
      groundedStableReference = true;
      termSource = termSource.replaceAll(entity, " ");
    }
  } else {
    for (const entity of stableEntities.sort((left, right) => right.length - left.length)) {
      if (entity.length < 3 || !clean(termSource).includes(clean(entity))) continue;
      if (!clean(source).includes(clean(entity))) return false;
      groundedStableReference = true;
      termSource = termSource.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), " ");
    }
  }
  const terms = locale === "zh" ? chineseTerms(termSource) : englishTerms(termSource);
  if (!terms.length) return true;
  const normalizedSource = clean(source);
  if (normalizedSource.includes(clean(choice.label))) return true;
  const canSegmentFromSources = (term) => {
    const normalized3 = clean(term);
    const normalizedSources = sources.map(clean);
    const reachable = /* @__PURE__ */ new Set([0]);
    for (let start = 0; start < normalized3.length; start += 1) {
      if (!reachable.has(start)) continue;
      for (let end = normalized3.length; end >= start + 2; end -= 1) {
        const piece = normalized3.slice(start, end);
        if (normalizedSources.some((candidate) => candidate.includes(piece))) reachable.add(end);
      }
    }
    return reachable.has(normalized3.length);
  };
  const matches = terms.filter((term) => sources.some((candidate) => clean(candidate).includes(clean(term))) || canSegmentFromSources(term));
  return groundedStableReference || matches.length > 0;
}
function filterGroundedChoices(choices, save, cartridge2, immediateBlocks = save.blocks) {
  let lastActionIndex = -1;
  for (let index = save.blocks.length - 1; index >= 0; index -= 1) {
    const block = save.blocks[index];
    if (block.kind === "event" && /^action-\d+$/.test(block.id)) {
      lastActionIndex = index;
      break;
    }
  }
  const recentCommittedBlocks = save.blocks.slice(lastActionIndex >= 0 ? lastActionIndex + 1 : 0);
  const visibleTurn2 = [...recentCommittedBlocks, ...immediateBlocks].filter((block) => block.kind !== "image" && !block.id.startsWith("action-")).map((block) => `${block.speaker ?? ""} ${block.text}`);
  const knownPeople = save.characters.filter((character) => character.status !== "departed").map((character) => character.name);
  const knownPlaces = save.map.filter((node) => node.visited || node.current).flatMap((node) => [node.label, node.detail ?? "", node.lore ?? "", ...node.facts ?? []]);
  const knownItems = save.inventory.flatMap((item) => [
    item.label,
    item.detail ?? "",
    item.effect ?? "",
    item.lore ?? "",
    ...(item.metrics ?? []).flatMap((metric) => [metric.label, metric.value])
  ]);
  const activeJobs = save.jobs.filter((job) => job.status === "offered" || job.status === "accepted").flatMap((job) => [job.label, job.employer ?? ""]);
  const knownStats = cartridge2.statDefinitions.flatMap((definition) => [definition.label, definition.description ?? "", String(save.stats[definition.id] ?? "")]);
  const sources = [...visibleTurn2, save.sceneLocation ?? save.location, save.location, save.objective, ...knownPeople, ...knownPlaces, ...knownItems, ...activeJobs, ...knownStats];
  const stableEntities = [...knownPeople, save.sceneLocation ?? save.location, save.location, ...knownPlaces, ...knownItems, ...activeJobs, ...knownStats].filter(Boolean);
  const routeAliases = save.map.filter((node) => node.visited || node.current).flatMap((node) => node.routeHints ?? []).filter((alias) => clean(alias).length >= 2);
  const visibleRouteContext = [save.sceneLocation ?? "", ...visibleTurn2];
  const routeAliasIsUsable = (choice) => {
    const alias = routeAliases.find((candidate) => clean(choice.label).includes(clean(candidate)));
    if (!alias) return true;
    const isMovement = cartridge2.locale === "zh" ? /(?:前往|去往|抵达|返回|回到|走向|赶往|搭乘|坐到)/u.test(choice.label) : /\b(?:travel|go|head|return|walk|ride|sail|move)\b/i.test(choice.label);
    return isMovement || visibleRouteContext.some((source) => clean(source).includes(clean(alias)));
  };
  const quarantined = typeof save.facts.consistency_quarantined_action === "string" && save.facts.consistency_quarantined_location === save.location ? clean(save.facts.consistency_quarantined_action) : "";
  return choices.filter((choice) => routeAliasIsUsable(choice) && (!quarantined || clean(choice.label) !== quarantined) && choiceIsGrounded(choice, sources, cartridge2.locale, stableEntities));
}

// src/engine-source/engine/domainRules.ts
function clamp2(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function advanceClock(save, minutes, locale) {
  const match = save.time.match(/(\d{1,2}):(\d{2})/);
  const currentMinutes = match ? Number(match[1]) * 60 + Number(match[2]) : 18 * 60 + 40;
  const visibleDay = save.time.match(/(?:第\s*(\d+)\s*天|Day\s*(\d+))/i);
  const currentDay2 = Math.max(1, Number(visibleDay?.[1] ?? visibleDay?.[2] ?? save.facts.world_day ?? 1));
  const absolute = currentMinutes + Math.max(0, Math.round(minutes));
  const day = currentDay2 + Math.floor(absolute / 1440);
  const withinDay = absolute % 1440;
  const hour = Math.floor(withinDay / 60);
  const minute = withinDay % 60;
  save.facts.world_day = day;
  save.time = `${locale === "zh" ? `\u7B2C ${day} \u5929` : `Day ${day}`} \xB7 ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
function normalized(value) {
  return value.trim().toLocaleLowerCase().replace(/[\s，。！？、,.!?;；:："“”'‘’()（）]+/g, "");
}
function isRestCommitment(value) {
  const source = value.trim().toLocaleLowerCase();
  const chineseRest = /(?:休息|歇一会|小睡|睡一会|睡觉|打盹|眯一会|恢复呼吸|住一晚|租[^，。！？]{0,8}房|支付房费|付房费|订[^，。！？]{0,8}房|今天不再行动)/u.test(source);
  const englishRest = /\b(?:rest|sleep|nap|doze)(?:ing)?\b|\b(?:take a break|catch my breath|stay (?:for )?(?:the night|overnight)|rent (?:(?:a|the) )?room|pay (?:for )?(?:(?:a|the) )?room(?: fee)?|book (?:(?:a|the) )?room|reserve (?:(?:a|the) )?room|get (?:(?:a|the) )?room for the night|stop for the day)\b/i.test(source);
  if (!chineseRest && !englishRest) return false;
  const chineseNegation = /(?:不|别)(?:要|想|打算|准备|再)?(?:休息|睡|小睡|打盹|住下)/u.test(source);
  const englishNegation = /\b(?:do not|don't|not going to|won't|without|skip)\b.{0,24}\b(?:rest|sleep|nap|stay)\b/i.test(source);
  const chineseReport = /(?:告诉|跟[^，。！？]{0,10}说|对[^，。！？]{0,10}说|表示|说明).{0,24}(?:休息|睡|住下)/u.test(source);
  const englishReport = /\b(?:tell|say to|explain to|let [a-z ]{1,20} know)\b.{0,48}\b(?:rest|sleep|stay)\b/i.test(source);
  const chineseInquiry = /(?:问|询问|打听|了解|看看|查看).{0,18}(?:休息|睡|客房|房间)|(?:哪里|哪儿|有没有|能不能|是否).{0,18}(?:休息|睡|客房|房间)|(?:休息|客房|房间).{0,12}(?:多少钱|价格|条件)/u.test(source) || /(?:我|我们)?(?:可以|能|可不可以|能否)[^，。！？]{0,18}(?:休息|睡|住一晚|住下|客房|房间)[^，。！？]{0,4}(?:吗|么|\?|？)/u.test(source);
  const englishInquiry = /\b(?:ask|inquire|check|learn|find out|whether|where can|is there|how much|price)\b.{0,48}\b(?:rest|sleep|nap|room|bed|shelter)\b/i.test(source) || /\b(?:rest|room|bed|shelter)\b.{0,32}\b(?:price|cost|available|availability)\b/i.test(source) || /\b(?:can|could|may|would)\s+(?:i|we)\b.{0,40}\b(?:rest|sleep|nap|stay|book|rent)\b/i.test(source) || /\bis\b.{0,28}\b(?:resting|sleeping|staying)\b.{0,20}\b(?:allowed|possible|available|okay|ok)\b/i.test(source);
  return !chineseNegation && !englishNegation && !chineseReport && !englishReport && !chineseInquiry && !englishInquiry;
}
function matchStrength(source, keyword) {
  if (source.includes(keyword)) return 200 + keyword.length;
  if (!/[\u3400-\u9fff]/.test(keyword)) return 0;
  let cursor = 0;
  for (const character of source) {
    if (character === keyword[cursor]) cursor += 1;
    if (cursor === keyword.length) return keyword.length;
  }
  return 0;
}
function currentMapNodeId(save) {
  return save.map.find((node) => node.current)?.id;
}
function currentWorldDay(save) {
  const visible = save.time.match(/(?:第\s*(\d+)\s*天|Day\s*(\d+))/i);
  return Math.max(1, Number(visible?.[1] ?? visible?.[2] ?? save.facts.world_day ?? 1));
}
function repeatFactId(save, ruleId) {
  const place = currentMapNodeId(save) ?? normalized(save.location) ?? "unknown-place";
  return `domain-repeat:${ruleId}:${place}:day-${currentWorldDay(save)}`;
}
function activeStatFloorRule(save, cartridge2) {
  for (const definition of cartridge2.statDefinitions) {
    const rule = definition.floorRule;
    if (!rule) continue;
    const threshold = rule.threshold ?? definition.min;
    const value = Number(save.stats[definition.id] ?? definition.initial);
    if (Number.isFinite(value) && value <= threshold) return { definition, rule, threshold, value };
  }
  return void 0;
}
function statFloorChoices(save, cartridge2) {
  const floor = activeStatFloorRule(save, cartridge2);
  return floor?.rule.recoveryChoices.map((label, index) => ({ id: `recovery-${save.scene}-${index}`, label }));
}
function requirementMet(requirement, save) {
  if (requirement.type === "map") {
    const current = currentMapNodeId(save);
    if (requirement.nodeId && current !== requirement.nodeId) return false;
    if (requirement.notNodeId && current === requirement.notNodeId) return false;
    if (requirement.visited !== void 0) {
      const targetId = requirement.nodeId ?? requirement.notNodeId;
      const target = targetId ? save.map.find((node) => node.id === targetId) : void 0;
      if (!target || Boolean(target.visited) !== requirement.visited) return false;
    }
    return true;
  }
  if (requirement.type === "capability") {
    const current = currentMapNodeId(save);
    return Boolean(current && save.map.find((node) => node.id === current)?.capabilities?.includes(requirement.id));
  }
  if (requirement.type === "stat") {
    const value2 = Number(save.stats[requirement.id]);
    if (!Number.isFinite(value2)) return false;
    if (requirement.min !== void 0 && value2 < requirement.min) return false;
    if (requirement.max !== void 0 && value2 > requirement.max) return false;
    return true;
  }
  if (requirement.type === "item") return (save.inventory.find((item) => item.id === requirement.id)?.count ?? 0) >= requirement.minCount;
  if (requirement.type === "character") {
    const character = save.characters.find((entry) => entry.id === requirement.id);
    return Boolean(character && character.status === requirement.status);
  }
  if (requirement.type === "danger") return requirement.phases.includes(save.danger.phase);
  const value = save.facts[requirement.id];
  if (requirement.equals !== void 0 && value !== requirement.equals) return false;
  if (requirement.notEquals !== void 0 && value === requirement.notEquals) return false;
  if (requirement.min !== void 0 && (!(typeof value === "number") || value < requirement.min)) return false;
  if (requirement.max !== void 0 && (!(typeof value === "number") || value > requirement.max)) return false;
  return true;
}
function resolveDomainAction(save, cartridge2, action) {
  const source = normalized(action);
  if (!source || !cartridge2.domainRules?.rules.length) return void 0;
  const candidate = cartridge2.domainRules.rules.map((rule, index) => {
    if (rule.intentGuard === "rest-commitment" && !isRestCommitment(action)) return null;
    const matches = rule.match.map(normalized).map((keyword) => rule.matchMode === "exact" ? source === keyword ? 1e3 + keyword.length : 0 : matchStrength(source, keyword)).filter(Boolean);
    return matches.length ? { rule, index, score: matches.length * 1e3 + Math.max(...matches) } : null;
  }).filter((entry) => Boolean(entry)).sort((left, right) => right.score - left.score || left.index - right.index)[0];
  const floor = activeStatFloorRule(save, cartridge2);
  if (floor && (!candidate || !floor.rule.allowedDomainRuleIds.includes(candidate.rule.id))) {
    return {
      status: "rejected",
      ruleId: `stat-floor-${floor.definition.id}`,
      intent: action,
      effects: [],
      reasons: [floor.rule.blockedText],
      successText: floor.rule.blockedText,
      successChoices: [...floor.rule.recoveryChoices],
      continuation: "replace"
    };
  }
  if (!candidate) return void 0;
  const reasons = candidate.rule.requirements.filter((requirement) => !requirementMet(requirement, save)).map((requirement) => requirement.reason);
  const repeatId = candidate.rule.repeatPolicy?.scope === "location-day" ? repeatFactId(save, candidate.rule.id) : void 0;
  if (repeatId && save.facts[repeatId] === true) reasons.push(candidate.rule.repeatPolicy.reason);
  const accepted = reasons.length === 0;
  const effects = accepted ? candidate.rule.effects.map((effect) => ({ ...effect })) : [];
  if (accepted && repeatId) effects.push({ type: "fact", id: repeatId, value: true });
  if (accepted && candidate.rule.dangerPolicy === "withdraw" && save.danger.phase !== "calm") {
    effects.push({ type: "danger", outcome: "costly-success" });
  }
  return {
    status: accepted ? "accepted" : "rejected",
    ruleId: candidate.rule.id,
    intent: candidate.rule.intent,
    effects,
    reasons,
    successText: candidate.rule.successText,
    dangerPolicy: candidate.rule.dangerPolicy,
    continuation: accepted ? candidate.rule.successContinuation ?? "replace" : candidate.rule.rejectionContinuation ?? "replace",
    successChoices: [...(reasons.length && candidate.rule.rejectionChoices ? candidate.rule.rejectionChoices : candidate.rule.successChoices) ?? []]
  };
}
function domainAllowsModelCommand(command, resolution) {
  if (!resolution) return true;
  return false;
}
function domainOwnsDanger(resolution) {
  return Boolean(resolution?.status === "accepted" && resolution.effects.some((effect) => effect.type === "danger"));
}
function domainSuppressesDanger(resolution) {
  return Boolean(resolution?.status === "accepted" && (resolution.dangerPolicy === "suppress" || resolution.dangerPolicy === "withdraw" || domainOwnsDanger(resolution)));
}
function applyInventoryEffect(save, effect) {
  const existing = save.inventory.find((item) => item.id === effect.itemId);
  if (effect.action === "remove") {
    if (!existing) return 0;
    const removed = Math.min(existing.count, effect.count);
    existing.count -= removed;
    save.inventory = save.inventory.filter((item) => item.count > 0);
    return -removed;
  }
  if (existing) {
    existing.count += effect.count;
    return effect.count;
  }
  if (!effect.item) return 0;
  save.inventory.push({
    ...effect.item,
    id: effect.itemId,
    count: effect.count,
    metrics: effect.item.metrics?.map((metric) => ({ ...metric })),
    imageStatus: effect.item.imageUrl ? "ready" : "idle"
  });
  return effect.count;
}
function syncDomainDerivedState(save, cartridge2) {
  cartridge2.domainRules?.derivedFacts?.forEach((definition) => {
    const count = definition.itemIds.reduce((total, id) => total + (save.inventory.some((item) => item.id === id && item.count > 0) ? 1 : 0), 0);
    save.facts[definition.factId] = definition.mode === "owned-item-count" ? count : count >= definition.threshold;
  });
  cartridge2.domainRules?.derivedItemMetrics?.forEach((definition) => {
    const item = save.inventory.find((entry) => entry.id === definition.itemId);
    if (!item) return;
    const used = Number(save.facts[definition.factId] ?? 0);
    const value = definition.mode === "remaining-from-used" ? String(clamp2(definition.maximum - used, 0, definition.maximum)) : "0";
    const metrics = item.metrics?.map((metric) => ({ ...metric })) ?? [];
    const existing = metrics.find((metric) => metric.id === definition.metricId || normalized(metric.label) === normalized(definition.label));
    if (existing) {
      existing.id = definition.metricId;
      existing.label = definition.label;
      existing.value = value;
    } else metrics.unshift({ id: definition.metricId, label: definition.label, value });
    item.metrics = metrics;
  });
  const objectiveBeforeSync = save.objective;
  const objectiveTransition = cartridge2.domainRules?.objectiveTransitions?.find((transition) => normalized(transition.from) === normalized(objectiveBeforeSync) && transition.requirements.every((requirement) => requirementMet(requirement, save)));
  if (objectiveTransition) save.objective = objectiveTransition.to;
  return save;
}
function applyDomainResolution(save, cartridge2, resolution) {
  if (!resolution) return [];
  save.choices = resolution.continuation === "replace" ? resolution.successChoices.map((label, index) => ({ id: `domain-${save.scene}-${index}`, label })) : [];
  if (resolution.status === "rejected") {
    return [{
      id: `domain-${save.scene}`,
      kind: "narration",
      text: resolution.reasons.join("\uFF1B"),
      data: { domainRule: resolution.ruleId, domainStatus: "rejected" }
    }];
  }
  const blocks = [{
    id: `domain-${save.scene}`,
    kind: "narration",
    text: resolution.successText,
    data: { domainRule: resolution.ruleId, domainStatus: "accepted" }
  }];
  const statDeltas = /* @__PURE__ */ new Map();
  resolution.effects.forEach((effect) => {
    if (effect.type === "stat") statDeltas.set(effect.id, (statDeltas.get(effect.id) ?? 0) + effect.delta);
  });
  statDeltas.forEach((requestedDelta, id) => {
    const definition = cartridge2.statDefinitions.find((entry) => entry.id === id);
    if (!definition) return;
    const before = save.stats[id] ?? definition.initial;
    const registeredMaximum = definition.domainMaxDelta ?? definition.maxDelta;
    const maximum = registeredMaximum == null ? Math.abs(requestedDelta) : Math.max(0, registeredMaximum);
    const delta = clamp2(requestedDelta, -maximum, maximum);
    const current = clamp2(before + delta, definition.min, definition.max);
    save.stats[id] = current;
    const applied = current - before;
    if (applied) blocks.push({ id: `domain-${save.scene}-stat-${id}`, kind: "change", text: `${definition.label} ${applied > 0 ? "+" : ""}${applied}`, data: { stat: id, delta: applied, domainRule: resolution.ruleId } });
  });
  resolution.effects.forEach((effect, index) => {
    const id = `domain-${save.scene}-${index}`;
    if (effect.type === "stat") return;
    if (effect.type === "fact") save.facts[effect.id] = effect.value;
    if (effect.type === "fact-add") save.facts[effect.id] = Number(save.facts[effect.id] ?? 0) + effect.delta;
    if (effect.type === "inventory") {
      const delta = applyInventoryEffect(save, effect);
      const verb = cartridge2.locale === "zh" ? delta > 0 ? "\u83B7\u5F97" : "\u6D88\u8017" : delta > 0 ? "Gained" : "Consumed";
      if (delta) blocks.push({ id, kind: "change", text: `${verb} ${effect.item?.label ?? effect.itemId} \xD7${Math.abs(delta)}`, data: { itemId: effect.itemId, delta, domainRule: resolution.ruleId } });
    }
    if (effect.type === "party") {
      const character = save.characters.find((entry) => entry.id === effect.characterId) ?? cartridge2.characters.find((entry) => entry.id === effect.characterId);
      if (!character) return;
      let target = save.characters.find((entry) => entry.id === effect.characterId);
      if (!target) {
        target = { ...character, skills: character.skills.map((skill) => ({ ...skill })), status: "known", origin: "cartridge", updatedAtScene: save.scene };
        save.characters.push(target);
      }
      if (effect.change === "add") {
        if (!save.partyMemberIds.includes(target.id)) save.partyMemberIds.push(target.id);
        target.status = "companion";
        target.joinedAtScene ??= save.scene;
        target.leftAtScene = void 0;
      } else {
        save.partyMemberIds = save.partyMemberIds.filter((entry) => entry !== target.id);
        target.status = "departed";
        target.leftAtScene = save.scene;
      }
      target.updatedAtScene = save.scene;
    }
    if (effect.type === "map") {
      const target = save.map.find((node) => node.id === effect.nodeId);
      if (!target) return;
      save.map.forEach((node) => {
        node.current = node.id === target.id;
      });
      target.visited = true;
      save.location = target.label;
      save.sceneLocation = target.label;
      blocks.push({ id, kind: "event", text: `${cartridge2.locale === "zh" ? "\u62B5\u8FBE" : "Arrived at"} ${target.label}`, data: { mapId: target.id, domainRule: resolution.ruleId } });
    }
    if (effect.type === "danger") {
      save.danger = {
        phase: "calm",
        safeTurns: 0,
        cycle: save.danger.cycle + 1,
        cooldownTurns: cartridge2.dangerDirector?.cooldownTurns ?? 0,
        severity: 1,
        lastOutcome: effect.outcome,
        lastResolvedScene: save.scene
      };
    }
    if (effect.type === "objective") save.objective = effect.value;
    if (effect.type === "clock") save.time = effect.value;
    if (effect.type === "clock-add") advanceClock(save, effect.minutes, cartridge2.locale);
    if (effect.type === "session") {
      save.sessionEnded = effect.ended;
      if (effect.reason) blocks.push({ id, kind: "summary", text: effect.reason, data: { domainRule: resolution.ruleId } });
    }
  });
  if (save.sessionEnded) save.choices = [];
  syncDomainDerivedState(save, cartridge2);
  return blocks;
}

// src/engine-source/engine/authoredTurns.ts
function normalized2(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
function resolveDeterministicChoiceTurn(save, cartridge2, action, options = {}) {
  const actionKey = normalized2(action);
  if (!actionKey || options.requireVisibleChoice !== false && !save.choices.some((choice) => normalized2(choice.label) === actionKey)) return void 0;
  return cartridge2.deterministicChoiceTurns?.find((candidate) => {
    if (normalized2(candidate.action) !== actionKey) return false;
    const when = candidate.when;
    if (when?.locations?.length && !when.locations.some((location2) => normalized2(location2) === normalized2(save.location))) return false;
    if (when?.characterIds?.some((id) => !save.characters.some((character) => character.id === id))) return false;
    if (when?.jobs?.some((requirement) => !save.jobs.some((job) => job.id === requirement.id && (!requirement.statuses?.length || requirement.statuses.includes(job.status))))) return false;
    return true;
  })?.turn;
}

// src/engine-source/engine/characterContinuity.ts
function normalizedCharacterName(value) {
  return value.trim().toLocaleLowerCase().replace(/[\s·•._-]+/g, "");
}
function matchingCharacter(save, command) {
  const byId = command.characterId ? save.characters.find((character) => character.id === command.characterId) : void 0;
  const byName = save.characters.find((character) => normalizedCharacterName(character.name) === normalizedCharacterName(command.character));
  return byId ?? byName;
}
function characterIdentityConflict(save, command, cartridge2) {
  const byId = command.characterId ? save.characters.find((character) => character.id === command.characterId) : void 0;
  const byName = save.characters.find((character) => normalizedCharacterName(character.name) === normalizedCharacterName(command.character));
  const definition = command.characterId ? cartridge2.characters.find((character) => character.id === command.characterId) : void 0;
  if (byId && normalizedCharacterName(byId.name) !== normalizedCharacterName(command.character)) return true;
  if (command.characterId && byName && byName.id !== command.characterId) return true;
  if (definition && normalizedCharacterName(definition.name) !== normalizedCharacterName(command.character)) return true;
  return false;
}
function visibleNarration(parsed) {
  return parsed.blocks.filter((block) => block.kind === "narration").map((block) => block.text.trim()).filter(Boolean).join("\n");
}
function visibleTurn(parsed) {
  return parsed.blocks.filter((block) => block.kind === "narration" || block.kind === "dialogue").map((block) => `${block.speaker ?? ""} ${block.text}`.trim()).filter(Boolean).join("\n");
}
function visibleMentionsCharacter(value, name) {
  if (value.includes(name)) return true;
  return name.split(/[\s·•]+/).map((part) => part.trim()).filter((part) => part.length >= 3).some((part) => value.includes(part));
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function hasVisibleCharacterDebut(parsed, name, locale) {
  const narration = visibleNarration(parsed);
  const exactName = name.trim();
  const nameIndex = narration.indexOf(exactName);
  if (!exactName || nameIndex < 0) return false;
  const before = narration.slice(0, nameIndex);
  const after = `${narration.slice(nameIndex + exactName.length)}
${parsed.blocks.filter((block) => block.kind === "dialogue").map((block) => `${block.speaker ?? ""} ${block.text}`).join("\n")}`;
  const sourceWindow = narration.slice(Math.max(0, nameIndex - 56), Math.min(narration.length, nameIndex + exactName.length + 48));
  const escapedName = escapeRegExp(exactName);
  const hasNamedDialogue = parsed.blocks.some((block) => block.kind === "dialogue" && normalizedCharacterName(block.speaker ?? "") === normalizedCharacterName(exactName));
  const nameSource = locale === "zh" ? new RegExp(`(?:\u53EB|\u558A|\u79F0|\u540D\u53EB|\u540D\u4E3A|\u540D\u5B57(?:\u662F|\u53EB)?|\u5199\u7740|\u7B7E\u7740|\u8BFB\u4F5C|\u81EA\u6211\u4ECB\u7ECD(?:\u8BF4)?|\u6211\u662F)[^\u3002\uFF01\uFF1F\\n]{0,32}[\u201C"']?${escapedName}|${escapedName}[^\u3002\uFF01\uFF1F\\n]{0,24}(?:\u8FD9\u4E2A\u540D\u5B57|\u662F(?:\u5979|\u4ED6|\u4ED6\u4EEC|\u8FD9\u4EBA)\u7684\u540D\u5B57)`, "u").test(sourceWindow) : new RegExp(`(?:called|named|name is|reads|says|introduces? (?:himself|herself|themself|themselves)? ?as|i(?:'|\u2019)m|i am)[^.!?\\n]{0,48}[\u201C"']?${escapedName}|${escapedName}[^.!?\\n]{0,32}(?:is (?:her|his|their) name)`, "i").test(sourceWindow);
  const recognisableBefore = locale === "zh" ? before.replace(/\s/g, "").length >= 8 : before.replace(/\s/g, "").length >= 18;
  const intentAfter = locale === "zh" ? after.replace(/\s/g, "").length >= 6 && (hasNamedDialogue || /(?:说|问|看|递|指|愿意|打算|需要|想|让|请|帮|带|同行|工作|离开|留下|给|交|付|验|介绍|[“"])/u.test(after)) : after.replace(/\s/g, "").length >= 14 && (hasNamedDialogue || /\b(?:say|ask|look|offer|point|will|want|need|help|guide|join|work|leave|stay|travel|pay|give|tell|introduce)\w*\b|[“"]/i.test(after));
  return nameSource && recognisableBefore && intentAfter;
}
function hasVisiblePartyJoin(parsed, name, locale) {
  const visible = visibleTurn(parsed);
  if (!visibleMentionsCharacter(visible, name)) return false;
  return locale === "zh" ? /(?:一起|同行|跟着|加入|陪(?:你|同)|带你|结伴|会合|共同的路|下一站|答应[^。！？\n]{0,24}(?:去|走|检查|工作|调查))/u.test(visible) : /\b(?:together|join|accompany|travel(?:ing)? with|come with|guide you|shared road|meet at|next stop|agree[^.!?\n]{0,48}(?:go|walk|inspect|work|survey))\b/i.test(visible);
}

// src/engine-source/engine/turnConsistency.ts
function clean2(value) {
  return value.toLocaleLowerCase().replace(/[\s，。！？、,.!?;；:："“”'‘’()（）\-—_/]+/g, "");
}
function mapNodes(save, cartridge2) {
  const definitions = new Map(cartridge2.initialMap.map((node) => [node.id, node]));
  const merged = save.map.map((node) => {
    const definition = definitions.get(node.id);
    return { ...definition, ...node, routeHints: node.routeHints ?? definition?.routeHints };
  });
  cartridge2.initialMap.forEach((node) => {
    if (!merged.some((candidate) => candidate.id === node.id || clean2(candidate.label) === clean2(node.label))) merged.push(node);
  });
  return merged;
}
function routeMovementCue(value, locale) {
  return locale === "zh" ? /(?:前往|去往|赶往|返回|回到|进入|走进|走到|抵达|到达|上楼|下楼|上到|下到|下车|离开|往[^。！？\n]{0,28}(?:走|去|检查|干活|工作|修补)|沿[^。！？\n]{0,28}(?:走|前进)|跟随|带着|陪同)/.test(value) : /\b(?:travel|go|head|return|enter|walk|reach|arrive|get off|leave|follow|accompany)\b/i.test(value);
}
function routeMatchScore(value, node) {
  const normalized3 = clean2(value);
  const label = clean2(node.label);
  let score = normalized3.includes(label) ? 100 + label.length : 0;
  const matches = new Set((node.routeHints ?? []).map(clean2).filter((hint) => hint.length >= 2 && normalized3.includes(hint)));
  matches.forEach((hint) => {
    score += 10 + Math.min(hint.length, 12);
  });
  return score;
}
var genericRouteHint = /^(?:这里|那里|附近|周围|地点|地方|区域|场景|当前地点|新地点|here|there|nearby|around|place|location|area|scene|current place|new place)$/i;
function stableDynamicLocationId(location2) {
  const normalized3 = clean2(location2) || "place";
  let hash = 2166136261;
  for (let index = 0; index < normalized3.length; index += 1) {
    hash ^= normalized3.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `dynamic-location-${(hash >>> 0).toString(36)}`;
}
function validatedDynamicRouteHints(command, parsed) {
  const visible = [
    visibleProse(parsed),
    command.location,
    command.detail,
    command.lore,
    ...command.facts ?? [],
    ...parsed.commands.filter((entry) => entry.type === "scene_location").map((entry) => entry.location)
  ].filter(Boolean).join("\n");
  const visibleClean = clean2(visible);
  const seen = /* @__PURE__ */ new Set();
  return [command.location, ...command.routeHints ?? []].map((hint) => hint.trim()).filter((hint) => {
    const normalized3 = clean2(hint);
    if (normalized3.length < 2 || normalized3.length > 48 || genericRouteHint.test(hint.trim()) || seen.has(normalized3)) return false;
    if (clean2(command.location) !== normalized3 && !visibleClean.includes(normalized3)) return false;
    seen.add(normalized3);
    return true;
  }).slice(0, 8);
}
function mergeRouteHints(...groups) {
  const seen = /* @__PURE__ */ new Set();
  const merged = groups.flatMap((group) => group ?? []).map((hint) => hint.trim()).filter((hint) => {
    const normalized3 = clean2(hint);
    if (normalized3.length < 2 || genericRouteHint.test(hint) || seen.has(normalized3)) return false;
    seen.add(normalized3);
    return true;
  }).slice(0, 8);
  return merged.length ? merged : void 0;
}
function inferActionDestination(save, cartridge2, action) {
  if (!routeMovementCue(action, cartridge2.locale)) return void 0;
  const candidates = mapNodes(save, cartridge2).filter((node) => clean2(node.label) !== clean2(save.location)).map((node) => ({ node, score: routeMatchScore(action, node) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);
  if (!candidates.length || candidates[0].score === candidates[1]?.score) return void 0;
  return candidates[0].node;
}
function bindChoiceDestinations(choices, save, cartridge2) {
  return choices.map((choice) => {
    const destination = inferActionDestination(save, cartridge2, choice.label);
    return destination ? { ...choice, targetLocationId: destination.id } : { ...choice, targetLocationId: void 0 };
  });
}
function playerDeclaredLocationAlias(action, locale) {
  const match = locale === "zh" ? action.match(/(?:我(?:要|决定|以后)?|从现在起)?把这里(?:正式)?(?:叫作|叫做|命名为|称为)[“"']?([^”"'，。！？]{2,24})/) : action.match(/\bI\s+(?:(?:will|want to|decide to)\s+)?(?:call|name)\s+(?:this place|this area|here)\s+["']?([^"'.!?]{2,40})/i);
  const alias = match?.[1]?.trim();
  return alias && !genericRouteHint.test(alias) ? alias : void 0;
}
function visibleProse(parsed) {
  return parsed.blocks.filter((block) => block.kind === "narration" || block.kind === "dialogue").map((block) => block.text).join("\n");
}

// src/engine-source/engine/presetEventDirector.ts
var FACT_PREFIX = "preset_event:";
function stableHash2(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function currentNodeId(save, cartridge2) {
  return save.map.find((node) => node.label === save.location)?.id ?? save.map.find((node) => node.current)?.id ?? cartridge2.initialMap.find((node) => node.label === save.location)?.id;
}
function currentDay(save) {
  const stored = Number(save.facts.world_day);
  if (Number.isFinite(stored) && stored >= 1) return Math.floor(stored);
  const match = save.time.match(/(?:第\s*(\d+)\s*天|Day\s*(\d+))/i);
  return Math.max(1, Number(match?.[1] ?? match?.[2] ?? 1));
}
function countKey(eventId) {
  return `${FACT_PREFIX}count:${eventId}`;
}
function dayKey(eventId) {
  return `${FACT_PREFIX}day:${eventId}`;
}
function eventCount(save, eventId) {
  return Math.max(0, Math.floor(Number(save.facts[countKey(eventId)]) || 0));
}
function selectPresetEvent(save, cartridge2) {
  if (!cartridge2.presetEventDirector || save.danger.phase !== "calm") return void 0;
  const nodeId = currentNodeId(save, cartridge2);
  if (!nodeId) return void 0;
  const events = cartridge2.presetEventDirector.events.filter((event) => event.locationId === nodeId);
  if (!events.length) return void 0;
  const day = currentDay(save);
  const lastId = String(save.facts[`${FACT_PREFIX}last`] ?? "");
  const unusedToday = events.filter((event) => Number(save.facts[dayKey(event.id)] ?? 0) !== day);
  const dayPool = unusedToday.length ? unusedToday : events;
  const minimumCount = Math.min(...dayPool.map((event) => eventCount(save, event.id)));
  const leastUsed = dayPool.filter((event) => eventCount(save, event.id) === minimumCount);
  const withoutImmediateRepeat = leastUsed.filter((event) => event.id !== lastId);
  const pool = withoutImmediateRepeat.length ? withoutImmediateRepeat : leastUsed;
  const cycle = Math.max(0, Math.floor(Number(save.facts[`${FACT_PREFIX}cycle`]) || 0));
  return pool[stableHash2(`${cartridge2.id}|${nodeId}|${day}|${cycle}`) % pool.length];
}
function presetEventRecoveryChoice(save, cartridge2) {
  if (save.objective.trim() || save.decisionContext.trim() || save.jobs.some((job) => job.status === "offered" || job.status === "accepted")) return void 0;
  const event = selectPresetEvent(save, cartridge2);
  return event ? { id: `preset-event-${save.scene}-${event.id}`, label: event.choiceLabel } : void 0;
}
function recordPresetEvent(save, resolution) {
  if (!resolution) return;
  const day = currentDay(save);
  const count = eventCount(save, resolution.eventId);
  save.facts[countKey(resolution.eventId)] = count + 1;
  save.facts[dayKey(resolution.eventId)] = day;
  save.facts[`${FACT_PREFIX}last`] = resolution.eventId;
  save.facts[`${FACT_PREFIX}last_category`] = resolution.category;
  save.facts[`${FACT_PREFIX}cycle`] = Math.max(0, Math.floor(Number(save.facts[`${FACT_PREFIX}cycle`]) || 0)) + 1;
}

// src/engine-source/engine/reducer.ts
function clamp3(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function createInitialSave(cartridge2, remoteChatId) {
  const initialPartyMemberIds = cartridge2.initialPartyMemberIds ?? cartridge2.characters.filter((character) => character.initialStatus === "companion").map((character) => character.id);
  const initial = {
    version: 10,
    cartridgeId: cartridge2.id,
    locale: cartridge2.locale,
    remoteChatId,
    entered: false,
    scene: 0,
    location: cartridge2.opening.location,
    sceneLocation: cartridge2.opening.location,
    time: cartridge2.opening.time,
    objective: cartridge2.opening.objective,
    decisionContext: "",
    stats: Object.fromEntries(cartridge2.statDefinitions.map((stat) => [stat.id, stat.initial])),
    facts: { ...cartridge2.initialFacts ?? {} },
    blocks: [...cartridge2.opening.blocks, createImageBlock("image-0", cartridge2.opening.location, cartridge2.opening.imagePrompt, "idle"), createChoiceRecordBlock(0, cartridge2.opening.choices)],
    choices: cartridge2.opening.choices,
    map: cartridge2.initialMap.map((node) => ({ ...node, visited: node.visited ?? Boolean(node.current), facts: node.facts ? [...node.facts] : void 0, routeHints: node.routeHints ? [...node.routeHints] : void 0 })),
    inventory: cartridge2.initialInventory.map((item) => ({ ...item, metrics: item.metrics?.map((metric) => ({ ...metric })), imageStatus: item.imageUrl ? "ready" : "idle" })),
    characters: cartridge2.characters.filter((character) => !character.hiddenUntilIntroduced).map((character) => {
      const state = characterFromDefinition(character);
      if (initialPartyMemberIds.includes(state.id)) state.status = "companion";
      return state;
    }),
    partyMemberIds: initialPartyMemberIds,
    relationships: [],
    jobs: [],
    danger: createInitialDangerState(),
    sessionEnded: false
  };
  initial.choices = bindChoiceDestinations(initial.choices, initial, cartridge2);
  return syncDomainDerivedState(initial, cartridge2);
}
function createChoiceRecordBlock(scene, choices) {
  return { id: `choices-${scene}`, kind: "choices", text: encodeChoiceRecord(choices), data: { scene } };
}
function characterFromDefinition(character) {
  return {
    ...character,
    skills: character.skills.map((skill) => ({ ...skill })),
    visualIdentity: character.visualIdentity ? cloneVisualIdentity(character.visualIdentity) : void 0,
    status: character.initialStatus ?? "known",
    origin: "cartridge",
    updatedAtScene: 0
  };
}
function cloneVisualIdentity(identity) {
  return { ...identity, immutableTraits: [...identity.immutableTraits], wardrobe: [...identity.wardrobe], forbiddenDrift: [...identity.forbiddenDrift] };
}
function visualIdentityFromCommand(command, source) {
  if (command.type !== "character_update" || !command.visualAppearance?.trim()) return void 0;
  return {
    status: "queued",
    version: 1,
    source,
    appearance: command.visualAppearance.trim(),
    immutableTraits: command.visualTraits?.slice(0, 6) ?? [],
    wardrobe: command.visualWardrobe?.slice(0, 4) ?? [],
    forbiddenDrift: command.visualForbidden?.slice(0, 6) ?? ["age drift", "face drift", "hair drift"]
  };
}
function resolveCharacter(save, command, index, cartridge2) {
  if (characterIdentityConflict(save, command, cartridge2)) return void 0;
  const existing = matchingCharacter(save, command);
  if (existing) {
    existing.role = command.role ?? existing.role;
    existing.detail = command.detail ?? existing.detail;
    existing.lore = command.lore ?? existing.lore;
    existing.vitality = command.vitality == null ? existing.vitality : clamp3(command.vitality, 0, 100);
    existing.stress = command.stress == null ? existing.stress : clamp3(command.stress, 0, 100);
    existing.skills = command.skills?.map((skill) => ({ ...skill })) ?? existing.skills;
    existing.visualIdentity ??= visualIdentityFromCommand(command, existing.origin === "cartridge" ? "authored" : "generated");
    existing.lastKnownLocation = save.location;
    existing.updatedAtScene = save.scene;
    return existing;
  }
  const definition = command.characterId ? cartridge2.characters.find((character) => character.id === command.characterId) : void 0;
  if (!command.characterId) return void 0;
  if (!definition && (command.type !== "character_update" || !command.visualAppearance?.trim() || !command.visualTraits?.length)) return void 0;
  const created = {
    ...definition,
    id: command.characterId,
    name: command.character || definition?.name || command.characterId || `NPC ${index + 1}`,
    role: command.role ?? definition?.role ?? t(cartridge2.locale, command.type === "party_change" && command.change === "add" ? "companion" : "knownPerson"),
    vitality: clamp3(command.vitality ?? definition?.vitality ?? 100, 0, 100),
    stress: clamp3(command.stress ?? definition?.stress ?? 0, 0, 100),
    skills: command.skills?.map((skill) => ({ ...skill })) ?? definition?.skills.map((skill) => ({ ...skill })) ?? [],
    detail: command.detail ?? definition?.detail,
    lore: command.lore ?? definition?.lore,
    visualIdentity: definition?.visualIdentity ? cloneVisualIdentity(definition.visualIdentity) : visualIdentityFromCommand(command, definition ? "authored" : "generated"),
    status: "known",
    origin: definition ? "cartridge" : "generated",
    lastKnownLocation: save.location,
    updatedAtScene: save.scene
  };
  save.characters.push(created);
  return created;
}
function hasVisibleDeparture(parsed, characterName) {
  const visible = parsed.blocks.map((block) => `${block.speaker ?? ""} ${block.text}`).join("\n");
  if (!visible.includes(characterName)) return false;
  return /离开|离队|分开|告别|留下|失踪|死亡|独自前往|leave|depart|separat|farewell|stay behind|missing|died|dead|goes alone/i.test(visible);
}
function createImageBlock(id, location2, prompt, status, url = "", metadata) {
  return { id, kind: "image", text: location2, data: { prompt, status, url, ...metadata } };
}
function changeBlock(id, text, data) {
  return { id, kind: "change", text, data };
}
function shortChoiceContext(value, maxLength) {
  const clean3 = value.replace(/[\n\r\t]+/g, " ").replace(/[“”"']/g, "").trim();
  return clean3.length > maxLength ? `${clean3.slice(0, maxLength - 1).trim()}\u2026` : clean3;
}
function createRecoveryChoices(save, cartridge2) {
  const location2 = shortChoiceContext(save.location, cartridge2.locale === "zh" ? 14 : 24);
  const objective = shortChoiceContext(save.objective, cartridge2.locale === "zh" ? 32 : 64).replace(/[。.!！?？；;]+$/u, "");
  const activeThreat = save.danger && save.danger.phase !== "calm";
  const presetEvent = !activeThreat && !objective && save.map && save.facts && save.time && save.danger && save.decisionContext != null && save.jobs ? presetEventRecoveryChoice(save, cartridge2) : void 0;
  if (presetEvent) return [presetEvent];
  const labels = activeThreat && cartridge2.dangerDirector ? contextualDangerChoiceLabels(save.danger?.currentThreat, cartridge2.dangerDirector.methods, cartridge2.locale) : objective ? [objective] : cartridge2.locale === "zh" ? [`\u89C2\u5BDF${location2 || "\u5468\u56F4"}\u7684\u65B0\u53D8\u5316`] : [`Observe what changed around ${location2 || "this place"}`];
  return [...new Set(labels)].map((label, index) => ({ id: `recovery-${save.scene}-${index}`, label }));
}
function validChoiceLabels(labels) {
  const seen = /* @__PURE__ */ new Set();
  return labels.map((label) => label.trim()).filter((label) => label.length >= 2 && label.length <= 96 && !seen.has(label) && Boolean(seen.add(label))).slice(0, 5);
}
function deriveReplylessChoices(save, next, parsed, effects, cartridge2, actionId) {
  if (next.danger.phase !== "calm" && cartridge2.dangerDirector) {
    return contextualDangerChoiceLabels(next.danger.currentThreat, cartridge2.dangerDirector.methods, cartridge2.locale).filter((label) => label.trim() !== actionId.trim()).slice(0, 5).map((label, index) => ({ id: `danger-recovery-${next.scene}-${index}`, label }));
  }
  const candidates = save.location === next.location ? save.choices.filter((choice) => choice.label.trim() !== actionId.trim()).map((choice, index) => ({ id: `derived-${next.scene}-${index}`, label: choice.label })) : [];
  const context = { ...next, blocks: [...next.blocks, ...effects] };
  const grounded = new Set(filterGroundedChoices(candidates, save, cartridge2, [...parsed.blocks, ...effects]).map((choice) => choice.label));
  const retained = candidates.filter((choice) => {
    const domain = resolveDomainAction(context, cartridge2, choice.label);
    return domain ? domain.status === "accepted" : grounded.has(choice.label);
  });
  if (retained.length) return retained.slice(0, 5);
  const stateCandidates = createRecoveryChoices(next, cartridge2).filter((choice) => choice.label.trim() !== actionId.trim());
  const stateGrounded = new Set(filterGroundedChoices(stateCandidates, context, cartridge2, [...parsed.blocks, ...effects]).map((choice) => choice.label));
  return stateCandidates.filter((choice) => {
    const domain = resolveDomainAction(context, cartridge2, choice.label);
    return domain ? domain.status === "accepted" : stateGrounded.has(choice.label);
  }).slice(0, 5);
}
function cleanInferredItemLabel(value) {
  return value.replace(/^[\s“”"「」『』]+|[\s“”"「」『』]+$/g, "").replace(/^(?:一|1)\s*(?:个|件|把|枚|份|瓶|块|张|卷|只)\s*/, "").replace(/^(?:the|an?)\s+/i, "").trim();
}
function inferInventoryCommands(parsed, cartridge2) {
  const narration = parsed.blocks.filter((block) => block.kind === "narration").map((block) => block.text).join("\n");
  if (!narration) return [];
  const explicit = new Set(parsed.commands.filter((command) => command.type === "inventory").map((command) => `${command.action}:${cleanInferredItemLabel(command.item).toLocaleLowerCase()}`));
  const patterns = cartridge2.locale === "zh" ? [
    { action: "add", expression: /你[^。！!？?\n]{0,28}?(?:获得了|得到了|收下了|捡起了?|拾起了?|取走了?|买下了?)([^，,。；;！!？?\n]{1,36})/g },
    { action: "add", expression: /你把([^，,。；;！!？?\n]{1,36}?)放(?:进|入)了?(?:行囊|背包)/g },
    { action: "remove", expression: /你[^。！!？?\n]{0,28}?(?:失去了|交出了|丢弃了|用掉了|消耗了)([^，,。；;！!？?\n]{1,36})/g }
  ] : [
    { action: "add", expression: /\byou [^.!?\n]{0,48}?\b(?:obtained|received|picked up|took|bought|kept)\s+([^.,;!?\n]{1,48})/gi },
    { action: "add", expression: /\byou put\s+([^.,;!?\n]{1,48}?)\s+in(?:to)? (?:your )?(?:pack|bag|inventory)\b/gi },
    { action: "remove", expression: /\byou [^.!?\n]{0,48}?\b(?:lost|gave away|discarded|consumed|used up)\s+([^.,;!?\n]{1,48})/gi }
  ];
  const inferred = [];
  const seen = /* @__PURE__ */ new Set();
  patterns.forEach(({ action, expression }) => {
    let match;
    while (match = expression.exec(narration)) {
      if (/(?:可以|能够|也许|或许|打算|准备|\bcan\b|\bcould\b|\bmay\b|\bmight\b|\bplan(?:ned)? to\b)/i.test(match[0])) continue;
      const item = cleanInferredItemLabel(match[1]);
      const key = `${action}:${item.toLocaleLowerCase()}`;
      if (item.length < 2 || seen.has(key) || explicit.has(key)) continue;
      seen.add(key);
      inferred.push({ type: "inventory", action, item, count: 1 });
    }
  });
  return inferred.slice(0, 3);
}
function applyParsedScene(save, parsed, cartridge2, actionId, imagePrompt, imageSubject, dangerDirective, domainResolution, imageCharacterId, presetEventResolution) {
  const parsedCheckpoint = parsed.commands.some((command) => command.type === "session_end");
  const activeDangerDirective = parsedCheckpoint || domainSuppressesDanger(domainResolution) || !dangerDirective || !dangerDirectiveEstablished(parsed, dangerDirective, cartridge2.locale) ? void 0 : dangerDirective;
  const commandDestination = parsed.commands.find((command) => command.type === "map_update");
  const domainMap = domainResolution?.status === "accepted" ? domainResolution.effects.find((effect) => effect.type === "map") : void 0;
  const domainDestination = domainMap?.type === "map" ? save.map.find((node) => node.id === domainMap.nodeId)?.label ?? cartridge2.initialMap.find((node) => node.id === domainMap.nodeId)?.label : void 0;
  const transition = createTransitionBlock(save, commandDestination?.type === "map_update" ? commandDestination.location : domainDestination, cartridge2);
  const next = {
    ...save,
    locale: cartridge2.locale,
    scene: save.scene + 1,
    sceneLocation: save.sceneLocation ?? save.location,
    blocks: [
      ...save.blocks,
      { id: `action-${save.scene + 1}`, kind: "event", text: actionId },
      ...transition ? [transition] : [],
      ...domainResolution ? [] : parsed.blocks
    ],
    choices: [],
    relationships: [...save.relationships],
    jobs: save.jobs.map((job) => ({ ...job })),
    map: save.map.map((node) => ({ ...node })),
    inventory: save.inventory.map((item) => ({ ...item })),
    characters: save.characters.map((character) => ({ ...character, skills: character.skills.map((skill) => ({ ...skill })), visualIdentity: character.visualIdentity ? cloneVisualIdentity(character.visualIdentity) : void 0 })),
    partyMemberIds: [...save.partyMemberIds],
    stats: { ...save.stats },
    facts: { ...save.facts },
    danger: normalizeDangerState(save.danger),
    decisionContext: domainResolution?.continuation === "resume" ? save.decisionContext : "",
    sessionEnded: false,
    lastActionId: actionId
  };
  recordPresetEvent(next, presetEventResolution);
  delete next.facts.consistency_quarantined_action;
  delete next.facts.consistency_quarantined_location;
  const declaredAlias = playerDeclaredLocationAlias(actionId, cartridge2.locale);
  if (declaredAlias) {
    const sourceNode = next.map.find((node) => node.current || node.label === save.location);
    if (sourceNode) sourceNode.routeHints = mergeRouteHints(sourceNode.routeHints, [declaredAlias]);
  }
  const visibleTurnText = parsed.blocks.filter((block) => block.kind === "narration" || block.kind === "dialogue").map((block) => block.text.trim()).filter(Boolean).join(" ");
  const effects = [];
  let dangerCheckAdded = false;
  const adjudicatedParsed = domainResolution ? domainResolution.status === "accepted" && domainResolution.dangerPolicy === "advance" && activeDangerDirective ? { ...parsed, commands: parsed.commands.filter((command) => command.type === "encounter" || command.type === "skill_check") } : { ...parsed, commands: [] } : parsed;
  const commands = [...parsed.commands, ...inferInventoryCommands(parsed, cartridge2)].filter((command) => domainAllowsModelCommand(command, domainResolution));
  const hasJobSettlement = commands.some((command) => command.type === "job" && command.action === "settle");
  commands.forEach((command, index) => {
    const effectId = `effect-${next.scene}-${index}`;
    if (command.type === "choices") {
      const labels = validChoiceLabels(command.choices);
      if (labels.length) next.choices = labels.map((label, choiceIndex) => ({ id: `${next.scene}-${choiceIndex}`, label }));
    }
    if (command.type === "situation") next.decisionContext = authoredDecisionContext(command.text, visibleTurnText, cartridge2.locale);
    if (command.type === "widget") {
      const definition = cartridge2.statDefinitions.find((stat) => stat.id === command.id);
      if (!definition) return;
      if (command.id === "coin" && command.operation === "add" && hasJobSettlement) return;
      const current = next.stats[command.id] ?? definition.initial;
      const raw = Number(command.value);
      const requested = command.operation === "add" ? current + raw : command.operation === "remove" ? current - raw : raw;
      const maxDelta = definition.maxDelta == null ? Number.POSITIVE_INFINITY : Math.max(0, definition.maxDelta);
      const boundedDelta = clamp3(requested - current, -maxDelta, maxDelta);
      next.stats[command.id] = clamp3(current + boundedDelta, definition.min, definition.max);
      const delta = next.stats[command.id] - current;
      effects.push(changeBlock(effectId, `${definition.label} ${delta > 0 ? "+" : ""}${delta}`, { stat: command.id, delta }));
    }
    if (command.type === "skill_check") {
      const fixed = activeDangerDirective?.phase === "resolution" && activeDangerDirective.check ? activeDangerDirective.check : void 0;
      const check = fixed ?? command;
      const succeeded = fixed ? fixed.outcome === "critical-success" || fixed.outcome === "success" || fixed.outcome === "costly-success" : command.result === "success";
      effects.push({ id: effectId, kind: "check", text: `${check.skill} \xB7 ${succeeded ? t(cartridge2.locale, "checkSuccess") : t(cartridge2.locale, "checkFailure")}`, data: { dc: check.dc, roll: check.roll, modifier: check.modifier, total: check.total, outcome: fixed?.outcome ?? command.result } });
      dangerCheckAdded = Boolean(fixed);
    }
    if (command.type === "state" && command.value) next.objective = command.value;
    if (command.type === "clock" && command.value) {
      next.time = command.value;
      const day = command.value.match(/(?:第\s*(\d+)\s*天|Day\s*(\d+))/i);
      if (day) next.facts.world_day = Math.max(1, Number(day[1] ?? day[2]));
    }
    if (command.type === "map_update") {
      const beforeLocation = next.location;
      const hints = validatedDynamicRouteHints(command, parsed);
      const existing = next.map.find((node) => node.id === command.locationId || node.label === command.location || node.id === command.location);
      const destinationId = existing?.id ?? command.locationId ?? stableDynamicLocationId(command.location);
      next.map.forEach((node) => {
        node.current = node.id === destinationId;
      });
      if (existing) {
        existing.current = true;
        existing.visited = true;
        if (command.connectedTo) existing.connectedTo = command.connectedTo;
        if (command.detail) existing.detail = command.detail;
        if (command.lore) existing.lore = command.lore;
        if (command.facts) existing.facts = command.facts;
        existing.routeHints = mergeRouteHints(existing.routeHints, hints);
      } else next.map.push({
        id: destinationId,
        label: command.location,
        connectedTo: command.connectedTo,
        current: true,
        visited: true,
        detail: command.detail,
        lore: command.lore,
        facts: command.facts,
        routeHints: hints
      });
      next.location = command.location;
      next.sceneLocation = command.location;
      if (beforeLocation !== command.location) effects.push({ id: effectId, kind: "event", text: t(cartridge2.locale, "arrived", { name: command.location }), data: { arrival: command.location, locationId: destinationId } });
    }
    if (command.type === "scene_location") next.sceneLocation = command.location;
    if (command.type === "inventory") {
      const existing = next.inventory.find((item) => item.label === command.item || item.id === command.item);
      let changed = false;
      if (existing) {
        const before = existing.count;
        existing.count = Math.max(0, existing.count + (command.action === "add" ? command.count : -command.count));
        changed = existing.count !== before;
        if (command.rarity) existing.rarity = command.rarity;
        if (command.detail) existing.detail = command.detail;
        if (command.effect) existing.effect = command.effect;
        if (command.lore) existing.lore = command.lore;
        if (command.metrics) existing.metrics = command.metrics;
        if (command.imagePrompt) existing.imagePrompt = command.imagePrompt;
      } else if (command.action === "add") {
        next.inventory.push({
          id: `item-${next.scene}-${index}`,
          label: command.item,
          count: command.count,
          rarity: command.rarity,
          detail: command.detail,
          effect: command.effect,
          lore: command.lore,
          metrics: command.metrics,
          imagePrompt: command.imagePrompt,
          imageStatus: "idle"
        });
        changed = true;
      }
      next.inventory = next.inventory.filter((item) => item.count > 0);
      if (changed) effects.push(changeBlock(effectId, `${command.action === "add" ? t(cartridge2.locale, "gained") : t(cartridge2.locale, "lost")} ${command.item} \xD7${command.count}`, { itemAction: command.action, ...command.rarity ? { rarity: command.rarity } : {} }));
    }
    if (command.type === "job") {
      const existing = next.jobs.find((job) => job.id === command.id);
      if (command.action === "offer") {
        if (!command.wage || !command.label || existing) return;
        next.jobs.push({ id: command.id, label: command.label, employer: command.employer, wage: command.wage, status: "offered", offeredAtScene: next.scene });
      }
      if (command.action === "accept" && existing && existing.status === "offered") existing.status = "accepted";
      if (command.action === "cancel" && existing && existing.status !== "settled") existing.status = "cancelled";
      const payable = command.action === "settle" ? next.jobs.find((job) => job.id === command.id) : void 0;
      if (payable && (payable.status === "offered" || payable.status === "accepted")) {
        const definition = cartridge2.statDefinitions.find((stat) => stat.id === "coin");
        if (!definition) return;
        const before = next.stats.coin ?? definition.initial;
        const wage = Math.min(payable.wage, definition.maxDelta ?? payable.wage);
        next.stats.coin = clamp3(before + wage, definition.min, definition.max);
        const delta = next.stats.coin - before;
        payable.status = "settled";
        payable.settledAtScene = next.scene;
        next.facts.jobs_completed = Number(next.facts.jobs_completed ?? 0) + 1;
        if (delta) effects.push(changeBlock(effectId, `${definition.label} +${delta}`, { stat: "coin", delta, jobId: payable.id }));
      }
      next.jobs = next.jobs.slice(-40);
    }
    if (command.type === "reputation") {
      const delta = /betray|hostile|distrust|拒绝|背叛/i.test(command.action) ? -1 : 1;
      const character = next.characters.find((entry) => normalizedCharacterName(entry.name) === normalizedCharacterName(command.npc));
      if (!character) return;
      next.relationships.push({ id: effectId, actor: character.name, characterId: character.id, axis: command.action, delta, source: actionId });
      effects.push(changeBlock(effectId, `${command.npc} \xB7 ${delta > 0 ? t(cartridge2.locale, "warmer") : t(cartridge2.locale, "colder")}`, { delta, relationshipChange: command.action }));
    }
    if (command.type === "character_update") {
      const existing = matchingCharacter(next, command);
      if (characterIdentityConflict(next, command, cartridge2)) return;
      if (!existing && !hasVisibleCharacterDebut(parsed, command.character, cartridge2.locale)) return;
      resolveCharacter(next, command, index, cartridge2);
    }
    if (command.type === "party_change") {
      const character = resolveCharacter(next, command, index, cartridge2);
      if (!character) return;
      if (command.change === "add") {
        if (!hasVisiblePartyJoin(parsed, character.name, cartridge2.locale)) return;
        if (!next.partyMemberIds.includes(character.id)) next.partyMemberIds.push(character.id);
        character.status = "companion";
        character.joinedAtScene ??= next.scene;
        character.leftAtScene = void 0;
      } else {
        if (!hasVisibleDeparture(parsed, character.name)) return;
        next.partyMemberIds = next.partyMemberIds.filter((id) => id !== character.id);
        character.status = "departed";
        character.leftAtScene = next.scene;
      }
      character.updatedAtScene = next.scene;
      effects.push({ id: effectId, kind: "event", text: `${character.name}${t(cartridge2.locale, command.change === "add" ? "joined" : "left")}`, data: { characterId: character.id, partyChange: command.change } });
    }
    if (command.type === "session_end") {
      next.sessionEnded = true;
      effects.push({ id: effectId, kind: "summary", text: command.reason });
    }
  });
  if (activeDangerDirective?.phase === "resolution" && activeDangerDirective.check && !dangerCheckAdded) {
    const check = activeDangerDirective.check;
    const succeeded = check.outcome === "critical-success" || check.outcome === "success" || check.outcome === "costly-success";
    effects.push({
      id: `danger-check-${next.scene}`,
      kind: "check",
      text: `${check.skill} \xB7 ${succeeded ? t(cartridge2.locale, "checkSuccess") : t(cartridge2.locale, "checkFailure")}`,
      data: { dc: check.dc, roll: check.roll, modifier: check.modifier, total: check.total, outcome: check.outcome }
    });
  }
  if (domainResolution?.status !== "rejected") effects.push(...settleDangerTurn(save, next, adjudicatedParsed, cartridge2, activeDangerDirective));
  effects.push(...applyDomainResolution(next, cartridge2, domainResolution));
  if (next.choices.length) {
    const textGrounded = new Set(filterGroundedChoices(next.choices, { ...next, blocks: [...next.blocks, ...effects] }, cartridge2, [...parsed.blocks, ...effects]).map((choice) => choice.label));
    const trustedDomainChoices = new Set(domainResolution?.status === "accepted" && domainResolution.continuation === "replace" ? domainResolution.successChoices : []);
    const trustedPresetChoices = new Set(presetEventResolution ? parsed.commands.find((command) => command.type === "choices")?.choices ?? [] : []);
    next.choices = next.choices.filter((choice) => {
      const domain = resolveDomainAction(next, cartridge2, choice.label);
      const authored = resolveDeterministicChoiceTurn(next, cartridge2, choice.label);
      return domain ? domain.status === "accepted" : trustedDomainChoices.has(choice.label) || trustedPresetChoices.has(choice.label) || Boolean(authored) || Boolean(inferActionDestination(next, cartridge2, choice.label)) || textGrounded.has(choice.label);
    });
  }
  if (!next.sessionEnded && next.choices.length === 0) {
    next.choices = activeDangerDirective ? dangerDirectiveChoices(activeDangerDirective, next.scene) : deriveReplylessChoices(save, next, parsed, effects, cartridge2, actionId);
  }
  const floor = activeStatFloorRule(next, cartridge2);
  if (!next.sessionEnded && floor) {
    const previous = Number(save.stats[floor.definition.id] ?? floor.definition.initial);
    if (previous > floor.threshold) {
      effects.push({
        id: `stat-floor-${floor.definition.id}-${next.scene}`,
        kind: "event",
        text: floor.rule.enteredText,
        data: { statFloor: floor.definition.id, threshold: floor.threshold }
      });
    }
    next.choices = statFloorChoices(next, cartridge2) ?? next.choices;
  }
  if (!next.sessionEnded && next.choices.length) next.choices = bindChoiceDestinations(next.choices, next, cartridge2);
  const domainImageNode = domainMap?.type === "map" ? next.map.find((node) => node.id === domainMap.nodeId) ?? cartridge2.initialMap.find((node) => node.id === domainMap.nodeId) : void 0;
  const imageParsed = domainImageNode ? {
    ...adjudicatedParsed,
    commands: [{
      type: "map_update",
      location: domainImageNode.label,
      locationId: domainImageNode.id,
      connectedTo: domainImageNode.connectedTo,
      detail: domainImageNode.detail,
      lore: domainImageNode.lore,
      facts: domainImageNode.facts,
      routeHints: domainImageNode.routeHints
    }]
  } : adjudicatedParsed;
  const image = domainResolution?.status === "rejected" ? { prompt: "" } : chooseSceneImage(
    save,
    next,
    imageParsed,
    cartridge2,
    imagePrompt,
    domainImageNode && !imageSubject ? "environment" : imageSubject,
    imageCharacterId
  );
  next.blocks = [
    ...next.blocks,
    ...effects,
    ...image.prompt ? [createImageBlock(`image-${next.scene}`, next.sceneLocation ?? next.location, image.prompt, "queued", "", {
      source: image.source ?? "director",
      reason: image.reason ?? "cadence",
      promptVersion: String(SCENE_IMAGE_PROMPT_VERSION),
      playerVisible: image.playerVisible ? "true" : "false",
      perspective: image.perspective ?? "observer",
      ...image.identityCharacterId ? { identityCharacterId: image.identityCharacterId } : {}
    })] : [],
    ...!next.sessionEnded && next.choices.length ? [createChoiceRecordBlock(next.scene, next.choices)] : []
  ];
  return syncDomainDerivedState(next, cartridge2);
}

// src/door-layout.json
var door_layout_default = {
  "office-records": {
    room: "office",
    side: "E",
    x: 606,
    y: 320
  },
  "office-client": {
    room: "office",
    side: "S",
    x: 340,
    y: 576
  },
  "records-office": {
    room: "records",
    side: "W",
    x: 34,
    y: 320
  },
  "client-office": {
    room: "client",
    side: "N",
    x: 340,
    y: 128
  },
  "office-delivery": {
    room: "office",
    side: "N",
    x: 320,
    y: 128
  },
  "delivery-office": {
    room: "delivery",
    side: "S",
    x: 320,
    y: 576
  },
  "records-channel": {
    room: "records",
    side: "N",
    x: 320,
    y: 128
  },
  "channel-records": {
    room: "channel",
    side: "S",
    x: 320,
    y: 576
  },
  "lobby-meeting": {
    room: "lobby",
    side: "N",
    x: 320,
    y: 128
  },
  "meeting-lobby": {
    room: "meeting",
    side: "S",
    x: 320,
    y: 576
  },
  "lobby-study": {
    room: "lobby",
    side: "W",
    x: 34,
    y: 420
  },
  "study-lobby": {
    room: "study",
    side: "E",
    x: 606,
    y: 420
  },
  "lobby-archive": {
    room: "lobby",
    side: "W",
    x: 34,
    y: 235
  },
  "archive-lobby": {
    room: "archive",
    side: "E",
    x: 606,
    y: 235
  },
  "lobby-fund": {
    room: "lobby",
    side: "E",
    x: 606,
    y: 235
  },
  "fund-lobby": {
    room: "fund",
    side: "W",
    x: 34,
    y: 235
  },
  "lobby-partnerroom": {
    room: "lobby",
    side: "E",
    x: 606,
    y: 420
  },
  "partnerroom-lobby": {
    room: "partnerroom",
    side: "W",
    x: 34,
    y: 420
  },
  "lobby-office": {
    room: "lobby",
    side: "S",
    x: 320,
    y: 576
  },
  "office-lobby": {
    room: "office",
    side: "W",
    x: 34,
    y: 430
  }
};

// src/spatial/architecture.ts
function sideLeafBodies(scene) {
  return Object.values(door_layout_default).filter((d) => d.room === scene && (d.side === "W" || d.side === "E")).map((d) => ({ x: d.side === "W" ? 34 : 558, y: d.y - 36, w: 48, h: 4 }));
}

// src/art-assets.ts
var trial = import.meta.env?.DEV ? new URLSearchParams(location.search).get("artTrial") : null;
var platformArtEnabled = !["legacy", "actor", "room"].includes(trial || "");

// src/platform-room-layout.ts
function applyPlatformRoomLayout(room) {
  const desk = room.props.find((p) => p.asset === "fund-furniture-0");
  desk.width = 128;
  desk.obstacles = [{ x: 108, y: 242, w: 114, h: 32 }];
  const cabinet = room.props.find((p) => p.asset === "fund-furniture-2");
  cabinet.width = 136;
  cabinet.obstacles = [{ x: 368, y: 192, w: 124, h: 22 }];
  const table = room.props.find((p) => p.asset === "fund-furniture-1");
  table.width = 200;
  table.obstacles = [{ x: 371, y: 431, w: 188, h: 54 }];
  const chair = room.props.find((p) => p.asset === "fund-furniture-3");
  chair.width = 44;
  chair.obstacles = [{ x: 151, y: 480, w: 26, h: 14 }, { x: 157, y: 475, w: 20, h: 8 }];
}
function applyPlatformOtherRoomLayout(room) {
  const widths = { office: [128, 136, 136, 46], records: [144, 136, 128, 60], client: [136, 152, 100, 32] };
  const sizes = widths[room.id];
  if (!sizes) return;
  for (const prop of room.props) {
    const index = Number(prop.asset.at(-1)), width = sizes[index];
    if (width === void 0) continue;
    prop.width = width;
    const narrow = room.id === "office" && index === 3 || room.id === "records" && index === 3 || room.id === "client" && index === 3;
    const w = narrow ? width * 0.62 : width * 0.9, h = narrow ? 18 : 28;
    prop.obstacles = [{ x: prop.x - w / 2, y: prop.y - h - 7, w, h }];
  }
}
function addPlatformSeats(room) {
  const positions = { fund: [[395, 530], [535, 530]], office: [[140, 336], [470, 310]], records: [[150, 341], [228, 341]], client: [[235, 300], [535, 344]] };
  for (const [i, [x, y]] of (positions[room.id] ?? []).entries()) {
    const asset = room.id + "-furniture-" + (i + 4);
    if (room.props.some((p) => p.asset === asset)) continue;
    room.props.push({ asset, x, y, width: 32, obstacles: [{ x: x - 11, y: y - 16, w: 22, h: 12 }] });
  }
}

// src/fresh-room-layout.ts
function applyFreshRoomLayout(room) {
  const chair = room.props.find((p) => p.asset === "fund-furniture-3");
  chair.width = 66;
  chair.obstacles = [{ x: 148, y: 470, w: 31, h: 23 }, { x: 139, y: 463, w: 27, h: 21 }];
  const committee = room.props.find((p) => p.asset === "fund-furniture-1");
  committee.obstacles = [{ x: 372, y: 400, w: 186, h: 45 }, { x: 403, y: 379, w: 43, h: 25 }, { x: 481, y: 379, w: 43, h: 25 }, { x: 401, y: 466, w: 45, h: 25 }, { x: 481, y: 466, w: 45, h: 25 }];
}

// src/spatial/world.ts
function walkable(world2, scene, p) {
  const s = world2.scenes[scene], a = world2.actor;
  if (!s || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return false;
  const r = s.interior;
  return p.x >= r.x && p.y >= r.y && p.x + a.w <= r.x + r.w && p.y + a.h <= r.y + r.h && !s.obstacles.some((o) => p.x < o.x + o.w && p.x + a.w > o.x && p.y < o.y + o.h && p.y + a.h > o.y);
}
function findPath(world2, scene, from, to) {
  const step = world2.step, key = (p) => `${p.x},${p.y}`, round = (p) => ({ x: Math.round(p.x / step) * step, y: Math.round(p.y / step) * step });
  const clear = (a, b) => {
    const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y)));
    for (let i = 1; i <= n; i++) if (!walkable(world2, scene, { x: a.x + (b.x - a.x) * i / n, y: a.y + (b.y - a.y) * i / n })) return false;
    return true;
  };
  if (!walkable(world2, scene, from) || !walkable(world2, scene, to)) return [];
  const nearby = (p) => {
    const center = round(p), points = [];
    for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) {
      const q = { x: center.x + x * step, y: center.y + y * step };
      if (walkable(world2, scene, q) && clear(p, q)) points.push(q);
    }
    return points.sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y));
  };
  const starts = nearby(from), ends = new Set(nearby(to).map(key));
  if (!starts.length || !ends.size) return [];
  const queue = [...starts], parents = new Map(starts.map((p) => [key(p), null]));
  let end;
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (ends.has(key(p))) {
      end = p;
      break;
    }
    for (const [dx, dy] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
      const q = { x: p.x + dx, y: p.y + dy };
      if (!parents.has(key(q)) && walkable(world2, scene, q) && clear(p, q)) {
        parents.set(key(q), p);
        queue.push(q);
      }
    }
  }
  if (!end) return [];
  const route = [to];
  for (let p = end; p; p = parents.get(key(p)) ?? null) route.push(p);
  return route.reverse();
}

// src/world.ts
var placed = (asset, x, y, width, obstacles) => ({ asset, x, y, width, obstacles });
var file = (id, label, x, y) => ({ id, kind: "record", record: id, label, at: { x, y }, approach: { x: x - 7, y: y + 24 } });
var npc = (person, x, y) => ({ id: person, kind: "person", person, label: ["\u4EA4\u8C08", "Talk"], at: { x, y }, approach: { x: x - 7, y: y + 36 } });
var door = (id, to, label) => {
  const d = door_layout_default[id];
  return { id, kind: "door", to, label, at: { x: d.x, y: d.y }, approach: { x: d.side === "W" ? 38 : d.side === "E" ? 574 : d.x - 7, y: d.side === "N" ? d.y + 4 : d.side === "S" ? 566 : d.y - 5 } };
};
var rooms = {
  lobby: { id: "lobby", title: ["Northline \xB7 \u4E2D\u592E\u63A5\u5F85\u533A", "NORTHLINE \xB7 CENTRAL RECEPTION"], subtitle: ["\u529E\u516C\u5BA4\u4E0E\u5916\u8BBF", "OFFICES & SITE VISITS"], floor: 0, props: [placed("fund-furniture-2", 320, 280, 136, [{ x: 258, y: 252, w: 124, h: 22 }]), placed("office-furniture-3", 320, 400, 46, [{ x: 306, y: 375, w: 28, h: 18 }])], entities: [door("lobby-study", "study", ["\u53BB\u81EA\u5DF1\u7684\u529E\u516C\u5BA4", "To your office"]), door("lobby-archive", "archive", ["\u53BB\u57FA\u91D1\u8D44\u6599\u5BA4", "To fund archive"]), door("lobby-fund", "fund", ["\u53BB\u9879\u76EE\u7EC4\u529E\u516C\u533A", "To deal team"]), door("lobby-partnerroom", "partnerroom", ["\u53BB\u5408\u4F19\u4EBA\u529E\u516C\u5BA4", "To partner office"]), door("lobby-meeting", "meeting", ["\u53BB\u6295\u59D4\u4F1A\u4F1A\u8BAE\u5BA4", "To committee room"]), door("lobby-office", "office", ["\u5916\u51FA\u62DC\u8BBF RelayOps", "Visit RelayOps"])] },
  fund: { id: "fund", title: ["Northline \xB7 \u9879\u76EE\u7EC4\u529E\u516C\u533A", "NORTHLINE \xB7 DEAL TEAM"], subtitle: ["\u5468\u4E94 \xB7 16:40", "FRIDAY \xB7 16:40"], floor: 0, floorAsset: "floor-fund-v2", props: [
    placed("fund-furniture-0", 165, 282, 190, [{ x: 82, y: 216, w: 166, h: 54 }]),
    placed("fund-furniture-2", 430, 220, 172, [{ x: 354, y: 177, w: 152, h: 35 }]),
    placed("fund-furniture-1", 465, 492, 200, [{ x: 378, y: 404, w: 174, h: 70 }]),
    placed("fund-furniture-3", 165, 500, 80, [{ x: 136, y: 457, w: 58, h: 36 }])
  ], entities: [file("memo", ["\u6295\u59D4\u4F1A\u6458\u8981", "Committee brief"], 165, 270), npc("analyst", 278, 332), door("fund-lobby", "lobby", ["\u56DE\u4E2D\u592E\u63A5\u5F85\u533A", "To central reception"])] },
  office: { id: "office", title: ["RelayOps \xB7 \u5F00\u653E\u529E\u516C\u533A", "RELAYOPS \xB7 WORKSPACE"], subtitle: ["\u5468\u4E94 \xB7 17:20", "FRIDAY \xB7 17:20"], floor: 1, floorAsset: "floor-office-v2", props: [
    placed("office-furniture-0", 165, 282, 190, [{ x: 80, y: 218, w: 170, h: 52 }]),
    placed("office-furniture-1", 470, 252, 190, [{ x: 386, y: 194, w: 168, h: 48 }]),
    placed("office-furniture-2", 470, 500, 174, [{ x: 392, y: 432, w: 156, h: 54 }]),
    placed("office-furniture-3", 165, 500, 66, [{ x: 142, y: 454, w: 46, h: 38 }])
  ], entities: [file("contract", ["\u5BA2\u6237\u5408\u540C", "Customer contract"], 170, 270), file("forecast", ["\u73B0\u91D1\u9884\u6D4B", "Cash forecast"], 470, 235), npc("founder", 355, 350), door("office-delivery", "delivery", ["\u53BB\u4EA4\u4ED8\u4F5C\u6218\u5BA4", "To delivery room"]), door("office-lobby", "lobby", ["\u8FD4\u56DE Northline \u603B\u90E8", "Return to Northline"]), door("office-records", "records", ["\u53BB\u8D44\u6599\u4F1A\u8BAE\u5BA4", "To data room"]), door("office-client", "client", ["\u53BB\u5BA2\u6237\u73B0\u573A", "To customer site"])] },
  records: { id: "records", title: ["RelayOps \xB7 \u8D44\u6599\u4F1A\u8BAE\u5BA4", "RELAYOPS \xB7 DATA ROOM"], subtitle: ["\u5468\u4E94 \xB7 18:05", "FRIDAY \xB7 18:05"], floor: 3, floorAsset: "floor-records-v2", props: [
    placed("records-furniture-0", 190, 295, 190, [{ x: 108, y: 229, w: 164, h: 54 }]),
    placed("records-furniture-1", 485, 220, 166, [{ x: 412, y: 177, w: 146, h: 34 }]),
    placed("records-furniture-2", 470, 470, 176, [{ x: 392, y: 411, w: 156, h: 48 }]),
    placed("records-furniture-3", 150, 515, 100, [{ x: 114, y: 455, w: 72, h: 48 }])
  ], entities: [file("payment", ["\u94F6\u884C\u56DE\u5355", "Bank receipt"], 190, 295), file("appendix", ["\u8865\u5145\u534F\u8BAE", "Supplement"], 485, 205), file("cash", ["\u4ED8\u6B3E\u6392\u671F", "Payment schedule"], 470, 465), file("channel", ["\u6E20\u9053\u8BF4\u660E", "Channel disclosure"], 150, 510), npc("finance", 315, 335), door("records-channel", "channel", ["\u53BB\u6E20\u9053\u7ED3\u7B97\u529E\u516C\u5BA4", "To settlement office"]), door("records-office", "office", ["\u56DE\u5F00\u653E\u529E\u516C\u533A", "To workspace"])] },
  client: { id: "client", title: ["Harbor & Pine \xB7 \u8FD0\u8425\u73B0\u573A", "HARBOR & PINE \xB7 OPERATIONS"], subtitle: ["\u5468\u4E94 \xB7 19:10", "FRIDAY \xB7 19:10"], floor: 2, floorAsset: "floor-client-v2", props: [
    placed("client-furniture-0", 165, 285, 184, [{ x: 84, y: 222, w: 162, h: 52 }]),
    placed("client-furniture-1", 470, 285, 188, [{ x: 386, y: 220, w: 168, h: 52 }]),
    placed("client-furniture-3", 165, 515, 72, [{ x: 140, y: 463, w: 50, h: 40 }]),
    placed("client-furniture-2", 470, 515, 150, [{ x: 404, y: 450, w: 132, h: 52 }])
  ], entities: [file("rollout", ["\u4E0A\u7EBF\u6E05\u5355", "Deployment list"], 165, 275), file("acceptance", ["\u9A8C\u6536\u610F\u89C1", "Acceptance note"], 470, 265), file("reference", ["\u590D\u8D2D\u8BB0\u5F55", "Renewal record"], 470, 515), npc("client", 315, 335), door("client-office", "office", ["\u56DE RelayOps", "To RelayOps"])] },
  delivery: { id: "delivery", title: ["RelayOps \xB7 \u4EA4\u4ED8\u4F5C\u6218\u5BA4", "RELAYOPS \xB7 DELIVERY ROOM"], subtitle: ["\u5468\u4E94 \xB7 18:20", "FRIDAY \xB7 18:20"], floor: 1, props: [
    placed("delivery-console", 300, 310, 168, [{ x: 223, y: 274, w: 154, h: 29 }]),
    placed("office-furniture-2", 480, 220, 128, [{ x: 423, y: 187, w: 114, h: 26 }]),
    placed("client-furniture-3", 140, 440, 36, [{ x: 127, y: 423, w: 26, h: 17 }]),
    placed("office-furniture-4", 278, 365, 32, [{ x: 267, y: 351, w: 22, h: 12 }])
  ], entities: [file("delivery-log", ["\u6545\u969C\u4EA4\u63A5\u5355", "Delivery handover"], 300, 310), door("delivery-office", "office", ["\u56DE\u5F00\u653E\u529E\u516C\u533A", "To workspace"])] },
  channel: { id: "channel", title: ["BridgeStone \xB7 \u6E20\u9053\u7ED3\u7B97\u529E\u516C\u5BA4", "BRIDGESTONE \xB7 SETTLEMENT OFFICE"], subtitle: ["\u5468\u4E94 \xB7 18:40", "FRIDAY \xB7 18:40"], floor: 3, props: [
    placed("channel-ledger", 250, 280, 150, [{ x: 182, y: 248, w: 136, h: 26 }]),
    placed("records-furniture-1", 470, 210, 116, [{ x: 418, y: 179, w: 104, h: 26 }]),
    placed("records-furniture-3", 470, 430, 55, [{ x: 450, y: 411, w: 40, h: 18 }]),
    placed("records-furniture-4", 235, 335, 32, [{ x: 224, y: 322, w: 22, h: 12 }])
  ], entities: [file("settlement-review", ["\u7ED3\u7B97\u6838\u5BF9\u5355", "Settlement reconciliation"], 250, 280), door("channel-records", "records", ["\u56DE\u8D44\u6599\u4F1A\u8BAE\u5BA4", "To data room"])] },
  meeting: { id: "meeting", title: ["Northline \xB7 \u6295\u59D4\u4F1A\u4F1A\u8BAE\u5BA4", "NORTHLINE \xB7 COMMITTEE ROOM"], subtitle: ["\u5468\u4E94 \xB7 19:50", "FRIDAY \xB7 19:50"], floor: 0, props: [
    placed("meeting-board", 320, 340, 220, [{ x: 220, y: 282, w: 200, h: 50 }]),
    placed("fund-furniture-2", 490, 180, 100, [{ x: 445, y: 154, w: 90, h: 21 }]),
    placed("fund-furniture-4", 240, 395, 32, [{ x: 229, y: 382, w: 22, h: 12 }]),
    placed("fund-furniture-5", 400, 395, 32, [{ x: 389, y: 382, w: 22, h: 12 }]),
    placed("office-furniture-3", 125, 200, 44, [{ x: 110, y: 182, w: 30, h: 18 }])
  ], entities: [{ id: "committee", kind: "committee", label: ["\u63D0\u4EA4\u6295\u59D4\u4F1A\u610F\u89C1", "Submit recommendation"], at: { x: 440, y: 340 }, approach: { x: 455, y: 353 } }, file("committee-draft", ["\u4E0A\u6B21\u8BA8\u8BBA\u7559\u75D5", "Prior discussion notes"], 320, 340), door("meeting-lobby", "lobby", ["\u56DE\u4E2D\u592E\u63A5\u5F85\u533A", "To central reception"])] },
  study: { id: "study", title: ["Northline \xB7 \u827E\u5A03\u7684\u529E\u516C\u5BA4", "NORTHLINE \xB7 YOUR OFFICE"], subtitle: ["\u9879\u76EE\u4E0E\u6765\u4FE1", "PROJECTS & CORRESPONDENCE"], floor: 0, props: [
    placed("fund-furniture-0", 210, 280, 128, [{ x: 153, y: 241, w: 114, h: 32 }]),
    placed("fund-furniture-4", 210, 335, 32, [{ x: 199, y: 319, w: 22, h: 12 }]),
    placed("fund-furniture-2", 470, 210, 136, [{ x: 408, y: 182, w: 124, h: 22 }]),
    placed("office-furniture-3", 125, 435, 46, [{ x: 111, y: 410, w: 28, h: 18 }])
  ], entities: [{ id: "project-desk", kind: "projects", label: ["\u9879\u76EE\u59D4\u6258\u4E0E\u6765\u4FE1", "Project desk"], at: { x: 210, y: 275 }, approach: { x: 240, y: 314 } }, door("study-lobby", "lobby", ["\u56DE\u4E2D\u592E\u63A5\u5F85\u533A", "To central reception"])] },
  archive: { id: "archive", title: ["Northline \xB7 \u57FA\u91D1\u8D44\u6599\u5BA4", "NORTHLINE \xB7 FUND ARCHIVE"], subtitle: ["\u8BC1\u636E\u4E0E\u5DF2\u63D0\u4EA4\u610F\u89C1", "EVIDENCE & RECOMMENDATIONS"], floor: 3, props: [
    placed("records-furniture-1", 160, 220, 136, [{ x: 99, y: 183, w: 122, h: 30 }]),
    placed("fund-furniture-2", 470, 220, 136, [{ x: 408, y: 190, w: 124, h: 22 }]),
    placed("channel-ledger", 310, 390, 150, [{ x: 242, y: 358, w: 136, h: 26 }]),
    placed("records-furniture-4", 310, 444, 32, [{ x: 299, y: 428, w: 22, h: 12 }])
  ], entities: [{ id: "archive-desk", kind: "archive", label: ["\u5F53\u524D\u9879\u76EE\u4E0E\u5386\u53F2\u8C03\u67E5", "Case archive"], at: { x: 310, y: 380 }, approach: { x: 345, y: 409 } }, door("archive-lobby", "lobby", ["\u56DE\u4E2D\u592E\u63A5\u5F85\u533A", "To central reception"])] },
  partnerroom: { id: "partnerroom", title: ["Northline \xB7 \u5408\u4F19\u4EBA\u529E\u516C\u5BA4", "NORTHLINE \xB7 PARTNER OFFICE"], subtitle: ["\u59D4\u6258\u4E0E\u590D\u76D8", "MANDATE & REVIEW"], floor: 0, props: [
    placed("fund-furniture-0", 235, 280, 128, [{ x: 178, y: 241, w: 114, h: 32 }]),
    placed("fund-furniture-2", 480, 215, 136, [{ x: 418, y: 185, w: 124, h: 22 }]),
    placed("fund-furniture-3", 145, 440, 44, [{ x: 130, y: 417, w: 30, h: 16 }]),
    placed("office-furniture-3", 485, 455, 46, [{ x: 471, y: 430, w: 28, h: 18 }])
  ], entities: [npc("partner", 355, 335), door("partnerroom-lobby", "lobby", ["\u56DE\u4E2D\u592E\u63A5\u5F85\u533A", "To central reception"])] }
};
if (import.meta.env?.DEV && new URLSearchParams(location.search).get("artTrial") === "room") applyFreshRoomLayout(rooms.fund);
if (platformArtEnabled) {
  applyPlatformRoomLayout(rooms.fund);
  for (const id of ["office", "records", "client"]) applyPlatformOtherRoomLayout(rooms[id]);
  for (const room of Object.values(rooms)) addPlatformSeats(room);
}
var world = { width: 640, height: 640, step: 8, actor: { w: 14, h: 10 }, scenes: Object.fromEntries(Object.values(rooms).map((room) => [room.id, { interior: { x: 34, y: 128, w: 572, h: 448 }, spawn: { x: 310, y: 492 }, obstacles: [...room.props.flatMap((prop) => prop.obstacles), ...sideLeafBodies(room.id), ...room.entities.filter((entity) => entity.kind === "person" && entity.id !== "analyst").map((entity) => ({ x: entity.at.x - 12, y: entity.at.y - 10, w: 24, h: 14 }))] }])) };
var spawn = (id) => ({ ...world.scenes[id].spawn });
for (const room of Object.values(rooms)) for (const entity of room.entities.filter((entity2) => entity2.kind === "record")) {
  const { x, y } = entity.at;
  const candidates = [entity.approach, { x: x - 7, y: y + 56 }, { x: x + 48, y: y + 18 }, { x: x - 62, y: y + 18 }, { x: x + 42, y: y - 30 }, { x: x - 56, y: y - 30 }];
  entity.approach = candidates.find((point) => walkable(world, room.id, point) && findPath(world, room.id, world.scenes[room.id].spawn, point).length > 0) || entity.approach;
}

// src/game-id.ts
var GAME_UUID = "233b6970-d7f6-4d54-bc20-4213eefc6ba5";
if (typeof window !== "undefined") window.__GAME_UUID__ = "233b6970-d7f6-4d54-bc20-4213eefc6ba5";
function getGameUuid() {
  return GAME_UUID;
}
function getGameApiBase() {
  return "/" + getGameUuid();
}
var API_BASE = getGameApiBase();

// src/state.ts
var cartridge = { schemaVersion: 1, id: "before-the-close", locale: "en", coverImage: "./art/platform-v1/poster.png", copy: { title: "Before the Close", subtitle: "A Northline Capital case", promise: "", enter: "Begin", continue: "Continue", customAction: "", itemImagingTitle: "", itemImagingBody: "" }, theme: { outer: "#142b35", surface: "#233b42", paper: "#f2eddf", ink: "#243941", muted: "#687a7d", accent: "#b48b50", danger: "#9c5048", gold: "#b48b50", material: "apartment" }, audioTheme: { material: "apartment", bpm: 76, rootHz: 110, scale: [0, 3, 7], levels: { music: 0.15, ambient: 0, sfx: 0.2, master: 0.5 }, tension: [] }, statDefinitions: [{ id: "research", label: "Research", initial: 0, min: 0, max: 100 }, { id: "trust", label: "Trust", initial: 0, min: 0, max: 100 }, { id: "risk", label: "Risk", initial: 0, min: 0, max: 100 }], drawerLabels: { party: "People", map: "Map", inventory: "Evidence", log: "Log" }, opening: { location: "fund", time: "16:40", objective: "Review the committee brief", imagePrompt: "", blocks: [], choices: [] }, characters: [], initialMap: [], initialInventory: [], demoTurns: [] };
function systemLocale() {
  if (typeof navigator === "undefined") return "en";
  return (navigator.languages?.[0] || navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
}
function newJourney() {
  return { id: crypto.randomUUID(), created: Date.now(), title: "", scene: "study", visited: ["study"], position: spawn("study"), save: createInitialSave(cartridge), history: [], opened: false, prologueVersion: 1, projectId: "relayops", chapterVersion: 1, storyMinute: 1e3 };
}
function newStore() {
  const j = newJourney();
  return { version: 1, active: j.id, journeys: [j], locale: systemLocale(), localeMode: "system", muted: false };
}
function has2(j, id) {
  return Boolean(j.save.facts[id]);
}
function facts(j, effects, text) {
  const save = applyParsedScene(j.save, { blocks: [{ id: crypto.randomUUID(), kind: "narration", text }], commands: [], raw: text }, cartridge, text, void 0, void 0, void 0, { status: "accepted", ruleId: "authored-investigation", intent: "investigate", effects, reasons: [], successText: text, successChoices: [], continuation: "resume" });
  return { ...j, save };
}
function mark(j, id, text = "") {
  return facts(j, [{ type: "fact", id, value: true }], text || id);
}
function collect(j, id) {
  if (inPrologue(j) && (id !== "memo" || !j.save.facts["orientation-role"] || !j.save.facts["met-analyst"])) return j;
  if (!records.some((r) => r.id === id)) return j;
  const revision = roomRevision(j, id);
  let next = has2(j, id) ? j : mark(j, id, "\u53D6\u5F97\u8D44\u6599\uFF1A" + id);
  if (revision && !has2(next, revision.flag)) next = mark(next, revision.flag, revision.title[1]);
  return next;
}
function conclude(j, id, selected, correct) {
  const f = findings.find((f2) => f2.id === id);
  if (!f || !correct || !f.pair.every((p) => selected.includes(p) && has2(j, p)) || selected.length !== 2) return j;
  return mark(j, id, f.result[0]);
}
function canNegotiate(j) {
  return findings.every((f) => has2(j, f.id)) && has2(j, "reference") && has2(j, "client-confirmed") && has2(j, "met-founder");
}
function negotiate(j, term) {
  if (!canNegotiate(j) || has2(j, "decision")) return j;
  return facts(j, [{ type: "fact", id: "terms", value: term }], term === "tranche" ? "\u521B\u59CB\u4EBA\u63A5\u53D7\u9996\u671F\u4FDD\u969C\u4EA4\u4ED8\u3001\u540E\u7EED\u6309\u9A8C\u6536\u5206\u671F\u4E0E\u73B0\u91D1\u62AB\u9732" : "\u521B\u59CB\u4EBA\u63A5\u53D7\u8C03\u6574\u4EF7\u683C\uFF0C\u660E\u786E\u8D44\u91D1\u7528\u9014\u53CA\u73B0\u91D1\u62AB\u9732");
}
function decide(j, decision) {
  if (inPrologue(j) || decision !== "pause" && chapterEnabled(j) && !chapterReviewed(j) || has2(j, "decision") || !has2(j, "memo") || !has2(j, "met-partner") || decision === "conditional" && !j.save.facts.terms) return j;
  return { ...facts(j, [{ type: "fact", id: "decision", value: decision }, { type: "session", ended: true }], `\u6295\u59D4\u4F1A\u610F\u89C1\uFF1A${decision}`), chapterVersion: 1, decisionSnapshot: { findings: findings.filter((f) => has2(j, f.id)).map((f) => f.id), terms: j.save.facts.terms } };
}
function load() {
  const raw = alteruLocalStorage.getItem("before-the-close");
  if (!raw) return newStore();
  try {
    const s = JSON.parse(raw);
    if (s.version !== 1 || !Array.isArray(s.journeys) || !s.journeys.some((j) => j.id === s.active) || !s.journeys.every((j) => j && typeof j.id === "string" && ["lobby", "fund", "office", "records", "client", "delivery", "channel", "meeting", "study", "archive", "partnerroom"].includes(j.scene) && Number.isFinite(j.position?.x) && Number.isFinite(j.position?.y) && j.save?.facts && Array.isArray(j.history))) throw Error("version");
    const localeMode = s.localeMode === "manual" ? "manual" : "system";
    return { ...s, journeys: s.journeys.map((j) => walkable(world, j.scene, j.position) ? j : { ...j, position: spawn(j.scene) }), localeMode, locale: localeMode === "system" ? systemLocale() : s.locale };
  } catch {
    throw Error("SAVE_READ_FAILED");
  }
}
function persist(store) {
  alteruLocalStorage.setItem("before-the-close", JSON.stringify(store));
}
function activateJourney(s, id, at) {
  if (!s.journeys.some((x) => x.id === id)) return s;
  return { ...s, active: id, journeys: s.journeys.map((x) => x.id === s.active ? { ...x, position: { ...at } } : x) };
}
function appendJourney(s, j, at) {
  const saved = activateJourney(s, s.active, at);
  return { ...saved, active: j.id, journeys: [j, ...saved.journeys] };
}
function arriveAt(j, scene, at) {
  if (inPrologue(j) && !["study", "lobby", "fund", "archive", "partnerroom", "meeting"].includes(scene)) return j;
  const time = { lobby: 1e3, fund: 1e3, office: 1040, records: 1085, client: 1150, delivery: 1100, channel: 1120, meeting: 1e3, study: 1e3, archive: 1e3, partnerroom: 1e3 };
  return { ...j, scene, visited: [.../* @__PURE__ */ new Set([...j.visited || [], j.scene, scene])], position: { ...at }, storyMinute: Math.max(j.storyMinute ?? time[j.scene], time[scene]) };
}
function archiveJourney(j) {
  return canArchive(j) && !has2(j, "case-archived") ? mark(j, "case-archived") : j;
}

// src/conversation-flow.ts
function completedTopics(topics2, history, saved = []) {
  const done = new Set(saved);
  for (const exchange of history) {
    if (!exchange.question.trim() || !exchange.reply.trim()) continue;
    if (exchange.topicKey) {
      done.add(exchange.topicKey);
      continue;
    }
    const matches = topics2.filter((t2) => t2.aliases?.some((a) => a.question === exchange.question && a.reply === exchange.reply));
    if (matches.length === 1) done.add(matches[0].key);
  }
  return done;
}
function availableTopics(topics2, history, saved = []) {
  const done = completedTopics(topics2, history, saved);
  return topics2.filter((t2) => (t2.utility || !done.has(t2.key)) && (!t2.after || done.has(t2.after))).sort((a, b) => Number(Boolean(b.after)) - Number(Boolean(a.after)));
}

// src/conversation-topics.ts
function dialogueTopics(j, person) {
  const eligible = inPrologue(j) ? prologueTopics(j, person) : [...chapterTopics(j, person), ...topics[person].filter((t2) => !t2.requires || t2.requires.every((r) => j.save.facts[r]))];
  if (j.save.facts.decision && !chapterEnabled(j)) eligible.push({ id: "decision@" + j.save.facts.decision, label: ["\u5173\u4E8E\u521A\u624D\u7684\u6295\u59D4\u4F1A\u610F\u89C1\u2026\u2026", "About the recommendation\u2026"], reply: afterDecision(person, j) });
  return availableTopics(eligible.map((t2) => ({ ...t2, key: t2.id, aliases: [{ question: t2.label[0], reply: t2.reply[0] }, { question: t2.label[1], reply: t2.reply[1] }] })), j.history.filter((h) => h.person === person));
}

// src/location-rooms.json
var location_rooms_default = {
  northline: [
    "lobby",
    "study",
    "fund",
    "archive",
    "partnerroom",
    "meeting"
  ],
  relayops: [
    "office",
    "records",
    "delivery"
  ],
  customer: [
    "client"
  ],
  settlement: [
    "channel"
  ]
};

// src/locations.ts
var areas = { northline: { title: ["Northline \xB7 \u57FA\u91D1\u603B\u90E8", "Northline \xB7 Headquarters"], rooms: location_rooms_default.northline }, relayops: { title: ["RelayOps \xB7 \u516C\u53F8", "RelayOps \xB7 Company"], rooms: location_rooms_default.relayops }, customer: { title: ["Harbor & Pine \xB7 \u5BA2\u6237\u73B0\u573A", "Harbor & Pine \xB7 Customer site"], rooms: location_rooms_default.customer }, settlement: { title: ["BridgeStone \xB7 \u6E20\u9053\u529E\u516C\u5BA4", "BridgeStone \xB7 Settlement office"], rooms: location_rooms_default.settlement } };
var areaOf = (scene) => Object.keys(areas).find((id) => areas[id].rooms.includes(scene));

// src/map-route.ts
function routeBetween(from, to, edges2) {
  const queue = [[from]], seen = /* @__PURE__ */ new Set([from]);
  while (queue.length) {
    const path = queue.shift(), last = path[path.length - 1];
    if (last === to) return path;
    for (const e of edges2) if (e.from === last && !seen.has(e.to)) {
      seen.add(e.to);
      queue.push([...path, e.to]);
    }
  }
  return null;
}

// src/map-travel.ts
var edges = Object.values(rooms).flatMap((room) => room.entities.filter((e) => e.to).map((e) => ({ from: room.id, to: e.to })));
function mapTravelStatus(j, to) {
  if (to === j.scene) return "current";
  if (areaOf(to) !== "northline" && !(j.visited || []).includes(to)) return "unvisited";
  const route = routeBetween(j.scene, to, edges);
  if (!route) return "unreachable";
  if (!projectAccepted(j) && route.some((r, i) => r === "lobby" && route[i + 1] === "office")) return "assignment";
  return "ready";
}
function mapTravel(j, to) {
  if (mapTravelStatus(j, to) !== "ready") return j;
  return arriveAt(j, to, spawn(to));
}

// finance-authority-source.ts
var negotiationCopy = { "tranche": { question: ["\u9996\u671F\u4FDD\u969C\u5C65\u7EA6\uFF0C\u540E\u7EED\u6309\u9A8C\u6536\u4EA4\u5272", "Fund delivery first; stage the balance"], reply: ["\u300C\u9996\u671F 1,200 \u4E07\uFF0C\u5148\u8986\u76D6\u5DF2\u62AB\u9732\u4E49\u52A1\u548C\u5B9E\u65BD\u9884\u7B97\u3002\u5269\u4F59 1,800 \u4E07\u4EE5\u7EA6\u5B9A\u95E8\u5E97\u9A8C\u6536\u4E3A\u6761\u4EF6\uFF0C\u6BCF\u5468\u62A5\u73B0\u91D1\u3002\u6211\u63A5\u53D7\u3002\u82E5\u9A8C\u6536\u7EE7\u7EED\u62D6\u5EF6\uFF0C\u540E\u7EED\u8D44\u91D1\u4ECD\u53EF\u80FD\u4E0D\u5230\u4F4D\u3002\u300D", "\u201C\xA512m first, covering disclosed obligations and delivery. The remaining \xA518m follows agreed acceptance milestones, with weekly cash reporting. I accept. If acceptance slips, that balance may still not arrive.\u201D"] }, "reprice": { question: ["\u6309\u9A8C\u8BC1\u540E\u7684\u4E1A\u52A1\u91CD\u5B9A\u4EF7\u5E76\u660E\u786E\u7528\u9014", "Reprice proven business and ring-fence use"], reply: ["\u300C\u6295\u524D\u4F30\u503C\u8C03\u5230 1.2 \u4EBF\uFF0C3,000 \u4E07\u4E00\u6B21\u4EA4\u5272\uFF1B\u4F18\u5148\u4FDD\u969C\u507F\u4ED8\u548C\u5C65\u7EA6\u3001\u6BCF\u5468\u73B0\u91D1\u62AB\u9732\u3002\u6211\u63A5\u53D7\u7A00\u91CA\uFF0C\u4F46\u4EA4\u4ED8\u98CE\u9669\u4E0D\u4F1A\u56E0\u4E3A\u4EF7\u683C\u4E0B\u964D\u800C\u6D88\u5931\u3002\u300D", "\u201C\xA5120m pre-money, \xA530m at closing, obligations and delivery prioritized with weekly reporting. I accept the dilution. A lower price doesn\u2019t eliminate delivery risk.\u201D"] } };
export {
  GAME_UUID,
  activateJourney,
  afterDecision,
  appendJourney,
  archiveJourney,
  areaOf,
  arriveAt,
  canArchive,
  canNegotiate,
  cartridge,
  chapterComplete,
  chapterDocument,
  chapterEnabled,
  chapterObjective,
  chapterReviewed,
  chapterRoomNote,
  chapterStage,
  chapterTopics,
  collect,
  conclude,
  decide,
  dialogueTopics,
  encounter,
  facts,
  findPath,
  findings,
  has2 as has,
  headquartersRooms,
  inPrologue,
  load,
  localizeContext,
  mapTravel,
  mapTravelStatus,
  mark,
  negotiate,
  negotiationCopy,
  newJourney,
  newStore,
  people,
  persist,
  projectAccepted,
  projectStatus,
  projects,
  prologueObjective,
  prologueStep,
  prologueTopics,
  records,
  revisionDefinitions,
  roomRevision,
  rooms,
  spawn,
  starterBrief,
  systemLocale,
  topics,
  tx,
  walkable,
  welcome,
  world
};
