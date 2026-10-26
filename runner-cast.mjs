export const cast=[
 ['Silver Circuit',['#b2c5d1','#f0f9ff','#4d6577','#27ead5'],'recharge'],
 ['Gold Groove',['#d8a63c','#fff1a5','#876022','#ff2397'],'decks'],
 ['Neon Neko',['#744193','#d0a0ff','#362248','#ff2397'],'catnap'],
 ['Moonwalker',['#dce5ef','#ffffff','#687b9c','#27ead5'],'float'],
 ['Cyber Courier',['#503a77','#ba9cff','#251b40','#27ead5'],'delivery'],
 ['Cassette Kid',['#f084ba','#ffd1ec','#66344f','#27ead5'],'rewind'],
 ['Arcade Knight',['#a7bbd5','#f0f7ff','#455b79','#b782ff'],'polish'],
 ['Deep Diver',['#b98642','#ffe0a0','#60431f','#27ead5'],'bubbles'],
 ['Skater Bot',['#309c9a','#9cfff0','#23434c','#ff2397'],'boardspin'],
 ['Space Cowboy',['#a37554','#f4c591','#49314b','#27ead5'],'campfire'],
 ['Vapor Ghost',['#d2c5f7','#ffffff','#74638f','#ff2397'],'fade'],
 ['Dino Bot',['#4fa58a','#b3ffc9','#244f49','#ffb74d'],'egg'],
 ['Synth Wizard',['#654495','#d4b3ff','#322144','#27ead5'],'conjure'],
 ['Ramen Runner',['#dc7168','#ffe0ba','#5a303d','#27ead5'],'noodles'],
 ['Nova Dash',['#d35d9e','#ffe1cc','#382044','#27ead5'],'route'],
 ['Captain Lyra',['#c7e4ee','#ffffff','#476379','#ff2397'],'starchart'],
 ['Pixel Vee',['#744193','#d6c7ff','#231332','#27ead5'],'drums']
];
export function paintCastHead(ctx,P,s,id,x,y,rest,now){const [name,[metal,shine,dark,accent]]=cast[id];
 const line=(color,width,points)=>{ctx.strokeStyle=color;ctx.lineWidth=width*s;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...P(...p)):ctx.moveTo(...P(...p)));ctx.stroke()};
 const shape=(color,points)=>{ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...P(...p)):ctx.moveTo(...P(...p)));ctx.fill();line('#0c0c1b',1.5,[...points,points[0]])};
 const oval=(color,a,b,rx,ry)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(...P(a,b),rx*s,ry*s,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#0c0c1b';ctx.lineWidth=1.5*s;ctx.stroke()};
 const box=(color,a,b,w,h)=>shape(color,[[a,b],[a+w,b],[a+w,b+h],[a,b+h]]);
 // Shared face, with a unique outer silhouette for each new character.
 if(id!==10){oval(metal,x,y,22,23);box('#0b1020',x-2,y-5,24,13);line(accent,2,[[x+3,y+2],[x+20,y+2]])}
 if(id===4){shape(dark,[[x-27,y+20],[x-26,y-18],[x-7,y-31],[x+16,y-24],[x+26,y+15],[x+17,y+23],[x+18,y-7],[x-7,y-9],[x-8,y+19]]);box('#ba9cff',x-17,y+25,25,16);line(accent,2,[[x-15,y+30],[x+6,y+30]])}
 if(id===5){box(metal,x-27,y-21,53,39);box(dark,x-22,y-15,43,23);oval(shine,x-12,y-3,8,8);oval(shine,x+12,y-3,8,8);oval(dark,x-12,y-3,3,3);oval(dark,x+12,y-3,3,3);shape(shine,[[x-9,y+17],[x-6,y+7],[x+7,y+7],[x+12,y+17]]);line(accent,1,[[x-4,y-3],[x+4,y-3]]);if(rest){for(const reelX of [x-12,x+12])for(let i=0;i<3;i++){const a=-now/100+i*Math.PI*2/3;line(dark,1.5,[[reelX,y-3],[reelX+Math.cos(a)*6,y-3+Math.sin(a)*6]])}}}
 if(id===6){shape(metal,[[x-22,y-20],[x+5,y-28],[x+25,y-8],[x+21,y+23],[x-18,y+22]]);box(dark,x-1,y-3,24,7);for(let i=0;i<3;i++)line(dark,2,[[x+2+i*6,y+10],[x+2+i*6,y+19]]);shape(accent,[[x-8,y-24],[x-16,y-42],[x+9,y-31],[x+16,y-21]])}
 if(id===7){oval(metal,x,y,27,27);oval(shine,x+9,y,18,19);oval('#103439',x+11,y,14,15);line(accent,2,[[x+4,y-6],[x+18,y-6]]);for(const [dx,dy]of [[-18,-15],[-18,15],[6,-23],[6,23]])oval(dark,x+dx,y+dy,2,2);line(metal,4,[[x-23,y+10],[x-34,y+18],[x-29,y+40]])}
 if(id===8){shape(accent,[[x-23,y-8],[x-19,y-27],[x+12,y-29],[x+25,y-11],[x+34,y-7]]);oval(dark,x-19,y+3,10,14);oval(shine,x-19,y+3,6,9);line(shine,3,[[x-24,y-8],[x-16,y-23],[x+7,y-24]])}
 if(id===9){shape(metal,[[x-21,y-12],[x-19,y-34],[x-3,y-27],[x+12,y-34],[x+21,y-12]]);oval(shine,x,y-11,37,6);box(dark,x-20,y-17,40,5);shape(shine,[[x+2,y+18],[x+22,y+18],[x+12,y+32]])}
 if(id===10){oval(shine,x,y-3,25,27);shape(shine,[[x-24,y-1],[x-28,y+26],[x-15,y+20],[x-4,y+29],[x+6,y+21],[x+20,y+29],[x+27,y+10],[x+23,y-1]]);oval(dark,x+7,y-3,4,7);oval(dark,x+20,y-2,3,6)}
 if(id===11){oval(metal,x-3,y-2,25,24);shape(metal,[[x+4,y-12],[x+35,y-7],[x+38,y+11],[x+7,y+17]]);box(dark,x+7,y+6,29,5);for(let i=0;i<4;i++)shape(shine,[[x+10+i*6,y+6],[x+13+i*6,y+10],[x+15+i*6,y+6]]);oval(dark,x+4,y-9,3,4);for(let i=0;i<3;i++)shape(accent,[[x-23+i*9,y-20],[x-21+i*9,y-33],[x-14+i*9,y-22]])}
 if(id===12){shape(metal,[[x-29,y-12],[x-14,y-49],[x+4,y-40],[x+17,y-12]]);oval(shine,x-1,y-12,34,5);shape(accent,[[x-9,y-30],[x-6,y-37],[x-3,y-30],[x+3,y-28],[x-4,y-26]])}
 if(id===13){shape(metal,[[x-28,y-3],[x-21,y+22],[x+18,y+22],[x+29,y-3]]);oval(shine,x,y-3,29,7);for(let i=0;i<5;i++)line('#ffd68a',2,[[x-18+i*7,y-7],[x-20+i*7,y-16],[x-14+i*7,y-21]]);line(dark,2,[[x+7,y-16],[x+25,y-36]]);line(dark,2,[[x+12,y-14],[x+32,y-31]]);box(dark,x-12,y+5,31,8);line(accent,2,[[x-5,y+9],[x+13,y+9]])}
 if(id>=14){
  const skin=id===15?'#986447':'#efc3ad',hair=id===14?'#ff2397':id===15?'#152c43':'#8254c9';
  // Distinct faces, hair silhouettes and accessories, rather than palette swaps.
  oval(skin,x+2,y+1,20,21);shape(hair,[[x-22,y+10],[x-26,y-13],[x-12,y-28],[x+10,y-27],[x+26,y-10],[x+10,y-15],[x+3,y-5],[x-7,y-11],[x-8,y+20]]);
  line('#182033',2,[[x+6,y+2],[x+14,y+2]]);line('#182033',1.5,[[x+12,y],[x+15,y-3]]);line('#ae665f',1.5,[[x+13,y+13],[x+18,y+12]]);
  if(id===14){const sw=Math.sin(now/100)*4;shape(hair,[[x-18,y-20],[x-39,y-28],[x-52,y-14+sw],[x-40,y+16+sw],[x-36,y+4],[x-31,y-9],[x-16,y-9]]);line(accent,3,[[x-19,y-20],[x-17,y-11]]);box('#132d3b',x-6,y-13,29,7);line(accent,2,[[x+1,y-9],[x+19,y-9]])}
  if(id===15){oval('#ff2397',x-12,y-23,9,8);oval('#152c43',x-18,y+13,7,12);oval('#152c43',x-21,y+26,5,7);ctx.strokeStyle='#9cfff0';ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(...P(x,y-1),28*s,31*s,0,0,Math.PI*2);ctx.stroke();line('#ffffff',2,[[x+14,y-23],[x+24,y-10]]);line(dark,3,[[x-25,y+25],[x+23,y+25]])}
  if(id===16){oval(hair,x-18,y-24,12,12);shape(accent,[[x-27,y-20],[x-33,y-9],[x-27,y+17],[x-19,y+18],[x-21,y-5]]);oval(dark,x-17,y+4,9,13);oval(accent,x-17,y+4,5,8);line(shine,3,[[x-20,y-15],[x-10,y-25],[x+9,y-24]])}
 }

}
export function runnerIdlePose(id,now){const swing=Math.sin(now/250);const poses={
 4:{head:9,hand:[27,-40],elbow:[20,-43]},
 5:{hand:[28,-34],elbow:[22,-40]},
 6:{hand:[26+swing*3,-78],elbow:[34,-54]},
 8:{hip:-24,head:13,nearK:[22,-16],nearF:[16,0],backK:[-10,-12],backF:[-20,0],hand:[35,-15+swing*2],elbow:[27,-34]},
 9:{hip:-24,head:11,nearK:[20,-13],nearF:[19,0],backK:[-12,-14],backF:[-16,0],hand:[33,-26+swing*2],elbow:[23,-35]},
 11:{hip:-27,head:12,nearK:[21,-13],nearF:[20,0],hand:[28,-23],elbow:[24,-34]},
 12:{hand:[32,-38],elbow:[23,-45]},
 13:{head:10,hand:[35,-47+swing*3],elbow:[26,-37]},
 14:{head:8,hand:[35,-38],elbow:[24,-43]},
 15:{head:8,hand:[36,-46],elbow:[24,-43]},
 16:{hand:[35,-38+Math.sin(now/110)*9],elbow:[24,-43]}
 };return poses[id]||{}}
