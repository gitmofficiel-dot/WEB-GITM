import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/mcp-server.js',import.meta.url),'utf8');
const m=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {prepareUpdatePayload};').toString('base64'));
test('audited project patch accepts French and legacy image fields',()=>{const p=m.prepareUpdatePayload('projects',{titleFr:'Titre',descriptionFr:'Description',imageUrl:'',techStack:[],teamMembers:[]});assert.equal(p.titleFr,'Titre');assert.equal(p.descriptionFr,'Description');assert.equal(p.imageUrl,'');assert.deepEqual(p.techStack,[]);});
test('audited patch still rejects arbitrary keys',()=>{assert.throws(()=>m.prepareUpdatePayload('projects',{admin:true}),/Rejected/);assert.throws(()=>m.prepareUpdatePayload('projects',{techStack:'bad'}),/array/);});
test('unauthenticated admin project write remains denied',async()=>{const r=await m.handleMcp(new Request('https://test/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'update_project',arguments:{id:'test',data:{titleFr:'No'}}}})}),{MCP_ADMIN_KEY:'test'});assert.equal((await r.json()).error.message,'unauthorized');});
