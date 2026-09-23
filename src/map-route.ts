/** Directed connections are supplied by the same doors used for travel. */
export function routeBetween<T extends string>(from:T,to:T,edges:ReadonlyArray<{from:T;to:T}>):T[]|null{
 const queue:T[][]=[[from]],seen=new Set<T>([from]);
 while(queue.length){const path=queue.shift()!,last=path[path.length-1];if(last===to)return path;
 for(const e of edges)if(e.from===last&&!seen.has(e.to)){seen.add(e.to);queue.push([...path,e.to])}}
 return null;
}