export function paintGhostSleep(ctx,P,s,now){const breath=1+Math.sin(now/700)*.06;
 const oval=(c,x,y,w,h)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(...P(x,y),w*s,h*s,0,0,Math.PI*2);ctx.fill()};
 oval('#744193',0,-5,40,7);oval('#d2c5f7',-7,-20,29,17*breath);oval('#ffffff',18,-25,22,19*breath);
 ctx.strokeStyle='#322144';ctx.lineWidth=2*s;for(const x of [18,31]){ctx.beginPath();ctx.moveTo(...P(x-4,-23));ctx.lineTo(...P(x,-20));ctx.lineTo(...P(x+4,-23));ctx.stroke()}
 oval('#b782ff',-8,-10,24,5);ctx.fillStyle='#ffffff';for(let i=0;i<3;i++){const rise=(now/95+i*18)%58;ctx.font=(15+i*5)*s+'px Arial';ctx.fillText('Z',...P(36+rise*.14,-37-rise))}
}
export function paintCastIdle(ctx,P,s,id,now,ground,rx){const [name,[metal,shine,dark,accent],idle]=cast[id];
 const line=(c,width,points)=>{ctx.strokeStyle=c;ctx.lineWidth=width*s;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...P(...p)):ctx.moveTo(...P(...p)));ctx.stroke()};
 const shape=(c,points)=>{ctx.fillStyle=c;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...P(...p)):ctx.moveTo(...P(...p)));ctx.fill()};
 const box=(c,x,y,w,h)=>{ctx.fillStyle=c;const p=P(x,y);ctx.fillRect(...p,w*s,h*s)};
 const oval=(c,x,y,w,h)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(...P(x,y),w*s,h*s,0,0,Math.PI*2);ctx.fill()};
 const phase=now/400;
 if(id===4){
  shape('#ba9cff',[[39,-34],[66,-34],[72,-28],[72,-3],[39,-3]]);box('#503a77',40,-30,30,27);line('#ffe0ba',3,[[53,-30],[53,-3]]);
  box('#ffffff',57,-21,11,11);for(let i=0;i<4;i++)box('#322144',58+i*2,-20,1,8);
  shape('#27ead522',[[29,-39],[69,-31],[69,-9],[29,-34]]);line('#27ead5',2,[[30,-37],[69,-29+(Math.sin(phase)+1)*9]]);box(dark,22,-43,12,10);box(accent,28,-41,4,5);
 }
 if(id===5){
  line(dark,3,[[25,-2],[31,-7],[40,-3],[49,-12],[59,-5],[64,-12],[74,-6],[70,-2]]);box(metal,50,-22,23,17);box(dark,54,-18,15,8);line(accent,2,[[30,-14],[25,-9],[30,-4]]);line(accent,2,[[42,-14],[37,-9],[42,-4]]);
 }
 if(id===6){
  line(shine,4,[[55,-45],[55,-2]]);line(accent,3,[[45,-30],[65,-30]]);
  const wipe=26+Math.sin(now/250)*4;line(shine,5,[[8,-53],[34,-55],[wipe,-78]]);shape('#ffe0ba',[[wipe-6,-84],[wipe+5,-83],[wipe+6,-74],[wipe-5,-73]]);
  const sparkle=now/220;line('#ffffff',1,[[17+Math.sin(sparkle)*3,-92],[17+Math.sin(sparkle)*3,-85]]);line('#ffffff',1,[[14,-89],[21,-89]]);
 }
 if(id===7){for(let i=0;i<5;i++){const rise=(now/60+i*13)%65;ctx.strokeStyle=accent;ctx.lineWidth=s;ctx.beginPath();ctx.ellipse(...P(28+i*3,-30-rise),s*(2+i%3),s*(2+i%3),0,0,Math.PI*2);ctx.stroke()}}
 if(id===8){
  oval('#141b2c',45,-2,31,5);oval(accent,45,-9,30,5);line(shine,2,[[24,-7],[66,-7]]);
  for(const x of [25,65]){oval(shine,x,-2,5,5);oval(dark,x,-2,2,2)}
  const turn=now/120;line(shine,3,[[34,-16],[26,-4]]);line('#27ead5',2,[[25,-2],[25+Math.cos(turn)*4,-2+Math.sin(turn)*4]]);
 }
 if(id===9){
  oval('#ffb74d22',48,-3,30,8);line('#876022',6,[[31,-3],[64,-10]]);line('#60431f',6,[[32,-10],[64,-3]]);
  const flicker=Math.sin(now/110)*4;
  shape('#ff5a36',[[34,-7],[31,-20],[40,-17],[44,-43-flicker],[51,-29],[58,-35+flicker],[66,-16],[61,-7]]);
  shape('#ffb74d',[[39,-7],[37,-19],[46,-32],[50,-19],[58,-26],[60,-10]]);shape('#fff1a5',[[45,-8],[44,-17],[49,-25],[54,-14],[54,-8]]);
  for(let i=0;i<3;i++){const rise=(now/40+i*11)%38;box('#ffb74d',45+i*5,-26-rise,2,3)}
 }
 if(id===11){
  oval('#fff4d5',43,-17,15,21);shape('#27ead5',[[29,-24],[35,-27],[40,-22],[47,-28],[52,-22],[57,-25],[57,-11],[29,-11]]);
  line('#746b53',1.5,[[29,-24],[35,-27],[40,-22],[47,-28],[52,-22],[57,-25]]);
  const peek=Math.max(0,Math.sin(now/850))*10;oval(metal,44,-25-peek,10,8);oval('#11172b',47,-27-peek,2,2);shape(shine,[[31,-35],[35,-46],[47,-49],[55,-40],[50,-34],[43,-38],[37,-33]]);
  line(metal,5,[[20,-35],[28,-22],[33,-20]]);
 }
 if(id===12){
  const hover=Math.sin(phase)*3;shape('#d4b3ff',[[35,-38+hover],[49,-43+hover],[63,-38+hover],[63,-22+hover],[49,-27+hover],[35,-22+hover]]);line('#654495',2,[[49,-43+hover],[49,-27+hover]]);
  for(let i=0;i<3;i++){line('#654495',1,[[38,-34+hover+i*3],[46,-37+hover+i*3]]);line('#654495',1,[[52,-37+hover+i*3],[60,-34+hover+i*3]])}
  for(let i=0;i<3;i++){const a=phase+i*2;oval(accent,49+Math.cos(a)*22,-49+Math.sin(a)*9,2,2)}
 }
 if(id===13){
  shape(metal,[[22,-31],[69,-31],[62,-13],[30,-13]]);oval(shine,45,-31,24,7);oval('#b97536',45,-31,20,4);
  line('#ffd68a',2,[[41,-31],[38,-38],[37,-48+Math.sin(phase)*3],[33,-51+Math.sin(phase)*3]]);line('#ffd68a',2,[[48,-31],[44,-39],[41,-49+Math.sin(phase)*3]]);
  line(dark,2,[[49,-43+Math.sin(phase)*3],[32,-51+Math.sin(phase)*3]]);line(dark,2,[[52,-40+Math.sin(phase)*3],[34,-49+Math.sin(phase)*3]]);
  for(let i=0;i<3;i++){const rise=(now/80+i*9)%30;line('#ffffff88',1,[[52+i*5,-36-rise],[54+i*5,-41-rise],[51+i*5,-47-rise]])}
 }

 if(id===14){
  shape('#ddd4f7',[[25,-45],[39,-48],[51,-44],[66,-47],[66,-22],[51,-19],[39,-23],[25,-20]]);
  line('#744193',1,[[39,-48],[39,-23],[51,-19],[51,-44]]);line('#744193',1,[[29,-38],[35,-34],[44,-39],[57,-30],[62,-32]]);
  const px=45+Math.sin(now/700)*8;oval(accent,px,-33,3,3);line(accent,1,[[px,-33],[px,-27]]);
 }
 if(id===15){
  for(const [color,rx,ry]of [['#27ead5',25,10],['#b782ff',15,22]]){ctx.strokeStyle=color;ctx.lineWidth=s;ctx.beginPath();ctx.ellipse(...P(53,-40),rx*s,ry*s,0,0,Math.PI*2);ctx.stroke()}oval('#ff2397',53,-40,4,4);
  for(let i=0;i<3;i++){const a=now/900+i*2;oval(i%2?'#b782ff':'#27ead5',53+Math.cos(a)*22,-40+Math.sin(a)*9,3,3)}
  shape('#27ead522',[[30,-16],[76,-16],[53,-42]]);box(dark,35,-16,39,8);
 }
 if(id===16){
  oval(dark,51,-27,25,9);box(metal,27,-27,48,19);oval(shine,51,-27,24,8);oval(accent,51,-27,17,5);line(dark,3,[[38,-9],[34,0]]);line(dark,3,[[64,-9],[69,0]]);
  const hit=Math.sin(now/110),other=Math.cos(now/130);line('#ffe0ba',2,[[35,-38+hit*9],[47,-28-hit*11]]);line('#ffe0ba',2,[[12,-42+other*8],[61,-29-other*12]]);
  if(hit>.7){line('#ff2397',1,[[46,-35],[42,-40]]);line('#27ead5',1,[[51,-35],[54,-42]])}
 }
 ctx.font=Math.round(12*s)+'px Arial';ctx.fillStyle=accent;ctx.fillText({delivery:'PARCEL SCAN',rewind:'REWINDING',polish:'VISOR POLISH',bubbles:'DECOMPRESS',boardspin:'WHEEL CHECK',campfire:'WARMING UP',fade:'DEEP SLEEP',egg:'HATCHING',conjure:'SPELL STUDY',noodles:'NOODLE BREAK',route:'ROUTE CHECK',starchart:'STAR CHART',drums:'SOUND CHECK'}[idle],rx-35*s,ground+28*s);
}
