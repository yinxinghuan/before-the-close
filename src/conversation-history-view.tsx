import {useState} from 'react'
import type {ChatTurn} from './state'
export function ConversationHistoryView({rows,zh,current}:{rows:ChatTurn[];zh:boolean;current:{q:string;a:string}|null}){
 const [limit,setLimit]=useState(5)
 const archive=current&&rows.at(-1)?.question===current.q&&rows.at(-1)?.reply===current.a?rows.slice(0,-1):rows
 return <details><summary>{zh?'之前的交谈':'Earlier conversations'} · {archive.length}</summary>{archive.slice(-limit).map((h,i)=><div key={archive.length-limit+i}><small>{h.question}</small><p>{h.reply}</p></div>)}{archive.length>limit&&<button onClick={()=>setLimit(n=>n+5)}>{zh?'查看更多记录':'Show earlier conversations'}</button>}</details>
}
