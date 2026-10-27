import {getBackdropStyle} from './backdrop-style.mjs';
// Shared stage: standalone visualizer and the exact backdrop behind Beat DJ.
export function paintNeonStage(ctx,w,h,now,bands,{spotlights=true}={}){
 const style=getBackdropStyle();
 const energy=Math.sqrt(bands.reduce((sum,v)=>sum+v*v,0)/Math.max(1,bands.length));
 ctx.save();for(let i=0;i<64;i++){const v=Math.max(0,Math.min(1,bands[i%32]||0)),x=w*.035+i*w*.93/64,height=v*h*.62*style.gain;ctx.fillStyle=style.colors[i<21?2:i<43?1:0];ctx.globalAlpha=.35+v*.3;ctx.fillRect(x,h*.43-height/2,Math.max(2,w*.93/64-3),Math.max(2,height))}
 if(spotlights)for(let i=0;i<6;i++){const x=w*(.1+i*.16),v=bands[i*5]||0;ctx.globalAlpha=v*.18;ctx.fillStyle=style.colors[i%2?0:2];ctx.beginPath();ctx.moveTo(x,h*.94);ctx.lineTo(x+Math.sin(now/1600+i)*w*.25-25,0);ctx.lineTo(x+Math.sin(now/1600+i)*w*.25+25,0);ctx.closePath();ctx.fill()}
 ctx.globalAlpha=Math.min(.4,energy*.45);ctx.strokeStyle='#b782ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w*.035,h*.43);ctx.lineTo(w*.965,h*.43);ctx.stroke();ctx.restore();
}
