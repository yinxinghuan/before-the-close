import type {Pair,PersonId,RecordId} from './content';
import {findPath,walkable,type Point,type Rect,type World} from './spatial/world';

export type SceneId='fund'|'office'|'records'|'client';
export type Entity={id:string;kind:'person'|'record'|'door'|'committee';label:Pair;at:Point;approach:Point;person?:PersonId;record?:RecordId;to?:SceneId};
export type Prop={asset:string;x:number;y:number;width:number;obstacles:Rect[]};
export type Room={id:SceneId;title:Pair;subtitle:Pair;floor:number;floorAsset?:string;props:Prop[];entities:Entity[]};

const placed=(asset:string,x:number,y:number,width:number,obstacles:Rect[]):Prop=>({asset,x,y,width,obstacles});
const file=(id:RecordId,label:Pair,x:number,y:number):Entity=>({id,kind:'record',record:id,label,at:{x,y},approach:{x:x-7,y:y+24}});
const npc=(person:PersonId,x:number,y:number):Entity=>({id:person,kind:'person',person,label:['交谈','Talk'],at:{x,y},approach:{x:x-7,y:y+36}});
const door=(id:string,to:SceneId,label:Pair,x:number,y:number):Entity=>({id,kind:'door',to,label,at:{x,y},approach:{x:x<60?38:x>580?574:x-7,y:y<100?92:y>570?566:y-5}});

