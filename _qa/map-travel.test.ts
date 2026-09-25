import test from 'node:test';import assert from 'node:assert/strict';
import {newJourney,arriveAt,mark} from '../src/state';import {spawn} from '../src/world';
import {mapTravel,mapTravelStatus} from '../src/map-travel';import {clampView,zoomView} from '../src/map-gesture';
test('headquarters shortcuts preserve case progress, visited state and monotonic clock',()=>{
 const j=mark(newJourney(),'memo');const n=mapTravel(j,'meeting');assert.equal(n.scene,'meeting');assert.equal(n.save,j.save);assert.equal(n.history,j.history);assert.deepEqual(n.position,spawn('meeting'));assert.ok(n.visited?.includes('study'));assert.ok(n.visited?.includes('meeting'));assert.ok(n.storyMinute!>=j.storyMinute!);
});
test('external shortcuts require arrival; legacy saves and new journeys cannot invent visits',()=>{
 let j=newJourney();assert.equal(mapTravelStatus(j,'records'),'unvisited');assert.equal(mapTravel(j,'records'),j);
 j=arriveAt(mark(j,'project-accepted'),'records',spawn('records'));j=mapTravel(j,'study');assert.equal(mapTravelStatus(j,'records'),'ready');assert.equal(mapTravel(j,'records').scene,'records');assert.equal(mapTravelStatus(newJourney(),'records'),'unvisited');
 const legacy={...j,visited:undefined};assert.equal(mapTravelStatus(legacy,'records'),'unvisited');
});
test('shortcut cannot bypass assignment gate even if destination was recorded',()=>{const j={...newJourney(),visited:['office' as const]};assert.equal(mapTravelStatus(j,'office'),'assignment');assert.equal(mapTravel(j,'office'),j)});
test('zoom keeps the point under the finger fixed and bounds panning at every scale',()=>{
 const a={x:0,y:0,z:1},focus={x:40,y:-30},b=zoomView(a,2,focus,300,280);assert.equal((focus.x-b.x)/b.z,focus.x);assert.equal((focus.y-b.y)/b.z,focus.y);
 assert.deepEqual(clampView({x:999,y:-999,z:2},300,280),{x:150,y:-140,z:2});assert.deepEqual(clampView({x:80,y:90,z:1},300,280),{x:0,y:0,z:1});
});

import {MapGesture} from '../src/map-gesture';
test('continuous drag uses latest position, pinch stays stable on two-to-one, cancel clears contacts',()=>{
 const m=new MapGesture({w:300,h:280});m.set({x:0,y:0,z:2});m.down(1,{x:0,y:0});for(let x=1;x<=60;x++)m.move(1,{x,y:0});assert.equal(m.view.x,60);assert.equal(m.moved,true);
 m.cancel();assert.equal(m.points.size,0);m.move(1,{x:90,y:0});assert.equal(m.view.x,60);
 m.set({x:0,y:0,z:1});m.down(1,{x:-50,y:0});m.down(2,{x:50,y:0});m.move(2,{x:100,y:0});assert.equal(m.view.z,1.5);assert.equal(m.moved,true);m.up(2);const old=m.view.x;m.move(1,{x:-40,y:0});assert.equal(m.view.x,old+10);m.up(1);
 m.down(3,{x:0,y:0});m.move(3,{x:2,y:1});assert.equal(m.moved,false);
});
test('fixed large atlas fit and resize cannot leave content outside its pan limits',()=>{const m=new MapGesture({w:300,h:200,contentW:1000,contentH:800});m.set({x:999,y:-999,z:.1});assert.deepEqual(m.view,{x:0,y:0,z:.25});m.zoom(2);m.set({...m.view,x:800});m.size={w:600,h:500,contentW:1000,contentH:800};m.set(m.view);assert.equal(m.view.x,700)});
