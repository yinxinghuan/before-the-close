import {Graphics,Sprite,type Container} from 'pixi.js';
type Point={x:number;y:number};
export type ForegroundRevealConfig={textureForScene:(id:string)=>string;size:{w:number;h:number};center:Point;radius:Point;opacity:number;active:(position:Point)=>boolean};

/** One cached stencil and translucent copy per foreground; no per-frame texture uploads. */
export function createForegroundReveal(config:ForegroundRevealConfig){
 let scene='',nextScan=0;
 let entries:{wall:Sprite;ghost:Sprite;mask:Graphics}[]=[];
 const clear=()=>{for(const {wall,ghost,mask} of entries){if(!wall.destroyed)wall.mask=null;if(!ghost.destroyed)ghost.destroy();if(!mask.destroyed)mask.destroy()}entries=[]};
 return (stage:Container|undefined,id:string,position:Point)=>{
  if(scene!==id){clear();scene=id;nextScan=0}
  if(stage&&!entries.length&&performance.now()>=nextScan){
   nextScan=performance.now()+500;
   const visit=(node:Container)=>{
    const wall=node as Sprite,label=wall.texture?.source?.label;
    if(typeof label==='string'&&label.includes(config.textureForScene(id))&&!node.label?.startsWith('local-reveal-')&&wall.parent){
     const ghost=new Sprite({texture:wall.texture});ghost.label='local-reveal-ghost';ghost.alpha=config.opacity;
     const mask=new Graphics().rect(-config.size.w*2,-config.size.h*2,config.size.w*4,config.size.h*4).fill(0xffffff).ellipse(0,0,config.radius.x,config.radius.y).cut();mask.label='local-reveal-mask';
     wall.parent.addChildAt(ghost,wall.parent.getChildIndex(wall));wall.parent.addChild(mask);ghost.visible=false;mask.visible=false;
     entries.push({wall,ghost,mask});return;
    }
    for(const child of [...(node.children??[])])visit(child);
   };visit(stage);
  }
  const near=config.active(position);
  entries=entries.filter(e=>!e.wall.destroyed);
  for(const {wall,ghost,mask} of entries){
   ghost.visible=near;mask.visible=near;
   if(!near){if(wall.mask)wall.mask=null;continue}
   ghost.position.copyFrom(wall.position);ghost.scale.copyFrom(wall.scale);ghost.anchor.copyFrom(wall.anchor);ghost.rotation=wall.rotation;
   mask.scale.copyFrom(wall.scale);
   mask.position.set(wall.x+(position.x+config.center.x-wall.anchor.x*config.size.w)*wall.scale.x,wall.y+(position.y+config.center.y-wall.anchor.y*config.size.h)*wall.scale.y);
   if(wall.mask!==mask)wall.setMask({mask,inverse:false});
  }
 };
}
