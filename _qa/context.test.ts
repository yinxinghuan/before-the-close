import test from 'node:test';
import assert from 'node:assert/strict';
import {afterDecision,findings,people,records,topics} from '../src/content';

const legacy=/Far Shore|Qiyun|Yuanhe|Chen Yu|Lin Che|Xu Heng|Jiang Lan|Luo Shan|Zhou Ning|¥/;

test('English authored content stays in the New York investment context',()=>{
  const english:string[]=[];
  for(const record of records)english.push(record.title[1],record.source[1],record.summary[1],record.body[1]);
  for(const person of Object.values(people))english.push(person.name[1],person.unknown[1],person.role[1],person.intro[1]);
  for(const items of Object.values(topics))for(const item of items)english.push(item.label[1],item.reply[1]);
  for(const finding of findings)english.push(finding.title[1],finding.correct[1],finding.wrong[1],finding.result[1]);
  for(const id of Object.keys(people) as Array<keyof typeof people>){
    english.push(afterDecision(id,{save:{facts:{decision:'pause','analyst-corrected':true}}})[1]);
    english.push(afterDecision(id,{save:{facts:{decision:'conditional','analyst-corrected':true}}})[1]);
  }
  assert.doesNotMatch(english.join('\n'),legacy);
  assert.match(english.join('\n'),/Northline Capital/);
  assert.match(english.join('\n'),/RelayOps/);
  assert.match(english.join('\n'),/Harbor & Pine/);
});
