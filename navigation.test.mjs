import {test} from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
test('visuals start automatically, resume on return, pause deliberately, and yield to launcher',async()=>{
 const saved=new Map([['musicthing-selected-effect','Synth Grid']]),localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
 const elements=new Map(),sent=[],handlers={},events={};let sensitivity=0,runSpeed=0,skyline=0;let chosenMode=-1;const classes=new Set();
 class Element{constructor(){this.children=[];this.hidden=false;this.dataset={};this.style={};this.classList={toggle:()=>false};this.scrollTop=0}append(...items){this.children.push(...items)}insertBefore(item){this.children.unshift(item)}setAttribute(){}querySelector(){return this}addEventListener(){}get firstChild(){return this.children[0]}}
 const document={hidden:false,body:new Element(),getElementById:id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createElement:()=>new Element(),addEventListener:(type,fn)=>events[type]=fn};
 const api={overrideKeys(){},send:m=>sent.push(m),on:(name,fn)=>handlers[name]=fn,triggerAction(){}};
 let source=await readFile(new URL('./client.mjs',import.meta.url),'utf8');source=source.replace(/^import[^\n]+\n/,'');
 document.body.classList={toggle:(name,on)=>{if(on)classes.add(name);else classes.delete(name);return on}};
 const parent={},window={parent,addEventListener:(name,fn)=>events[name]=fn};const visuals={setSkylineSensitivity:v=>skyline=v,cycleRunner:()=>null,tapRunner:()=>null,setRunnerSpeed:v=>runSpeed=v,setSensitivity:v=>sensitivity=v,setEnabled(){},setMode:i=>chosenMode=i,setFrame(){}};
 vm.runInNewContext(source,{createLyricOverlay(){},createDeskThing:()=>api,createVisuals:()=>visuals,localStorage,modes:['EQ Bars','Warp Tunnel','Synth Grid','Spectrum Waves','Beat Runner'],document,window,URL,Date,Map,setInterval(){},setTimeout(){},clearTimeout(){}});
 assert.equal(chosenMode,2,'MusicThing reopens the last chosen effect');
 const lastCapture=()=>sent.filter(m=>m.type==='visualizer').at(-1)?.payload.active;
 assert.equal(lastCapture(),true,'opening starts capture');assert.equal(sensitivity,1);elements.get('sensitivity').oninput({target:{value:'3.2'}});assert.equal(sensitivity,3.2);assert.equal(elements.get('sensitivityValue').textContent,'3.2×');
 assert.equal(elements.get('musicMenu').hidden,true,'extra controls start tucked away');elements.get('menuToggle').onclick();assert.equal(elements.get('musicMenu').hidden,false);elements.get('openAdjust').onclick();assert.equal(elements.get('effectPicker').hidden,true);assert.equal(elements.get('visualAdjust').hidden,false);elements.get('closeAdjust').onclick();assert.equal(elements.get('effectPicker').hidden,false);assert.equal(elements.get('visualAdjust').hidden,true);elements.get('closeMenu').onclick();assert.equal(elements.get('musicMenu').hidden,true);

 const playingRequest=sent.filter(m=>m.type==='music-request'&&m.payload.section==='playing').at(-1);
 handlers['music-result']({payload:{section:'playing',id:playingRequest.payload.id,data:{playing:true,device:'Mac',track:{id:'one',title:'Song',artist:'Artist'}}}});
 assert.equal(elements.get('togglePlayback').textContent,'Pause');elements.get('togglePlayback').onclick();assert.equal(sent.filter(m=>m.type==='music-request').at(-1).payload.value,'pause');assert.equal(lastCapture(),true,'playback controls do not stop the visualizer');
 const transport=sent.filter(m=>m.type==='music-request').at(-1);handlers['music-result']({payload:{section:'transport',id:transport.payload.id,data:{ok:true}}});

 elements.get('fullscreen').onclick();assert.ok(classes.has('visual-full'));const beforeTap=chosenMode;
 elements.get('scope').onclick();assert.ok(!classes.has('visual-full'),'tap restores controls');assert.equal(chosenMode,beforeTap,'reveal tap does not also change effect');
 elements.get('gpu').onclick();assert.notEqual(chosenMode,beforeTap,'normal tap can still change effect');const tabs=elements.get('tabs').children;assert.equal(tabs.length,5,'no unsupported video dead end');
 tabs[1].onclick();assert.equal(lastCapture(),false,'lyrics stops capture');tabs[0].onclick();assert.equal(lastCapture(),true,'returning resumes');
 elements.get('capture').onclick();assert.equal(lastCapture(),false);tabs[1].onclick();tabs[0].onclick();assert.equal(lastCapture(),false,'explicit pause is respected');elements.get('capture').onclick();assert.equal(lastCapture(),true);
 events.message({source:parent,data:{source:'deskthing',type:'overlay-priority',payload:{open:true}}});assert.equal(lastCapture(),false);events.message({source:parent,data:{source:'deskthing',type:'overlay-priority',payload:{open:false}}});assert.equal(lastCapture(),true);
 document.hidden=true;events.visibilitychange();assert.equal(lastCapture(),false);document.hidden=false;events.visibilitychange();assert.equal(lastCapture(),true);
 const touch=(x,y)=>({target:elements.get('scope'),touches:[{clientX:x,clientY:y}],changedTouches:[{clientX:x,clientY:y}],preventDefault(){},stopImmediatePropagation(){}});
 elements.get('modes').children[4].onclick();elements.get('openAdjust').onclick();assert.equal(elements.get('runnerAdjust').hidden,false);assert.equal(elements.get('generalAdjust').hidden,true);elements.get('runnerSpeed').oninput({target:{value:'1.5'}});elements.get('skylineSensitivity').oninput({target:{value:'0.3'}});assert.equal(skyline,.3);assert.equal(runSpeed,1.5);elements.get('closeMenu').onclick();const priorSensitivity=sensitivity;
 events.touchstart(touch(400,300));events.touchmove(touch(400,150));events.touchend(touch(400,150));assert.equal(runSpeed,2.5,'runner swipe raises running speed');assert.equal(sensitivity,priorSensitivity,'runner swipe preserves audio sensitivity');assert.equal(elements.get('gestureHudLabel').textContent,'Running speed');elements.get('modes').children[0].onclick();
 const originalMode=chosenMode;
 events.touchstart(touch(400,300));events.touchmove(touch(402,210));assert.equal(sensitivity,4,'upward drag raises sensitivity and clamps');events.touchend(touch(402,210));assert.equal(chosenMode,originalMode,'sensitivity drag does not change effect');
 events.touchstart(touch(400,200));events.touchmove(touch(400,380));assert.equal(sensitivity,2,'downward drag lowers sensitivity');events.touchend(touch(400,380));
 const beforeSwipe=chosenMode;
 events.touchstart(touch(400,200));events.touchend(touch(200,205));assert.equal(chosenMode,(beforeSwipe+1)%5,'left swipe changes effect');assert.equal(saved.get('musicthing-spotify-preview'),'visualizer');assert.equal(saved.get('musicthing-selected-effect'),['EQ Bars','Warp Tunnel','Synth Grid','Spectrum Waves','Beat Runner'][chosenMode]);assert.equal(elements.get('visualizer').hidden,false,'swipe stays on visuals');
 events.touchstart(touch(200,200));events.touchend(touch(400,205));assert.equal(chosenMode,beforeSwipe,'right swipe reverses effect');
 for(let i=0;i<5;i++){events.touchstart(touch(400,200));events.touchend(touch(200,205))}assert.equal(chosenMode,beforeSwipe,'all five effects wrap');
 tabs[1].onclick();events.touchstart(touch(200,200));events.touchend(touch(205,350));assert.equal(elements.get('lyrics').hidden,false,'vertical lyric scrolling stays on lyrics');
 events.touchstart(touch(200,200));events.touchend(touch(400,205));assert.equal(elements.get('lyrics').hidden,false,'horizontal swipe does not change More pages');tabs[0].onclick();
 events.wheel({deltaY:1,deltaX:0,preventDefault(){},stopImmediatePropagation(){}});
 elements.get('fullscreen').onclick();assert.ok(classes.has('visual-full'));handlers.client_status({request:'closed'});assert.equal(lastCapture(),false);handlers.client_status({request:'opened'});assert.equal(lastCapture(),true);assert.ok(!classes.has('visual-full'),'reopening always restores the normal view; fullscreen is opt-in');
});
