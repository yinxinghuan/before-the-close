import test from 'node:test';import assert from 'node:assert/strict';
import {sideLeafBodies,wallOverlapsActor,architecture} from '../src/spatial/architecture';
import {rooms,world} from '../src/world';import {walkable,findPath} from '../src/spatial/world';
import doors from '../src/door-layout.json';
test('open side leaf blocks its ground line; routes can go around tip and still reach every portal',()=>{
 for(const [scene,room] of Object.entries(rooms)){
  for(const leaf of sideLeafBodies(scene)){
   assert.equal(walkable(world,scene,{x:leaf.x+16,y:leaf.y}),false,scene+' leaf');
   assert.ok([18,34,50,66,82,98,114,130,146,162,178,194,210].some(offset=>walkable(world,scene,{x:leaf.x===34?leaf.x+leaf.w+offset:leaf.x-offset-14,y:leaf.y})),scene+' route past leaf and adjacent furniture');
  }
  for(const door of room.entities.filter(e=>e.to))assert.ok(findPath(world,scene,world.scenes[scene].spawn,door.approach).length,door.id);
 }
});
test('south reveal requires actual wall overlap; door gap and distant actor have no cutaway',()=>{
 assert.ok(architecture.southHeight/67.5>1.7);
 assert.equal(wallOverlapsActor({x:80,y:538},'lobby'),true);
 assert.equal(wallOverlapsActor({x:80,y:400},'lobby'),false);
 for(const d of Object.values(doors).filter(d=>d.side==='S'))assert.equal(wallOverlapsActor({x:d.x-7,y:550},d.room),false,d.room);
});
