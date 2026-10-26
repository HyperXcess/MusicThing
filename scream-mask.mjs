export function paintReferenceMask(ctx){
 const gradient=(type,args,stops,fallback)=>{const g=ctx[type]?.(...args);if(!g?.addColorStop)return fallback;for(const [at,color]of stops)g.addColorStop(at,color);return g};
 const shape=(p,color,stroke=null,width=1)=>{ctx.beginPath();ctx.moveTo(...p[0]);for(let i=1;i<p.length;i+=3){if(i+2<p.length)ctx.bezierCurveTo(...p[i],...p[i+1],...p[i+2]);else for(let j=i;j<p.length;j++)ctx.lineTo(...p[j])}ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}};
 const line=(p,color,width=1)=>{ctx.beginPath();ctx.moveTo(...p[0]);for(let i=1;i<p.length;i+=3){if(i+2<p.length)ctx.bezierCurveTo(...p[i],...p[i+1],...p[i+2]);else for(let j=i;j<p.length;j++)ctx.lineTo(...p[j])}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()};
 const hood=gradient('createLinearGradient',[-52,-80,52,-80],[[0,'#08090b'],[.3,'#1b1b1d'],[.55,'#070809'],[1,'#141417']],'#111114');
 shape([[-43,-27],[-50,-54],[-45,-119],[-16,-136],[-6,-146],[9,-144],[23,-135],[48,-116],[45,-57],[54,-27],[38,-40],[21,-30],[0,-28],[-21,-27],[-38,-40],[-43,-27]],hood,'#29282b',1.1);
 const face=gradient('createLinearGradient',[-34,-80,34,-80],[[0,'#8f9085'],[.16,'#d3d2bf'],[.45,'#efeddb'],[.65,'#e0dfca'],[1,'#888a7d']],'#e0dfca');
 shape([[0,-134],[-24,-135],[-31,-118],[-32,-101],[-38,-85],[-27,-67],[-18,-54],[-12,-40],[-10,-22],[-6,-20],[-3,-17],[3,-17],[7,-20],[10,-22],[11,-40],[19,-55],[27,-70],[38,-86],[31,-101],[31,-120],[23,-134],[0,-134]],face,'#777b70',.7);
 const forehead=gradient('createRadialGradient',[-7,-119,2,-2,-113,28],[[0,'#f6f2dd'],[1,'#e0dfcb00']],'#e0dfcb');shape([[-29,-110],[-26,-139],[25,-139],[29,-110],[13,-118],[-13,-118],[-29,-110]],forehead);
 for(const side of [-1,1]){ctx.save();ctx.scale(side,1);
  // Eye openings rise tightly beside the nose and sweep downward/outward.
  shape([[-5,-108],[-5,-121],[-14,-122],[-19,-110],[-21,-100],[-24,-96],[-31,-90],[-38,-82],[-29,-75],[-20,-80],[-9,-85],[-4,-99],[-5,-108]],'#a6a998');
  shape([[-7,-107],[-7,-117],[-13,-118],[-16,-109],[-19,-99],[-22,-95],[-29,-89],[-34,-84],[-28,-79],[-21,-83],[-12,-88],[-6,-99],[-7,-107]],'#060809');
  line([[-6,-108],[-5,-117],[-11,-123],[-16,-117]],'#f8f1db',1.4);
  line([[-33,-86],[-35,-77],[-22,-72],[-15,-84]],'#f0ecd4',2.1);
  shape([[-29,-73],[-25,-62],[-18,-48],[-12,-34],[-13,-53],[-18,-64],[-23,-75]],'#a7aa98');
  line([[-27,-71],[-25,-60],[-18,-48],[-13,-33]],'#d6d7be',1);
  ctx.restore();
 }
 // Small nose opening, not a broad painted bridge.
 shape([[-4,-86],[-5,-82],[-7,-81],[-6,-79],[-4,-78],[-2,-79],[0,-81],[2,-78],[5,-78],[6,-80],[6,-82],[3,-83],[2,-86],[0,-87],[-2,-86],[-4,-86]],'#080a09');
 line([[-4,-90],[-3,-93],[-2,-95],[-1,-96]],'#f8f2d9',1.1);
 // Very long scream opening: rounded at the top, narrowing to a small rounded chin.
 shape([[0,-74],[-13,-75],[-14,-64],[-11,-51],[-8,-37],[-8,-25],[-5,-22],[-2,-20],[3,-20],[6,-23],[8,-28],[8,-38],[11,-52],[14,-65],[12,-75],[0,-74]],'#c2c5ad');
 shape([[0,-72],[-10,-73],[-12,-64],[-9,-51],[-7,-38],[-7,-26],[-4,-23],[-2,-22],[2,-22],[4,-24],[7,-30],[6,-39],[9,-52],[12,-65],[10,-73],[0,-72]],'#050808');
 const inner=gradient('createLinearGradient',[-5,-65,8,-28],[[0,'#0b0e0e'],[.65,'#101412'],[1,'#050707']],'#090c0b');shape([[0,-70],[-8,-71],[-9,-61],[-7,-50],[-6,-36],[-6,-26],[-3,-24],[0,-22],[3,-25],[5,-29],[6,-39],[7,-51],[9,-62],[8,-71],[0,-70]],inner);
 line([[-11,-65],[-13,-49],[-8,-26],[-5,-22]],'#f0ecd2',1.2);line([[11,-64],[13,-48],[8,-26],[5,-22]],'#dddcc5',1);
 // Restrained headphone cups outside the hood, kept almost black.
 for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*43,-87,6,14,0,0,Math.PI*2);ctx.fillStyle='#111216';ctx.fill();ctx.strokeStyle='#343039';ctx.lineWidth=1.2;ctx.stroke()}
}
