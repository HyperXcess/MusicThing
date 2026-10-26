export const runnerBodies=[
 {kind:'chrome armor',width:12,arm:6,leg:8,boot:'#566a7c'},
 {kind:'gold jacket',width:15,arm:7,leg:8,boot:'#a47c2d'},
 {kind:'neko suit',width:9,arm:5,leg:6,boot:'#743e8e'},
 {kind:'space suit',width:16,arm:9,leg:10,boot:'#d1dde8'},
 {kind:'courier jacket',width:12,arm:7,leg:7,boot:'#41304f'},
 {kind:'cassette torso',width:14,arm:5,leg:6,boot:'#a5517c'},
 {kind:'knight armor',width:17,arm:9,leg:10,boot:'#728ca8'},
 {kind:'diving suit',width:18,arm:10,leg:11,boot:'#735529'},
 {kind:'skater hoodie',width:13,arm:7,leg:6,boot:'#f09bc8'},
 {kind:'cowboy vest',width:13,arm:6,leg:8,boot:'#8c5c3d'},
 {kind:'ghost shroud',width:17,arm:5,leg:0,boot:'#d2c5f7'},
 {kind:'dinosaur',width:16,arm:7,leg:10,boot:'#407d61'},
 {kind:'wizard robe',width:14,arm:9,leg:5,boot:'#523778'},
 {kind:'chef apron',width:15,arm:7,leg:7,boot:'#bc6860'},
 {kind:'sprint suit',width:10,arm:5,leg:7,boot:'#f18fb8'},
 {kind:'captain uniform',width:13,arm:7,leg:8,boot:'#d1e7ef'},
 {kind:'arcade jacket',width:11,arm:6,leg:7,boot:'#7853a4'}
];
export function paintRunnerBody({ctx,P,s,id,headX,hipY,now,colors}){const [metal,shine,dark,accent]=colors,b=runnerBodies[id],x=headX*.5,top=hipY-26;
 const shape=(points,color)=>{ctx.beginPath();points.forEach(([a,z],i)=>i?ctx.lineTo(...P(a,z)):ctx.moveTo(...P(a,z)));ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#171324';ctx.lineWidth=s*1.2;ctx.stroke()},line=(points,color,width=1.5)=>{ctx.beginPath();points.forEach(([a,z],i)=>i?ctx.lineTo(...P(a,z)):ctx.moveTo(...P(a,z)));ctx.strokeStyle=color;ctx.lineWidth=width*s;ctx.stroke()},oval=(a,z,rx,ry,color)=>{ctx.beginPath();ctx.ellipse(...P(a,z),rx*s,ry*s,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()};
 if(id===2){line([[-8,hipY-4],[-29,hipY-8],[-35,hipY-24+Math.sin(now/180)*4]],metal,5)}
 if(id===3||id===7){shape([[x-b.width-6,top+4],[x-b.width-1,top+3],[-b.width-1,hipY],[-b.width-8,hipY-2]],dark)}
 if(id===11){shape([[-10,hipY],[-35,hipY+6],[-49,hipY-3],[-29,hipY-6],[-10,hipY-15]],metal);for(let j=0;j<4;j++)shape([[-16-j*7,hipY-6],[-19-j*7,hipY-17+j*2],[-24-j*7,hipY-3]],accent)}
 if(id===12||id===15)shape([[x-b.width,top],[-b.width-12,hipY+7+Math.sin(now/200)*3],[4,hipY+4],[x+2,top+5]],id===12?dark:'#7d93b4');
 shape([[x-b.width,top+3],[x+b.width*.75,top],[b.width,hipY+3],[-b.width,hipY+3]],metal);
 if(id===0){shape([[x-8,top+6],[x+7,top+5],[7,hipY-5],[-8,hipY-3]],shine);line([[x-5,top+11],[x+6,top+10]],accent,3);oval(-5,hipY-4,3,3,dark)}
 if(id===1){shape([[x-14,top],[x-6,top+2],[-2,hipY+2],[-14,hipY+2]],dark);shape([[x+8,top],[x+13,top+2],[14,hipY+2],[5,hipY+2]],shine);line([[x,top+3],[1,hipY]],'#fce3a3',1);line([[-10,hipY-5],[10,hipY-5]],accent,2)}
 if(id===2){shape([[x-6,top+8],[x+5,top+6],[7,hipY-3],[-5,hipY-1]],'#b18cce');line([[-8,hipY-16],[-3,hipY-14]],dark,2);line([[-7,hipY-8],[-2,hipY-6]],dark,2)}
 if(id===3){oval(x,top+12,12,10,shine);shape([[-9,hipY-13],[8,hipY-13],[9,hipY-3],[-8,hipY-3]],dark);line([[-6,hipY-9],[5,hipY-9]],accent,2)}
 if(id===4){shape([[x-11,top],[x-3,top+7],[-2,hipY+3],[-13,hipY+2]],dark);line([[x-8,top+1],[10,hipY-2]],accent,3);shape([[-15,hipY-11],[0,hipY-12],[1,hipY+3],[-14,hipY+4]],'#8d69a8')}
 if(id===5){shape([[x-10,top+6],[x+10,top+5],[11,hipY-3],[-11,hipY-2]],dark);for(const a of [-5,5])oval(x+a,top+15,4,4,shine);line([[x-9,top+7],[x+9,top+7]],accent,1);shape([[-5,hipY-8],[5,hipY-8],[7,hipY-3],[-7,hipY-3]],shine)}
 if(id===6){shape([[x-13,top+5],[x+12,top+3],[9,hipY-6],[-7,hipY-4]],shine);line([[x+2,top+5],[0,hipY-4]],dark,2);for(const a of [-1,1])oval(x+a*15,top+4,7,5,metal)}
 if(id===7){oval(x,top+16,14,14,'#a57436');oval(x+3,top+14,8,8,dark);line([[x,top+7],[x+6,top+15]],accent,2);for(let j=0;j<5;j++)oval(-11+j*5,hipY-2,1.5,1.5,shine)}
 if(id===8){shape([[x-10,top+6],[x+7,top+6],[7,hipY-1],[-9,hipY]],dark);line([[x-3,top+4],[-2,hipY-7]],shine,1);shape([[-11,hipY-4],[11,hipY-4],[12,hipY+5],[-11,hipY+5]],'#315a66')}
 if(id===9){shape([[x-12,top],[x-5,top+4],[-4,hipY],[-13,hipY]],dark);shape([[x+7,top],[x+11,top+2],[13,hipY],[6,hipY]],dark);line([[-12,hipY-3],[13,hipY-3]],'#603d35',4);oval(2,hipY-3,3,3,'#dfb25d')}
 if(id===10){shape([[x-15,top],[-21,hipY+7],[-12,hipY+2],[-5,hipY+10],[4,hipY+4],[13,hipY+8],[18,hipY+1],[x+12,top]],'#d2c5f7');line([[x-7,top+5],[-9,hipY]],'#f7eeff',1)}
 if(id===11){oval(2,hipY-11,12,15,shine);for(let j=0;j<3;j++)line([[-6,hipY-19+j*8],[10,hipY-20+j*8]],dark,1)}
 if(id===12){shape([[x-12,top],[-22,hipY+10],[18,hipY+8],[x+11,top]],metal);line([[x,top+4],[-4,hipY+7]],shine,2);for(const [a,z]of [[-12,hipY-6],[5,hipY],[-5,hipY-20]]){line([[a-2,z],[a+2,z]],accent,1);line([[a,z-2],[a,z+2]],accent,1)}}
 if(id===13){shape([[x-7,top+3],[x+7,top+3],[13,hipY+5],[-13,hipY+5]],'#ffddbb');line([[x-10,top+10],[x+8,top+8]],dark,2);shape([[-5,hipY-10],[7,hipY-10],[8,hipY],[-5,hipY]],metal)}
 if(id===14){shape([[x-7,top+5],[x+5,top+4],[7,hipY-4],[-7,hipY-2]],dark);line([[x-7,top+3],[-7,hipY+2]],'#ffe3cf',2);line([[x+5,top+3],[8,hipY+2]],accent,2)}
 if(id===15){shape([[x-10,top+4],[x+8,top+3],[9,hipY],[-9,hipY]],'#eaf5f7');line([[x-9,top+6],[9,hipY]],'#476379',3);line([[-12,hipY-2],[13,hipY-2]],dark,3);oval(x+5,top+10,2,2,accent)}
 if(id===16){shape([[x-10,top],[x-1,top+9],[-1,hipY],[-12,hipY]],dark);shape([[x+2,top+9],[x+9,top],[13,hipY],[3,hipY]],'#9d7ac7');line([[x-8,top+7],[-7,hipY-5]],accent,2);shape([[0,hipY-12],[6,hipY-8],[1,hipY-4],[-4,hipY-8]],accent)}
 return b.kind;
}
export function paintRunnerBoot({plate,id,foot,color}){if(id===10)return;const x=foot[0],y=foot[1],long=id===3||id===7?13:id===9?16:11,height=id===6||id===7?9:6;plate(color,[[x-5,y-height],[x+long-5,y-height],[x+long,y-2],[x+long-1,y+1],[x-5,y+1]])}
