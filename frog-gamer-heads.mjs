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
 const oval=(x,y,rx,ry,color,outline='#29252b',width=2)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(outline){ctx.strokeStyle=outline;ctx.lineWidth=width;ctx.stroke()}};
 const line=(points,color,width=2)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()};
 oval(-48,-78,9,14,'#e7caa1');oval(48,-78,9,14,'#e7caa1');oval(0,-81,49,54,'#edd4aa');oval(0,-57,45,24,'#c8b995',null);oval(0,-67,35,23,'#b2aa91',null);oval(0,-83,9,8,'#e0c093',null);
 // Receding dark hair, heavy cheeks, small spectacles and uneven stubble.
 for(const side of [-1,1]){line([[side*29,-127],[side*43,-117],[side*47,-99],[side*51,-109],[side*48,-86]],'#49372a',10);line([[side*38,-121],[side*50,-125],[side*44,-112]],'#49372a',3)}line([[-20,-129],[-9,-134],[-3,-132]],'#49372a',5);line([[10,-132],[21,-134],[28,-129]],'#49372a',4);
 for(const side of [-1,1]){const x=side*22;oval(x,-103,20,13,'#fbf9ed','#827e77',2);if(blink)line([[x-10,-102],[x+10,-102]],'#433d38',2);else oval(x+3,-104,2,2,'#24232a',null);line([[x-17,-119],[x+12,-121]],'#65503b',2)}line([[-3,-104],[3,-104]],'#827e77',2);line([[-44,-107],[-49,-103]],'#827e77',2);line([[44,-107],[49,-103]],'#827e77',2);
 oval(0,-72,8,3,rest?'#75594c':'#342d2b',null);line([[-9,-46],[0,-43],[11,-46]],'#b9a78b',1.4);
 for(let i=0;i<25;i++){const a=i*2.399,x=Math.cos(a)*(14+i%6*4),y=-64+Math.sin(a)*16;line([[x,y],[x+1,y+1.5]],'#6e6656',.8)}for(const [x,y]of [[-31,-88],[-37,-71],[28,-85],[35,-69],[-18,-83]])oval(x,y,1.3,1.3,'#c88e79',null);
 ctx.beginPath();ctx.ellipse(0,-95,54,49,0,Math.PI,Math.PI*2);ctx.strokeStyle='#342c3e';ctx.lineWidth=6;ctx.stroke();for(const side of [-1,1])oval(side*51,-85,7,15,'#453d50');line([[51,-82],[48,-65],[21,-67]],'#46404e',3);oval(20,-67,4,3,'#26232b');
}
