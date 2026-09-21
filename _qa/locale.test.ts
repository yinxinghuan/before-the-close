import {test} from 'node:test';
import assert from 'node:assert/strict';
import {systemLocale} from '../src/state';

test('system locale selects Chinese only for a Chinese primary language',()=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'navigator');
 try{
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{languages:['zh-CN'],language:'zh-CN'}});assert.equal(systemLocale(),'zh');
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{languages:['en-US'],language:'en-US'}});assert.equal(systemLocale(),'en');
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{languages:['fr-FR'],language:'fr-FR'}});assert.equal(systemLocale(),'en');
 }finally{if(original)Object.defineProperty(globalThis,'navigator',original);else delete(globalThis as {navigator?:unknown}).navigator}
});
