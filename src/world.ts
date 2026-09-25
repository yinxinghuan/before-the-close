import {platformArtEnabled} from './art-assets';
import {applyPlatformRoomLayout,applyPlatformOtherRoomLayout,addPlatformSeats} from './platform-room-layout';
import {applyFreshRoomLayout} from './fresh-room-layout';
import doorLayout from './door-layout.json';
import type {Pair,PersonId,RecordId} from './content';
import {findPath,walkable,type Point,type Rect,type World} from './spatial/world';

export type SceneId='fund'|'office'|'records'|'client'|'delivery'|'channel'|'meeting'|'study'|'archive'|'partnerroom';
export type Entity={id:string;kind:'person'|'record'|'door'|'committee'|'projects'|'archive';label:Pair;at:Point;approach:Point;person?:PersonId;record?:RecordId;to?:SceneId};
export type Prop={asset:string;x:number;y:number;width:number;obstacles:Rect[]};
export type Room={id:SceneId;title:Pair;subtitle:Pair;floor:number;floorAsset?:string;props:Prop[];entities:Entity[]};

const placed=(asset:string,x:number,y:number,width:number,obstacles:Rect[]):Prop=>({asset,x,y,width,obstacles});
const file=(id:RecordId,label:Pair,x:number,y:number):Entity=>({id,kind:'record',record:id,label,at:{x,y},approach:{x:x-7,y:y+24}});
const npc=(person:PersonId,x:number,y:number):Entity=>({id:person,kind:'person',person,label:['交谈','Talk'],at:{x,y},approach:{x:x-7,y:y+36}});
const door=(id:string,to:SceneId,label:Pair):Entity=>{const d=doorLayout[id as keyof typeof doorLayout];return {id,kind:'door',to,label,at:{x:d.x,y:d.y},approach:{x:d.side==='W'?38:d.side==='E'?574:d.x-7,y:d.side==='N'?92:d.side==='S'?566:d.y-5}}};

