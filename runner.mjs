import {runnerBodies,paintRunnerBody,paintRunnerBoot} from './runner-bodies.mjs';
import {cast,paintCastHead,paintCastIdle,runnerIdlePose,paintGhostSleep} from './runner-cast.mjs';
import {drawRunnerEnvironment} from './runner-environments.mjs';
// Ten distinct stride silhouettes: compression, push-off, flight and contact.
const stride=[
 [3,8,12,-19,-7,-10,-18,-15,-31,-2,-12,-48,4,-42],
 [0,10,16,-25,8,-14,-17,-16,-34,-5,-15,-47,2,-37],
 [-5,12,22,-20,34,-5,-15,-24,-28,-30,-12,-49,7,-44],
 [-2,9,17,-15,25,0,-20,-24,-28,-35,-8,-43,12,-40],
 [4,6,0,-13,3,0,-13,-27,-25,-23,4,-42,21,-47],
 [2,8,-16,-18,-29,-2,12,-24,-2,-13,19,-42,26,-55],
 [-1,11,-20,-24,-31,-29,17,-22,11,-10,24,-43,31,-57],
 [-6,12,-16,-22,-32,-33,24,-20,34,-3,23,-45,29,-59],
 [-1,9,-12,-27,-26,-22,14,-14,21,0,17,-41,26,-52],
 [4,6,-8,-27,-24,-19,1,-14,0,0,8,-39,24,-44]
];
export function runnerPose(cycle){const position=((cycle%1)+1)%1*stride.length,index=Math.floor(position),t=position-index;return stride[index].map((v,i)=>v+(stride[(index+1)%stride.length][i]-v)*t)}
export const runnerCharacters=cast.map(c=>c[0]);
const palettes=cast.map(c=>c[1]);
// Canvas-only arcade runner: fixed camera, beat obstacles, automatic jumps.
export function createRunner({label=true}={}){let last=null,travel=0,speed=0,silence=0,bassOld=0,cooldown=0,jump=0,velocity=0,obstacles=[],charging=false,character=0,bounds=null,idleBlend=0;
 const cycle=()=>{character=(character+1)%cast.length;return {index:character,name:runnerCharacters[character]}};
 return {cycle,getCharacter:()=>character,setCharacter:i=>character=((i%cast.length)+cast.length)%cast.length,tap(x,y){if(!bounds||x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom)return null;return cycle()},draw(ctx,w,h,now,bands,sensitivity=1,runSpeed=1,skylineGain=1){
  const dt=last==null?.04:Math.min(.08,Math.max(.001,(now-last)/1000));last=now;
  const energy=Math.sqrt(bands.reduce((s,v)=>s+v*v,0)/32),bass=bands.slice(0,10).reduce((s,v)=>s+v,0)/10,treble=bands.slice(22).reduce((s,v)=>s+v,0)/10;
  silence=energy<.012?silence+dt:0;charging=silence>=2;
  const target=charging?0:w*.29*runSpeed;speed+=(target-speed)*Math.min(1,dt*3);travel+=speed*dt;cooldown=Math.max(0,cooldown-dt);
  const hit=bass-bassOld;bassOld=bass;
  if(!charging&&cooldown===0&&bass>.07&&hit>.025){obstacles.push({x:w+25,height:Math.min(h*.27,18+Math.pow(bass,.7)*sensitivity*h*.12),jumped:false});cooldown=.9}
  const ground=h*.83,rx=w*.28,scale=Math.max(1.2,Math.min(w/440,h/220)),body=32*scale;
  for(const obstacle of obstacles){obstacle.x-=speed*dt;
   if(!obstacle.jumped&&jump<=0&&obstacle.x-rx<Math.max(55*scale,speed*.31)&&obstacle.x>rx){velocity=Math.sqrt(2*h*3.4*(obstacle.height+body*.7));obstacle.jumped=true}
  }
  velocity-=h*3.4*dt;jump=Math.max(0,jump+velocity*dt);if(jump===0)velocity=0;
  obstacles=obstacles.filter(o=>o.x> -40);
  drawRunnerEnvironment(ctx,w,h,travel,character);
  // Each skyline tower is a live EQ bin; stable width, audio-driven height.
  for(let i=0;i<32;i++){const slot=w/28,x=((i*slot-travel*.13)%(slot*32)+slot*32)%(slot*32)-slot*2,bh=8+Math.min(1,Math.max(0,bands[i]*skylineGain))*h*.57;
   ctx.fillStyle=i<10?'#103c3e':i<22?'#302043':'#42152f';ctx.fillRect(x,ground-bh,slot-4,bh);
   ctx.fillStyle=i<10?'#27ead5':i<22?'#b782ff':'#ff2397';ctx.fillRect(x,ground-bh,slot-4,3);
  }
  ctx.strokeStyle='#44265f';ctx.lineWidth=1;for(let i=0;i<13;i++){const x=((i*w/10-travel)%(w+w/5)+(w+w/5))%(w+w/5)-w/10;ctx.beginPath();ctx.moveTo(x,ground);ctx.lineTo(x-w*.16,h);ctx.stroke()}
  ctx.strokeStyle='#27ead5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,ground);ctx.lineTo(w,ground);ctx.stroke();
  for(const o of obstacles){ctx.fillStyle='#ff2397';ctx.fillRect(o.x-6,ground-o.height,12,o.height);ctx.fillStyle='#ffd4ef';ctx.fillRect(o.x-10,ground-o.height,20,5)}
  const rest=charging&&jump===0;idleBlend+=((rest?1:0)-idleBlend)*Math.min(1,dt*5);
  const float=character===3?idleBlend*(38+Math.sin(now/800)*9):0;
  const y=ground-jump-float,pose=runnerPose(travel/(145*scale));
  const [bob,lean,kx,ky,fx,fy,bkx,bky,bfx,bfy,ex,ey,hx,hy]=pose;
  const idle=rest?runnerIdlePose(character,now):{};
  const hipY=idle.hip??(-31+(rest?0:jump>0?-3:bob)),headX=rest?(idle.head??3):lean+6;
  const [metal,shine,dark,accent]=palettes[character];bounds={left:rx-42*scale,right:rx+52*scale,top:y-110*scale,bottom:y+6*scale};
  const P=(x,z)=>[rx+x*scale,y+z*scale];
  const line=(color,width,a,b)=>{ctx.strokeStyle=color;ctx.lineWidth=width*scale;ctx.beginPath();ctx.moveTo(...P(...a));ctx.lineTo(...P(...b));ctx.stroke()};
  const plate=(color,points)=>{ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...P(...p)):ctx.moveTo(...P(...p)));ctx.fill()};
  const bodyStyle=runnerBodies[character];
  const joint=(x,z)=>{ctx.fillStyle=accent;ctx.fillRect(rx+(x-2)*scale,y+(z-2)*scale,4*scale,4*scale)};
  ctx.fillStyle='#271734';ctx.fillRect(rx-22*scale,ground+4,44*scale,4);
  if(!rest&&speed>5){
   // Continuous backward streaks: born near the runner, then travel, thin and fade.
   for(let i=0;i<6;i++){const age=((travel/(85*scale)+i/6)%1+1)%1,fade=Math.pow(1-age,1.5);
    const x=rx-(20+age*95)*scale,z=y-(25+(i%3)*9+Math.sin(i*2.3)*3+age*(i%2?7:-7))*scale;
    ctx.globalAlpha=fade*.65;ctx.fillStyle=i%2?'#27ead5':'#ff2397';ctx.fillRect(x,z,(8+age*15)*scale,Math.max(.7,(1-age)*2)*scale);
   }ctx.globalAlpha=1;
  }
  if(!(rest&&(character===2||character===10))){
  // Far limbs are darker; bent knees and elbows keep both silhouettes readable.
  const backK=rest?(idle.backK??[-6,-15]):jump>0?[-18,-20]:[bkx,bky],backF=rest?(idle.backF??[-8,0]):jump>0?[-28,-31]:[bfx,bfy];
  if(bodyStyle.leg){line(dark,bodyStyle.leg,[-3,hipY],backK);line(metal,bodyStyle.leg-1,backK,backF)}paintRunnerBoot({plate,id:character,foot:backF,color:bodyStyle.boot});
  const farElbow=rest?[-16,hipY-12]:[-ex*.7,ey+bob],farHand=rest?[-9,hipY-2]:[-hx*.7,hy+bob];line(dark,bodyStyle.arm,[headX-4,hipY-22],farElbow);line(metal,bodyStyle.arm-1,farElbow,farHand);
  paintRunnerBody({ctx,P,s:scale,id:character,headX,hipY,now,colors:palettes[character]});
  const nearK=rest?(idle.nearK??[7,-16]):jump>0?[21,-29]:[kx,ky],nearF=rest?(idle.nearF??[9,0]):jump>0?[29,-20]:[fx,fy];
  if(bodyStyle.leg){line(shine,bodyStyle.leg,[3,hipY],nearK);line(metal,bodyStyle.leg-1,nearK,nearF);joint(...nearK)}paintRunnerBoot({plate,id:character,foot:nearF,color:bodyStyle.boot});
  const elbow=rest?(character===1?[24,-42+Math.sin(now/280)*2]:(idle.elbow??[18,-35])):jump>0?[25,-52]:[ex,ey+bob],hand=rest?(character===1?[37+Math.sin(now/330)*5,-31]:(idle.hand??[24,-25])):jump>0?[37,-60]:[hx,hy+bob];
  line(shine,bodyStyle.arm,[headX+4,hipY-22],elbow);line(shine,bodyStyle.arm-1,elbow,hand);joint(...elbow);ctx.fillStyle='#ff2397';ctx.fillRect(rx+(hand[0]-3)*scale,y+(hand[1]-3)*scale,7*scale,7*scale);
  if(character===12){const tip=rest?[54,-60]:[hand[0]+16,hand[1]-25];line('#d4b3ff',2,[hand[0]-6,hand[1]+10],tip);ctx.fillStyle='#27ead5';ctx.beginPath();ctx.ellipse(...P(...tip),4*scale,5*scale,0,0,Math.PI*2);ctx.fill()}
  const headY=hipY-50+(rest&&character===1?Math.sin(now/400)*2:0);
  const oval=(color,x,z,rxSize,rySize,outline=true)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(...P(x,z),rxSize*scale,rySize*scale,0,0,Math.PI*2);ctx.fill();if(outline){ctx.strokeStyle='#090d16';ctx.lineWidth=2*scale;ctx.stroke()}};
  if(character<4){
  // Oversized chrome helmets, black visor and a circular ear module.
  oval(metal,headX,headY,23,26);oval(shine,headX-5,headY-12,13,8,false);
  if(character===2){plate(metal,[[headX-19,headY-15],[headX-22,headY-38],[headX-6,headY-24]]);plate(shine,[[headX+4,headY-24],[headX+17,headY-36],[headX+18,headY-14]])}
  if(character===3){oval(shine,headX+1,headY+1,24,25);oval('#11172b',headX+5,headY,19,19);oval('#3a2961',headX+8,headY+3,14,14,false)}
  else {plate('#090d16',[[headX-4,headY-6],[headX+25,headY-2],[headX+24,headY+13],[headX+1,headY+16],[headX-5,headY+8]]);plate(dark,[[headX+1,headY+16],[headX+23,headY+13],[headX+19,headY+25],[headX+6,headY+25]]);line(shine,2,[headX+3,headY+18],[headX+18,headY+17])}
  ctx.fillStyle=accent;ctx.fillRect(rx+(headX+3)*scale,y+(headY+4)*scale,(rest?7+Math.floor(now/500)%3*3:18)*scale,3*scale);
  if(character===1){line('#ffb94a',2,[headX+7,headY-3],[headX+7,headY+11]);line('#ffb94a',2,[headX+14,headY-2],[headX+14,headY+10])}
  oval(dark,headX-14,headY+5,9,10);oval(shine,headX-14,headY+5,6,7);oval(accent,headX-14,headY+5,3,4,false);
  }else{paintCastHead(ctx,P,scale,character,headX,headY,rest,now)}
  }else if(character===10){paintGhostSleep(ctx,P,scale,now)}else{
   // Neko curls into a low sleeping ball, visor closed and tail tucked around it.
   const breathing=1+Math.sin(now/700)*.035;
   const oval=(color,x,z,wide,tall)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(...P(x,z),wide*scale,tall*scale,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#160e21';ctx.lineWidth=2*scale;ctx.stroke()};
   oval(metal,-5,-17,25,16*breathing);oval(shine,16,-24,19,18);
   plate(metal,[[1,-34],[2,-53],[13,-40]]);plate(metal,[[20,-40],[34,-49],[31,-27]]);
   plate('#160e21',[[13,-27],[35,-25],[33,-15],[13,-17]]);line(accent,2,[18,-21],[30,-20]);
   line(metal,7,[-26,-12],[-33,-24]);line(shine,5,[-33,-24],[-21,-29]);
   ctx.fillStyle=accent;ctx.fillRect(rx+3*scale,y-5*scale,17*scale,4*scale);
  }
  if(rest){ctx.font=Math.round(14*scale)+'px Arial';ctx.fillStyle='#c7afd9';
   if(character===0){line('#27ead5',2,[24,-25],[38,0]);ctx.fillStyle='#27ead5';ctx.fillRect(rx+32*scale,ground-3,14*scale,6);for(let i=0;i<3;i++){const rise=(now/65+i*13)%44;ctx.fillRect(rx+(39+i*4)*scale,ground-rise*scale,2*scale,2*scale)}ctx.fillStyle='#c7afd9';ctx.fillText('RECHARGING',rx-35*scale,Math.min(ground+28*scale,(ctx.canvas?.height??Infinity)-8))}
   else if(character===1){plate('#34223d',[[20,-30],[62,-30],[67,-20],[17,-20]]);line('#744193',3,[24,-20],[24,0]);line('#744193',3,[59,-20],[59,0]);
    for(const x of [29,53]){ctx.strokeStyle='#ff2397';ctx.lineWidth=2*scale;ctx.beginPath();ctx.ellipse(...P(x,-27),7*scale,2*scale,0,0,Math.PI*2);ctx.stroke();line('#fff1a5',1,[x,-27],[x+Math.cos(now/250)*6,-27+Math.sin(now/250)*2])}
    ctx.fillStyle='#ff2397';ctx.fillText('AFTERPARTY',rx-28*scale,Math.min(ground+28*scale,(ctx.canvas?.height??Infinity)-8))}
   else if(character===2){for(let i=0;i<3;i++){const rise=(now/80+i*13)%42;ctx.font=Math.round((10+i*3)*scale)+'px Arial';ctx.fillStyle='#b782ff';ctx.fillText('z',rx+(35+rise*.25)*scale,y-(42+rise)*scale)}ctx.font=Math.round(14*scale)+'px Arial';ctx.fillText('CAT NAP',rx-25*scale,Math.min(ground+28*scale,(ctx.canvas?.height??Infinity)-8))}
   else if(character===3){line('#b782ff',1,[6,-20],[45,float]);ctx.fillStyle='#27ead5';ctx.fillRect(rx+40*scale,ground-2,12*scale,4);for(let i=0;i<4;i++){const rise=(now/90+i*12)%45;ctx.fillRect(rx+(-14+i*9)*scale,ground-rise*scale,2*scale,2*scale)}ctx.fillStyle='#c7afd9';ctx.fillText('ZERO-G BREAK',rx-36*scale,Math.min(ground+28*scale,(ctx.canvas?.height??Infinity)-8))}
  }
  if(rest&&character>=4)paintCastIdle(ctx,P,scale,character,now,ground,rx);ctx.globalAlpha=1;
  ctx.font='600 20px Arial';const title=runnerCharacters[character],titleWidth=ctx.measureText?ctx.measureText(title).width:title.length*12;ctx.fillStyle='#08060eb3';if(label)ctx.fillRect(12,10,titleWidth+20,30);ctx.fillStyle='#c7afd9';if(label)ctx.fillText(title,22,32);
  return {charging:rest,jump,obstacles:obstacles.length,speed,character:runnerCharacters[character],idleAnimation:rest?cast[character][2]:null,bounds};
 }}
}
