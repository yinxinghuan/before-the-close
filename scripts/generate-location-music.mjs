import fs from 'node:fs/promises';import {spawn} from 'node:child_process';
const plan=JSON.parse(await fs.readFile('doc/location-music-20260925/plan.json','utf8'));
const results=await Promise.allSettled(plan.map(async p=>{const out=`doc/location-music-20260925/raw/${p.id}.mp3`;try{await fs.access(out);return p.id+' already downloaded'}catch{}
return await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['/Users/yin/code/games/.agents/skills/alteru-media-service/scripts/generate-audio.mjs','--session-id',p.session_id,'--request-id',p.request_id,'--kind',p.kind,'--prompt',p.prompt,'--duration',String(p.duration_seconds),'--output',out]);let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);child.on('close',async code=>{await fs.writeFile(`doc/location-music-20260925/${p.id}-request.log`,log);code?reject(Error(p.id+': '+log)):resolve(p.id+': downloaded')})})}));
for(const r of results)console.log(r.status==='fulfilled'?r.value:r.reason.message);
if(results.some(r=>r.status==='rejected'))process.exitCode=1;
