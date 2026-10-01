import {inPrologue,prologueTopics} from './prologue'
import {chapterTopics,chapterEnabled} from './chapter'
import {topics,afterDecision,type PersonId,type Topic,type Pair} from './content'
import questions from './dialogue-questions.json'
import type {Journey} from './state'
import {availableTopics} from './conversation-flow'
export function dialogueTopics(j:Journey,person:PersonId){
 const eligible:Topic[]=inPrologue(j)?prologueTopics(j,person):[...chapterTopics(j,person),...topics[person].filter(t=>!t.requires||t.requires.every(r=>j.save.facts[r]))]
 if(j.save.facts.decision&&!chapterEnabled(j))eligible.push({id:'decision@'+j.save.facts.decision,label:['关于刚才的投委会意见……','About the recommendation…'],reply:afterDecision(person,j)})
 return availableTopics(eligible.map(t=>{
  const copy=(questions as Record<string,string[]>)[person+':'+t.id]
  const label:Pair=copy?[copy[0],copy[1]]:t.label
  // Keep exact old question/reply aliases so an older save cannot revive a topic.
  return {...t,label,key:t.id,aliases:[...t.label.map((question,i)=>({question,reply:t.reply[i]})),...label.map((question,i)=>({question,reply:t.reply[i]}))]}
 }),j.history.filter(h=>h.person===person))
}
