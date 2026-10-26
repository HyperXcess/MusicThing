import {createSpectrumWaves} from './spectrum-waves.mjs';
import {faceState,paintFace} from './fighter-face.mjs';
import {fighterPose,fighterMove,moveDeck,katanaDeck,moveHeights,isEvasion} from './fighter-motion.mjs';
import {targetThemes,paintTarget} from './fighter-targets.mjs';
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
 let character=0,last=null,silence=0,restTime=0,oldBass=0,oldEnergy=0,cooldown=0,obstacles=[],particles=[],attack=null,hits=0,spawned=0,waves=spectrum||createSpectrumWaves(),dodges=0,walkTravel=0,lastSpawn=-Infinity,lastClear=-Infinity,seed=9473,deck=[],lastMove=null;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const nextMove=()=>{if(!deck.length){deck=(character===5?katanaDeck:moveDeck).slice();for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}if(deck[deck.length-1]===lastMove)[deck[0],deck[deck.length-1]]=[deck[deck.length-1],deck[0]]}return lastMove=deck.pop()};
 const cycle=()=>{character=(character+1)%fighters.length;deck=[];return{index:character,name:fighters[character].name}};
 return{cycle,getCharacter:()=>character,setCharacter:i=>{character=((i%fighters.length)+fighters.length)%fighters.length;deck=[]},
 draw(ctx,w,h,now,bands,sensitivity=1,pace=1,skylineGain=1,forcedRest=false){if(forcedRest){bands=Array(32).fill(0);obstacles=[];attack=null;}
  const dt=last==null?.04:clamp((now-last)/1000,0,.08);last=now;
  const clean=Array.from({length:32},(_,i)=>clamp(Number(bands?.[i])||0,0,1));
  const energy=Math.sqrt(clean.reduce((a,b)=>a+b*b,0)/32),bass=clean.slice(0,10).reduce((a,b)=>a+b,0)/10;
  silence=energy<.012?silence+dt:0;const resting=forcedRest||silence>=2;restTime=resting?restTime+dt:0;cooldown=Math.max(0,cooldown-dt);
  const scale=Math.max(1.2,Math.min(w/440,h/220))*.84,ground=h*.84;
  const visibleTarget=obstacles.some(o=>!o.hit&&!o.evaded&&o.x<w-15);
  const walking=false;
  const rx=w*.28,strikeX=rx+74*scale;
  if(!resting&&energy>.035&&cooldown===0&&(bass-oldBass>.025||energy-oldEnergy>.04)){
   const move=nextMove(),height=moveHeights[move],kind=height<35?'low':height<80?'mid':'high',offset=(random()-.5)*14;
   obstacles.push({x:w+30+random()*45,kind,move,offset,contactY:ground-(height+offset)*scale,y:ground-(height+offset)*scale,startDY:(random()-.5)*h*.27,bob:random()*h*.07,phase:random()*6,variant:Math.floor(random()*3),size:(10+Math.pow(energy,.6)*7+random()*4)*scale});spawned++;lastSpawn=now;cooldown=isEvasion(move)?1.05:.65+random()*.25;
  }
  oldBass=bass;oldEnergy=energy;
  // Clear strikes on arrival: beat accents create targets; travel time is intentionally visible.
  const speed=w*.43*clamp(pace,.5,2.5);
  const candidates=obstacles.filter(o=>!o.hit&&!o.evaded).sort((a,b)=>a.x-b.x),nearest=candidates[0];
  const plane=o=>isEvasion(o.move)?rx+5*scale:strikeX;
  if(!attack&&nearest&&nearest.x-plane(nearest)<=speed*.34)attack={kind:nearest.kind,move:nearest.move,offset:nearest.offset,age:0,y:nearest.contactY};
  for(const target of obstacles){target.x-=speed*dt;const remaining=clamp((target.x-plane(target))/(w-plane(target)),0,1);target.y=target.contactY+target.startDY*remaining+Math.sin(now/230+target.phase)*target.bob*remaining;
   if(!target.hit&&!target.evaded&&target.x<=plane(target)){
    attack={kind:target.kind,move:target.move,offset:target.offset,age:.32,impactAge:0,y:target.contactY};lastClear=now;
    if(isEvasion(target.move)){target.evaded=true;dodges++;continue}
    hits++;target.hit=true;
    for(let i=0;i<12;i++){const angle=i/12*Math.PI*2;particles.push({x:strikeX,y:target.contactY,vx:Math.cos(angle)*(70+i*8),vy:Math.sin(angle)*120-35,age:0,color:targetThemes[character].colors[i%3],rotation:i,spin:(i%2?1:-1)*(3+i*.3),shape:character})}
   }
  }
  obstacles=obstacles.filter(o=>!o.hit&&o.x>rx-75*scale).slice(-14);
  if(attack){attack.age+=dt;if(attack.impactAge!=null)attack.impactAge+=dt;if(attack.age>.72)attack=null}
  for(const p of particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt}particles=particles.filter(p=>p.age<.55).slice(-90);
  paintArena(ctx,w,h,now,clean,skylineGain,character,waves,walkTravel);
  for(const target of obstacles)paintTarget(ctx,target,character,now);
  for(const p of particles){ctx.save();ctx.globalAlpha=1-p.age/.55;ctx.translate(p.x,p.y);ctx.rotate(p.rotation+p.age*p.spin);ctx.fillStyle=p.color;ctx.beginPath();ctx.moveTo(-4*scale,-scale);ctx.lineTo(5*scale,0);ctx.lineTo(-scale,(p.shape===2?4:2)*scale);ctx.closePath();ctx.fill();ctx.restore()}ctx.globalAlpha=1;
  const atRest=resting&&obstacles.length===0&&!attack,face=faceState(now,character,{resting:atRest,walking,attack,visible:visibleTarget,newTarget:now-lastSpawn,celebrate:now-lastClear});
  paintFighter(ctx,rx,ground,scale,now,character,attack,atRest,restTime,energy,{walking,ready:visibleTarget,face});
  if(attack&&!isEvasion(attack.move)&&attack.impactAge!=null&&attack.impactAge<.12){ctx.globalAlpha=(1-attack.impactAge/.12)*.7;ctx.strokeStyle='#fff5d5';ctx.lineWidth=2;for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(strikeX+Math.cos(a)*8,attack.y+Math.sin(a)*8);ctx.lineTo(strikeX+Math.cos(a)*23,attack.y+Math.sin(a)*23);ctx.stroke()}ctx.globalAlpha=1}
  const title=fighters[character].name;ctx.font='600 20px Arial';ctx.fillStyle='#08060eb3';if(label)ctx.fillRect(12,10,ctx.measureText(title).width+20,30);ctx.fillStyle='#c7afd9';if(label)ctx.fillText(title,22,32);
  return{character:title,resting:resting&&obstacles.length===0&&!attack,idleAnimation:resting&&obstacles.length===0&&!attack?fighters[character].idle:null,attack:attack?.kind||null,hits,spawned,obstacles:obstacles.length,particles:particles.length,anchorX:rx,walking,behavior:atRest?'rest':attack?'combat':visibleTarget?'ready':walking?'walk':'guard',emotion:face.emotion,blink:face.blink,dodges,move:attack?.move||null,targetTheme:targetThemes[character].name,groundTravel:walkTravel};
 }};
}
function paintArena(ctx,w,h,now,bands,gain,id,waves){paintFrequencyWaves(ctx,w,h,now,bands,gain,waves);const ground=h*.84;ctx.strokeStyle='#44265f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,ground);ctx.lineTo(w,ground);ctx.stroke()}
function paintFighter(ctx,rx,ground,s,now,id,attack,rest,restTime,energy,behavior){
 const pose=fighterPose(attack?.move||(behavior.walking?'walk':null),attack?attack.age/.72:0,now,energy),f=fighters[id],P=(x,y)=>[rx+(x*pose.turn+pose.shift)*s,ground+(y+pose.lift)*s],wave=Math.sin(now/800),bow=rest&&restTime<.9?Math.sin(restTime/.9*Math.PI)*12:0;
 const line=(color,width,points)=>{ctx.strokeStyle=color;ctx.lineWidth=width*s;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...P(...p)):ctx.moveTo(...P(...p)));ctx.stroke()};
 const shape=(color,points)=>{ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...P(...p)):ctx.moveTo(...P(...p)));ctx.closePath();ctx.fill()};
 const oval=(color,x,y,wx,hy)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(...P(x,y),wx*s,hy*s,0,0,Math.PI*2);ctx.fill()};
 let {frontK,frontF,hand,elbow,hip,head,backK,backF,backElbow,backHand,lean}=pose;head=[head[0]+bow,head[1]+bow];
 if(attack&&!isEvasion(attack.move)){const amount=Math.pow(Math.sin(Math.PI*Math.min(1,attack.age/.72)),.35),offset=(attack.offset||0)*amount;if(['sweep','flying-kick','spin-kick','tornado-kick'].includes(attack.move)){frontF=[frontF[0],frontF[1]-offset];frontK=[frontK[0],frontK[1]-offset*.5]}else{hand=[hand[0],hand[1]-offset];elbow=[elbow[0],elbow[1]-offset*.5]}}
 if(rest&&restTime>=.9){if(id===0){hand=[26+wave*12,-50+wave*9];elbow=[17,-44];head[1]+=wave*2}
  if(id===1){hand=[16,-35];elbow=[20,-48];head[1]+=wave*2}
  if(id===2){hand=[34+wave*8,-58+wave*12];frontK=[25,-35];frontF=[8,-28]}
  if(id===3){hip=-23;head=[19,-73];hand=[35,-10+wave*2];elbow=[25,-33];frontK=[28,-12];frontF=[46,0]}
  if(id===5){hand=[29,-46];elbow=[19,-47];backHand=[12,-38];head[1]+=wave}
  if(id===4){hip=-24;head=[5,-83];frontK=[20,-12];frontF=[21,0];hand=[29,-35];elbow=[20,-42]}}
 if(id===5&&behavior.walking){hand=[20,-26];elbow=[15,-40]}
 const drop=attack?.move==='duck'?Math.max(0,head[1]+96)*.8:0;
 if(behavior.ready&&!attack){hand=[30,-64];elbow=[16,-50];backHand=[-2,-60]}
 ctx.fillStyle='#271734';ctx.beginPath();ctx.ellipse(rx,ground+4*s,Math.max(22,40+pose.lift*.4)*s,4*s,0,0,Math.PI*2);ctx.fill();
 line('#10111f',12,[[-8,hip],backK,backF]);line(f.suit,8,[[-8,hip],backK,backF]);line(f.light,5,[[backF[0]-5,backF[1]],[backF[0]+5,backF[1]]]);
 line('#10111f',13,[[0,hip],frontK,frontF]);line(f.suit,9,[[0,hip],frontK,frontF]);line(f.light,5,[[frontF[0]-4,frontF[1]],[frontF[0]+7,frontF[1]]]);
 line('#10111f',12,[[-10+lean,-59+drop],backElbow,backHand]);line(f.suit,8,[[-10+lean,-59+drop],backElbow,backHand]);oval(f.skin,...backHand,5,5);
 line('#10111f',11,[[lean,-62+drop],[head[0],head[1]+19]]);line(f.skin,7,[[lean,-62+drop],[head[0],head[1]+19]]);
 shape('#10111f',[[-17+lean,-66+drop],[10+lean,-65+drop],[14,hip+2],[-14,hip+2]]);shape(f.suit,[[-14+lean,-64+drop],[8+lean,-63+drop],[11,hip],[-12,hip]]);shape(f.light,[[-4+lean,-63+drop],[7+lean,-62+drop],[-1,-43],[-8+lean*.5,-51+drop*.5]]);line('#211528',4,[[-12,hip],[12,hip]]);line(f.accent,2,[[5,hip],[17,hip+12]]);
 if(id===5){line('#15151e',2,[[8+lean,-60],[9,hip]]);line('#15151e',2,[[frontK[0]+2,frontK[1]],[frontF[0]+2,frontF[1]]]);line('#15151e',2,[[backK[0]-2,backK[1]],[backF[0]-2,backF[1]]])}
 line('#10111f',12,[[8+lean,-58+drop],elbow,hand]);line(f.suit,8,[[8+lean,-58+drop],elbow,hand]);oval(f.skin,...hand,6,5);
 oval('#10111f',...head,24,25);oval(f.skin,head[0]+1,head[1]+1,21,22);
 const [hx,hy]=head;
 if(id===0){shape(f.hair,[[hx-23,hy-2],[hx-22,hy-20],[hx-8,hy-29],[hx+13,hy-26],[hx+23,hy-9],[hx+14,hy-17],[hx-3,hy-18],[hx-13,hy-7],[hx-16,hy+8]]);oval(f.hair,hx-5,hy-31,9,8);line('#9b8f7e',1,[[hx-20,hy-31],[hx+12,hy-31]])}
 if(id===1){oval(f.light,hx-2,hy-17,17,6);for(let i=0;i<5;i++)oval('#744193',-12+i*6,-61+Math.sin(i)*2,2,2)}
 if(id===2){shape(f.hair,[[hx-23,hy+15],[hx-24,hy-13],[hx-12,hy-26],[hx+10,hy-25],[hx+24,hy-8],[hx+5,hy-14],[hx-4,hy-7],[hx-12,hy-13],[hx-13,hy+19]]);oval(f.hair,hx-16,hy-26,11,10);line(f.accent,2,[[hx-23,hy-26],[hx-8,hy-23]])}
 if(id===3){shape(f.hair,[[hx-22,hy+15],[hx-25,hy-13],[hx-9,hy-28],[hx+12,hy-25],[hx+23,hy-7],[hx+3,hy-16],[hx-12,hy-6],[hx-12,hy+15]]);shape(f.hair,[[hx-19,hy-17],[hx-39,hy-20],[hx-52,hy+12+wave*4],[hx-29,hy+3],[hx-21,hy-8]]);line(f.accent,3,[[hx-23,hy-15],[hx-19,hy-7]])}
 if(id===5){shape(f.hair,[[hx-19,hy-19],[hx-42,hy-23],[hx-51,hy+4+Math.sin(now/260)*3],[hx-35,hy+15],[hx-31,hy-3],[hx-18,hy-8]]);oval('#15151e',hx-24,hy-13,5,5);shape(f.hair,[[hx-23,hy-1],[hx-25,hy-14],[hx-10,hy-28],[hx+13,hy-24],[hx+25,hy-5],[hx+15,hy-10],[hx+7,hy-15],[hx-5,hy-8],[hx-18,hy-5]]);line('#f8e8b0',2,[[hx-19,hy-14],[hx-17,hy+13]])}
 if(id===4){shape(f.suit,[[hx-24,hy-13],[hx-14,hy-26],[hx+12,hy-24],[hx+25,hy-8],[hx+23,hy+17],[hx-18,hy+20]]);shape('#0b1020',[[hx-5,hy-5],[hx+23,hy-5],[hx+21,hy+6],[hx-5,hy+6]]);paintFace({line,oval,shape},hx,hy,behavior.face,id,f.accent)}
 else paintFace({line,oval,shape},hx,hy,behavior.face,id,f.accent);
 if(id===0){shape(f.hair,[[hx-8,hy-5],[hx-18,hy-11],[hx-27,hy-10],[hx-16,hy-2],[hx-4,hy-1]]);shape(f.hair,[[hx+8,hy-5],[hx+18,hy-10],[hx+29,hy-8],[hx+20,hy-2],[hx+8,hy-1]]);shape(f.hair,[[hx+4,hy+10],[hx-3,hy+13],[hx-4,hy+30],[hx+4,hy+45+wave*2],[hx+13,hy+33],[hx+23,hy+15],[hx+15,hy+10],[hx+11,hy+19],[hx+7,hy+19]]);line('#c6c1b5',1,[[hx+3,hy+22],[hx+5,hy+37]]);line('#c6c1b5',1,[[hx+16,hy+20],[hx+10,hy+34]])}
 if(id===5){
  let tip;
  if(attack&&(attack.move.endsWith('cut')||attack.move==='draw-slash'||attack.move==='spinning-slash')){
   const t=attack.age/.72,tipAt=[74-pose.shift,-moveHeights[attack.move]-pose.lift-(attack.offset||0)],dx=tipAt[0]-hand[0],dy=tipAt[1]-hand[1],contact=Math.atan2(dy,dx),wind=contact-1.8,follow=contact+1.5,angle=t<.42?wind+(contact-wind)*Math.max(0,t/.42):t<.54?contact:contact+(follow-contact)*Math.min(1,(t-.54)/.28),length=Math.hypot(dx,dy);
   tip=[hand[0]+Math.cos(angle)*length,hand[1]+Math.sin(angle)*length];
   if(t>.25&&t<.76){ctx.globalAlpha=.28;for(let j=1;j<=3;j++){const a=angle-j*.16;line('#fff5c6',1,[[hand[0]+Math.cos(a)*length*.45,hand[1]+Math.sin(a)*length*.45],[hand[0]+Math.cos(a)*length,hand[1]+Math.sin(a)*length]])}ctx.globalAlpha=1}
  }else{const angle=rest?-.13:[-1.15,-.5,.8][Math.floor(now/2100)%3]+Math.sin(now/700)*.05;tip=[hand[0]+Math.cos(angle)*43,hand[1]+Math.sin(angle)*43]}
  line('#15151e',4,[hand,tip]);line('#e5f3ff',2.3,[hand,tip]);line('#ffffff',.7,[[hand[0]+1,hand[1]-1],[tip[0]+1,tip[1]-1]]);
  const vx=tip[0]-hand[0],vy=tip[1]-hand[1],len=Math.hypot(vx,vy)||1,ux=vx/len,uy=vy/len;
  line('#15151e',4,[[hand[0]-ux*10,hand[1]-uy*10],hand]);line('#caab6b',2,[[hand[0]-uy*5,hand[1]+ux*5],[hand[0]+uy*5,hand[1]-ux*5]]);
  if(rest){line('#ffe792',1,[[hand[0]+17,-44],[hand[0]+21,-48],[hand[0]+25,-44]]);line('#ffe792',1,[[hand[0]+21,-52],[hand[0]+21,-40]])}
 }

 if(rest&&restTime>=.9){
  if(id===1){ctx.strokeStyle=f.accent;ctx.lineWidth=s;ctx.beginPath();ctx.ellipse(...P(0,-40),29*s,(22+wave*4)*s,0,0,Math.PI*2);ctx.stroke()}
  if(id===2){const x=hand[0],y=hand[1];for(let i=0;i<7;i++){const a=-2.8+i*.32;line(i%2?f.accent:f.light,2,[[x,y],[x+Math.cos(a)*20,y+Math.sin(a)*20]])}}
  if(id===4){line(f.accent,2,[[hand[0],hand[1]],[43,-16],[43,-2]]);shape(f.suit,[[35,-8],[54,-8],[54,-1],[35,-1]]);for(let i=0;i<3;i++){const rise=(now/80+i*10)%35;line(f.accent,1,[[36+i*5,-14-rise],[39+i*5,-20-rise]])}}
  ctx.font='13px Arial';ctx.fillStyle=f.accent;ctx.fillText(['TAI CHI','CENTERING','FAN FLOW','COOL-DOWN STRETCH','RECHARGING','BLADE CARE'][id],rx-35*s,Math.min(ground+27*s,(ctx.canvas?.height??Infinity)-8));
 }
}

export function paintFrequencyWaves(ctx,w,h,now,bands,gain,waves){ctx.save();ctx.globalAlpha=.65;waves.draw(ctx,w,h,now,bands);ctx.restore()}
