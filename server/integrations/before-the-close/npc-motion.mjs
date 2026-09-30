// Server-owned counterpart of R15's analyst x +/-22 patrol, speed22, wait0.7.
// No client-provided NPC coordinates. Position authority is local/canary only.
export function advanceResident(anchor,now){
  const r=structuredClone(anchor);let dt=Math.max(0,(now-r.epoch)/1000);r.epoch=now;
  if(r.paused)return r;
  // One complete out-and-back traversal takes 5.4s. Preserve an initial partial
  // segment first, then discard whole cycles; never loop for hours of absence.
  for(let n=0;dt>0&&n<12;n++){
    if(r.wait>0){const spent=Math.min(dt,r.wait);r.wait-=spent;dt-=spent;if(!dt)break;}
    const duration=Math.abs(r.target-r.x)/22,spent=Math.min(duration,dt);
    r.x+=Math.sign(r.target-r.x)*22*spent;dt-=spent;
    if(spent===duration){r.x=r.target;r.target=r.origin+(r.target>r.origin?-22:22);r.wait=.7;if(dt>5.4)dt%=5.4;}
  }
  return r;
}
export const initialResident=(entity,now)=>({x:entity.at.x,y:entity.at.y,origin:entity.at.x,target:entity.at.x+22,wait:0,epoch:now,paused:false,focus:false});
