export const targetThemes=[
 {name:'Bamboo bundles',colors:['#78c98e','#e2f6ba','#6c9860']},
 {name:'Temple stone seals',colors:['#b7abc9','#f1d9ac','#7e718c']},
 {name:'Origami cranes',colors:['#ff8ac7','#dbedff','#b782ff']},
 {name:'Flame lanterns',colors:['#ff764c','#ffd27c','#ff2397']},
 {name:'Sparring drones',colors:['#27ead5','#d8ecff','#8195b1']},
 {name:'Katana training targets',colors:['#e9ce89','#fff3ba','#b48a54']}
];
export function paintTarget(ctx,target,id,now){
 const {x,y,size}=target,r=size*.85,p=targetThemes[id].colors;
 const path=(points,color,width=1.5,fill)=>{ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(x+a*r,y+b*r):ctx.moveTo(x+a*r,y+b*r));if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()};
 const oval=(dx,dy,rx,ry,color,fill)=>{ctx.beginPath();ctx.ellipse(x+dx*r,y+dy*r,rx*r,ry*r,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke()};

 const variant=target.variant||0;
 if(id===5){if(variant===0){path([[-.5,-1],[.5,-1],[.5,1],[-.5,1],[-.5,-1]],p[0],2,'#74613a');for(const yy of [-.65,0,.65])path([[-.5,yy],[.5,yy]],p[1],2)}else if(variant===1){oval(0,0,.85,.85,p[0],'#80483c');oval(0,0,.55,.55,p[1]);oval(0,0,.2,.2,p[0],p[0])}else{path([[0,-1.2],[.7,-.4],[.45,.7],[0,1.2],[-.45,.7],[-.7,-.4],[0,-1.2]],p[0],2,'#4c5968');path([[-.55,-.2],[.55,-.2]],p[1],2);oval(-.25,-.1,.15,.13,p[1]);oval(.25,-.1,.15,.13,p[1])}return}

 if(variant){
  if(id===0&&variant===1){path([[-.25,-1.2],[.25,-1.2],[.25,1.2],[-.25,1.2]],'#e9cc91',2,'#705035');path([[-.25,-.25],[-1,-.5]],'#e9cc91',4);path([[.25,.1],[1,-.15]],'#e9cc91',4);path([[-.25,.65],[-.8,.9]],'#e9cc91',3)}
  if(id===0&&variant===2){oval(0,0,.9,.9,p[0],'#344e34');for(let j=0;j<6;j++){const a=j*Math.PI/3;path([[0,0],[Math.cos(a)*.9,Math.sin(a)*.9]],p[1],2)}oval(0,0,.25,.25,'#e9cc91')}
  if(id===1&&variant===1){path([[-.65,.6],[-.55,-.3],[-.3,-.75],[.3,-.75],[.55,-.3],[.65,.6],[-.65,.6]],'#edc77c',2,'#77603e');oval(0,-.9,.19,.2,'#edc77c');path([[-.85,.65],[.85,.65]],'#edc77c',3);oval(0,.85,.15,.15,'#edc77c')}
  if(id===1&&variant===2){for(const [x,y,z]of [[-.45,-.35,.48],[.42,-.2,.5],[0,.5,.6]])path([[x-z,y],[x-z*.5,y-z],[x+z*.6,y-z*.8],[x+z,y+z*.3],[x,y+z],[x-z,y]],p[0],1.6,'#474252')}
  if(id===2&&variant===1){for(let j=0;j<7;j++){const a=j*Math.PI*2/7+now/2200;oval(Math.cos(a)*.55,Math.sin(a)*.55,.32,.5,p[1],'#784865')}oval(0,0,.25,.25,p[0],'#ffe2ad')}
  if(id===2&&variant===2){const open=.9+Math.sin(now/220)*.15;for(let j=0;j<9;j++){const a=-Math.PI+j*Math.PI/8;path([[0,.6],[Math.cos(a)*open,.6+Math.sin(a)*1.4]],j%2?p[0]:p[1],2)}path([[0,.6],[0,1.2]],p[1],3)}
  if(id===3&&variant===1){path([[-.6,-.4],[-1.4,-.8],[-.85,.1],[-1.6,.6],[-.5,.55]],p[0],2,'#ac3e43');oval(.15,0,.65,.65,p[1],'#ed7843');oval(.15,0,.28,.28,'#fff2b2','#fff2b2')}
  if(id===3&&variant===2){oval(0,0,.85,.85,p[0]);oval(0,0,.5,.5,p[1]);for(let j=0;j<8;j++){const a=now/400+j*Math.PI/4;path([[Math.cos(a)*.85,Math.sin(a)*.85],[Math.cos(a+.13)*1.2,Math.sin(a+.13)*1.2]],p[1],2)}}
  if(id===4&&variant===1){oval(0,0,.6,.6,p[0],'#24485a');for(let j=0;j<8;j++){const a=now/800+j*Math.PI/4;path([[Math.cos(a)*.6,Math.sin(a)*.6],[Math.cos(a)*1,Math.sin(a)*1]],p[1],3)}oval(0,0,.2,.2,p[0],p[0])}
  if(id===4&&variant===2){path([[-.7,-.4],[.4,-.4],[.9,0],[.4,.4],[-.7,.4],[-.7,-.4]],p[1],2,'#34485d');path([[-.7,-.25],[-1.1,-.5],[-.9,0],[-1.1,.5],[-.7,.25]],p[0],2);oval(.3,0,.18,.18,p[0],p[0])}
  return;
 }
 if(id===0){for(let j=0;j<3;j++){const a=-.44+j*.43;path([[a-.12,-1.1],[a+.12,-.95],[a+.12,1.1],[a-.12,.97]],p[0],1.5,'#244c38');for(const b of [-.65,0,.65])path([[a-.14,b],[a+.14,b+.05]],p[1])}path([[-.7,-.3],[.7,.3],[-.7,.3],[.7,-.3]],'#e5c793',2)}
 if(id===1){path([[-.8,-.7],[.1,-1],[.85,-.6],[.9,.5],[.2,1],[-.9,.5]],p[0],2,'#302c40');oval(0,0,.56,.56,p[1]);path([[-.3,.25],[0,-.36],[.3,.25],[-.3,.25],[.3,-.05]],p[1],1.4)}
 if(id===2){const flap=Math.sin(now/90)*.28;path([[-.25,.18],[-1.3,-.85-flap],[-.35,-.42],[0,-1],[.4,-.25],[1.2,-.75-flap],[.35,.3],[0,.7],[-.25,.18]],p[1],1.5,'#7a426c');path([[-.25,.18],[0,-1],[.16,.1],[1.2,-.75-flap]],p[0],1.6);path([[.2,.1],[.7,-.2],[.95,-.15],[.7,-.04]],p[1])}
 if(id===3){path([[-.4,-.85],[.4,-.85],[.65,-.5],[.65,.45],[.35,.8],[-.35,.8],[-.65,.45],[-.65,-.5],[-.4,-.85]],p[0],2,'#672741');path([[-.4,-.85],[.4,-.85]],p[1],3);path([[-.35,.8],[.35,.8]],p[1],3);for(const a of [-.3,0,.3])path([[a,-.7],[a,.68]],p[1],1);const f=Math.sin(now/80)*.14;path([[-.22,.4],[-.28,.02],[-.08,.16],[.02,-.4-f],[.24,.1],[.16,.42]],p[1],1.5,'#ff9f45');path([[0,.85],[0,1.35],[.2,1.55]],p[1],2)}
 if(id===4){path([[-.7,-.4],[0,-.8],[.7,-.4],[.7,.4],[0,.8],[-.7,.4],[-.7,-.4]],p[2],2,'#22374b');oval(0,0,.28,.28,p[0],'#17636a');for(const a of [-1,1]){path([[a*.65,0],[a*1.2,-.2]],p[1],2);oval(a*1.2,-.27,.38,.1,p[0]);const spin=Math.sin(now/40)*.35;path([[a*1.2-.35,-.27-spin],[a*1.2+.35,-.27+spin]],p[1],1)} }
}
