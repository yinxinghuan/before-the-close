import {test} from 'node:test';
import assert from 'node:assert/strict';
import {aiErrorText} from '../src/AiUsage';
test('prologue refusals explain a story condition instead of a network failure',()=>{
 assert.match(aiErrorText('PROLOGUE_REQUIRED','zh'),/自由聊天不需要完成整个序章/);
 assert.match(aiErrorText('PROLOGUE_REQUIRED','en'),/Free conversation does not require completing the prologue/);
});
