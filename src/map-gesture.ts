export type View={x:number;y:number;z:number};
export function clampView(v:View,w:number,h:number):View{
 const z=Math.max(1,Math.min(3,v.z)),bx=w*(z-1)/2,by=h*(z-1)/2;
 return {z,x:Math.max(-bx,Math.min(bx,v.x)),y:Math.max(-by,Math.min(by,v.y))};
}
export function zoomView(v:View,z:number,focus:{x:number;y:number},w:number,h:number):View{
 const next=Math.max(1,Math.min(3,z)),r=next/v.z;
 return clampView({z:next,x:focus.x-(focus.x-v.x)*r,y:focus.y-(focus.y-v.y)*r},w,h);
}
