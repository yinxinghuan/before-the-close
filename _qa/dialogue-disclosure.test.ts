import test from 'node:test';import assert from 'node:assert/strict';
import {newJourney} from '../src/state';import {dialogueTopics} from '../src/conversation-topics';import {topics} from '../src/content';
import {resumeReading,readingKey} from '../src/dialogue-reading';import {dialoguePages} from '../src/dialogue-pages';
import questions from '../src/dialogue-questions.json';
test('initial questions probe unknown information rather than assume it',()=>{
 const j=newJourney();delete j.prologueVersion;
 for(const [key,label] of Object.entries(questions)){const [person,id]=key.split(':');const q=dialogueTopics(j,person as any).find(t=>t.id===id)!;assert.deepEqual(q.label,label)}
 assert.ok(!dialogueTopics(j,'analyst').some(q=>q.id==='payer-test'));
 const old=topics.analyst.find(q=>q.id==='payer')!;j.history.push({person:'analyst',question:old.label[0],reply:old.reply[0]});
 assert.ok(!dialogueTopics(j,'analyst').some(q=>q.id==='payer'));assert.ok(dialogueTopics(j,'analyst').some(q=>q.id==='payer-test'));
 assert.ok(!dialogueTopics(j,'client').some(q=>q.id==='refund'));j.save.facts.appendix=true;assert.ok(dialogueTopics(j,'client').some(q=>q.id==='refund'));
});
test('unfinished reply resumes from authoritative history without replaying an action',()=>{
 const reply='This is the first part.\nThis is the new information that supports a follow-up.';
 const history=[{id:'exchange-1',person:'analyst' as const,question:'What first?',reply,topicKey:'payer'}],cursor={exchangeId:'exchange-1',page:1,locale:'en' as const};
 const original=JSON.stringify(history);assert.deepEqual(resumeReading(history,'analyst',JSON.parse(JSON.stringify(cursor)),'en'),{reply:{q:'What first?',a:reply},page:1});
 assert.equal(resumeReading(history,'partner',cursor,'en'),null);assert.equal(resumeReading(history,'analyst',undefined,'en'),null);
 assert.equal(resumeReading(history,'analyst',cursor,'zh')?.page,0);assert.equal(resumeReading(history,'analyst',{...cursor,page:999},'en')?.page,dialoguePages(reply,'en').length-1);
 assert.equal(JSON.stringify(history),original);assert.notEqual(readingKey('one','analyst'),readingKey('two','analyst'));
});
