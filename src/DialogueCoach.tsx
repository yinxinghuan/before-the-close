type Turn={topicKey?:string;question:string;reply:string};
export function dialogueCoachState(history:Turn[],prologue:boolean,current:{q:string;a:string}|null){
 const last=history.at(-1);
 if(last?.topicKey==='free-talk'&&current?.q===last.question&&current?.a===last.reply)return 'success';
 if(prologue&&!history.some(h=>h.topicKey==='free-talk'&&h.reply.trim()))return 'invite';
 return 'none';
}
export function DialogueCoach({state,locale,onTry}:{state:ReturnType<typeof dialogueCoachState>;locale:'zh'|'en';onTry:()=>void}){
 const zh=locale==='zh';
 if(state==='none')return null;
 return <aside className="bc-dialogue-coach" aria-label={zh?'自由对话体验':'Open conversation'}>
  {state==='invite'?<><strong>{zh?'不只选台词，也能自己问':'Go beyond the choices'}</strong><p>{zh?'试着问一句你真正想知道的。AI 会结合人物和当前进度回答。':'Ask something you want to know. AI replies in character, using your current progress.'}</p><button onClick={onTry}>{zh?'自由对话：试着问一句':'Try a question of your own'}</button><small>{zh?'也可先继续下方话题。聊天帮助理解，不会替你完成调查。':'Or continue with a topic below. Conversation helps you understand; it does not complete the investigation for you.'}</small></>:<p>{zh?'这是针对你问题的 AI 回答。可以继续追问，或回到原调查；新说法仍需证据核实。':'That was an AI response to your question. Follow up or return to the investigation; new claims still need evidence.'}</p>}
 </aside>;
}
