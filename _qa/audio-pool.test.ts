import test from 'node:test';
import assert from 'node:assert/strict';

test('footsteps and interaction sounds reuse bounded audio elements, including failed music retries',async()=>{
 const instances:FakeAudio[]=[];const listeners:Function[]=[];
 let failMusic=true;
 class FakeAudio{
  muted=false;paused=true;ended=false;loop=false;volume=1;currentTime=0;
  constructor(public src:string){instances.push(this)}
  play(){this.paused=false;return this.src.includes('music')&&failMusic?Promise.reject(new Error('locked')):Promise.resolve()}
  pause(){this.paused=true}
 }
 const previousAudio=Object.getOwnPropertyDescriptor(globalThis,'Audio'),previousDocument=Object.getOwnPropertyDescriptor(globalThis,'document');
 Object.defineProperty(globalThis,'Audio',{configurable:true,value:FakeAudio});
 Object.defineProperty(globalThis,'document',{configurable:true,value:{hidden:false,addEventListener:(_:string,listener:Function)=>listeners.push(listener)}});
 try{
  const audio=await import('../src/audio');
  for(let i=0;i<20;i++){audio.startAudio();await Promise.resolve();await Promise.resolve()}
  failMusic=false;audio.startAudio();await Promise.resolve();
  for(let i=0;i<1000;i++){audio.footstep(25);if(i%10===0)audio.sound('paper');if(i%30===0)audio.sound('door')}
  assert.ok(instances.length<=7,`Allocated ${instances.length} audio elements`);
  assert.equal(instances.filter(a=>a.src.includes('music')).length,1);
  assert.equal(listeners.length,1);
  audio.setMuted(true);assert.ok(instances.every(a=>a.muted));assert.ok(instances.filter(a=>!a.loop).every(a=>a.paused));
 }finally{
  if(previousAudio)Object.defineProperty(globalThis,'Audio',previousAudio);else delete (globalThis as any).Audio;
  if(previousDocument)Object.defineProperty(globalThis,'document',previousDocument);else delete (globalThis as any).document;
 }
});
