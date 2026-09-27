import test from 'node:test';import assert from 'node:assert/strict';
import {newJourney,mark,collect,decide,arriveAt,type Journey} from '../src/state';
import {inPrologue,prologueStep,prologueTopics} from '../src/prologue';
import {projectAccepted} from '../src/headquarters';
import {dialogueTopics} from '../src/conversation-topics';
import {mapTravel} from '../src/map-travel';
const apply=(j:Journey,person:'partner'|'analyst',id:string)=>{const t=prologueTopics(j,person).find(x=>x.id===id);assert.ok(t,id);return (t.effects||[]).reduce((n,f)=>mark(n,f),j)};
test('new hire completes a small evidence exercise before any field visit',()=>{
 let j=newJourney();assert.equal(prologueStep(j),'welcome');
 assert.equal(collect(j,'memo'),j);assert.equal(arriveAt(j,'office',{x:300,y:300}),j);
 j=mark(j,'welcome-read');j=mark(j,'met-partner');j=apply(j,'partner','orientation-role');
 assert.equal(prologueStep(j),'colleague');j=mark(j,'met-analyst');assert.equal(prologueStep(j),'brief');
 j=collect(j,'memo');assert.equal(prologueStep(j),'check');
 const mistaken=apply(j,'analyst','orientation-assume');assert.equal(prologueStep(mistaken),'check');
 j=apply(mistaken,'analyst','orientation-check');assert.equal(prologueStep(j),'file');
 assert.equal(decide(j,'pause'),j);assert.equal(projectAccepted(j),false);
 j=mark(j,'orientation-file');j=apply(j,'partner','orientation-ready');assert.equal(inPrologue(j),false);assert.equal(projectAccepted(j),true);
 assert.equal(arriveAt(j,'office',{x:300,y:300}).scene,'office');
});
test('HQ free exploration and recorded map destinations cannot skip the prologue',()=>{
 const j={...mark(newJourney(),'project-accepted'),scene:'lobby' as const,visited:['lobby','office'] as Journey['visited']};
 assert.equal(mapTravel(j,'office'),j);assert.equal(arriveAt(j,'meeting',{x:300,y:300}).scene,'meeting');assert.equal(collect(j,'committee-draft'),j);
 assert.ok(dialogueTopics(j,'partner').every(t=>t.id.startsWith('orientation-')));
});
test('saved prologue resumes and older investigations remain exempt',()=>{
 const fresh=mark(newJourney(),'welcome-read');assert.equal(prologueStep(JSON.parse(JSON.stringify(fresh))),'role');
 const old=newJourney();delete old.prologueVersion;assert.equal(inPrologue(old),false);assert.ok(collect(old,'memo').save.facts.memo);
});
import {dialoguePages} from '../src/dialogue-pages';
test('dialogue pagination keeps closing quotes and avoids punctuation-only pages',()=>{
 for(const locale of ['zh','en'] as const){for(const step of ['role','check','ready']){let j=newJourney();for(const f of ['welcome-read',...(step!=='role'?['orientation-role','met-analyst','memo']:[]),...(step==='ready'?['orientation-check','orientation-file']:[])])j=mark(j,f);for(const t of prologueTopics(j,step==='check'?'analyst':'partner')){const text=t.reply[locale==='zh'?0:1];const pages=dialoguePages(text,locale);assert.equal(pages.join('').replace(/\s/g,''),text.replace(/\s/g,''));assert.ok(pages.every(p=>/[\p{L}\p{N}]/u.test(p)));}}}
});
