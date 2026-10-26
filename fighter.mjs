import {createPropWorld,propCatalog} from './fighter-props.mjs';
import {createSoundstage} from './fighter-soundstage.mjs';
import {paintChibi,fighterArtReady} from './fighter-art.mjs';
import {createSpectrumWaves} from './spectrum-waves.mjs';
import {faceState} from './fighter-face.mjs';
import {moveDeck,katanaDeck,moveHeights,isEvasion} from './fighter-motion.mjs';
import {targetThemes,paintTarget,paintTargetDebris} from './fighter-targets.mjs';
export const fighters=[
 {name:'Master Jin',gender:'man',suit:'#e7e0ce',light:'#fff9e8',hair:'#f0eee6',skin:'#be916f',accent:'#a89b83',idle:'tai-chi'},
 {name:'Iron Monk',gender:'man',suit:'#a75c45',light:'#f4c78b',hair:'#705441',skin:'#a97755',accent:'#b782ff',idle:'breathing'},
 {name:'Jade Lotus',gender:'woman',suit:'#2b9d88',light:'#c1fff0',hair:'#182d3c',skin:'#eac2a1',accent:'#ff2397',idle:'fan-flow'},
 {name:'Ember Fox',gender:'woman',suit:'#d85d6b',light:'#ffe3d0',hair:'#a44b35',skin:'#98634d',accent:'#27ead5',idle:'stretch'},
 {name:'Chrome Fist',gender:'robot',suit:'#8195b1',light:'#e7f6ff',hair:'#26344b',skin:'#c3d6e1',accent:'#27ead5',idle:'cooldown'},
 {name:'The Bride',gender:'woman',suit:'#f5cf34',light:'#fff2a4',hair:'#efc86b',skin:'#f0c7a8',accent:'#ffe792',idle:'sword-care'}
];
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
export function createFighter({spectrum=null,label=true}={}){
 const soundstage=createSoundstage(),objects=createPropWorld();
 let character=0,last=null,silence=0,restTime=0,oldBass=0,oldEnergy=0,cooldown=0,obstacles=[],particles=[],attack=null,hits=0,spawned=0,waves=spectrum||createSpectrumWaves(),dodges=0,walkTravel=0,lastSpawn=-Infinity,lastClear=-Infinity,seed=9473,deck=[],lastMove=null;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const nextMove=()=>{if(!deck.length){deck=(character===5?katanaDeck:moveDeck).slice();for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}if(deck[deck.length-1]===lastMove)[deck[0],deck[deck.length-1]]=[deck[deck.length-1],deck[0]]}return lastMove=deck.pop()};
 const cycle=()=>{character=(character+1)%fighters.length;deck=[];return{index:character,name:fighters[character].name}};
 return{queueObject:id=>objects.choose(id),ready:()=>fighterArtReady(character),queueMove:move=>{if([...moveDeck,...katanaDeck].includes(move)){deck.push(move);cooldown=0;oldBass=0;oldEnergy=0}},cycle,getCharacter:()=>character,setCharacter:i=>{character=((i%fighters.length)+fighters.length)%fighters.length;deck=[]},
 draw(ctx,w,h,now,bands,sensitivity=1,pace=1,skylineGain=1,forcedRest=false){if(forcedRest){bands=Array(32).fill(0);obstacles=[];attack=null;}
  const dt=last==null?.04:clamp((now-last)/1000,0,.08);last=now;
  const clean=Array.from({length:32},(_,i)=>clamp(Number(bands?.[i])||0,0,1));
  const energy=Math.sqrt(clean.reduce((a,b)=>a+b*b,0)/32),bass=clean.slice(0,10).reduce((a,b)=>a+b,0)/10;
  silence=energy<.012?silence+dt:0;const resting=forcedRest||silence>=2;restTime=resting?restTime+dt:0;cooldown=Math.max(0,cooldown-dt);
  soundstage.step(dt,now,clean,resting);objects.step(dt,now);
  const scale=Math.max(1.2,Math.min(w/440,h/220))*.84,ground=h*.84;
  const visibleTarget=obstacles.some(o=>!o.hit&&!o.evaded&&o.x<w-15);
  const walking=false;
  const rx=w*.28,strikeX=rx+74*scale;
  if(!resting&&energy>.035&&cooldown===0&&(bass-oldBass>.025||energy-oldEnergy>.04)){
   const move=nextMove(),height=moveHeights[move],kind=height<35?'low':height<80?'mid':'high',offset=(random()-.5)*14;
   obstacles.push({system:'prop',object:objects.next(),x:w+30+random()*45,kind,move,offset,contactY:ground-(height+offset)*scale,y:ground-(height+offset)*scale,startDY:(random()-.5)*h*.27,bob:random()*h*.07,phase:random()*6,variant:Math.floor(random()*3),size:(10+Math.pow(energy,.6)*7+random()*4)*scale});spawned++;lastSpawn=now;cooldown=isEvasion(move)?1.05:.65+random()*.25;
  }
  oldBass=bass;oldEnergy=energy;
  // Clear strikes on arrival: beat accents create targets; travel time is intentionally visible.
  const speed=w*.43*clamp(pace,.5,2.5);
  const candidates=obstacles.filter(o=>!o.hit&&!o.evaded).sort((a,b)=>a.x-b.x),nearest=candidates[0];
  const plane=o=>isEvasion(o.move)?rx+5*scale:strikeX;
  if(!attack&&nearest&&nearest.x-plane(nearest)<=speed*(nearest.system==='eq'?1+bass*.4:1)*.34)attack={kind:nearest.kind,move:nearest.move,offset:nearest.offset,age:0,y:nearest.contactY};
  for(const target of obstacles){target.x-=speed*(target.system==='eq'?1+bass*.4:1)*dt;const remaining=clamp((target.x-plane(target))/(w-plane(target)),0,1);target.y=target.contactY+target.startDY*remaining+Math.sin(now/230+target.phase)*target.bob*remaining;
   if(!target.hit&&!target.evaded&&target.x<=plane(target)){
    attack={kind:target.kind,move:target.move,offset:target.offset,age:.32,impactAge:0,y:target.contactY};lastClear=now;
    if(isEvasion(target.move)){soundstage.touch(target,rx,target.contactY,{evade:true,move:target.move});target.evaded=true;dodges++;continue}
    hits++;target.hit=true;soundstage.touch({...target,system:target.object===39?'core':target.object%4===0?'node':'eq'},strikeX,target.contactY);objects.hit(target,target.move);
    for(let i=0;i<(target.system==='theme'?12:0);i++){const angle=i/12*Math.PI*2;particles.push({x:strikeX,y:target.contactY,vx:Math.cos(angle)*(70+i*8),vy:Math.sin(angle)*120-35,age:0,chunkSize:3+random()*4,color:targetThemes[character].colors[i%3],rotation:i,spin:(i%2?1:-1)*(3+i*.3),shape:character})}
   }
  }
  obstacles=obstacles.filter(o=>!o.hit&&o.x>rx-75*scale).slice(-14);
  if(attack){attack.age+=dt;if(attack.impactAge!=null)attack.impactAge+=dt;if(attack.age>.72){if(['jump','flying-kick','tornado-kick','leaping-cut'].includes(attack.move))soundstage.land(rx,ground);attack=null}}
  for(const p of particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt}particles=particles.filter(p=>p.age<.70).slice(-90);
  paintArena(ctx,w,h,now,clean,skylineGain,character,waves,walkTravel);
  soundstage.backdrop(ctx,w,h,ground,rx);
  for(const target of obstacles)objects.target(ctx,target,bass);
  for(const p of particles)paintTargetDebris(ctx,p,scale);ctx.globalAlpha=1;
  const atRest=resting&&obstacles.length===0&&!attack,face=faceState(now,character,{resting:atRest,walking,attack,visible:visibleTarget,newTarget:now-lastSpawn,celebrate:now-lastClear});
  paintFighter(ctx,rx,ground,scale,now,character,attack,atRest,restTime,energy,{walking,ready:visibleTarget,face});
  if(attack&&!isEvasion(attack.move)&&attack.impactAge!=null&&attack.impactAge<.12){ctx.globalAlpha=(1-attack.impactAge/.12)*.7;ctx.strokeStyle='#fff5d5';ctx.lineWidth=2;for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(strikeX+Math.cos(a)*8,attack.y+Math.sin(a)*8);ctx.lineTo(strikeX+Math.cos(a)*23,attack.y+Math.sin(a)*23);ctx.stroke()}ctx.globalAlpha=1}
  objects.draw(ctx,w,h);soundstage.foreground(ctx,w,h,ground);
  const title=fighters[character].name;ctx.font='600 20px Arial';ctx.fillStyle='#08060eb3';if(label)ctx.fillRect(12,10,ctx.measureText(title).width+20,30);ctx.fillStyle='#c7afd9';if(label)ctx.fillText(title,22,32);
  return{character:title,resting:resting&&obstacles.length===0&&!attack,idleAnimation:resting&&obstacles.length===0&&!attack?fighters[character].idle:null,attack:attack?.kind||null,hits,spawned,obstacles:obstacles.length,particles:particles.length,anchorX:rx,walking,behavior:atRest?'rest':attack?'combat':visibleTarget?'ready':walking?'walk':'guard',emotion:face.emotion,blink:face.blink,dodges,move:attack?.move||null,object:nearest?propCatalog[nearest.object]?.name:null,objectWorld:objects.state(),targetTheme:targetThemes[character].name,soundstage:soundstage.state(),groundTravel:walkTravel};
 }};
}
function paintArena(ctx,w,h,now,bands,gain,id,waves){paintFrequencyWaves(ctx,w,h,now,bands,gain,waves);const ground=h*.84;ctx.strokeStyle='#44265f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,ground);ctx.lineTo(w,ground);ctx.stroke()}
function paintFighter(ctx,rx,ground,s,now,id,attack,rest,restTime,energy,behavior){
 paintChibi(ctx,rx,ground,s,now,id,attack,rest,restTime,energy,behavior.face);
 if(rest&&restTime>=.9){ctx.font='13px Arial';ctx.fillStyle=fighters[id].accent;ctx.fillText(['TAI CHI','CENTERING','FAN FLOW','COOL-DOWN STRETCH','RECHARGING','BLADE CARE'][id],rx-35*s,Math.min(ground+27*s,(ctx.canvas?.height??Infinity)-8))}
}

export function paintFrequencyWaves(ctx,w,h,now,bands,gain,waves){ctx.save();ctx.globalAlpha=.50;waves.draw(ctx,w,h,now,bands);ctx.restore()}
