import fs from 'node:fs/promises';
// Keep historical source art for rollback, but ship only the new runtime family.
const manifest=JSON.parse(await fs.readFile('public/art/platform-v1/manifest.json','utf8'));
for(const name of manifest.coverage)await fs.access(`dist/art/platform-v1/${name}.png`);
for(const entry of await fs.readdir('dist/art'))if(entry!=='platform-v1')await fs.rm('dist/art/'+entry,{recursive:true,force:true});
for(const entry of await fs.readdir('dist/map'))if(entry.endsWith('.png')&&entry!=='empty.png')await fs.rm('dist/map/'+entry);
await fs.copyFile('dist/art/platform-v1/poster.png','dist/poster.png');
console.log(`Prepared ${manifest.coverage.length} new runtime artwork files; retained historical source outside dist.`);
