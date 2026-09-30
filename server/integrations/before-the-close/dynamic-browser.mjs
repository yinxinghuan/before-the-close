import {rooms,world} from './world';
import {verificationSpace,verificationSceneId} from './kit-dynamic-space.mjs';
import {areas} from './locations';
import {dynamicRoomEntryOpen} from './dynamic-atlas.mjs';
export function syncDynamicWorld(head){
  rooms.records.dynamicRoomBound=Boolean(head.binding);
  rooms.records.entities=rooms.records.entities.filter(e=>e.kind!=='dynamic');
  areas.relayops.rooms=areas.relayops.rooms.filter(id=>id!==verificationSceneId);
  if(!head.binding)return;
  const s=verificationSpace(head.catalog[0],head.dynamic.actions);
  if(s.room.id!==verificationSceneId)throw Error('UNREGISTERED_DYNAMIC_MAP');
  rooms[s.room.id]=s.room;world.scenes[s.room.id]=s.scene;if(dynamicRoomEntryOpen(head))rooms.records.entities.push(s.entrance);
  areas.relayops.rooms.push(s.room.id);
}
