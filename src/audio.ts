type Effect='paper'|'door'|'step';
let muted=false,started=false,music:HTMLAudioElement|undefined,steps=0;
const voices:Record<Effect,HTMLAudioElement[]>={paper:[],door:[],step:[]};
const next:Record<Effect,number>={paper:0,door:0,step:0};
const limits:Record<Effect,number>={paper:2,door:1,step:3};

export function setMuted(value:boolean){
 muted=value;if(music)music.muted=value;
 Object.values(voices).flat().forEach(a=>{a.muted=value;if(value)a.pause()});
}
export function startAudio(){
 if(started)return;
 if(!music){
  music=new Audio('./audio/music.mp3');music.loop=true;music.volume=.18;
  // Install once, including when autoplay initially fails and is retried.
  document.addEventListener('visibilitychange',()=>{
   if(document.hidden){music?.pause();Object.values(voices).flat().forEach(a=>a.pause())}
   else if(started)void music?.play().catch(()=>{started=false});
  });
 }
 started=true;music.muted=muted;void music.play().catch(()=>{started=false});
}
export function sound(id:Effect|'discover'){
 if(muted||document.hidden)return;
 const key:Effect=id==='discover'?'paper':id,pool=voices[key];
 let a=pool.find(voice=>voice.paused||voice.ended);
 if(!a&&pool.length<limits[key]){a=new Audio(`./audio/${key}.mp3`);pool.push(a)}
 if(!a){a=pool[next[key]%pool.length];next[key]=(next[key]+1)%pool.length;a.pause()}
 a.muted=muted;a.volume=key==='step'?.55:.4;
 try{a.currentTime=0}catch{/* Some WebViews cannot seek until metadata is ready. */}
 void a.play().catch(()=>{});
}
export function footstep(distance:number){steps+=distance;if(steps>=25){steps%=25;sound('step')}}
