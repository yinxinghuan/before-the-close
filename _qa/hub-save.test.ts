import test from 'node:test';
import assert from 'node:assert/strict';
import {load,newStore,collect} from '../src/state';
import {spawn,world} from '../src/world';
import {walkable} from '../src/spatial/world';

test('wall migration preserves case progress and room while recovering a blocked old position',()=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'alteruLocalStorage');
 const store=newStore(); const j=collect(store.journeys[0],'memo');
 j.position={x:320,y:70}; assert.equal(walkable(world,j.scene,j.position),false);
 store.journeys=[j];
 try{
  Object.defineProperty(globalThis,'alteruLocalStorage',{configurable:true,value:{getItem:()=>JSON.stringify(store)}});
  const restored=load(); assert.equal(restored.active,store.active);
  assert.equal(restored.journeys[0].scene,j.scene);
  assert.deepEqual(restored.journeys[0].save,JSON.parse(JSON.stringify(j.save)));
  assert.deepEqual(restored.journeys[0].position,spawn(j.scene));
  j.position=spawn(j.scene); assert.deepEqual(load().journeys[0].position,j.position);
 }finally{if(original)Object.defineProperty(globalThis,'alteruLocalStorage',original);else Reflect.deleteProperty(globalThis,'alteruLocalStorage')}
});
