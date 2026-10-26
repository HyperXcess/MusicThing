// Lightweight paths keep both characters crisp on the original Chromium 69 display.
export function paintFrogRoyal(ctx,{blink=false,rest=false,now=0}={}){
 ctx.save();ctx.translate(-55,-128);ctx.scale(.195,.195);const ink='#263923',green='#689847';
 const path=(draw,fill,stroke=ink,width=7)=>{ctx.beginPath();draw();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}};
 const oval=(x,y,rx,ry,fill)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()};
 // Broad three-quarter silhouette, folded lids and protruding lips from the approved reference.
 path(()=>{ctx.moveTo(9,423);ctx.bezierCurveTo(-42,355,-12,201,42,143);ctx.bezierCurveTo(58,117,68,115,79,119);ctx.bezierCurveTo(95,23,171,-35,253,-5);ctx.bezierCurveTo(289,4,310,23,327,39);ctx.bezierCurveTo(400,-26,474,-12,485,64);ctx.bezierCurveTo(527,75,553,102,566,137);ctx.bezierCurveTo(608,162,573,218,526,236);ctx.bezierCurveTo(536,263,564,283,552,326);ctx.bezierCurveTo(574,347,548,373,535,385);ctx.bezierCurveTo(536,423,465,457,403,470);ctx.bezierCurveTo(220,499,53,474,9,423)},green);
 path(()=>{ctx.moveTo(157,79);ctx.bezierCurveTo(215,31,298,46,332,76);ctx.bezierCurveTo(398,60,463,58,489,70)},null,ink,6);
 for(const [x,w]of [[177,211],[386,195]]){
  if(blink){path(()=>{ctx.moveTo(x,171);ctx.bezierCurveTo(x+48,196,x+w-35,197,x+w,169)},null,ink,8);continue}
  path(()=>{ctx.moveTo(x,167);ctx.bezierCurveTo(x+45,119,x+128,110,x+w,150);ctx.bezierCurveTo(x+w+21,172,x+w-15,199,x+w-53,208);ctx.bezierCurveTo(x+73,223,x+21,203,x,175);ctx.closePath()},'#fff');
  const px=x+100;oval(px,165,39,42,'#050506');oval(px-11,145,7,7,'#fff');oval(px+12,156,8,8,'#fff');oval(px-12,170,4,4,'#fff');
 }
 path(()=>{ctx.moveTo(153,157);ctx.bezierCurveTo(216,144,255,104,330,122);ctx.bezierCurveTo(352,126,376,136,385,145);ctx.bezierCurveTo(438,119,511,120,574,146)},null,green,17);
 path(()=>{ctx.moveTo(166,136);ctx.bezierCurveTo(244,127,287,77,375,112);ctx.bezierCurveTo(409,94,489,91,546,110)},null,ink,5);
 path(()=>{ctx.moveTo(192,210);ctx.bezierCurveTo(260,241,333,227,375,208);ctx.moveTo(398,213);ctx.bezierCurveTo(446,237,501,232,539,215);ctx.moveTo(279,262);ctx.lineTo(345,237);ctx.moveTo(402,237);ctx.lineTo(446,259)},null,ink,5);
 path(()=>{ctx.moveTo(152,347);ctx.bezierCurveTo(164,308,194,316,231,322);ctx.bezierCurveTo(367,351,466,358,550,327);ctx.bezierCurveTo(579,315,572,349,552,365);ctx.bezierCurveTo(557,386,536,408,501,407);ctx.bezierCurveTo(366,416,291,388,172,382);ctx.bezierCurveTo(147,381,144,363,152,347)},'#ad714e');
 path(()=>{ctx.moveTo(187,352);ctx.bezierCurveTo(283,345,404,405,553,363);ctx.moveTo(129,384);ctx.bezierCurveTo(130,409,146,413,162,414)},null,'#573b29',6);
 // Headphones sit outside the reference face; crown follows head movement.
 path(()=>{ctx.moveTo(40,152);ctx.bezierCurveTo(8,-67,451,-91,527,87)},null,'#392342',24);
 oval(35,190,33,66,'#38213f');oval(35,190,18,48,'#e6bd54');oval(537,193,21,55,'#38213f');oval(539,193,11,39,'#e6bd54');
 path(()=>{ctx.moveTo(135,27);ctx.lineTo(113,-61);ctx.lineTo(181,-30);ctx.lineTo(232,-91);ctx.lineTo(279,-26);ctx.lineTo(344,-73);ctx.lineTo(333,23);ctx.closePath()},'#e9bd52','#815326',7);for(const x of [167,231,300])oval(x,-4,9,16,'#dc3e9c');
 ctx.restore();
}
export function paintGamerHead(ctx,{blink=false,rest=false,now=0}={}){
 const oval=(x,y,rx,ry,color,stroke='#40382e',width=1.5)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}};
 const line=(p,color,width=1.5)=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()};
 const shape=(points,fill,stroke=null)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.3;ctx.stroke()}};
 // Match the supplied cut-paper gamer: tall bald forehead, tiny rectangular glasses,
 // sparse side hair, a broad hanging jaw and irregular stubble rather than a beard.
 oval(0,-45,40,15,'#e9cea2',null);oval(-50,-83,8,13,'#efd6ac');oval(50,-83,8,13,'#efd6ac');
 shape([[-48,-105],[-46,-132],[-30,-151],[-6,-151],[23,-153],[44,-138],[49,-109],[57,-86],[52,-57],[34,-46],[17,-34],[-16,-33],[-35,-45],[-58,-58],[-58,-90],[-48,-105]],'#f0d8af','#675c49');
 shape([[-39,-78],[-29,-89],[-15,-82],[-12,-76],[-6,-87],[9,-89],[18,-78],[33,-86],[44,-77],[43,-62],[39,-47],[10,-41],[-12,-44],[-37,-45],[-46,-57],[-39,-78]],'#bfb398');
 for(const side of [-1,1]){
  const x=side*23;ctx.beginPath();ctx.moveTo(x-20,-119);ctx.quadraticCurveTo(x-25,-115,x-22,-101);ctx.quadraticCurveTo(x-19,-96,x+18,-99);ctx.quadraticCurveTo(x+22,-103,x+21,-117);ctx.quadraticCurveTo(x+13,-122,x-20,-119);ctx.closePath();ctx.fillStyle='#f6f5e9';ctx.fill();ctx.strokeStyle='#979182';ctx.lineWidth=1.5;ctx.stroke();if(blink)line([[x-10,-108],[x+11,-108]],'#37332d',1.5);else oval(x-side*5,-112,1.8,2.2,'#292821',null);
  shape([[side*5,-127],[side*17,-140],[side*30,-134],[side*39,-125]],'#3f3026');
  shape([[side*35,-134],[side*45,-138],[side*43,-125],[side*51,-121],[side*47,-112],[side*58,-111],[side*48,-102],[side*55,-101],[side*48,-92],[side*41,-98],[side*43,-112],[side*35,-119],[side*35,-134]],'#46372b');
 }
 line([[-3,-111],[3,-111]],'#979182',1.6);shape([[-7,-150],[-14,-158],[-8,-160],[-3,-153]],'#46372b');shape([[-2,-151],[5,-161],[12,-160],[4,-151]],'#46372b');line([[0,-153],[15,-156]],'#46372b',1.5);
 oval(-3,-96,1.7,1.2,'#6f5b42',null);oval(5,-96,1.7,1.2,'#6f5b42',null);line([[-7,-96],[-3,-100],[3,-100],[8,-95]],'#ab987a',1);
 oval(1,-81,7,2.6,'#2e2b22',null);line([[-17,-57],[-4,-54],[13,-56]],'#9f927a',1);line([[-21,-43],[-2,-39],[18,-43]],'#c1aa88',1);
 for(let j=0;j<38;j++){const a=j*2.399,r=10+j%9*3,x=Math.cos(a)*r,y=-65+Math.sin(a)*17;line([[x,y],[x+.5,y+1]],'#615a48',.7)}
 for(const [x,y]of [[-34,-89],[-41,-76],[-30,-73],[-19,-91],[31,-91],[41,-76],[29,-73]])oval(x,y,1.5,1.5,'#d09a83',null);
}