export const rooms:Record<SceneId,Room>={
 fund:{id:'fund',title:['Northline · 项目组办公区','NORTHLINE · DEAL TEAM'],subtitle:['周五 · 16:40','FRIDAY · 16:40'],floor:0,floorAsset:'floor-fund-v2',props:[
  placed('fund-furniture-0',165,282,190,[{x:82,y:216,w:166,h:54}]),
  placed('fund-furniture-2',430,220,172,[{x:354,y:177,w:152,h:35}]),
  placed('fund-furniture-1',465,492,200,[{x:378,y:404,w:174,h:70}]),
  placed('fund-furniture-3',165,500,80,[{x:136,y:457,w:58,h:36}]),
 ],entities:[file('memo',['投委会摘要','Committee brief'],165,270),npc('analyst',278,332),door('fund-study','study',['去自己的办公室','To your office']),door('fund-meeting','meeting',['去投委会会议室','To committee room']),door('fund-office','office',['外出拜访 RelayOps','Visit RelayOps'])]},
 office:{id:'office',title:['RelayOps · 开放办公区','RELAYOPS · WORKSPACE'],subtitle:['周五 · 17:20','FRIDAY · 17:20'],floor:1,floorAsset:'floor-office-v2',props:[
  placed('office-furniture-0',165,282,190,[{x:80,y:218,w:170,h:52}]),
  placed('office-furniture-1',470,252,190,[{x:386,y:194,w:168,h:48}]),
  placed('office-furniture-2',470,500,174,[{x:392,y:432,w:156,h:54}]),
  placed('office-furniture-3',165,500,66,[{x:142,y:454,w:46,h:38}]),
 ],entities:[file('contract',['客户合同','Customer contract'],170,270),file('forecast',['现金预测','Cash forecast'],470,235),npc('founder',355,350),door('office-delivery','delivery',['去交付作战室','To delivery room']),door('office-fund','fund',['返回 Northline 总部','Return to Northline']),door('office-records','records',['去资料会议室','To data room']),door('office-client','client',['去客户现场','To customer site'])]},
 records:{id:'records',title:['RelayOps · 资料会议室','RELAYOPS · DATA ROOM'],subtitle:['周五 · 18:05','FRIDAY · 18:05'],floor:3,floorAsset:'floor-records-v2',props:[
  placed('records-furniture-0',190,295,190,[{x:108,y:229,w:164,h:54}]),
  placed('records-furniture-1',485,220,166,[{x:412,y:177,w:146,h:34}]),
  placed('records-furniture-2',470,470,176,[{x:392,y:411,w:156,h:48}]),
  placed('records-furniture-3',150,515,100,[{x:114,y:455,w:72,h:48}]),
 ],entities:[file('payment',['银行回单','Bank receipt'],190,295),file('appendix',['补充协议','Supplement'],485,205),file('cash',['付款排期','Payment schedule'],470,465),file('channel',['渠道说明','Channel disclosure'],150,510),npc('finance',315,335),door('records-channel','channel',['去渠道结算办公室','To settlement office']),door('records-office','office',['回开放办公区','To workspace'])]},
 client:{id:'client',title:['Harbor & Pine · 运营现场','HARBOR & PINE · OPERATIONS'],subtitle:['周五 · 19:10','FRIDAY · 19:10'],floor:2,floorAsset:'floor-client-v2',props:[
  placed('client-furniture-0',165,285,184,[{x:84,y:222,w:162,h:52}]),
  placed('client-furniture-1',470,285,188,[{x:386,y:220,w:168,h:52}]),
  placed('client-furniture-3',165,515,72,[{x:140,y:463,w:50,h:40}]),
  placed('client-furniture-2',470,515,150,[{x:404,y:450,w:132,h:52}]),
 ],entities:[file('rollout',['上线清单','Deployment list'],165,275),file('acceptance',['验收意见','Acceptance note'],470,265),file('reference',['复购记录','Renewal record'],470,515),npc('client',315,335),door('client-office','office',['回 RelayOps','To RelayOps'])]},
 delivery:{id:'delivery',title:['RelayOps · 交付作战室','RELAYOPS · DELIVERY ROOM'],subtitle:['周五 · 18:20','FRIDAY · 18:20'],floor:1,props:[
 placed('delivery-console',300,310,168,[{x:223,y:274,w:154,h:29}]),placed('office-furniture-2',480,220,128,[{x:423,y:187,w:114,h:26}]),placed('client-furniture-3',140,440,36,[{x:127,y:423,w:26,h:17}]),placed('office-furniture-4',278,365,32,[{x:267,y:351,w:22,h:12}])
 ],entities:[file('delivery-log',['故障交接单','Delivery handover'],300,310),door('delivery-office','office',['回开放办公区','To workspace'])]},
 channel:{id:'channel',title:['BridgeStone · 渠道结算办公室','BRIDGESTONE · SETTLEMENT OFFICE'],subtitle:['周五 · 18:40','FRIDAY · 18:40'],floor:3,props:[
 placed('channel-ledger',250,280,150,[{x:182,y:248,w:136,h:26}]),placed('records-furniture-1',470,210,116,[{x:418,y:179,w:104,h:26}]),placed('records-furniture-3',470,430,55,[{x:450,y:411,w:40,h:18}]),placed('records-furniture-4',235,335,32,[{x:224,y:322,w:22,h:12}])
 ],entities:[file('settlement-review',['结算核对单','Settlement reconciliation'],250,280),door('channel-records','records',['回资料会议室','To data room'])]},
 meeting:{id:'meeting',title:['Northline · 投委会会议室','NORTHLINE · COMMITTEE ROOM'],subtitle:['周五 · 19:50','FRIDAY · 19:50'],floor:0,props:[
 placed('meeting-board',320,340,220,[{x:220,y:282,w:200,h:50}]),placed('fund-furniture-2',490,180,100,[{x:445,y:154,w:90,h:21}]),placed('fund-furniture-4',240,395,32,[{x:229,y:382,w:22,h:12}]),placed('fund-furniture-5',400,395,32,[{x:389,y:382,w:22,h:12}]),placed('office-furniture-3',125,200,44,[{x:110,y:182,w:30,h:18}])
 ],entities:[{id:'committee',kind:'committee',label:['提交投委会意见','Submit recommendation'],at:{x:440,y:340},approach:{x:455,y:353}},door('meeting-partnerroom','partnerroom',['去合伙人办公室','To partner office']),file('committee-draft',['上次讨论留痕','Prior discussion notes'],320,340),door('meeting-fund','fund',['回基金办公室','To fund office'])]},


 study:{id:'study',title:['Northline · 艾娃的办公室','NORTHLINE · YOUR OFFICE'],subtitle:['项目与来信','PROJECTS & CORRESPONDENCE'],floor:0,props:[
 placed('fund-furniture-0',210,280,128,[{x:153,y:241,w:114,h:32}]),placed('fund-furniture-4',210,335,32,[{x:199,y:319,w:22,h:12}]),placed('fund-furniture-2',470,210,136,[{x:408,y:182,w:124,h:22}]),placed('office-furniture-3',125,435,46,[{x:111,y:410,w:28,h:18}])
 ],entities:[{id:'project-desk',kind:'projects',label:['项目委托与来信','Project desk'],at:{x:210,y:275},approach:{x:240,y:314}},door('study-fund','fund',['去项目组办公区','To deal team']),door('study-archive','archive',['去基金资料室','To fund archive'])]},
 archive:{id:'archive',title:['Northline · 基金资料室','NORTHLINE · FUND ARCHIVE'],subtitle:['证据与已提交意见','EVIDENCE & RECOMMENDATIONS'],floor:3,props:[
 placed('records-furniture-1',160,220,136,[{x:99,y:183,w:122,h:30}]),placed('fund-furniture-2',470,220,136,[{x:408,y:190,w:124,h:22}]),placed('channel-ledger',310,390,150,[{x:242,y:358,w:136,h:26}]),placed('records-furniture-4',310,444,32,[{x:299,y:428,w:22,h:12}])
 ],entities:[{id:'archive-desk',kind:'archive',label:['当前项目与历史调查','Case archive'],at:{x:310,y:380},approach:{x:345,y:409}},door('archive-study','study',['回自己的办公室','To your office'])]},
 partnerroom:{id:'partnerroom',title:['Northline · 合伙人办公室','NORTHLINE · PARTNER OFFICE'],subtitle:['委托与复盘','MANDATE & REVIEW'],floor:0,props:[
 placed('fund-furniture-0',235,280,128,[{x:178,y:241,w:114,h:32}]),placed('fund-furniture-2',480,215,136,[{x:418,y:185,w:124,h:22}]),placed('fund-furniture-3',145,440,44,[{x:130,y:417,w:30,h:16}]),placed('office-furniture-3',485,455,46,[{x:471,y:430,w:28,h:18}])
 ],entities:[npc('partner',355,335),door('partnerroom-meeting','meeting',['回投委会会议室','To committee room'])]},

};

