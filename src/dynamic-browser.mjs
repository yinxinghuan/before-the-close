import {rooms,world} from './world';
import {areas} from './locations';
import {createSlotSpace} from './kit-spatial-slots.mjs';
import layouts from './series-layouts.json';
import {seriesEntries,seriesEntryOpen} from './series-presentation.mjs';
export function syncDynamicWorld(head){
 const entries=seriesEntries(head),ids=layouts.map(l=>l.sceneId);
 rooms.records.dynamicRoomCount=entries.length;
 rooms.records.entities=rooms.records.entities.filter(e=>e.kind!=='dynamic');
 areas.relayops.rooms=areas.relayops.rooms.filter(id=>!ids.includes(id));
 for(const [i,e]of entries.entries()){
  const s=createSlotSpace(layouts[i])(head.catalog[i],e.actions);
  rooms[s.room.id]=s.room;world.scenes[s.room.id]=s.scene;
  if(seriesEntryOpen(head,e))rooms.records.entities.push(s.entrance);
  areas.relayops.rooms.push(s.room.id);
 }
}
