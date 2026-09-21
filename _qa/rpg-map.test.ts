import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rooms,world} from '../src/world';
import {walkable} from '../src/spatial/world';

test('every RPGJS map keeps an object layer so player and event sprites render',()=>{
 for(const scene of Object.keys(rooms)){
  const tmx=readFileSync(new URL(`../public/map/${scene}.tmx`,import.meta.url),'utf8');
  assert.match(tmx,/<objectgroup\b[^>]*\bname="collision"[^>]*>/,scene);
 }
});

test('composite furniture keeps visible gaps walkable while solid footprints block',()=>{
 assert.equal(walkable(world,'fund',{x:453,y:390}),true,'gap between the upper meeting chairs');
 assert.equal(walkable(world,'fund',{x:430,y:440}),false,'meeting table footprint');
 assert.equal(walkable(world,'fund',{x:170,y:225}),false,'work desk footprint');
});
