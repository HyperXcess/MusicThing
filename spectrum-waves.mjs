// Shared by Spectrum Waves and Beat Fighter: identical geometry, colors and response.
export function createSpectrumWaves(){
 const motion=Array.from({length:3},(_,i)=>({level:0,position:0,velocity:0,phase:i*2.1}));let last=null;
 return{draw(ctx,w,h,now,bands){
  const update=last==null||now-last>=39;if(update)last=now;
  const colors=['#27ead5','#b782ff','#ff2397'],ranges=[[0,10],[10,22],[22,32]];
  for(let layer=0;layer<3;layer++){
   const [lo,hi]=ranges[layer],m=motion[layer],band=bands.slice(lo,hi),level=Math.sqrt(band.reduce((s,v)=>s+v*v,0)/band.length),hit=Math.max(0,level-m.level);
   if(update){m.level=level;m.velocity+=(level-m.position)*.24+hit*(1.8+layer*.35);m.velocity*=.68;m.position+=m.velocity;if(level<.0001){m.position=0;m.velocity=0}m.phase+=(.10+layer*.045)+level*.35+hit*1.2}
   const amplitude=Math.pow(Math.max(0,Math.min(1.35,m.position)),.7);ctx.strokeStyle=colors[layer];ctx.lineWidth=1.6+level*.65;ctx.lineCap='round';ctx.setLineDash?.(layer===0?[]:layer===1?[10,7]:[1,6]);ctx.beginPath();
   for(let i=0;i<=160;i++){const u=i/160,pos=u*(hi-lo-1),index=Math.floor(pos),f=pos-index,blend=f*f*(3-2*f),local=band[index]*(1-blend)+band[Math.min(hi-lo-1,index+1)]*blend,envelope=Math.pow(Math.sin(u*Math.PI),.65),wave=Math.sin(u*Math.PI*(4+layer*2)-m.phase)*.68+Math.sin(u*Math.PI*(9+layer*3)+m.phase*1.37)*.24+Math.sin(u*Math.PI*2+m.phase*.7)*.08,y=h/2+wave*amplitude*(.65+local*.65)*h*.43*envelope;i?ctx.lineTo(u*w,y):ctx.moveTo(u*w,y)}ctx.stroke();ctx.setLineDash?.([]);
  }
 }};
}
