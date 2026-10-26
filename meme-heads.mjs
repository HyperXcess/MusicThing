export function paintMemeHead(ctx,{kind,blink=false,rest=false,clock=0,energy=0}){
 const ink='#24202a',path=(points,fill,stroke=ink,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;){if(i+2<points.length){ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);i+=3}else{ctx.lineTo(...points[i]);i++}}if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke()}};
 const oval=(x,y,rx,ry,color,stroke=ink,width=2)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}};
 const line=(p,color=ink,width=2)=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()};
 if(kind==='deadpan'){
  path([[ -29,-46],[-35,-60],[-50,-80],[-48,-107],[-48,-148],[-17,-151],[10,-147],[42,-145],[51,-121],[49,-104],[59,-87],[46,-62],[23,-45],[7,-35],[-13,-39],[-29,-46]],'#f0efec');
  for(const [y,w]of [[-122,30],[-113,34],[-103,23]])line([[-w,y],[-9,y-3],[12,y-1],[w,y+3]],'#62605f',1.2);
  for(const [x,y]of [[-19,-91],[28,-88]]){if(blink)line([[x-11,y],[x+11,y]],ink,1.5);else{path([[x-12,y],[x-7,y-7],[x+6,y-7],[x+12,y],[x+6,y+5],[x-6,y+4],[x-12,y]],'#fff');oval(x+3,y,4,5,'#16151a',null)}line([[x-12,y-12],[x-2,y-16],[x+9,y-12]],'#555052',1.2)}
  path([[21,-81],[20,-73],[30,-66],[20,-61],[14,-60],[16,-55],[11,-55]],null);line([[-1,-57],[-9,-57],[-10,-61]],ink,1.5);line([[-12,-44],[-6,-46],[8,-44],[24,-44]],ink,1.5);path([[-36,-75],[-42,-61],[-31,-54],[-30,-44]],null,'#6c6767',1.4);
 }else if(kind==='zest'){
  oval(0,-91,53,48,'#ec8b21','#7f4b23',2.5);oval(-15,-110,29,23,'#f5a33b',null);for(let j=0;j<55;j++){const a=j*2.399,r=12+j%12*3;oval(Math.cos(a)*r,-91+Math.sin(a)*r*.8,.75,.65,j%2?'#d67d20':'#ffc15b',null)}
  for(const x of [-22,22]){if(blink)line([[x-12,-103],[x+12,-103]],'#6a492b',2);else{oval(x,-104,14,8,'#f0ead5','#9d662b',1.5);oval(x+2,-104,6.5,7,'#7f9579',null);oval(x+2,-104,3,5,'#26292b',null);oval(x,-107,1.8,1.8,'#fff',null)}}
  const laugh=!rest?Math.max(0,Math.sin(clock/160))*Math.min(1,energy*2)*5:0;oval(0,-72,32,16+laugh,'#281e1c','#a65e24',3);for(let i=0;i<8;i++)oval(-24+i*7,-78+Math.abs(i-3.5)*.8,3.8,6.5,'#fff0a4','#bfa56f',.7);path([[-8,-139],[-3,-149],[3,-144],[8,-140]],'#729349','#43552d',1.5);
 }else if(kind==='chiseled'){
  path([[-36,-45],[-45,-62],[-28,-75],[-42,-84],[-52,-91],[-49,-123],[-39,-134],[-24,-154],[23,-151],[40,-135],[50,-123],[35,-113],[43,-101],[53,-85],[31,-71],[38,-54],[45,-35],[25,-23],[5,-22],[-27,-28],[-36,-45]],'#83c6a2');
  path([[-27,-121],[-35,-112],[-14,-104],[-10,-113]],null,'#365343',2);path([[22,-127],[36,-115],[21,-107],[20,-96]],null,'#365343',2);
  for(const [x,y]of [[-16,-100],[23,-97]]){oval(x,y,12,9,'#ddd794','#385a43',1.7);if(blink)line([[x-11,y],[x+11,y]],'#3a533f',2);else{oval(x+2,y+1,4,5,'#b25c64',null);path([[x-13,y-3],[x-4,y-12],[x+10,y-9],[x+12,y-2]],'#83c6a2','#294c3c',1.8)}}
  path([[10,-95],[2,-85],[17,-72],[11,-66],[2,-67],[-2,-72],[-8,-71]],null,'#34533f',2);path([[-8,-60],[4,-69],[12,-61],[22,-58],[10,-48],[0,-48],[-8,-60]],'#a0c8a6');line([[-7,-59],[4,-57],[12,-59],[20,-58]],'#3d5946',1.5);path([[4,-45],[23,-43],[4,-29],[-3,-33]],null,'#4e795f',2);line([[-27,-87],[-32,-72],[-27,-63]],'#477456',2);line([[31,-84],[24,-77],[29,-70]],'#477456',2);path([[-35,-127],[-28,-140],[-13,-143],[-6,-142]],null,'#b1e1bd',4);
 }
 // Small side-mounted headphones leave each reference silhouette visible.
 ctx.beginPath();ctx.ellipse(0,-101,55,45,0,Math.PI,Math.PI*2);ctx.strokeStyle='#3b2d49';ctx.lineWidth=4;ctx.stroke();for(const side of [-1,1]){oval(side*51,-91,7,14,'#30263d');line([[side*52,-99],[side*52,-83]],kind==='zest'?'#ff2397':'#b782ff',2)}
}
