import type {Direction} from '@rpgjs/common';
import {people,type PersonId} from '../content';
import {rooms,type Prop,type SceneId} from '../world';

const directionRow=(direction:Direction)=>({down:0,left:1,right:2,up:3}[String(direction) as 'down'|'left'|'right'|'up']??0);
const still=(frameX:number,frameY:number,anchor:[number,number],scale:number,x=0,y=0)=>({animations:()=>[[{frameX,frameY,time:0,anchor,scale:[scale,scale],x,y}]]});

export const heroSheet={
 id:'hero',image:'./art/hero.png',width:768,height:1024,framesWidth:3,framesHeight:4,
 textures:Object.fromEntries([['stand',1],['stride-0',0],['stride-1',1],['stride-2',2]].map(([name,column])=>[name,{animations:({direction}:{direction:Direction})=>[[{frameX:column,frameY:directionRow(direction),time:0,anchor:[.5,.95],scale:[.3125,.3125],x:7,y:10}]]}]))
};

export function npcSheet(id:PersonId){
 const base=people[id].row*4;
 return {id:'npc-'+id,image:'./art/npcs.png',width:384,height:2560,framesWidth:3,framesHeight:20,textures:Object.fromEntries([['stand',1],['stride-0',0],['stride-1',1],['stride-2',2]].map(([name,column])=>[name,{animations:({direction}:{direction:Direction})=>[[{frameX:column,frameY:base+directionRow(direction),time:0,anchor:[.5,.95],scale:[.625,.625],x:0,y:0}]]}]))};
}

const dimensions:Record<string,[number,number]>={
 'fund-furniture-0':[373,330],'fund-furniture-1':[395,367],'fund-furniture-2':[389,319],'fund-furniture-3':[432,418],
 'office-furniture-0':[433,405],'office-furniture-1':[395,432],'office-furniture-2':[416,311],
 'records-furniture-0':[372,330],'records-furniture-1':[376,358],'records-furniture-2':[366,377],'records-furniture-3':[392,326],
 'client-furniture-0':[376,344],'client-furniture-1':[395,363],'client-furniture-2':[394,319],'client-furniture-3':[379,331],
};
export const propGraphic=(prop:Prop)=>'prop-'+prop.asset;
export function propSheet(prop:Prop){const [width,height]=dimensions[prop.asset],scale=prop.width/width;return{id:propGraphic(prop),image:`./art/${prop.asset}.png`,width,height,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[.5,1],scale)}}}
export const frontGraphic=(scene:SceneId)=>'front-'+scene;
export const baseGraphic=(scene:SceneId)=>'base-'+scene;
export function baseSheet(scene:SceneId){return{id:baseGraphic(scene),image:`./map/${scene}-base.png`,width:640,height:640,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[0,0],1)}}}
export function frontSheet(scene:SceneId){return{id:frontGraphic(scene),image:`./map/${scene}-front.png`,width:640,height:640,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[0,1],1)}}}

export const spatialSheets=[...Object.values(rooms).flatMap(room=>room.props.map(propSheet)),...(Object.keys(people) as PersonId[]).map(npcSheet),...(Object.keys(rooms) as SceneId[]).flatMap(scene=>[baseSheet(scene),frontSheet(scene)])];
