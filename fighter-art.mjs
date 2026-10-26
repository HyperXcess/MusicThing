import {atlasBounds} from './fighter-atlas.mjs';
import {fighterPosters} from './fighter-posters.mjs';
const cache=new Map();let lastReady=null;
const complete=image=>!!image?.complete&&image.naturalWidth>0;
function sheets(id){if(typeof Image==='undefined')return null;if(cache.has(id))return cache.get(id);const base=typeof window!=='undefined'&&window.__musicFighterArtBase||'/app/musicthing/fighter-art/';const load=src=>{const image=new Image();image.src=src;return image};const pair={id,poster:load(fighterPosters[id]),base:load(base+id+'-base.png'),advanced:load(base+id+'-advanced.png')};cache.set(id,pair);return pair}
export function fighterArtReady(id){if(typeof Image==='undefined')return true;const art=sheets(id);return complete(art?.base)||complete(art?.poster)||!!lastReady}
// Small approved ready poses start decoding before any fighter frame is requested.
if(typeof Image!=='undefined')for(let i=0;i<6;i++){const image=new Image();image.src=fighterPosters[i];cache.set(i,{id:i,poster:image});}
function fullSheets(id){let art=cache.get(id);if(art&&!art.base){const base=typeof window!=='undefined'&&window.__musicFighterArtBase||'/app/musicthing/fighter-art/';for(const kind of ['base','advanced']){art[kind]=new Image();art[kind].src=base+id+'-'+kind+'.png'}}return art||sheets(id)}
export function chibiPose(move,p=0){const wind=p<.26,hit=p>=.40&&p<.65,recover=p>=.65;
 if(!move)return{sheet:'base',frame:0};
 if(move==='duck')return{sheet:'advanced',frame:wind?0:recover?11:8};
 if(move==='jump')return{sheet:'advanced',frame:wind?0:recover?11:7};
 if(move==='sweep'||move==='low-cut')return{sheet:'advanced',frame:wind?0:recover?2:1};
 if(move==='spin-kick'||move==='tornado-kick'||move==='spinning-slash')return{sheet:'advanced',frame:wind?3:p<.40?5:hit?6:recover?11:4};
 if(move==='roundhouse')return{sheet:'advanced',frame:wind?3:recover?11:4};
 if(move==='backfist')return{sheet:p<.40?'advanced':'base',frame:p<.26?3:p<.40?5:recover?4:3};
 if(move==='flying-kick'||move==='leaping-cut')return{sheet:'base',frame:wind?5:recover?7:6};
 if(move==='rising-cut'||move==='overhead-cut')return{sheet:'base',frame:wind?2:recover?4:6};
 return{sheet:'base',frame:wind?2:recover?4:3};
}
export function paintChibi(ctx,rx,ground,s,now,id,attack,rest,restTime,energy,face){let art=typeof Image==='undefined'?null:fullSheets(id);if(!art)return false;const p=attack?Math.min(1,attack.age/.72):0;let pose=chibiPose(attack?.move,p);
 if(!attack){if(rest&&restTime>.9)pose={sheet:'advanced',frame:Math.floor(restTime/2.6)%2?10:9};else if(face?.blink>.4||now%4700>4520)pose={sheet:'base',frame:1}}
 let image=art[pose.sheet],poster=false;
 if(!complete(image)){pose={sheet:'base',frame:0};image=complete(art.base)?art.base:art.poster;poster=!complete(art.base);if(!complete(image)){if(!lastReady)return false;art=lastReady;id=art.id;image=complete(art.base)?art.base:art.poster;poster=!complete(art.base)}}
 lastReady=art;
 const rows=pose.sheet==='base'?2:3,cw=image.naturalWidth/4,ch=image.naturalHeight/rows,size=132*s,phase=Math.sin(Math.min(1,p/.65)*Math.PI),air=attack&&['jump','dragon-punch','flying-kick','tornado-kick','leaping-cut'].includes(attack.move)?Math.sin(Math.min(1,p)*Math.PI)*(attack.move==='jump'?42:22)*s:0,lunge=attack?phase*7*s:0,bounce=attack?0:Math.sin(now/(rest?620:160))*(rest?.65:1.35)*s;
 // One whole illustrated pose, consistently anchored; spin has its own rear-view artwork.
 const rise=attack&&attack.move==='high-punch'?phase*22*s:0;
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.translate(rx+lunge,ground-air-rise+bounce);if(poster)ctx.drawImage(image,-size*.5,-size,size,size);else{const rect=atlasBounds[id+'-'+pose.sheet][pose.frame],col=pose.frame%4,row=Math.floor(pose.frame/4);ctx.drawImage(image,...rect,((rect[0]-col*cw)/cw-.5)*size,((rect[1]-row*ch)/ch-1)*size,rect[2]/cw*size,rect[3]/ch*size);}ctx.restore();
 if(attack&&p>.28&&p<.68&&!['jump','duck'].includes(attack.move)){ctx.save();ctx.globalAlpha=.30*Math.sin((p-.28)/.4*Math.PI);ctx.strokeStyle=id===5?'#fff4a4':'#e5caff';ctx.lineWidth=(id===5?3:2)*s;ctx.beginPath();ctx.ellipse(rx+53*s,ground-(attack.move==='sweep'||attack.move==='low-cut'?15:65)*s-air,27*s,attack.move.includes('spin')?46*s:18*s,-.4,-1.1,1.2);ctx.stroke();ctx.restore()}

 return true;
}
