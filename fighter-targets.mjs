export const targetThemes=[
 {name:'Stacked training boards',colors:['#c99558','#ffe2ac','#795136']},
 {name:'Temple stone seals',colors:['#a495b5','#e1cdb1','#5f566e']},
 {name:'Jade lanterns',colors:['#53b89b','#caffd8','#dbbc77']},
 {name:'Ember drums',colors:['#d64d55','#ffdb91','#813742']},
 {name:'Overloaded power cores',colors:['#27ead5','#deefff','#60748c']},
 {name:'Bamboo cutting bundles',colors:['#8cb465','#f4e1a6','#586d42']}
];
export function paintTarget(ctx,target,id,now){const{x,y,size}=target,r=size*1.12,p=targetThemes[id].colors,v=target.variant||0;
 ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(now/750+(target.phase||0))*.045);
 const poly=(points,fill,stroke=p[1],width=1.5)=>{ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(a*r,b*r):ctx.moveTo(a*r,b*r));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()};
 const line=(pts,color=p[1],width=1.5)=>{ctx.beginPath();pts.forEach(([a,b],i)=>i?ctx.lineTo(a*r,b*r):ctx.moveTo(a*r,b*r));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()};
 const oval=(x,y,a,b,fill,stroke=p[1])=>{ctx.beginPath();ctx.ellipse(x*r,y*r,a*r,b*r,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()};
 if(id===0){for(let j=2+v;j>=0;j--){const dy=(j-1)*.35,shift=(j-1)*.12;poly([[-.95+shift,dy-.18],[.8+shift,dy-.18],[1+shift,dy-.03],[1+shift,dy+.20],[-.95+shift,dy+.20]],p[0],p[2],2);line([[-.85+shift,dy-.10],[.7+shift,dy-.10]],p[1],2);for(let k=0;k<3;k++)line([[-.65+k*.6+shift,dy+.04],[-.35+k*.6+shift,dy+.04]],p[2],.8)} }
 if(id===1){const count=v===1?8:v===2?4:6,pts=Array.from({length:count},(_,i)=>{const a=i/count*Math.PI*2;return[Math.cos(a)*.88,Math.sin(a)*.98]});poly(pts,'#6c627d',p[2],3);poly(pts.map(([a,b])=>[a*.80,b*.80]),p[0],p[1]);oval(0,0,.50,.50,'#87748d');line([[-.30,.20],[0,-.35],[.30,.20],[-.30,.20],[.30,-.05]],'#ffe6b1',2);line([[-.7,-.5],[-.4,-.35],[-.55,-.1]],p[2],1.5)}
 if(id===2){line([[0,-1.15],[0,-.85]],p[2],2);poly([[-.55,-.77],[.55,-.77],[.79,-.35],[.79,.40],[.48,.81],[-.48,.81],[-.79,.40],[-.79,-.35]],p[0],p[2],2);for(let k=-2-v;k<=2+v;k++)line([[k*.23,-.63],[k*.29,0],[k*.23,.65]],'#b5f7cf',1);poly([[-.6,-.81],[.6,-.81],[.6,-.65],[-.6,-.65]],p[2]);poly([[-.50,.68],[.50,.68],[.50,.84],[-.50,.84]],p[2]);oval(0,0,.23,.30,'#e7ffd2');line([[0,.83],[0,1.12],[-.15,1.30],[.15,1.30]],p[2],2)}
 if(id===3){poly([[-.7,-.56],[.45,-.76],[.88,-.36],[.85,.54],[-.30,.82],[-.75,.43]],p[0],p[2],2);oval(.10,-.22,.70,.52,'#f4d1a0',p[2]);oval(.10,-.22,.54,.38,'#ffebbd','#cf885e');for(let j=0;j<8+v*2;j++){const a=j*Math.PI/(4+v);oval(.10+Math.cos(a)*.61,-.22+Math.sin(a)*.44,.045,.045,p[2],p[2])}for(const a of [-.5,0,.5])line([[a,.18],[a-.15,.62]],'#ffb35e',2);line([[-.5,-.02],[.3,-.48]],p[0],3);line([[-.1,-.48],[.5,-.02]],p[0],3)}
 if(id===4){const angle=now/900;const hex=Array.from({length:6},(_,i)=>[Math.cos(i*Math.PI/3+angle)*.85,Math.sin(i*Math.PI/3+angle)*.85]);poly(hex,'#263448',p[2],3);oval(0,0,.53,.53,'#155a62',p[1]);oval(0,0,.31+.035*Math.sin(now/90),.31+.035*Math.sin(now/90),p[0]);for(let j=0;j<3+v;j++){const a=angle+j*Math.PI*2/(3+v);line([[Math.cos(a)*.57,Math.sin(a)*.57],[Math.cos(a)*.74,Math.sin(a)*.74]],p[0],3)}line([[-.95,-.15],[-1.1,-.40],[-1.2,-.1]],p[0]);line([[.96,.10],[1.12,.35],[1.21,.06]],p[0])}
 if(id===5){for(let j=0;j<4+v;j++){const dx=(j-(3+v)/2)*.26;poly([[dx-.14,-.73],[dx+.13,-.91],[dx+.13,.85],[dx-.14,1]],p[0],p[2],1.5);oval(dx,-.80,.14,.10,p[1],p[2]);for(const yy of [-.32,.32])line([[dx-.12,yy],[dx+.12,yy-.05]],p[1],1)}for(const yy of [-.43,.43]){line([[-.65,yy],[.65,yy]],'#b59b62',3);line([[-.6,yy-.04],[.6,yy-.04]],'#f5df9e',1)}}
 ctx.restore();
}
export function paintTargetDebris(ctx,p,s){ctx.save();ctx.globalAlpha=Math.max(0,1-p.age/.70);ctx.translate(p.x,p.y);ctx.rotate(p.rotation+p.age*p.spin);const r=(p.chunkSize||5)*s;ctx.fillStyle=p.color;ctx.strokeStyle=targetThemes[p.shape].colors[1];ctx.lineWidth=.8;
 if(p.shape===0||p.shape===5){ctx.fillRect(-r,-r*.24,r*2,r*.48);ctx.beginPath();ctx.moveTo(-r*.85,-r*.12);ctx.lineTo(r*.65,-r*.12);ctx.stroke();if(p.shape===5){ctx.beginPath();ctx.moveTo(0,-r*.24);ctx.lineTo(0,r*.24);ctx.stroke()}}
 else if(p.shape===2){ctx.beginPath();ctx.moveTo(-r,-r*.5);ctx.quadraticCurveTo(0,-r,r,r*.4);ctx.lineTo(r*.7,r*.7);ctx.quadraticCurveTo(-r*.2,-r*.2,-r,r*.5);ctx.closePath();ctx.fill()}
 else{ctx.beginPath();ctx.moveTo(-r,-r*.5);ctx.lineTo(r*.3,-r*.8);ctx.lineTo(r,r*.2);ctx.lineTo(0,r*.65);ctx.closePath();ctx.fill();ctx.stroke()}
 ctx.restore();
}
