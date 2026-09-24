import type {Room} from './world';
/** Layout follows generated silhouettes; world units stay independent of source pixels. */
export function applyPlatformRoomLayout(room:Room){
 const desk=room.props.find(p=>p.asset==='fund-furniture-0')!;
 desk.width=128;desk.obstacles=[{x:108,y:242,w:114,h:32}];
 const cabinet=room.props.find(p=>p.asset==='fund-furniture-2')!;
 cabinet.width=136;cabinet.obstacles=[{x:368,y:192,w:124,h:22}];
 const table=room.props.find(p=>p.asset==='fund-furniture-1')!;
 table.width=200;table.obstacles=[{x:371,y:431,w:188,h:54}];
 const chair=room.props.find(p=>p.asset==='fund-furniture-3')!;
 chair.width=44;chair.obstacles=[{x:151,y:480,w:26,h:14},{x:157,y:475,w:20,h:8}];
}

/** Physical sizes are actor-relative; source-image pixel dimensions do not set footprints. */
export function applyPlatformOtherRoomLayout(room:Room){
 const widths:Record<string,number[]>={office:[128,136,136,46],records:[144,136,128,60],client:[136,152,100,32]};
 const sizes=widths[room.id];if(!sizes)return;
 for(const prop of room.props){const index=Number(prop.asset.at(-1)),width=sizes[index];if(width===undefined)continue;prop.width=width;
  const narrow=(room.id==='office'&&index===3)||(room.id==='records'&&index===3)||(room.id==='client'&&index===3);
  const w=narrow?width*.62:width*.9,h=narrow?18:28;
  prop.obstacles=[{x:prop.x-w/2,y:prop.y-h-7,w,h}];
 }
}

export function addPlatformSeats(room:Room){
 const positions:Record<string,number[][]>={fund:[[395,530],[535,530]],office:[[140,336],[470,310]],records:[[150,341],[228,341]],client:[[235,300],[535,344]]};
 for(const [i,[x,y]] of (positions[room.id]??[]).entries()){
  const asset=room.id+'-furniture-'+(i+4);if(room.props.some(p=>p.asset===asset))continue;
  room.props.push({asset,x,y,width:32,obstacles:[{x:x-11,y:y-16,w:22,h:12}]});
 }
}
