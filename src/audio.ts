import {musicForScene} from './location-music';import type {SceneId} from './world';
type Effect='paper'|'door'|'step';
let muted=false,started=false,steps=0,scene:SceneId='study',context:AudioContext|undefined,master:GainNode|undefined;
let current:{source:AudioBufferSourceNode;gain:GainNode;url:string}|undefined,pending='',revision=0;
const buffers=new Map<string,AudioBuffer>();
const voices:Record<Effect,HTMLAudioElement[]>={paper:[],door:[],step:[]};
const next:Record<Effect,number>={paper:0,door:0,step:0};
const limits:Record<Effect,number>={paper:2,door:1,step:3};
const level=.18,fade=1.2;
async function changeMusic(){
 if(!context||!master||!started)return;
 const url=musicForScene(scene);if(url===pending)return;
 // Invalidate an in-flight visit when the player has already returned home.
 if(url===current?.url){if(pending){revision++;pending=''}return}
 const token=++revision;pending=url;
 try{
  let buffer=buffers.get(url);
  if(!buffer){const response=await fetch(url);if(!response.ok)throw Error('MUSIC_LOAD_FAILED');buffer=await context.decodeAudioData(await response.arrayBuffer());if(token!==revision)return;buffers.set(url,buffer);while(buffers.size>2)buffers.delete(buffers.keys().next().value!)}
  if(token!==revision)return;
  const source=context.createBufferSource(),gain=context.createGain(),now=context.currentTime;source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(master);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1,now+fade);source.start();
  if(current){const old=current;old.gain.gain.cancelScheduledValues(now);old.gain.gain.setValueAtTime(old.gain.gain.value,now);old.gain.gain.linearRampToValueAtTime(0,now+fade);old.source.stop(now+fade+.05);old.source.onended=()=>{old.source.disconnect();old.gain.disconnect()}}
  current={source,gain,url};
 }catch{/* Keep the current location music if a new track cannot load; retry on the next gesture. */}
 finally{if(token===revision)pending=''}
}
export function setMusicScene(value:SceneId){scene=value;void changeMusic()}
export function setMuted(value:boolean){muted=value;if(context&&master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(value?0:level,context.currentTime)}Object.values(voices).flat().forEach(a=>{a.muted=value;if(value)a.pause()})}
export function startAudio(){
 if(!context){
  const AudioCtor=window.AudioContext||(window as typeof window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!AudioCtor)return;
  context=new AudioCtor();master=context.createGain();master.gain.value=muted?0:level;master.connect(context.destination);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){void context?.suspend();Object.values(voices).flat().forEach(a=>a.pause())}else if(started)void context?.resume().catch(()=>{started=false})});
 }
 if(context.state!=='running'){void context.resume().then(()=>{started=true;void changeMusic()}).catch(()=>{started=false})}else{started=true;void changeMusic()}
}
export function sound(id:Effect|'discover'){
 if(muted||document.hidden)return;
 const key:Effect=id==='discover'?'paper':id,pool=voices[key];let a=pool.find(voice=>voice.paused||voice.ended);
 if(!a&&pool.length<limits[key]){a=new Audio(`./audio/${key}.mp3`);pool.push(a)}
 if(!a){a=pool[next[key]%pool.length];next[key]=(next[key]+1)%pool.length;a.pause()}
 a.muted=muted;a.volume=key==='step'?.55:.4;try{a.currentTime=0}catch{}
 void a.play().catch(()=>{});
}
export function footstep(distance:number){steps+=distance;if(steps>=25){steps%=25;sound('step')}}
