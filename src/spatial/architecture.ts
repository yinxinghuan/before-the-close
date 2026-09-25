import doorLayout from '../door-layout.json';
import type {Point,Rect} from './world';
// Independent dimensions: height never follows cap thickness.
export const architecture={northHeight:80,southHeight:80,southAboveFloor:70,sideThickness:10,capHeight:10,southFoot:576};
/** Open side leaves are solid along their ground contact, not across their image. */
export function sideLeafBodies(scene:string):Rect[]{return Object.values(doorLayout).filter(d=>d.room===scene&&(d.side==='W'||d.side==='E')).map(d=>({x:d.side==='W'?34:558,y:d.y-36,w:48,h:4}))}
export function wallOverlapsActor(p:Point,scene:string){
 const foot={x:p.x+7,y:p.y+10},top=architecture.southFoot-architecture.southAboveFloor;
 if(foot.y<top-8||foot.y>architecture.southFoot+8)return false;
 const doors=Object.values(doorLayout).filter(d=>d.room===scene&&d.side==='S');
 return !doors.some(d=>foot.x-12>=d.x-26&&foot.x+12<=d.x+26);
}
