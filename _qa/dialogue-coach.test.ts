import {test} from 'node:test';import assert from 'node:assert/strict';
import {dialogueCoachState} from '../src/DialogueCoach';
test('introduction and scripted topics do not falsely complete AI onboarding',()=>{
 assert.equal(dialogueCoachState([{question:'Hello',reply:'Welcome'}],true,null),'invite');
 assert.equal(dialogueCoachState([{topicKey:'orientation-role',question:'My job?',reply:'Review'}],true,null),'invite');
});
test('authoritative free reply completes onboarding, survives reload, allows follow-up feedback',()=>{
 const history=[{topicKey:'free-talk',question:'Where?',reply:'The office.'}];
 assert.equal(dialogueCoachState(history,true,{q:'Where?',a:'The office.'}),'success');
 assert.equal(dialogueCoachState(history,true,null),'none');
 assert.equal(dialogueCoachState([],false,null),'none');
 assert.equal(dialogueCoachState([],true,{q:'Where?',a:''}),'invite');
});
