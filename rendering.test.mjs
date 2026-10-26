import {test} from 'node:test';import assert from 'node:assert/strict';import {createVisuals} from './visuals.mjs';
test('EQ bar heights and terrain vertices change with audio; silence stays flat',()=>{let draw;globalThis.requestAnimationFrame=fn=>draw=fn;let rects=[],points=[];const ctx={fillRect:(...v)=>rects.push(v),moveTo:(...v)=>points.push(v),lineTo:(...v)=>points.push(v),beginPath(){},stroke(){},arc(){},save(){},restore(){},translate(){},rotate(){}};const canvas={width:760,height:300,getContext:()=>ctx},gpu={getContext:()=>null};const visuals=createVisuals(canvas,gpu);visuals.setEnabled(true);draw(100);const quiet=rects.slice();rects=[];visuals.setFrame({bands:Array(32).fill(.9)});draw(200);assert.ok(Math.max(...rects.map(v=>v[3]))>150,'loud audio produces tall EQ bars');assert.ok(quiet.filter(v=>v[3]===3).length>=32);visuals.setMode(2);points=[];visuals.setFrame({bands:Array(32).fill(0)});for(let i=0;i<50;i++)draw(300+i*50);const flat=points.slice(-768);points=[];visuals.setFrame({bands:Array(32).fill(1)});for(let i=0;i<30;i++)draw(3000+i*50);const loud=points.slice(-768);assert.notDeepEqual(flat,loud,'grid geometry responds to incoming bands');visuals.stop();});
test('feedback shader receives the changing live spectrum and energy',()=>{let draw;globalThis.requestAnimationFrame=fn=>draw=fn;let energy=0,bands;const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:(_,name)=>name,getAttribLocation:()=>0,uniform1f:(name,v)=>{if(name==='energy')energy=v},uniform1fv:(_,v)=>bands=v},{get:(o,k)=>o[k]||(()=>({}))});const ctx={fillRect(){}};const v=createVisuals({width:760,height:300,getContext:()=>ctx},{width:760,height:300,getContext:()=>gl});assert.equal(v.hasShaders,true);v.setMode(1);v.setEnabled(true);v.setFrame({bands:Array(32).fill(.8)});draw(100);assert.ok(energy>.6);assert.ok(bands.every(v=>v>.6));v.setFrame({bands:Array(32).fill(0)});for(let i=0;i<40;i++)draw(200+i*50);assert.ok(energy<.01);v.stop();});

test('Spectrum Waves draws three overlapping colored curves, responds to audio, and settles flat in silence',()=>{
 let draw;globalThis.requestAnimationFrame=fn=>draw=fn;let paths=[],points=[];
 const ctx={fillRect(){},beginPath(){points=[]},moveTo:(x,y)=>points.push([x,y]),lineTo:(x,y)=>points.push([x,y]),stroke(){paths.push({color:this.strokeStyle,points})}};
 const v=createVisuals({width:760,height:300,getContext:()=>ctx},{getContext:()=>null});v.setMode(3);v.setEnabled(true);draw(100);
 assert.equal(paths.length,3);assert.ok(paths.every(p=>p.points.every(([,y])=>y===150)),'silence is flat');
 paths=[];v.setFrame({bands:Array.from({length:32},(_,i)=>i%3===0?.9:.4)});draw(200);
 assert.deepEqual(paths.map(p=>p.color),['#27ead5','#b782ff','#ff2397']);assert.ok(paths.every(p=>p.points.some(([,y])=>Math.abs(y-150)>20)),'all curves react');assert.notDeepEqual(paths[0].points,paths[1].points);
 v.setFrame({bands:Array(32).fill(0)});for(let i=0;i<50;i++){paths=[];draw(300+i*50)}assert.ok(paths.every(p=>p.points.every(([,y])=>Math.abs(y-150)<.01)),'curves settle after audio ends');v.stop();
});

