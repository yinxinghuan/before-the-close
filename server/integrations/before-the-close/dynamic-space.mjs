import {createSlotSpace} from '../../packages/spatial-slots/index.mjs';
// Trusted existing-art layout; shared by server and renderer. The common
// projector owns no game names, geometry, asset IDs or action consequences.
// Coordinates retain the source game's 640px map and 14x10 actor contract.
export const verificationDoor={at:{x:592,y:352},approach:{x:566,y:347}};
export const verificationSceneId='dyn-verification-1';
const layout={sceneId:verificationSceneId,parentId:'records',subtitle:['RelayOps · 补充核验','RELAYOPS · SUPPLEMENTAL REVIEW'],floor:3,floorAsset:'floor-records-v2',
 props:[
    {asset:'records-furniture-0',x:190,y:295,width:190,obstacles:[{x:108,y:229,w:164,h:54}]},
    {asset:'records-furniture-1',x:485,y:220,width:166,obstacles:[{x:412,y:177,w:146,h:34}]},
 ],
 interior:{x:34,y:128,w:572,h:448},spawn:{x:38,y:315},obstacles:[{x:34,y:284,w:48,h:4}],
 entrance:verificationDoor,exit:{at:{x:34,y:320},approach:{x:38,y:315}},
 slots:[{at:{x:190,y:295},approach:{x:183,y:319}},{at:{x:485,y:205},approach:{x:478,y:239}}],
 exitLabel:['返回资料会议室','Return to the data room'],enterPrefix:['进入','Enter '],
};
export const verificationLayout=()=>structuredClone(layout);
export const verificationSpace=createSlotSpace(layout);
