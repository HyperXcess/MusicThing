import {paintMelloHead} from './mello-head.mjs';
import {paintReferenceMask} from './scream-mask.mjs';
export function knicksExpression(clock,energy,rest){const phase=(clock/1000+6)%27,strength=rest?0:Math.min(1,Math.max(0,energy)*3),stank=0,laugh=phase>=1.7&&phase<3.8?Math.sin((phase-1.7)/2.1*Math.PI)*strength:0;return{stank,laugh}}
export function djGroove({kind,clock,energy,rest,index=0}){
 const type={mushroom:'shake',eyeball:'shake',squid:'dip',dino:'headbang',yeti:'headbang',toaster:'shake',skull:'headbang',cat:'lean',jellyfish:'dip',cassette:'shake',doberman:'lean',knicks:'dip',bubble:'shake',scream:'lean',mello:'headbang',ibiza:'lean',glitch:'headbang'}[kind],period=kind==='yeti'?14:18+index%3,phase=(clock/1000+index*.73)%period,strength=rest?0:Math.min(1,Math.max(0,energy)*2.5),amount=phase<3?strength*Math.sin(phase/3*Math.PI)**2:0,swing=Math.sin(phase*13);
 return{type,amount,angle:amount*(type==='headbang'?swing*.34:type==='shake'?Math.sin(phase*17)*.23:Math.sin(phase*4)*.08),x:type==='shake'?amount*Math.sin(phase*17)*5:0,y:type==='headbang'?amount*(4+swing*7):type==='lean'?amount*6:0,crouch:type==='dip'?amount*23:type==='lean'?amount*9:0,zoom:type==='lean'?1+amount*.12:1};
}
// Each head has its own silhouette and face language; all coordinates are local to the DJ.
export function djHeadReaction({kind,clock,energy,rest,index=0,action=''}){
 const phase=(clock/1000+index*.73)%12,hype=/hype|pump|wave/.test(action),strength=rest?0:Math.min(1,Math.max(0,energy)*2.5),burst=phase<2?Math.sin(phase/2*Math.PI)**2:0,amount=kind==='doberman'?(rest?0:strength*((clock/1000+index*.73)%32<1.8?Math.sin(((clock/1000+index*.73)%32)/1.8*Math.PI)**2:0)):strength*Math.max(burst,hype?(1+Math.sin(clock/400))*.5:0),t=clock/1000,bangPhase=(t+index*.73)%14,groove=djGroove({kind,clock,energy,rest,index}),bang=groove.type==='headbang'?groove.amount:0;
 const names={mushroom:'wink',eyeball:'eye roll',squid:'gasp',dino:'roar',yeti:'headbang',toaster:'toast pop',skull:'cackle',cat:'ear flick',jellyfish:'pulse',cassette:'reel rush',doberman:'howl',knicks:'cheer',bubble:'bubble smile',scream:'silent scream',mello:'helmet nod',ibiza:'festival grin',glitch:'bass face'};
 return{amount,headbang:bang,groove,expression:bang>.15?'headbang':amount>.3?names[kind]:rest?'relaxed':'groove',x:Math.sin(t*2.1+index)*strength*2.5+groove.x,y:rest?Math.sin(t)*.8:-Math.abs(Math.sin(t*5+index))*strength*4-amount*(kind==='doberman'?8:2)+groove.y,angle:Math.sin(t*3+index)*strength*.08+amount*(kind==='doberman'?-.11:kind==='cassette'?.12:0)+groove.angle,stretch:kind==='squid'||kind==='jellyfish'?1+amount*.1:1,lookY:kind==='doberman'?-amount*5:kind==='eyeball'?-amount*13:0};
}
export function paintDJHead(ctx,{kind,skin,accent,now,clock,energy,rest,index,action}){
 const reaction=djHeadReaction({kind,clock,energy,rest,index,action}),emote=reaction.amount,ink='#171324',white='#fff5ed',blink=(rest&&['cat','toaster'].includes(kind))||now%(3400+index*173)<105||reaction.headbang>.35||(kind==='doberman'&&emote>.45),wink=(kind==='cat'||kind==='mushroom')&&emote>.55,look=Math.sin(clock/900)*2;ctx.save();ctx.translate(reaction.x,-43+reaction.y);ctx.rotate(reaction.angle);ctx.scale(reaction.groove.zoom,reaction.stretch*reaction.groove.zoom);ctx.translate(0,43);
 const line=(p,color=ink,width=2)=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()};
 const oval=(x,y,rx,ry,color,outline=ink,width=2)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(outline){ctx.strokeStyle=outline;ctx.lineWidth=width;ctx.stroke()}};
 const poly=(p,color,outline=ink)=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(outline){ctx.strokeStyle=outline;ctx.lineWidth=2.5;ctx.stroke()}};
 const curve=(p,color,fill,width=2)=>{ctx.beginPath();ctx.moveTo(...p[0]);for(let j=1;j<p.length;j+=3)ctx.bezierCurveTo(...p[j],...p[j+1],...p[j+2]);if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}if(color){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}};
 const eye=(x,y,{slant=0,iris=accent,size=1}={})=>{if(blink||(wink&&x<0)){line([[x-8*size,y],[x,y+2],[x+8*size,y-1]],ink,2.5);return}ctx.save();ctx.translate(x,y);ctx.rotate(slant);oval(0,0,9*size,11*size,white);oval(look,1+reaction.lookY,5.5*size,7.5*size,iris,null);oval(look+1,1+reaction.lookY,3*size,5.5*size,ink,null);oval(look-1,-3,2*size,2.5*size,'#fff',null);line([[-8*size,-5*size],[-3*size,-10*size],[5*size,-9*size]],ink,2.4);ctx.restore()};
 const grin=(x,y,width=15)=>{curve([[x-width,y],[x-width*.4,y+5],[x+width*.4,y+5],[x+width,y-2],[x+width*.7,y+16],[x-width*.7,y+16],[x-width,y]],ink,ink);line([[x-width+4,y+3],[x+width-4,y+2]],white,3)};
 const cheek=(x,y)=>oval(x,y,7,3,'#f08a9c',null);
 if(kind==='ibiza'){
  curve([[-33,-101],[-33,-128],[33,-127],[33,-101],[34,-76],[20,-48],[0,-45],[-22,-48],[-34,-77],[-33,-101]],ink,'#cfa17f',2.5);
  poly([[-35,-97],[-34,-113],[-24,-119],[-30,-132],[-13,-127],[-9,-138],[2,-129],[20,-136],[18,-126],[32,-121],[36,-102],[23,-110],[14,-114],[1,-110],[-12,-114],[-25,-105]],'#927153');line([[-22,-121],[-9,-124],[3,-119]],'#ceb48a',2);line([[6,-124],[17,-125],[26,-114]],'#ceb48a',2);
  eye(-15,-91,{iris:'#72939b',size:.8});eye(15,-91,{iris:'#72939b',size:.8});line([[-24,-103],[-15,-106],[-7,-103]],'#745b45',2);line([[7,-103],[15,-106],[24,-103]],'#745b45',2);line([[0,-87],[-4,-75],[3,-73]],'#986b54',1.3);
  curve([[-27,-74],[-27,-53],[-13,-46],[0,-46],[15,-46],[28,-56],[27,-74],[22,-61],[15,-54],[0,-55],[-15,-54],[-22,-61],[-27,-74]],null,'#92725e');for(let i=0;i<10;i++){const x=-20+i*4.5;line([[x,-57],[x+1,-53]],'#71584b',.8)}if(rest)line([[-8,-62],[8,-62]],'#774c45',2);else grin(0,-65,13);
 }else if(kind==='glitch'){
  poly([[13,-124],[34,-114],[32,-62],[18,-47],[-4,-45],[-28,-64],[-31,-107]],'#d8b7a5');poly([[15,-118],[32,-108],[29,-75],[19,-67]],'#ac988e',null);for(let j=0;j<5;j++)line([[22+j*1.7,-109],[23+j*1.3,-90]],'#7b7477',1);
  curve([[16,-124],[-37,-143],[-55,-100],[-40,-50],[-28,-62],[-34,-89],[-12,-105],[0,-115],[6,-99],[15,-98],[11,-114],[19,-116],[16,-124]],ink,'#1d1d25',2.5);curve([[-22,-120],[-42,-106],[-40,-77],[-35,-68]],'#4d4555',null,2);
  eye(-13,-87,{iris:'#76608f',size:.73});eye(15,-87,{iris:'#76608f',size:.73});for(const x of [-14,15]){poly([[x-12,-99],[x+11,-99],[x+12,-78],[x-12,-78]],'#29242e');oval(x,-88,8,8,'#d0beb6');oval(x,-87,3,5,'#302737');line([[x-8,-97],[x+7,-97]],'#6f6578',1)}line([[-2,-91],[4,-91]],'#29242e',3);line([[0,-82],[-2,-71],[3,-70]],'#a28175',1.2);if(rest)line([[-7,-60],[7,-60]],'#774d54',1.8);else curve([[-8,-62],[-1,-55],[8,-57],[13,-65]],'#774d54',null,2.2);oval(28,-64,3,3,'#a5a0ad');
 }else if(kind==='mello'){paintMelloHead(ctx);
 }else if(kind==='scream'){paintReferenceMask(ctx);
 }else if(kind==='bubble'){
  const flow=Math.sin(clock/480)*3;
  // Brown twin ponytails, side locks and warm highlights follow the supplied reference.
  curve([[-28,-108],[-57,-139],[-64,-64],[-41,-35],[-54,-76],[-31,-68],[-28,-108]],ink,'#855047',2.5);
  curve([[28,-108],[57,-139],[64,-64],[41,-35],[54,-76],[31,-68],[28,-108]],ink,'#855047',2.5);
  curve([[-40,-113],[-55,-103],[-49,-64],[-44,-53]],'#c38b62',null,2);curve([[40,-113],[55,-103],[49,-64],[44,-53]],'#c38b62',null,2);
  curve([[-32,-97],[-35,-125],[35,-125],[32,-97],[33,-72],[14,-47],[0,-43],[-14,-47],[-33,-72],[-32,-97]],ink,'#f0c8b5',2.3);
  curve([[-35,-91],[-41,-133],[38,-137],[35,-91],[24,-102],[25,-109],[19,-112],[16,-100],[12,-100],[9,-110],[5,-99],[0,-99],[-3,-111],[-9,-99],[-14,-101],[-17,-112],[-25,-105],[-25,-98],[-35,-91]],ink,'#995d4f',2.5);
  curve([[-28,-116],[-12,-129],[15,-129],[29,-117]],'#d89e6b',null,4);curve([[0,-128],[7,-144],[0,-150],[-8,-144]],'#c98c5d',null,2);
  for(const side of [-1,1]){const x=side*15;line([[x-8,-102],[x,-104],[x+7,-101]],'#8e584e',1.5);if(blink){curve([[x-9,-86],[x-3,-82],[x+3,-82],[x+9,-87]],ink,null,2)}else{oval(x,-86,8.3,10.5,'#fff5f1');oval(x+look*.5,-85,5.6,8.7,'#62729d',null);oval(x+look*.5,-80,4.2,4.3,'#95c9bb',null);oval(x+look*.5,-86,2.6,6.5,'#292d47',null);oval(x-3,-93,2.3,2.8,'#fff',null);curve([[x-8,-89],[x-5,-97],[x+5,-97],[x+8,-91]],ink,null,2.2);line([[x+side*7,-93],[x+side*10,-96]],ink,1.6)}}
  oval(-23,-68,5,2.5,'#e7b4b0',null);oval(23,-68,5,2.5,'#e7b4b0',null);line([[1,-78],[3,-74],[0,-73]],'#c58d7e',1);
  if(action==='blowing bubbles')oval(0,-61,3,3.4,'#b46e7d');else curve([[-7,-62],[-2,-58],[3,-58],[8,-63]],'#ac6274',null,1.7);
  for(const side of [-1,1]){oval(side*33,-108,5,4,'#dc708e');curve([[side*30,-102],[side*(42+flow),-91],[side*29,-69],[side*35,-55]],'#7a4944',null,4)}
 }else if(kind==='knicks'){const {stank,laugh}=knicksExpression(clock,energy,rest);ctx.save();ctx.translate(0,laugh*Math.sin(clock/80)*2);ctx.rotate(stank*-.07+laugh*Math.sin(clock/180)*.03);
  // Shoulder-length wavy hair frames a warm face; side part and raised brows echo the reference.
  curve([[-33,-56],[-58,-70],[-49,-116],[-27,-124],[-7,-148],[35,-132],[43,-111],[55,-96],[39,-63],[47,-45],[27,-36],[20,-49],[-33,-56]],ink,'#211f25',3);
  curve([[-30,-100],[-32,-125],[30,-121],[31,-95],[34,-62],[15,-44],[0,-44],[-18,-46],[-34,-66],[-30,-100]],ink,'#bc8462',2.5);
  curve([[-35,-96],[-41,-123],[-1,-142],[22,-119],[0,-122],[-14,-109],[-35,-96]],ink,'#27252b',2);
  curve([[25,-118],[48,-106],[32,-93],[42,-79],[29,-68],[43,-57],[29,-42]],'#37323b',null,6);
  curve([[-30,-104],[-45,-87],[-32,-76],[-42,-65],[-43,-56],[-32,-48],[-25,-49]],'#37323b',null,5);
  line([[-24,-99-stank*3],[-16,-104+stank*2],[-7,-102+stank*7]],'#3f2a27',2.6);line([[8,-103+stank*7],[17,-104+stank*2],[25,-99-stank*3]],'#3f2a27',2.6);
  if(laugh>.15){for(const x of [-15,15])curve([[x-8,-89],[x-3,-98],[x+3,-98],[x+8,-89]],ink,null,2.5)}else{ctx.save();ctx.translate(0,-90);ctx.scale(1,1-stank*.45);ctx.translate(0,90);eye(-15,-90,{iris:'#61432d',size:.85});eye(15,-90,{iris:'#61432d',size:.85});ctx.restore()}
  line([[0,-87],[-3,-75-stank*3],[2,-73-stank*3]],'#925c45',1.2);oval(-23,-72,6,3,'#c97e70',null);oval(23,-72,6,3,'#c97e70',null);
  if(laugh>.15){grin(0,-66,13);oval(0,-54,6,2,'#d7949a',null)}else if(stank>.15){curve([[-11,-61-stank*3],[-5,-65-stank*3],[3,-57],[12,-60]],'#79433d',null,2.8);line([[-8,-78],[-5,-81]],'#925c45',1);line([[6,-81],[9,-78]],'#925c45',1)}else if(action==='selfie'){curve([[-10,-63],[-3,-57],[5,-57],[11,-64]],'#79433d',null,2.4)}else if(action==='phone hype'||emote>.5){oval(0,-60,7,9,'#653b3b');oval(0,-56,4,2,'#dc9b91',null)}else{curve([[-11,-63],[-4,-57],[5,-57],[12,-64]],'#79433d',null,2.2)}
  for(const side of [-1,1])oval(side*31,-66,4,7,'#e9bd58','#ac7c36',1);ctx.restore();
 }else if(kind==='mushroom'){
  curve([[-32,-103],[-40,-77],[-30,-45],[0,-43],[30,-44],[40,-77],[32,-103]],ink,'#e9cbb0',3);
  oval(0,-108,49,8,'#9f306b');curve([[-53,-110],[-50,-152],[42,-155],[54,-110],[26,-100],[-26,-100],[-53,-110]],ink,'#e43899',3);
  for(const [x,y,r]of [[-28,-122,8],[0,-135,10],[29,-120,8]])oval(x,y,r,r*.65,'#fff0c1',null);
  eye(-15,-82,{slant:.12,iris:'#8b4c9f'});eye(15,-82,{slant:-.12,iris:'#8b4c9f'});cheek(-23,-65);cheek(23,-65);if(rest)line([[-8,-60],[8,-60]],'#75434b',2);else grin(0,-65,12);
 }else if(kind==='eyeball'){
  oval(0,-85,39,39,'#ece7f8');oval(-8,-94,28,27,'#fff',null);
  for(const side of [-1,1])line([[side*33,-100],[side*25,-95],[side*29,-86]],'#c494c2',1);
  if(blink)line([[-31,-85],[0,-81],[31,-85]],ink,4);else{const x=look*3,ey=-85+reaction.lookY;oval(x,ey,23,28,accent);oval(x,ey,16,22,'#228c92',null);for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[x+Math.cos(a)*17,-85+Math.sin(a)*23],[x+Math.cos(a)*21,-85+Math.sin(a)*26]],'#96fff0',1)}oval(x,ey,9,19,ink,null);oval(x-7,-96,6,8,'#fff',null);oval(x+8,-75,2.5,3,'#bffff4',null)}
 }else if(kind==='squid'){
  curve([[-34,-58],[-60,-103],[-23,-141],[0,-141],[26,-140],[58,-99],[34,-58]],ink,'#ad7acb',3);
  for(let i=0;i<5;i++){const x=-28+i*14;curve([[x,-65],[x-14,-40],[x+19,-43],[x+8,-58]],'#e0abed',null,5)}
  eye(-16,-89,{slant:.18,iris:'#ffbe78'});eye(16,-89,{slant:-.18,iris:'#ffbe78'});oval(0,-66,7+emote*3,9+emote*6,'#573c7e');oval(-2,-69,2,2,'#e3a6ed',null);
 }else if(kind==='dino'){
  for(const x of [-24,0,24])poly([[x-9,-112],[x,-133],[x+10,-112]],'#cc548e');
  curve([[-36,-94],[-38,-127],[36,-127],[37,-94],[43,-62],[26,-45],[0,-45],[-28,-45],[-44,-66],[-36,-94]],ink,'#6cba8d',3);
  eye(-17,-94,{iris:'#ddae4c',size:.9});eye(17,-94,{iris:'#ddae4c',size:.9});
  if(emote>.35){oval(0,-53,21,12+emote*7,ink);oval(0,-46,11,4,'#d68198',null)}oval(0,-65-emote*4,32,17,'#b4d59b');oval(-12,-71,3,2,ink,null);oval(12,-71,3,2,ink,null);curve([[ -24,-61],[-12,-51],[12,-51],[25,-62]],ink,null,2);poly([[-16,-57],[-12,-49],[-8,-55]],white);poly([[10,-55],[14,-49],[18,-58]],white);
 }else if(kind==='yeti'){
  poly([[-34,-112],[-45,-95],[-38,-82],[-46,-64],[-34,-61],[-31,-43],[-19,-48],[-12,-35],[0,-43],[12,-35],[20,-47],[33,-43],[35,-61],[46,-66],[38,-84],[44,-98],[30,-118],[15,-114],[2,-127],[-14,-116],[-25,-122]],'#704731');
  oval(0,-78,28,29,'#ad805d',null);line([[-28,-100],[-16,-104],[-5,-99]],'#38261e',7);line([[5,-99],[16,-104],[28,-100]],'#38261e',7);eye(-14,-90,{iris:'#755437',size:.65});eye(14,-90,{iris:'#755437',size:.65});oval(0,-75,12,8,'#52372b');oval(-4,-75,2,2,ink,null);oval(4,-75,2,2,ink,null);curve([[-17,-60],[-7,-54],[6,-54],[18,-62]],ink,null,2.5);
  for(const side of [-1,1])for(let i=0;i<4;i++)line([[side*(23+i*3),-91+i*10],[side*(27+i*3),-82+i*10]],'#b98b62',1);
 }else if(kind==='toaster'){
  poly([[-41,-109],[-32,-119],[33,-119],[42,-109],[42,-49],[32,-43],[-32,-43],[-41,-49]],'#b4a1ca');poly([[-32,-107],[-25,-111],[30,-111],[35,-105],[35,-55],[-32,-55]],'#d8c8e7',null);
  if(!['toast pop','blow out','toast toss','smug nod'].includes(action)&&!rest){ctx.save();ctx.translate(0,-emote*14);poly([[-27,-118],[-29,-132],[-22,-142],[20,-142],[29,-132],[26,-118]],'#f0ce86');ctx.restore();}line([[-20,-129],[20,-129]],'#c18d48',3);line([[-28,-117],[28,-117]],ink,4);
  for(const x of [-16,16]){if(blink)line([[x-8,-86],[x+8,-86]],accent,3);else{poly([[x-8,-98],[x+8,-98],[x+8,-79],[x-8,-79]],'#332b4b');line([[x-4,-93],[x+4,-93]],accent,2)}}if(['blow out','toast pop','burning'].includes(action)||(rest&&now%9000<2800))oval(0,-63,7,10,'#302238');else line([[-15,-66],[-9,-60],[9,-60],[15,-66]],ink,3);oval(41,-65,6,7,accent);
 }else if(kind==='skull'){
  curve([[-36,-76],[-50,-132],[47,-136],[37,-77],[34,-64],[25,-61],[23,-56],[19,-38],[-19,-38],[-23,-56],[-28,-63],[-36,-64],[-36,-76]],ink,'#ebe1db',3);
  for(const side of [-1,1]){oval(side*17,-89,14,18,'#2b1e38');oval(side*17,-88,4,7,accent,null);line([[side*7,-106],[side*25,-112]],ink,3)}poly([[0,-79],[-6,-66],[6,-66]],'#38243c');if(rest)oval(0,-48,15,6+Math.sin(now/900)**2*10,ink);else if(emote>.3)oval(0,-48,19,5+emote*8,ink);line([[-19,-53],[0,-49+emote*6],[19,-53]],ink,2.5);for(let i=0;i<5;i++)line([[-14+i*7,-55],[-14+i*7,-42]],ink,1.5);line([[-12,-123],[-4,-116],[-8,-110]],'#9a8c9c',1.5);
 }else if(kind==='cat'){
  poly([[-35,-94],[-40,-139],[-12,-117],[12,-117],[40,-139],[35,-94]],'#a37bb8');poly([[-32,-126],[-29,-104],[-18,-114]],'#f29fbd',null);poly([[32,-126],[29,-104],[18,-114]],'#f29fbd',null);
  poly([[-34,-107],[-42,-87],[-34,-79],[-42,-74],[-28,-54],[-12,-49],[0,-46],[12,-49],[28,-54],[42,-74],[34,-79],[42,-87],[34,-107]],'#ba96cd');
  for(const x of [-12,0,12])poly([[x-4,-112],[x+4,-112],[x,-98]],'#725282',null);
  for(const side of [-1,1]){const x=side*17;if(blink||(wink&&side<0))line([[x-9,-85],[x,-82],[x+9,-86]],ink,2);else{curve([[x-10,-86],[x-3,-101],[x+6,-96],[x+10,-86],[x+4,-78],[x-5,-77],[x-10,-86]],ink,'#8bddb9');oval(x+look,-87,2.8,9,ink,null);oval(x-3,-91,2,2,white,null)}}
  oval(-11,-64,13,9,'#ecd9ec',null);oval(11,-64,13,9,'#ecd9ec',null);poly([[-6,-73],[6,-73],[0,-67]],'#9a4e7c');line([[0,-67],[0,-61],[-6,-57]],ink,1.5);line([[0,-61],[6,-57]],ink,1.5);for(const side of [-1,1]){line([[side*20,-68],[side*47,-76]],white,1.4);line([[side*23,-63],[side*48,-63]],white,1.4);line([[side*20,-58],[side*45,-53]],white,1.4)}
 }else if(kind==='doberman'){
  poly([[-34,-101],[-30,-146],[-8,-118],[8,-118],[30,-146],[34,-101],[37,-72],[22,-45],[0,-40],[-22,-45],[-37,-72]],'#302222');poly([[-27,-132],[-24,-107],[-15,-118]],'#ac7049',null);poly([[27,-132],[24,-107],[15,-118]],'#ac7049',null);
  for(const side of [-1,1]){const x=side*17;oval(x,-101,8,4,'#bc8150',null);eye(x,-90,{iris:'#c69545',slant:side*-.2,size:.75})}
  if(emote>.35){poly([[-10,-94],[10,-94],[18,-68],[13,-43],[0,-38],[-13,-43],[-18,-68]],'#b57a4d');oval(0,-66,10,15,ink);oval(0,-56,5,4,'#dc839b',null);oval(0,-91,10,7,'#211b1e');for(const side of [-1,1])line([[side*24,-114],[side*30,-120],[side*34,-129]],accent,1.4)}else{poly([[-8,-88],[8,-88],[19,-63],[15,-48],[0,-43],[-15,-48],[-19,-63]],'#b57a4d');oval(0,-64,16,11,'#855036',null);poly([[-10,-71],[10,-71],[8,-63],[0,-60],[-8,-63]],'#211b1e');line([[0,-61],[0,-54],[-9,-51]],ink,2);line([[0,-54],[9,-51]],ink,2);line([[-12,-78],[-8,-81]],'#dbaf78',1);line([[12,-78],[8,-81]],'#dbaf78',1);}
 }else if(kind==='jellyfish'){
  for(let i=0;i<7;i++){const x=-28+i*9;curve([[x,-64],[x-15,-40],[x+19,-28],[x+Math.sin(clock/240+i)*12,-13]],i%2?'#27ead5':'#ff60c0',null,2.5)}
  curve([[-47,-74],[-49,-134],[43,-145],[48,-74],[31,-64],[18,-83],[0,-71],[-19,-84],[-31,-63],[-47,-74]],ink,'#a881d8',3);
  curve([[-32,-105],[-24,-128],[8,-130],[23,-118]],'#d1b4f0',null,3);eye(-17,-93,{iris:'#42dcca',size:.8});eye(17,-93,{iris:'#42dcca',size:.8});line([[-5,-78],[0,-75],[5,-78]],'#613c86',2);
 }else if(kind==='cassette'){
  poly([[-40,-116],[-33,-122],[34,-122],[41,-114],[41,-51],[34,-43],[-33,-43],[-40,-51]],'#946eaa');poly([[-32,-109],[32,-109],[32,-67],[-32,-67]],'#d5a2b7');
  for(const x of [-17,17]){oval(x,-88,13,13,ink);oval(x,-88,9,9,'#655076',null);for(let i=0;i<3;i++){const a=clock/(450-emote*300)+i*Math.PI*2/3;line([[x,-88],[x+Math.cos(a)*8,-88+Math.sin(a)*8]],accent,2)}oval(x-3,-92,2,2,white,null)}poly([[-17,-63],[17,-63],[24,-49],[-24,-49]],'#382b4f');oval(-11,-54,3,3,'#e3d8ec');oval(11,-54,3,3,'#e3d8ec');line([[-8,-104],[8,-104]],'#714861',2);
 }
 // Headphones sit at the sides, leaving facial features unobstructed.
 if(!['scream','mello'].includes(kind)){
 ctx.beginPath();ctx.ellipse(0,-87,44,39,0,Math.PI,Math.PI*2);ctx.strokeStyle='#1b1729';ctx.lineWidth=6;ctx.stroke();
 for(const side of [-1,1]){oval(side*41,-81,8,17,'#353047');line([[side*43,-91],[side*43,-72]],accent,3);line([[side*38,-88],[side*38,-76]],'#756b86',1)}
 }
 ctx.restore();return{blink,expression:reaction.expression};
}
