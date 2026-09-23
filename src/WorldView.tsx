import {Assets} from 'pixi.js';
import {useEffect,useRef,useState} from 'react';
import type {RpgPlayer} from '@rpgjs/server';
import {people,tx,type Locale} from './content';
import {rooms,world,type SceneId,type Entity} from './world';
import {findPath,walkable,type Point} from './spatial/world';
import {createRpgSpace,type Space} from './spatial/rpg-space';
import {baseGraphic,doorParts,frontGraphic,heroSheet,northGraphic,propGraphic,sideGraphic,spatialSheets} from './spatial/sheets';
import {footstep} from './audio';

export type WorldHandle={move:(x:number,y:number)=>void;go:(point:Point)=>void;approach:(entity:Entity)=>void;position:()=>Point};
type Resident={x:number;y:number;target:number;wait:number;travel:number;moving:boolean;facing:'down'|'left'|'right'|'up';event?:RpgPlayer};

export function WorldView({journeyId,scene,start,locale,paused,known,onNear,onPosition,handle}:{journeyId:string;scene:SceneId;start:Point;locale:Locale;paused:boolean;known:string[];onNear:(entity:Entity|null)=>void;onPosition:(point:Point)=>void;handle:{current:WorldHandle|null}}){
 const host=useRef<HTMLDivElement>(null),spaceRef=useRef<Space|null>(null),lastStep=useRef({...start});
 const latest=useRef({scene,paused,onNear,onPosition,locale,known});latest.current={scene,paused,onNear,onPosition,locale,known};
 const desired=useRef({journeyId,scene,start});desired.current={journeyId,scene,start};
 const [ready,setReady]=useState(false),[error,setError]=useState(false);
 const residents=useRef(Object.fromEntries(Object.values(rooms).map(room=>[room.id,Object.fromEntries(room.entities.filter(entity=>entity.person).map(entity=>[entity.id,{x:entity.at.x,y:entity.at.y,target:entity.at.x+22,wait:0,travel:0,moving:false,facing:'down'} as Resident]))])) as Record<SceneId,Record<string,Resident>>);

 useEffect(()=>{
  let stopped=false,nearest='',click:((event:MouseEvent)=>void)|undefined;
  const mount=host.current?.querySelector<HTMLElement>('#rpg');if(!mount)return;
  const personEvents=(roomId:SceneId)=>rooms[roomId].entities.filter(entity=>entity.person).map(entity=>({id:'person-'+entity.id,x:entity.at.x,y:entity.at.y,event:{onInit(this:RpgPlayer){this.setHitbox(1,1);this.through=true;this.animationFixed=true;this.setGraphic('npc-'+entity.person!);this.animationName.set('stand');residents.current[roomId][entity.id].event=this;this.syncChanges()}}}));
  const mapEvents=(id:string)=>{const roomId=id as SceneId,room=rooms[roomId];return[
   {id:baseGraphic(roomId),x:0,y:0,event:{onInit(this:RpgPlayer){this.setHitbox(1,1);this.through=true;this.animationFixed=true;this.setGraphic(baseGraphic(roomId));this.animationName.set('stand');this.syncChanges()}}},
   {id:northGraphic(roomId),x:0,y:0,event:{onInit(this:RpgPlayer){this.setHitbox(1,1);this.through=true;this.animationFixed=true;this.setGraphic(northGraphic(roomId));this.animationName.set('stand');this.syncChanges()}}},
   {id:sideGraphic(roomId),x:0,y:0,event:{onInit(this:RpgPlayer){this.setHitbox(1,1);this.through=true;this.animationFixed=true;this.setGraphic(sideGraphic(roomId));this.animationName.set('stand');this.syncChanges()}}},
   ...room.props.map(prop=>({id:propGraphic(prop),x:prop.x,y:prop.y,event:{onInit(this:RpgPlayer){this.setHitbox(1,1);this.through=true;this.animationFixed=true;this.setGraphic(propGraphic(prop));this.animationName.set('stand');this.syncChanges()}}})),
   ...personEvents(roomId),
   ...doorParts.filter(part=>part.scene===roomId).map(part=>({id:part.id,x:0,y:part.depth,event:{onInit(this:RpgPlayer){this.setHitbox(1,1);this.through=true;this.animationFixed=true;this.setGraphic(part.id);this.animationName.set('stand');this.syncChanges()}}})),
   {id:frontGraphic(roomId),x:0,y:640,event:{onInit(this:RpgPlayer){this.setHitbox(1,1);this.through=true;this.animationFixed=true;this.setGraphic(frontGraphic(roomId));this.animationName.set('stand');this.syncChanges()}}},
  ]};
  const dynamicWalkable=(point:Point,id:string)=>walkable(world,id,point)&&!Object.values(residents.current[id as SceneId]||{}).some(resident=>point.x<resident.x+12&&point.x+world.actor.w>resident.x-12&&point.y<resident.y+4&&point.y+world.actor.h>resident.y-10);
  const dynamicPath=(from:Point,to:Point,id:string)=>{const active={...world,scenes:{...world.scenes,[id]:{...world.scenes[id],obstacles:[...world.scenes[id].obstacles,...Object.values(residents.current[id as SceneId]||{}).map(resident=>({x:resident.x-12,y:resident.y-10,w:24,h:14}))]}}};return findPath(active,id,from,to)};
  const prepareScene=async(id:string)=>{
   const roomId=id as SceneId,room=rooms[roomId];
   const ids=new Set([heroSheet.id,baseGraphic(roomId),northGraphic(roomId),sideGraphic(roomId),frontGraphic(roomId),...room.props.map(propGraphic),...room.entities.filter(e=>e.person).map(e=>'npc-'+e.person),...doorParts.filter(p=>p.scene===roomId).map(p=>p.id)]);
   await Promise.all([heroSheet,...spatialSheets].filter(s=>ids.has(s.id)).map(s=>Assets.load(s.image)));
  };
  void Promise.resolve().then(async()=>{await prepareScene(scene);if(stopped)return;
  const runtimeHero=heroSheet;
  const runtimeSheets=spatialSheets;
  const space=createRpgSpace({world,host:mount,scene,position:start,speed:108,stride:52,sheet:runtimeHero,spritesheets:runtimeSheets,mapEvents,prepareScene,controlsBlocked:()=>latest.current.paused,walkable:dynamicWalkable,findPath:dynamicPath,
   onDestination:()=>{},onError:()=>{if(!stopped)setError(true)},
   onReady:runtime=>{if(stopped)return;spaceRef.current=runtime;runtime.pause(latest.current.paused);handle.current={move:(x,y)=>runtime.move(x,y),go:point=>runtime.walkTo(point),approach:entity=>runtime.walkTo(entity.approach),position:runtime.position};const target=desired.current;if(target.scene!==runtime.scene()){setReady(false);void runtime.restore(target.scene,target.start).then(()=>setReady(true)).catch(()=>setError(true))}else setReady(true)},
   onPosition:point=>{const distance=Math.hypot(point.x-lastStep.current.x,point.y-lastStep.current.y);if(distance>.01)footstep(distance);lastStep.current={...point};latest.current.onPosition(point)},
   onFrame:(dt,position,activeScene,isPaused)=>{if(stopped||activeScene!==latest.current.scene)return;const room=rooms[activeScene as SceneId],active=residents.current[activeScene as SceneId];
    for(const entity of room.entities.filter(item=>item.person)){const resident=active[entity.id],dx=position.x+7-resident.x,dy=position.y+5-resident.y;resident.moving=false;
     if(Math.hypot(dx,dy)<105||isPaused)resident.facing=Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';
     else if(entity.id==='analyst'){resident.wait-=dt;if(resident.wait<=0){const step=Math.sign(resident.target-resident.x)*Math.min(Math.abs(resident.target-resident.x),22*dt);resident.x+=step;resident.travel+=Math.abs(step);resident.moving=Math.abs(step)>.01;resident.facing=step<0?'left':'right';if(Math.abs(resident.target-resident.x)<.1){resident.wait=.7;resident.target=entity.at.x+(resident.target>entity.at.x?-22:22)}}}
     if(resident.event){
      const event=resident.event,pose=resident.moving?['stride-0','stride-1','stride-2','stride-1'][Math.floor(resident.travel/7)%4]:'stand';
      let changed=false;
      if(event.direction()!==resident.facing){event.direction.set(resident.facing as never);changed=true}
      if(event.animationName()!==pose){event.animationName.set(pose);changed=true}
      if(event.x()!==resident.x||event.y()!==resident.y){void event.teleport({x:resident.x,y:resident.y});changed=true}
      if(changed)event.syncChanges();
     }
    }
    let closest:Entity|null=null,best=65;
    for(const entity of room.entities){const resident=active[entity.id],point=resident?{x:resident.x,y:resident.y}:entity.at,dist=Math.hypot(position.x+7-point.x,position.y+5-point.y);if(dist<best){best=dist;closest=entity}const marker=space.project({x:point.x,y:point.y-(entity.kind==='person'?38:24)}),button=host.current?.querySelector<HTMLElement>(`[data-entity="${entity.id}"]`);if(button){const transform=`translate3d(${marker.x}px,${marker.y}px,0) translate(-50%,-50%)`;if(button.style.transform!==transform)button.style.transform=transform}}
    if(nearest!==(closest?.id||'')){nearest=closest?.id||'';latest.current.onNear(closest)}
   }
  });
  click=(event:MouseEvent)=>{if(latest.current.paused)return;const rect=host.current!.getBoundingClientRect();space.walkTo(space.toWorld({x:event.clientX-rect.left,y:event.clientY-rect.top}))};
  mount.addEventListener('click',click);
  }).catch(()=>{if(!stopped)setError(true)});
  return()=>{stopped=true;if(click)mount.removeEventListener('click',click);handle.current=null};
 },[]);

 useEffect(()=>{spaceRef.current?.pause(paused)},[paused]);
 useEffect(()=>{const space=spaceRef.current;if(!space)return;setReady(false);setError(false);lastStep.current={...start};void space.restore(scene,start).then(()=>setReady(true)).catch(()=>setError(true))},[journeyId,scene]);

 return <div ref={host} className="bc-world"><div id="rpg" aria-label={tx(rooms[scene].title,locale)}/>{!ready&&<div className="bc-world-loading">{error?<div><p>{tx(['场景未能载入','Scene unavailable'],locale)}</p><button onClick={()=>location.reload()}>{tx(['重新载入','Retry'],locale)}</button></div>:tx(['正在抵达…','Arriving…'],locale)}</div>}<div className="bc-access-targets">{rooms[scene].entities.map(entity=><button key={entity.id} data-entity={entity.id} data-person={Boolean(entity.person)} onClick={event=>{event.stopPropagation();handle.current?.approach(entity)}}>{entity.person?tx(known.includes(entity.person)?people[entity.person].name:people[entity.person].unknown,locale):tx(entity.label,locale)}</button>)}</div></div>;
}