test('sensitivity increases response for quiet audio without amplifying silence',()=>{
 let draw;globalThis.requestAnimationFrame=fn=>draw=fn;let heights=[];const ctx={fillRect:(x,y,w,h)=>{if(w<30)heights.push(h)}};
 function measure(gain,bands){heights=[];const v=createVisuals({width:760,height:300,getContext:()=>ctx},{getContext:()=>null});v.setSensitivity(gain);v.setEnabled(true);v.setFrame({bands:Array(32).fill(bands)});draw(100);v.stop();return Math.max(...heights)}
 assert.ok(measure(4,.08)>measure(.5,.08)*3);assert.equal(measure(4,0),3);
});

test('Synth Grid sensitivity keeps its floor anchored and scales peak height',()=>{
 let draw;globalThis.requestAnimationFrame=fn=>draw=fn;let paths=[],points=[];
 const ctx={fillRect(){},beginPath(){points=[]},moveTo:(...p)=>points.push(p),lineTo:(...p)=>points.push(p),stroke(){paths.push({color:this.strokeStyle,points})},arc(){}};
 const v=createVisuals({width:760,height:300,getContext:()=>ctx},{getContext:()=>null});v.setMode(2);v.setEnabled(true);v.setFrame({bands:Array.from({length:32},(_,i)=>i===16?.9:.05)});
 v.setSensitivity(.5);for(let i=0;i<35;i++){paths=[];draw(100+i*50)}const low=paths;
 v.setSensitivity(4);paths=[];draw(2000);const high=paths;
 assert.deepEqual(low.filter(p=>p.color==='#44265f'),high.filter(p=>p.color==='#44265f'),'floor is unchanged');
 const lowTerrain=low.filter(p=>p.color!=='#44265f').flatMap(p=>p.points),highTerrain=high.filter(p=>p.color!=='#44265f').flatMap(p=>p.points);
 assert.deepEqual(lowTerrain.map(p=>p[0]),highTerrain.map(p=>p[0]),'horizontal perspective stays fixed');assert.ok(Math.min(...highTerrain.map(p=>p[1]))<Math.min(...lowTerrain.map(p=>p[1]))-30,'sensitivity raises peaks');v.stop();
});

test('canvas visibility overrides Spotify display rules immediately when switching effects',()=>{
 globalThis.requestAnimationFrame=()=>{};const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:()=>0,getAttribLocation:()=>0},{get:(o,k)=>o[k]||(()=>({}))});
 const canvas={width:760,height:300,style:{},getContext:()=>({fillRect(){}})},gpu={style:{},getContext:()=>gl};const v=createVisuals(canvas,gpu);
 v.setMode(1);assert.equal(canvas.style.display,'none');assert.equal(gpu.style.display,'block');
 for(const mode of [0,2,3]){v.setMode(mode);assert.equal(canvas.style.display,'block');assert.equal(gpu.style.display,'none','hidden GPU cannot cover 2D effects even before next frame')}v.stop();
});

test('Spectrum Waves colors bounce independently for bass, midrange and treble',()=>{
 function amplitudes(bandIndex){let draw,paths=[],points=[];globalThis.requestAnimationFrame=fn=>draw=fn;const ctx={fillRect(){},beginPath(){points=[]},moveTo:(x,y)=>points.push(y),lineTo:(x,y)=>points.push(y),stroke(){paths.push(points)}};const v=createVisuals({width:760,height:300,getContext:()=>ctx},{getContext:()=>null});v.setMode(3);v.setEnabled(true);v.setFrame({bands:Array.from({length:32},(_,i)=>Math.abs(i-bandIndex)<3?.9:0)});draw(100);v.stop();return paths.map(p=>Math.max(...p.map(y=>Math.abs(y-150))))}
 for(const [index,layer]of [[4,0],[16,1],[27,2]]){const a=amplitudes(index);assert.ok(a[layer]>30,'matching frequency range bounces strongly');assert.ok(a.every((v,i)=>i===layer||v===0),'other colors stay quiet without their own frequency energy')}
});
