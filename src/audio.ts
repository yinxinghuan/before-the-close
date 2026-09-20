let muted=false,started=false;let music:HTMLAudioElement|undefined;let steps=0;const pool:HTMLAudioElement[]=[];
export function setMuted(value:boolean){muted=value;if(music)music.muted=value;pool.forEach(a=>{a.muted=value;if(value)a.pause()})}
export function startAudio(){if(started)return;started=true;music=new Audio('./audio/music.mp3');music.loop=true;music.volume=.18;music.muted=muted;void music.play().catch(()=>{started=false});document.addEventListener('visibilitychange',()=>{if(document.hidden){music?.pause();pool.forEach(a=>a.pause())}else if(started)void music?.play().catch(()=>{})})}
export function sound(id:'paper'|'door'|'step'|'discover'){if(muted||document.hidden)return;const a=new Audio(`./audio/${id==='discover'?'paper':id}.mp3`);a.volume=id==='step'?.55:.4;pool.push(a);if(pool.length>6)pool.shift()?.pause();void a.play().catch(()=>{})}
export function footstep(distance:number){steps+=distance;if(steps>=25){steps%=25;sound('step')}}
