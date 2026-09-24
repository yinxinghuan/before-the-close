import {topics,afterDecision,type PersonId,type Topic} from './content'
import type {Journey} from './state'
import {availableTopics} from './conversation-flow'
export function dialogueTopics(j:Journey,person:PersonId){
 const eligible:Topic[]=topics[person].filter(t=>!t.requires||t.requires.every(r=>j.save.facts[r]))
 if(j.save.facts.decision)eligible.push({id:'decision@'+j.save.facts.decision,label:['关于刚才的投委会意见……','About the recommendation…'],reply:afterDecision(person,j)})
 return availableTopics(eligible.map(t=>({...t,key:t.id,aliases:[{question:t.label[0],reply:t.reply[0]},{question:t.label[1],reply:t.reply[1]}]})),j.history.filter(h=>h.person===person))
}
