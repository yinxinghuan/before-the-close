import {useEffect,useRef,useState,type PointerEvent} from 'react';
import {clampView,zoomView,type View} from './map-gesture';
export function useMapGesture(){
 const viewport=useRef<HTMLDivElement>(null),layer=useRef<HTMLDivElement>(null),value=useRef<View>({x:0,y:0,z:1}),frame=useRef(0),points=useRef(new Map<number,{x:number;y:number}>()),moved=useRef(false),[zoom,setZoom]=useState(1);
 const size=()=>({w:viewport.current?.clientWidth||1,h:viewport.current?.clientHeight||1});
 const change=(v:View)=>{const {w,h}=size();value.current=clampView(v,w,h);if(!frame.current)frame.current=requestAnimationFrame(()=>{frame.current=0;const v=value.current;if(layer.current)layer.current.style.transform=`translate3d(${v.x}px,${v.y}px,0) scale(${v.z})`})};
 const settle=()=>setZoom(value.current.z);
 const scale=(amount:number)=>{const {w,h}=size();change(zoomView(value.current,amount,{x:0,y:0},w,h));settle()};
 const reset=()=>{change({x:0,y:0,z:1});settle()};
 useEffect(()=>{const observer=new ResizeObserver(()=>change(value.current));if(viewport.current)observer.observe(viewport.current);return()=>{observer.disconnect();cancelAnimationFrame(frame.current);points.current.clear()}},[]);
 const handlers={onPointerDown:(e:PointerEvent<HTMLDivElement>)=>{if(e.button!==0)return;if(!points.current.size)moved.current=false;points.current.set(e.pointerId,{x:e.clientX,y:e.clientY});(e.target as Element).setPointerCapture(e.pointerId)},onPointerMove:(e:PointerEvent<HTMLDivElement>)=>{
 const old=points.current.get(e.pointerId);if(!old)return;const next={x:e.clientX,y:e.clientY},other=[...points.current].find(([id])=>id!==e.pointerId)?.[1];const dx=next.x-old.x,dy=next.y-old.y;if(!moved.current&&!other&&Math.hypot(dx,dy)<5)return;moved.current=true;
 if(other){const rect=viewport.current!.getBoundingClientRect(),{w,h}=size(),before=Math.hypot(old.x-other.x,old.y-other.y),after=Math.hypot(next.x-other.x,next.y-other.y);if(before>0){const focus={x:(old.x+other.x)/2-rect.left-w/2,y:(old.y+other.y)/2-rect.top-h/2};const v=zoomView(value.current,value.current.z*after/before,focus,w,h);change({...v,x:v.x+dx/2,y:v.y+dy/2})}}else change({...value.current,x:value.current.x+dx,y:value.current.y+dy});points.current.set(e.pointerId,next)
 },onPointerUp:(e:PointerEvent<HTMLDivElement>)=>{points.current.delete(e.pointerId);settle()},onPointerCancel:(e:PointerEvent<HTMLDivElement>)=>{points.current.delete(e.pointerId);moved.current=true;settle()},onLostPointerCapture:(e:PointerEvent<HTMLDivElement>)=>{points.current.delete(e.pointerId);settle()},onClickCapture:(e:React.MouseEvent<HTMLDivElement>)=>{if(moved.current&&e.detail!==0){e.preventDefault();e.stopPropagation()}}};
 return {viewport,layer,handlers,zoom,scale,reset,locate:(x:number,y:number)=>{const {w,h}=size();change({x:(.5-x)*w*1.7,y:(.5-y)*h*1.7,z:1.7});settle()}};
}