export const rooms:Record<SceneId,Room>={
 fund:{id:'fund',title:['北线资本','NORTHLINE CAPITAL'],subtitle:['周五 · 16:40','FRIDAY · 16:40'],floor:0,floorAsset:'floor-fund-v2',props:[
  placed('fund-furniture-1',165,276,176,[{x:78,y:220,w:174,h:38},{x:79,y:202,w:37,h:55},{x:220,y:214,w:30,h:58},{x:117,y:250,w:76,h:26}]),
  placed('fund-furniture-3',468,159,164,[{x:386,y:126,w:132,h:33},{x:527,y:139,w:29,h:20}]),
  placed('fund-furniture-2',464,315,154,[{x:389,y:237,w:45,h:40},{x:498,y:236,w:43,h:41},{x:389,y:279,w:44,h:36},{x:499,y:279,w:42,h:36},{x:441,y:271,w:46,h:36}]),
  placed('fund-furniture-0',464,530,224,[{x:395,y:420,w:138,h:78},{x:366,y:380,w:48,h:49},{x:515,y:381,w:49,h:50},{x:352,y:430,w:46,h:63},{x:532,y:432,w:44,h:61},{x:377,y:479,w:52,h:51},{x:480,y:477,w:52,h:53}]),
 ],entities:[file('memo',['投委会摘要','Committee brief'],165,270),{id:'partner',kind:'person',person:'partner',label:['交谈','Talk'],at:{x:545,y:190},approach:{x:515,y:190}},npc('analyst',278,332),{id:'committee',kind:'committee',label:['投委会席位','Committee seat'],at:{x:464,y:488},approach:{x:457,y:542}},door('fund-office','office',['去 RelayOps','To RelayOps'],606,345)]},
 office:{id:'office',title:['RelayOps · 开放办公区','RELAYOPS · WORKSPACE'],subtitle:['周五 · 17:20','FRIDAY · 17:20'],floor:1,floorAsset:'floor-office-v2',props:[
  placed('office-furniture-0',170,270,184,[{x:82,y:187,w:167,h:40},{x:160,y:225,w:52,h:45},{x:218,y:211,w:44,h:49}]),
  placed('office-furniture-1',470,235,188,[{x:379,y:154,w:90,h:29},{x:456,y:185,w:108,h:50}]),
  placed('office-furniture-2',175,515,176,[{x:88,y:420,w:166,h:53},{x:153,y:457,w:51,h:43},{x:94,y:473,w:47,h:42},{x:218,y:465,w:42,h:45}]),
 ],entities:[file('contract',['客户合同','Customer contract'],170,270),file('forecast',['现金预测','Cash forecast'],470,235),npc('founder',355,350),door('office-fund','fund',['回北线资本','To Northline'],32,430),door('office-records','records',['去资料会议室','To data room'],606,320),door('office-client','client',['去客户现场','To customer site'],340,596)]},
 records:{id:'records',title:['RelayOps · 资料会议室','RELAYOPS · DATA ROOM'],subtitle:['周五 · 18:05','FRIDAY · 18:05'],floor:3,floorAsset:'floor-records-v2',props:[
  placed('records-furniture-0',190,295,204,[{x:127,y:202,w:126,h:71},{x:99,y:166,w:44,h:45},{x:237,y:166,w:44,h:45},{x:88,y:219,w:43,h:57},{x:252,y:220,w:42,h:56},{x:115,y:255,w:50,h:40},{x:214,y:253,w:50,h:42}]),
  placed('records-furniture-1',485,205,172,[{x:399,y:153,w:61,h:52},{x:443,y:153,w:133,h:52}]),
  placed('records-furniture-2',470,465,180,[{x:380,y:399,w:164,h:40},{x:379,y:416,w:42,h:47},{x:516,y:408,w:34,h:44},{x:463,y:431,w:75,h:34}]),
  placed('records-furniture-3',150,510,160,[{x:70,y:405,w:69,h:105},{x:159,y:427,w:72,h:83}]),
 ],entities:[file('payment',['银行回单','Bank receipt'],190,295),file('appendix',['补充协议','Supplement'],485,205),file('cash',['付款排期','Payment schedule'],470,465),file('channel',['渠道说明','Channel disclosure'],150,510),npc('finance',315,335),door('records-office','office',['回开放办公区','To workspace'],32,320)]},
 client:{id:'client',title:['Harbor & Pine · 运营现场','HARBOR & PINE · OPERATIONS'],subtitle:['周五 · 19:10','FRIDAY · 19:10'],floor:2,floorAsset:'floor-client-v2',props:[
  placed('client-furniture-0',165,275,182,[{x:75,y:224,w:180,h:51}]),
  placed('client-furniture-1',470,265,184,[{x:383,y:207,w:174,h:39},{x:384,y:190,w:36,h:54},{x:527,y:202,w:30,h:61},{x:422,y:239,w:77,h:26}]),
  placed('client-furniture-2',165,515,174,[{x:80,y:427,w:50,h:45},{x:201,y:427,w:49,h:45},{x:80,y:474,w:49,h:41},{x:201,y:474,w:49,h:41},{x:139,y:465,w:52,h:38}]),
  placed('client-furniture-3',470,515,172,[{x:384,y:397,w:77,h:118},{x:480,y:392,w:67,h:123}]),
 ],entities:[file('rollout',['上线清单','Deployment list'],165,275),file('acceptance',['验收意见','Acceptance note'],470,265),file('reference',['复购记录','Renewal record'],470,515),npc('client',315,335),door('client-office','office',['回 RelayOps','To RelayOps'],340,86)]},
};

export const world:World={width:640,height:640,step:8,actor:{w:14,h:10},scenes:Object.fromEntries(Object.values(rooms).map(room=>[room.id,{interior:{x:34,y:88,w:572,h:488},spawn:{x:310,y:492},obstacles:[...room.props.flatMap(prop=>prop.obstacles),...room.entities.filter(entity=>entity.kind==='person'&&entity.id!=='analyst').map(entity=>({x:entity.at.x-12,y:entity.at.y-10,w:24,h:14}))]}]))};
export const spawn=(id:SceneId):Point=>({...world.scenes[id].spawn});

for(const room of Object.values(rooms))for(const entity of room.entities.filter(entity=>entity.kind==='record')){
 const {x,y}=entity.at;
 const candidates=[entity.approach,{x:x-7,y:y+56},{x:x+48,y:y+18},{x:x-62,y:y+18},{x:x+42,y:y-30},{x:x-56,y:y-30}];
 entity.approach=candidates.find(point=>walkable(world,room.id,point)&&findPath(world,room.id,world.scenes[room.id].spawn,point).length>0)||entity.approach;
}
