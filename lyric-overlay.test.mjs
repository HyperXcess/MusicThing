import {test} from 'node:test';import assert from 'node:assert/strict';import {createLyricOverlay} from './lyric-overlay.mjs';
test('optional overlay follows timed lines, clears on track changes, persists, and stops polling when hidden',()=>{
 const original={document:global.document,window:global.window,localStorage:global.localStorage,setInterval:global.setInterval};
 let tick,shown=true;const sent=[],handlers={},saved=new Map(),root={append(...children){this.children=children}};
 global.document={createElement:()=>({style:{},append(){},setAttribute(k,v){this[k]=v}})};global.window={addEventListener(){}};global.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};global.setInterval=fn=>tick=fn;
 try{const api={on:(t,f)=>handlers[t]=f,send:m=>sent.push(m)},overlay=createLyricOverlay({api,root,active:()=>shown});
 assert.equal(overlay.line.hidden,true);assert.equal(sent.length,0);overlay.button.onclick();assert.equal(saved.get('musicthing-lyric-overlay'),'true');
 const reply=(section,data,error)=>handlers['music-result']({payload:{section,id:sent.filter(m=>m.payload.section===section).at(-1).payload.id,data,error}});
 reply('playing',{track:{id:'one',duration:60000},progress:15000,playing:false});reply('lyrics',{trackId:'one',lines:[{at:0,text:'First line'},{at:10000,text:'Active line'},{at:30000,text:'Later line'}]});assert.equal(overlay.nextLine.textContent,'Later line');assert.equal(overlay.line.textContent,'Active line');assert.equal(overlay.line.hidden,false);
 shown=false;const count=sent.length;tick();assert.equal(sent.length,count);assert.equal(overlay.button.hidden,true);assert.equal(overlay.line.hidden,true);
 shown=true;tick();reply('playing',{track:{id:'two'},progress:0,playing:true});assert.notEqual(overlay.line.textContent,'Active line');reply('lyrics',{trackId:'two',lines:[]});assert.equal(overlay.line.textContent,'No timed lyrics for this track');
 overlay.button.onclick();assert.equal(overlay.line.hidden,true);assert.equal(saved.get('musicthing-lyric-overlay'),'false');
 }finally{Object.assign(global,original)}
});
