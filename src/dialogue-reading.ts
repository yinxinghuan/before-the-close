import type {ChatTurn} from './state'
import type {Locale,PersonId} from './content'
import {dialoguePages} from './dialogue-pages'

export type ReadingCursor={exchangeId:string;page:number;locale:Locale}
export type Readings=Record<string,ReadingCursor>
const storageKey='before-the-close-dialogue-reading-v1'
export const readingKey=(journey:string,person:PersonId)=>journey+':'+person
export function loadReadings():Readings{
 try{const raw=JSON.parse(alteruLocalStorage.getItem(storageKey)||'{}');if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
  return Object.fromEntries(Object.entries(raw).filter(([,v]:any)=>v&&typeof v.exchangeId==='string'&&Number.isInteger(v.page)&&v.page>=0&&['zh','en'].includes(v.locale))) as Readings
 }catch{return {}}
}
export function saveReadings(value:Readings){alteruLocalStorage.setItem(storageKey,JSON.stringify(value))}
export function resumeReading(history:ChatTurn[],person:PersonId,cursor:ReadingCursor|undefined,locale:Locale){
 const turn=cursor&&history.find(h=>h.id===cursor.exchangeId&&h.person===person&&h.reply.trim());if(!turn)return null
 // A locale switch changes page boundaries: restart this same reply, not its effects.
 const page=cursor.locale===locale?Math.min(cursor.page,Math.max(0,dialoguePages(turn.reply,locale).length-1)):0
 return {reply:{q:turn.question,a:turn.reply},page}
}
