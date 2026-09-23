import test from 'node:test';
import assert from 'node:assert/strict';
import {rooms,world} from '../src/world';
import {applyFreshRoomLayout} from '../src/fresh-room-layout';
import {findPath,walkable} from '../src/spatial/world';

test('fresh room keeps all interaction approaches reachable with new furniture footprints',()=>{
 const room=structuredClone(rooms.fund);applyFreshRoomLayout(room);
 const staticCount=rooms.fund.props.flatMap(p=>p.obstacles).length;
 const trial=structuredClone(world);
 trial.scenes.fund.obstacles=[...room.props.flatMap(p=>p.obstacles),...world.scenes.fund.obstacles.slice(staticCount)];
 for(const entity of room.entities){
  assert.ok(walkable(trial,'fund',entity.approach),entity.id+' approach blocked');
  assert.ok(findPath(trial,'fund',trial.scenes.fund.spawn,entity.approach).length,entity.id+' unreachable');
 }
 assert.ok(walkable(trial,'fund',{x:452,y:471}),'gap between near chairs remains open');
 assert.equal(walkable(trial,'fund',{x:408,y:472}),false,'near chair footprint blocks movement');
 assert.ok(walkable(trial,'fund',{x:574,y:340}),'door approach remains clear');
});
