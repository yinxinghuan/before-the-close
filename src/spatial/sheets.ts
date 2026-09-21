import type {Direction} from '@rpgjs/common';
import {people,type PersonId} from '../content';
import {rooms,type Prop,type SceneId} from '../world';
import {RELEASE_ID} from '../game-id';

const directionRow=(direction:Direction)=>({down:0,left:1,right:2,up:3}[String(direction) as 'down'|'left'|'right'|'up']??0);
const asset=(path:string)=>`${path}?v=${RELEASE_ID}`;
const still=(frameX:number,frameY:number,anchor:[number,number],scale:number,x=0,y=0)=>({animations:()=>[[{frameX,frameY,time:0,anchor,scale:[scale,scale],x,y}]]});

export const heroSheet={
 id:'hero',image:asset('./art/hero.png'),width:768,height:1024,framesWidth:3,framesHeight:4,
 textures:Object.fromEntries([['stand',1],['stride-0',0],['stride-1',1],['stride-2',2]].map(([name,column])=>[name,{animations:({direction}:{direction:Direction})=>[[{frameX:column,frameY:directionRow(direction),time:0,anchor:[.5,.95],scale:[.3125,.3125],x:7,y:10}]]}]))
};

export function npcSheet(id:PersonId){
 const base=people[id].row*4;
 return {id:'npc-'+id,image:asset('./art/npcs.png'),width:384,height:2560,framesWidth:3,framesHeight:20,textures:Object.fromEntries([['stand',1],['stride-0',0],['stride-1',1],['stride-2',2]].map(([name,column])=>[name,{animations:({direction}:{direction:Direction})=>[[{frameX:column,frameY:base+directionRow(direction),time:0,anchor:[.5,.95],scale:[.625,.625],x:0,y:0}]]}]))};
}

const dimensions:Record<string,[number,number]>={
 'fund-furniture-0':[393,327],'fund-furniture-1':[410,324],'fund-furniture-2':[387,359],'fund-furniture-3':[237,276],
 'office-furniture-0':[371,341],'office-furniture-1':[441,301],'office-furniture-2':[409,372],'office-furniture-3':[140,287],
 'records-furniture-0':[332,278],'records-furniture-1':[367,393],'records-furniture-2':[392,346],'records-furniture-3':[259,353],
 'client-furniture-0':[377,383],'client-furniture-1':[415,352],'client-furniture-2':[331,390],'client-furniture-3':[187,318],
};
export const propGraphic=(prop:Prop)=>'prop-'+prop.asset;
export function propSheet(prop:Prop){const [width,height]=dimensions[prop.asset],scale=prop.width/width;return{id:propGraphic(prop),image:asset(`./art/${prop.asset}.png`),width,height,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[.5,1],scale)}}}
export const frontGraphic=(scene:SceneId)=>'front-'+scene;
export const baseGraphic=(scene:SceneId)=>'base-'+scene;
export const northGraphic=(scene:SceneId)=>'north-'+scene;
export const sideGraphic=(scene:SceneId)=>'side-'+scene;
export function baseSheet(scene:SceneId){return{id:baseGraphic(scene),image:asset(`./map/${scene}-base.png`),width:640,height:640,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[0,0],1)}}}
export function northSheet(scene:SceneId){return{id:northGraphic(scene),image:asset(`./map/${scene}-north.png`),width:640,height:640,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[0,0],1)}}}
export function sideSheet(scene:SceneId){return{id:sideGraphic(scene),image:asset(`./map/${scene}-side.png`),width:640,height:640,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[0,0],1)}}}
export function frontSheet(scene:SceneId){return{id:frontGraphic(scene),image:asset(`./map/${scene}-front.png`),width:640,height:640,framesWidth:1,framesHeight:1,textures:{stand:still(0,0,[0,1],1)}}}

export const spatialSheets=[...Object.values(rooms).flatMap(room=>room.props.map(propSheet)),...(Object.keys(people) as PersonId[]).map(npcSheet),...(Object.keys(rooms) as SceneId[]).flatMap(scene=>[baseSheet(scene),northSheet(scene),sideSheet(scene),frontSheet(scene)])];
