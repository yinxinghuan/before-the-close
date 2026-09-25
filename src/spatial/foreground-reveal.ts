import {Sprite,Texture,type Container} from 'pixi.js';
type Point={x:number;y:number};
export type ForegroundRevealConfig={textureForScene:(id:string)=>string;size:{w:number;h:number};center:Point;radius:number;opacity:number;active:(position:Point,id:string)=>boolean};

/** Cached alpha mask: soft circular cutaway, no per-frame texture regeneration. */
export function createForegroundReveal(config:ForegroundRevealConfig){
 const extent=2*Math.max(config.size.w,config.size.h),canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d')!,r=config.radius*512/extent;
 const gradient=ctx.createRadialGradient(256,256,0,256,256,r);
 gradient.addColorStop(0,`rgba(255,255,255,${config.opacity})`);gradient.addColorStop(.58,`rgba(255,255,255,${config.opacity})`);gradient.addColorStop(1,'white');
 ctx.fillStyle=gradient;ctx.fillRect(0,0,512,512);
 const texture=Texture.from(canvas);
 let scene='',nextScan=0,entries:{wall:Sprite;mask:Sprite}[]=[];
 const clear=()=>{for(const {wall,mask} of entries){if(!wall.destroyed)wall.mask=null;if(!mask.destroyed)mask.destroy()}entries=[]};
 return (stage:Container|undefined,id:string,position:Point)=>{
  if(scene!==id){clear();scene=id;nextScan=0}
  if(stage&&!entries.length&&performance.now()>=nextScan){
   nextScan=performance.now()+500;
   const visit=(node:Container)=>{const wall=node as Sprite,label=wall.texture?.source?.label;
    if(typeof label==='string'&&label.includes(config.textureForScene(id))&&wall.parent){
     const mask=new Sprite({texture});mask.label='local-reveal-mask';mask.anchor.set(.5);wall.parent.addChild(mask);entries.push({wall,mask});return;
    }
    for(const child of [...(node.children??[])])visit(child);
   };visit(stage);
  }
  const near=config.active(position,id);
  for(const {wall,mask} of entries){
   if(wall.destroyed)continue;
   if(!near){wall.mask=null;mask.visible=false;continue}
   mask.visible=true;mask.scale.set(extent/512*wall.scale.x,extent/512*wall.scale.y);
   mask.position.set(wall.x+(position.x+config.center.x-wall.anchor.x*config.size.w)*wall.scale.x,wall.y+(position.y+config.center.y-wall.anchor.y*config.size.h)*wall.scale.y);
   if(wall.mask!==mask)wall.setMask({mask,inverse:false});
  }
 };
}
