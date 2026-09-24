import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(),run=path.join(root,'doc/chapter-expansion-20260925');
const api='https://game.aiwaves.tech/alteru-media/api';
const resume=process.argv.includes('--resume');
const ids=process.argv.slice(2).filter(x=>x!=='--resume');if(!ids.length)throw Error('Provide explicit planned asset ids');
const plan=JSON.parse(await fs.readFile(path.join(run,'plan.json'),'utf8'));
const health=await fetch(api+'/health').then(r=>r.json());if(health.version!=='0.5.0'||!health.gpt_image_configured)throw Error('GPT service not ready');
await fs.mkdir(path.join(run,'raw'),{recursive:true});await fs.mkdir(path.join(run,'requests'),{recursive:true});
for(const id of ids)if(!plan.assets.some(a=>a.id===id))throw Error('Unknown asset '+id);
// Shared service contract: four submissions/minute for this workload, no blind retries.
const prior=[];
for(const name of await fs.readdir(path.join(run,'requests'))){if(!name.endsWith('.json'))continue;const r=JSON.parse(await fs.readFile(path.join(run,'requests',name),'utf8'));if(r.attemptedAt)prior.push(Date.parse(r.attemptedAt));}
const recent=prior.filter(at=>Date.now()-at<61000).sort((a,b)=>a-b);
if(recent.length+ids.length>4){const wait=Math.max(0,61000-(Date.now()-recent[recent.length-1]));console.log('Respecting workload rate limit: '+Math.ceil(wait/1000)+'s');await new Promise(resolve=>setTimeout(resolve,wait));}
await Promise.all(ids.map(async id=>{
 const item=plan.assets.find(a=>a.id===id),recordFile=path.join(run,'requests',id+'.json');
 let record;try{record=JSON.parse(await fs.readFile(recordFile,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
 if(record?.response?.status==='succeeded'){
  const file=path.join(run,'raw',id+'.webp');
  try{await fs.access(file);console.log(id+': already downloaded');return}catch{}
  const response=await fetch(record.response.media.url);if(!response.ok)throw Error('Download HTTP '+response.status);
  const bytes=Buffer.from(await response.arrayBuffer());await fs.writeFile(file,bytes);record.file=path.relative(root,file);record.sha256=crypto.createHash('sha256').update(bytes).digest('hex');record.status='candidate';delete record.error;
  await fs.writeFile(recordFile,JSON.stringify(record,null,2));console.log(id+': recovered download without regeneration');return;
 }
 if(record?.attemptedAt&&!(resume&&record.status==='outcome-unknown')){console.log(id+': previously attempted; inspect task before any resubmission');return}
 const reference_urls=[];
 for(const parent of item.parents??[]){const p=JSON.parse(await fs.readFile(path.join(run,'requests',parent+'.json'),'utf8'));if(p.response?.status!=='succeeded')throw Error('Parent missing '+parent);reference_urls.push(p.response.media.url)}
 const body={request_id:record?.request?.request_id??crypto.randomUUID(),session_id:'233b6970-d7f6-4d54-bc20-4213eefc6ba5',model:item.model??'gpt-image-2.5-sunburst',mode:reference_urls.length?'edit':'text',reference_urls,prompt:item.prompt,size:item.size??{width:1024,height:1024},quality:'high',background:'opaque',n:1};
 record={id,request:body,parents:item.parents??[],attemptedAt:new Date().toISOString(),status:'submitted'};await fs.writeFile(recordFile,JSON.stringify(record,null,2));
 const start=Date.now();
 try{const response=await fetch(api+'/v1/images/generations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(270000)});record.httpStatus=response.status;const raw=await response.text();try{record.response=JSON.parse(raw)}catch{record.responseText=raw.slice(0,1000)}
 record.elapsedSeconds=(Date.now()-start)/1000;
 if(record.response?.status==='succeeded'){const result=await fetch(record.response.media.url);if(!result.ok)throw Error('Download HTTP '+result.status);const bytes=Buffer.from(await result.arrayBuffer());const file=path.join(run,'raw',id+'.webp');await fs.writeFile(file,bytes);record.file=path.relative(root,file);record.sha256=crypto.createHash('sha256').update(bytes).digest('hex');record.status='candidate'}else record.status='failed';
 }catch(e){record.error=e.message;record.status='outcome-unknown';record.elapsedSeconds=(Date.now()-start)/1000}
 await fs.writeFile(recordFile,JSON.stringify(record,null,2));console.log(JSON.stringify({id,status:record.status,seconds:record.elapsedSeconds,http:record.httpStatus,error:record.response?.error??record.error}));
}));
