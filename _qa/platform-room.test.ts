import test from 'node:test';
import assert from 'node:assert/strict';
import {rooms,world} from '../src/world';
import {applyPlatformRoomLayout} from '../src/platform-room-layout';
import {findPath,walkable} from '../src/spatial/world';

test('platform artwork layout keeps functional approaches and doorway reachable',()=>{
 const room=structuredClone(rooms.fund);applyPlatformRoomLayout(room);
 const trial=structuredClone(world),count=rooms.fund.props.flatMap(p=>p.obstacles).length;
 trial.scenes.fund.obstacles=[...room.props.flatMap(p=>p.obstacles),...world.scenes.fund.obstacles.slice(count)];
 for(const entity of room.entities){assert.ok(walkable(trial,'fund',entity.approach),entity.id+' blocked');assert.ok(findPath(trial,'fund',trial.scenes.fund.spawn,entity.approach).length,entity.id+' unreachable')}
 assert.ok(walkable(trial,'fund',{x:143,y:462}),'chair transparent corner stays open');
 assert.equal(walkable(trial,'fund',{x:165,y:488}),false,'chair actual footprint blocks');
 assert.ok(walkable(trial,'fund',{x:574,y:340}),'doorway clear');
});

import {applyPlatformOtherRoomLayout} from '../src/platform-room-layout';
for(const id of ['office','records','client'] as const)test(`new ${id} furnishings keep each interaction and door reachable`,()=>{
 const room=structuredClone(rooms[id]);applyPlatformOtherRoomLayout(room);const trial=structuredClone(world),count=rooms[id].props.flatMap(p=>p.obstacles).length;
 trial.scenes[id].obstacles=[...room.props.flatMap(p=>p.obstacles),...world.scenes[id].obstacles.slice(count)];
 for(const entity of room.entities){assert.ok(walkable(trial,id,entity.approach),entity.id+' blocked');assert.ok(findPath(trial,id,trial.scenes[id].spawn,entity.approach).length,entity.id+' unreachable')}
});
