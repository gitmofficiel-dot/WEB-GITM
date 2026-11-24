import test from 'node:test';
import assert from 'node:assert/strict';
import {projectField,projectCategory,asList,memberList} from '../src/utils/projectPresentation.js';
test('project categories localize without changing unknown values',()=>{assert.equal(projectCategory('Robotics','ar'),'الروبوتات');assert.equal(projectCategory('Cloud','fr'),'Systèmes et infrastructure');assert.equal(projectCategory('custom','ar'),'custom');});
test('legacy lists normalize without crashing',()=>{assert.deepEqual(asList('React, Node'),['React','Node']);assert.deepEqual(asList(null),[]);assert.deepEqual(asList(['React']),['React']);assert.equal(memberList('Tariq, Fatima')[0].name,'Tariq');assert.deepEqual(memberList(null),[]);});
test('locale fields prefer persisted edits; reviewed copy is a fallback',()=>{assert.equal(projectField({id:'dZrGePCDDuoAcmZEEyXM',titleEn:'Edited title'},'title','en'),'Edited title');assert.match(projectField({id:'dZrGePCDDuoAcmZEEyXM'},'title','en'),/Heritage/);});
