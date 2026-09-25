import type {Pair} from './content';
import type {SceneId} from './world';
export const areas={northline:{title:['Northline · 基金总部','Northline · Headquarters'] as Pair,rooms:['study','fund','archive','partnerroom','meeting'] as SceneId[]},relayops:{title:['RelayOps · 公司','RelayOps · Company'] as Pair,rooms:['office','records','delivery'] as SceneId[]},customer:{title:['Harbor & Pine · 客户现场','Harbor & Pine · Customer site'] as Pair,rooms:['client'] as SceneId[]},settlement:{title:['BridgeStone · 渠道办公室','BridgeStone · Settlement office'] as Pair,rooms:['channel'] as SceneId[]}};
export type AreaId=keyof typeof areas;
export const areaOf=(scene:SceneId)=>Object.keys(areas).find(id=>areas[id as AreaId].rooms.includes(scene)) as AreaId;
