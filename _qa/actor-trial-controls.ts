// Development-only fixture: exercises the game's real keyboard event handlers.
const panel=document.createElement('div');
panel.style.cssText='position:fixed;right:8px;top:142px;z-index:99999;display:flex;gap:4px;font:12px sans-serif';
let timer:ReturnType<typeof setInterval>|undefined;let active='';let phase=0;
const keys=['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'];
function release(){if(active)window.dispatchEvent(new KeyboardEvent('keyup',{key:active,code:active,bubbles:true}));active='';}
function stop(){clearInterval(timer);timer=undefined;release();}
function step(){release();active=keys[phase++%keys.length];window.dispatchEvent(new KeyboardEvent('keydown',{key:active,code:active,bubbles:true}));}
for(const [label,action] of [['QA: walk loop',()=>{stop();phase=0;step();timer=setInterval(step,500)}],['QA: stop',stop]] as const){const b=document.createElement('button');b.textContent=label;b.style.cssText='padding:8px;background:#eff5f5;color:#172329;border:1px solid #596c74';b.onclick=action;panel.append(b)}
document.body.append(panel);window.addEventListener('pagehide',stop);window.addEventListener('blur',stop);

export {};
