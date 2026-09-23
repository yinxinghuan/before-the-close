import type {Room} from './world';

export function applyFreshRoomLayout(room:Room){
 const chair=room.props.find(p=>p.asset==='fund-furniture-3')!;
 chair.width=66;chair.obstacles=[{x:148,y:470,w:31,h:23},{x:139,y:463,w:27,h:21}];
 const committee=room.props.find(p=>p.asset==='fund-furniture-1')!;
 committee.obstacles=[{x:372,y:400,w:186,h:45},{x:403,y:379,w:43,h:25},{x:481,y:379,w:43,h:25},{x:401,y:466,w:45,h:25},{x:481,y:466,w:45,h:25}];
}