// Local candidate layout; production remains unchanged.
if(import.meta.env?.DEV&&new URLSearchParams(location.search).get('artTrial')==='room')applyFreshRoomLayout(rooms.fund);

if(platformArtEnabled){applyPlatformRoomLayout(rooms.fund);for(const id of ['office','records','client'] as const)applyPlatformOtherRoomLayout(rooms[id]);for(const room of Object.values(rooms))addPlatformSeats(room);}

const southWall=(room:Room):Rect[]=>{const doors=Object.values(doorLayout).filter(d=>d.room===room.id&&d.side==='S').sort((a,b)=>a.x-b.x);const spans:Rect[]=[];let x=34;for(const d of doors){spans.push({x,y:548,w:d.x-26-x,h:28});x=d.x+26}spans.push({x,y:548,w:606-x,h:28});return spans};
export const world:World={width:640,height:640,step:8,actor:{w:14,h:10},scenes:Object.fromEntries(Object.values(rooms).map(room=>[room.id,{interior:{x:34,y:88,w:572,h:488},spawn:{x:310,y:492},obstacles:[...room.props.flatMap(prop=>prop.obstacles),...southWall(room),...room.entities.filter(entity=>entity.kind==='person'&&entity.id!=='analyst').map(entity=>({x:entity.at.x-12,y:entity.at.y-10,w:24,h:14}))]}]))};
export const spawn=(id:SceneId):Point=>({...world.scenes[id].spawn});

for(const room of Object.values(rooms))for(const entity of room.entities.filter(entity=>entity.kind==='record')){
 const {x,y}=entity.at;
 const candidates=[entity.approach,{x:x-7,y:y+56},{x:x+48,y:y+18},{x:x-62,y:y+18},{x:x+42,y:y-30},{x:x-56,y:y-30}];
 entity.approach=candidates.find(point=>walkable(world,room.id,point)&&findPath(world,room.id,world.scenes[room.id].spawn,point).length>0)||entity.approach;
}
