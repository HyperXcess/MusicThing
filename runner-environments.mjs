export const runnerEnvironments=['Chrome City','Disco Sunset','Moonlit Kyoto','Lunar Outpost','Circuit District','Tape Hills','Wireframe Keep','Sunken City','Neon Skatepark','Twin Sun Desert','Vapor Ruins','Jurassic Valley','Crystal Spires','Lantern Market','Neon Rooftops','Orbital Hangar','Synth Stage'];
export function drawRunnerEnvironment(ctx,w,h,travel,character){
 const alpha=ctx.globalAlpha??1;ctx.globalAlpha=alpha*.15;const ground=h*.83;
 // A few pixels of counter-motion; the scenery stays distant and never sweeps past.
 const drift=w*.035*Math.sin(travel/(w*4));
 const line=(color,width,points)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x+drift,y):ctx.moveTo(x+drift,y));ctx.stroke()};
 const shape=(color,points)=>line(color,1.5,[...points,points[0]]);
 const rect=(color,x,y,width,height)=>shape(color,[[x,y],[x+width,y],[x+width,y+height],[x,y+height]]);
 const oval=(color,x,y,rx,ry,rotation=0)=>{ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x+drift,y,rx,ry,rotation,0,Math.PI*2);ctx.stroke()};
 try{
  if(character===0){
   for(let i=0;i<12;i++){const x=i*(w+120)/12-60,height=h*(.25+(i*17%33)/100),width=w*.055;
    shape('#95c9ed',[[x,ground],[x,ground-height],[x+width*.5,ground-height-20],[x+width,ground-height],[x+width,ground]]);
    line('#27ead5',1,[[x+width*.5,ground-height-20],[x+width*.5,ground-height-40]]);
    for(let y=ground-height+14;y<ground;y+=24)line('#95c9ed',1,[[x+6,y],[x+width-6,y]]);
   }
   line('#27ead5',1.5,[[-w*.04,h*.49],[w*1.04,h*.43]]);line('#b782ff',1,[[-w*.04,h*.51],[w*1.04,h*.45]]);
  }else if(character===1){
   const sx=w*.69,sy=h*.30,r=h*.24;oval('#ff2397',sx,sy,r,r);
   for(let i=0;i<7;i++){const y=sy+i*r/8,half=Math.sqrt(r*r-(y-sy)*(y-sy));line('#ff2397',1,[[sx-half,y],[sx+half,y]])}
   for(const x of [w*.10,w*.88]){const top=h*.34;line('#b782ff',2,[[x,ground],[x+10,top]]);for(let i=0;i<5;i++){const a=i/4*Math.PI;line('#b782ff',1.5,[[x+10,top],[x+10+Math.cos(a)*w*.09,top-Math.sin(a)*h*.10],[x+10+Math.cos(a)*w*.13,top+10]])}}
   line('#27ead5',1,[[-w*.04,h*.60],[w*.25,h*.45],[w*.45,h*.61],[w*.66,h*.50],[w*1.04,h*.62]]);
  }else if(character===2){
   oval('#d0baff',w*.76,h*.24,h*.16,h*.16);
   for(let i=0;i<4;i++){const x=i*w*.32-30,width=w*.16,base=ground-i%2*15;
    rect('#b782ff',x+width*.25,base-h*.17,width*.5,h*.17);
    for(let tier=0;tier<3;tier++){const y=base-h*.17-tier*h*.075,span=width*(1-tier*.18);shape('#c7afd9',[[x+width/2,y-h*.07],[x+width/2+span*.6,y],[x+width/2+span*.7,y-5],[x+width/2+span*.45,y+8],[x+width/2-span*.45,y+8],[x+width/2-span*.7,y-5],[x+width/2-span*.6,y]])}
   }
   const x=w*.48;line('#ff2397',2,[[x-25,ground],[x-25,h*.48],[x+25,h*.48],[x+25,ground]]);line('#ff2397',2,[[x-40,h*.45],[x,h*.47],[x+40,h*.45]]);
  }else if(character===3){
   for(let i=0;i<28;i++){const x=((i*137)%997)/997*w,y=((i*71)%211)/211*h*.65;line(i%3?'#c7afd9':'#27ead5',1,[[x-2,y],[x+2,y]]);if(i%4===0)line('#c7afd9',1,[[x,y-2],[x,y+2]])}
   oval('#b782ff',w*.73,h*.25,h*.16,h*.16);oval('#27ead5',w*.73,h*.25,h*.26,h*.045,-.25);
   const terrain=[];for(let i=-1;i<=13;i++)terrain.push([i*w/12,ground-h*.12-(i*17%29)/29*h*.09]);line('#b6b6e9',1.5,terrain);
   for(let i=0;i<5;i++)oval('#b6b6e9',i*w*.25,ground-h*.08,20+i*3,5+i);
   const x=w*.49;oval('#d0d7ed',x,ground-h*.08,w*.09,h*.13);line('#27ead5',1,[[x-w*.08,ground-h*.08],[x+w*.08,ground-h*.08]]);
  }else if(character===4){
   for(let i=0;i<8;i++){const x=i*w/7,y=h*(.2+(i%3)*.15);line('#27ead5',1.5,[[x,ground],[x,y],[x+25,y-20],[x+65,y-20]]);oval('#b782ff',x+65,y-20,4,4);rect('#b782ff',x-10,y+20,20,35)}
  }else if(character===5){
   for(const x of [w*.18,w*.74]){oval('#ff2397',x,h*.36,h*.18,h*.18);oval('#b782ff',x,h*.36,h*.065,h*.065);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;line('#ff2397',1,[[x+Math.cos(a)*h*.09,h*.36+Math.sin(a)*h*.09],[x+Math.cos(a)*h*.15,h*.36+Math.sin(a)*h*.15]])}}
   line('#27ead5',2,[[0,ground-h*.1],[w*.18,h*.55],[w*.4,h*.73],[w*.6,h*.52],[w,h*.65]]);
  }else if(character===6){
   for(let i=0;i<6;i++){const x=i*w/5-20,top=h*(i%2?.4:.28);rect('#c7afd9',x,top,w*.12,ground-top);for(let j=0;j<3;j++)rect('#b782ff',x+j*w*.04,top-14,w*.023,14);oval('#27ead5',x+w*.06,top+35,6,12)}line('#b782ff',1,[[0,h*.6],[w,h*.6]]);
  }else if(character===7){
   for(let i=0;i<7;i++){const x=i*w/6;line('#27ead5',2,[[x,ground],[x+5,h*.62],[x-12,h*.54]]);line('#27ead5',1,[[x+5,h*.62],[x+20,h*.55]]);oval('#b782ff',x+25,h*.22+(i%3)*h*.1,15,8);for(let j=0;j<3;j++)line('#b782ff',1,[[x+15+j*10,h*.24+(i%3)*h*.1],[x+12+j*10,h*.36+(i%3)*h*.1]])}rect('#c7afd9',w*.4,h*.56,w*.22,h*.27);
  }else if(character===8){
   line('#27ead5',2,[[0,h*.53],[w*.15,h*.53],[w*.3,ground],[w*.55,ground],[w*.72,h*.53],[w,h*.53]]);line('#ff2397',2,[[w*.35,h*.65],[w*.62,h*.65]]);line('#b782ff',1,[[w*.35,h*.65],[w*.35,ground],[w*.62,ground],[w*.62,h*.65]]);for(let i=0;i<4;i++)shape('#b782ff',[[i*w*.25,h*.27],[i*w*.25+20,h*.2],[i*w*.25+60,h*.3],[i*w*.25+30,h*.36]]);
  }else if(character===9){
   oval('#ffb74d',w*.68,h*.23,h*.13,h*.13);oval('#ff2397',w*.84,h*.36,h*.08,h*.08);line('#b782ff',1.5,[[0,ground],[w*.15,h*.55],[w*.27,h*.55],[w*.35,ground],[w*.6,h*.62],[w*.78,h*.62],[w,ground]]);for(const x of [w*.1,w*.5])line('#27ead5',2,[[x,ground],[x,h*.57],[x-12,h*.57],[x-12,h*.48],[x-12,h*.57],[x,h*.57],[x,h*.42],[x,h*.64],[x+15,h*.64],[x+15,h*.55]]);
  }else if(character===10){
   oval('#ff2397',w*.7,h*.28,h*.16,h*.16);for(let i=0;i<6;i++){const x=i*w*.2;rect('#c7afd9',x,h*.4,w*.06,h*.43);line('#b782ff',2,[[x-5,h*.39],[x+w*.075,h*.39]]);for(let j=0;j<3;j++)line('#b782ff',1,[[x+8+j*6,h*.43],[x+8+j*6,ground]])}for(let i=0;i<12;i++)line('#27ead5',1,[[i*w/10,ground],[i*w/10+w*.1,h]]);
  }else if(character===11){
   shape('#ff2397',[[w*.4,ground],[w*.62,h*.23],[w*.87,ground]]);line('#ffb74d',2,[[w*.57,h*.34],[w*.62,h*.37],[w*.67,h*.34]]);for(let i=0;i<8;i++){const x=i*w/7;line('#27ead5',2,[[x,ground],[x,h*.4]]);for(let j=0;j<3;j++)line('#27ead5',1,[[x,h*.4+j*12],[x-22,h*.35+j*12],[x,h*.41+j*12],[x+22,h*.35+j*12]])}
  }else if(character===12){
   for(let i=0;i<7;i++){const x=i*w/6,z=h*(.25+(i%3)*.1);shape('#b782ff',[[x-15,ground],[x-20,z+25],[x,z],[x+20,z+25],[x+15,ground]]);line('#27ead5',1,[[x,z],[x,ground]]);shape('#27ead5',[[x+35,z-25],[x+42,z-35],[x+49,z-25],[x+42,z-15]])}
  }else if(character===13){
   line('#b782ff',1,[[0,h*.26],[w*.5,h*.38],[w,h*.26]]);for(let i=0;i<10;i++){const x=i*w/9,y=h*(.26+Math.sin(i/9*Math.PI)*.12);oval('#ff2397',x,y+20,11,15);line('#ffb74d',1,[[x,y+35],[x,y+43]])}for(let i=0;i<5;i++){const x=i*w*.25;rect('#b782ff',x,h*.61,w*.18,h*.22);shape('#27ead5',[[x-5,h*.61],[x+12,h*.52],[x+w*.16,h*.52],[x+w*.2,h*.61]])}
  }else if(character===14){
   for(let i=0;i<7;i++){const x=i*w/6,top=h*(.37+(i%3)*.09);rect('#b782ff',x,top,w*.12,ground-top);line('#27ead5',1,[[x+w*.06,top],[x+w*.06,top-36],[x+w*.10,top-36]]);for(let j=0;j<3;j++)rect('#ff2397',x+8+j*15,top+14,7,12)}
   line('#27ead5',1,[[0,h*.30],[w*.35,h*.40],[w*.7,h*.26],[w,h*.36]]);
  }else if(character===15){
   oval('#b782ff',w*.72,h*.28,h*.16,h*.16);oval('#27ead5',w*.72,h*.28,h*.25,h*.04,-.2);
   for(const x of [w*.07,w*.89]){line('#c7e4ee',2,[[x,ground],[x,h*.22],[x+w*.04,h*.18],[x+w*.08,h*.22],[x+w*.08,ground]])}
   shape('#27ead5',[[w*.43,h*.58],[w*.56,h*.42],[w*.69,h*.58],[w*.60,h*.57],[w*.56,h*.65],[w*.52,h*.57]]);line('#b782ff',1,[[w*.18,ground],[w*.35,h*.67],[w*.80,h*.67],[w*.95,ground]]);
  }else if(character===16){
   for(const x of [w*.08,w*.85]){rect('#b782ff',x,h*.34,w*.09,h*.48);oval('#27ead5',x+w*.045,h*.48,20,20);oval('#ff2397',x+w*.045,h*.68,27,27)}
   line('#b782ff',2,[[0,h*.18],[w,h*.18]]);for(let i=0;i<7;i++){const x=i*w/6;shape('#ff2397',[[x,h*.18],[x-10,h*.24],[x+10,h*.24]]);line('#27ead5',1,[[x-10,h*.24],[x-35,h*.60],[x+35,h*.60],[x+10,h*.24]])}
  }

 }finally{ctx.globalAlpha=alpha}
 return runnerEnvironments[character];
}
