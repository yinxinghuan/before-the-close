import {rooms,spawn,type SceneId} from './world';
import {areaOf} from './locations';
import {routeBetween} from './map-route';
import {projectAccepted} from './headquarters';
import {arriveAt,type Journey} from './state';
const edges=Object.values(rooms).flatMap(room=>room.entities.filter(e=>e.to).map(e=>({from:room.id,to:e.to!})));
export function mapTravelStatus(j:Journey,to:SceneId):'current'|'unvisited'|'assignment'|'unreachable'|'ready'{
 if(to===j.scene)return 'current';
 if(areaOf(to)!=='northline'&&!(j.visited||[]).includes(to))return 'unvisited';
 const route=routeBetween(j.scene,to,edges);if(!route)return 'unreachable';
 if(!projectAccepted(j)&&route.some((r,i)=>r==='lobby'&&route[i+1]==='office'))return 'assignment';
 return 'ready';
}
export function mapTravel(j:Journey,to:SceneId):Journey{
 if(mapTravelStatus(j,to)!=='ready')return j;
 return arriveAt(j,to,spawn(to));
}
