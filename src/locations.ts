import locationRooms from './location-rooms.json';
import type {Pair} from './content';
import type {SceneId} from './world';
export const areas={northline:{title:['Northline · 基金总部','Northline · Headquarters'] as Pair,rooms:locationRooms.northline as SceneId[]},relayops:{title:['RelayOps · 公司','RelayOps · Company'] as Pair,rooms:locationRooms.relayops as SceneId[]},customer:{title:['Harbor & Pine · 客户现场','Harbor & Pine · Customer site'] as Pair,rooms:locationRooms.customer as SceneId[]},settlement:{title:['BridgeStone · 渠道办公室','BridgeStone · Settlement office'] as Pair,rooms:locationRooms.settlement as SceneId[]}};
export type AreaId=keyof typeof areas;
export const areaOf=(scene:SceneId)=>Object.keys(areas).find(id=>areas[id as AreaId].rooms.includes(scene)) as AreaId;
