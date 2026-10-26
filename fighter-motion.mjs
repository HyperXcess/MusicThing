const mix=(a,b,t)=>Array.isArray(a)?a.map((v,i)=>mix(v,b[i],t)):a+(b-a)*t;
const ready={turn:1,shift:0,lift:0,hip:-34,lean:0,head:[4,-96],frontK:[15,-18],frontF:[30,0],backK:[-20,-18],backF:[-29,0],elbow:[20,-48],hand:[33,-58],backElbow:[-21,-47],backHand:[-4,-56]};
const poses={
 punch:{wind:{shift:-7,hip:-39,lean:-8,head:[-4,-100],elbow:[2,-48],hand:[12,-52]},impact:{shift:10,lean:13,head:[15,-95],elbow:[40,-55],hand:[64,-55],backK:[-26,-12],backF:[-39,0],backHand:[3,-62]}},
 'high-punch':{wind:{shift:-5,hip:-40,lean:-7,head:[-3,-101],hand:[13,-52]},impact:{shift:10,lean:12,head:[13,-95],elbow:[38,-79],hand:[64,-94],backHand:[4,-63],backF:[-39,0]}},
 'dragon-punch':{wind:{shift:-5,hip:-23,lean:-9,head:[-3,-80],hand:[8,-30],frontK:[22,-10]},impact:{shift:10,lift:-19,hip:-36,lean:12,head:[14,-97],elbow:[40,-65],hand:[64,-100],frontK:[24,-42],frontF:[10,-29],backK:[-18,-15],backF:[-27,-3],backHand:[5,-66]}},
 'flying-kick':{wind:{shift:-8,hip:-41,lean:-9,head:[-8,-103],frontK:[18,-24],frontF:[23,0],hand:[19,-65]},impact:{shift:10,lift:-22,hip:-34,lean:-12,head:[-14,-95],frontK:[35,-32],frontF:[64,-33],backK:[-24,-33],backF:[-10,-21],elbow:[12,-60],hand:[26,-72],backHand:[-14,-55]}},
 'draw-slash':{wind:{shift:-5,lean:-7,head:[-3,-98],hand:[-5,-38],elbow:[-8,-48]},impact:{shift:8,lean:10,head:[12,-96],hand:[28,-53],elbow:[18,-51]}},
 'rising-cut':{wind:{hip:-25,head:[-2,-80],hand:[5,-25],elbow:[0,-40]},impact:{shift:8,lift:-14,lean:9,head:[12,-96],hand:[36,-68],elbow:[23,-58],frontK:[23,-40],frontF:[16,-25]}},
 'overhead-cut':{wind:{hand:[9,-134],elbow:[-5,-106],head:[0,-96],lean:-7},impact:{shift:8,lean:15,head:[17,-95],hand:[37,-72],elbow:[24,-73],backF:[-39,0]}},
 'spinning-slash':{wind:{hand:[-22,-70],elbow:[-27,-57],lean:-12,head:[-12,-99]},impact:{shift:8,lean:10,head:[13,-95],hand:[29,-56],elbow:[18,-48]}},
 'low-cut':{wind:{shift:-4,hip:-39,head:[-5,-99],hand:[0,-55]},impact:{shift:8,hip:-22,lean:14,head:[15,-78],hand:[34,-28],elbow:[21,-40],frontF:[38,0],backF:[-36,0]}},
 'leaping-cut':{wind:{hip:-24,head:[0,-79],hand:[8,-105],elbow:[-4,-78]},impact:{shift:8,lift:-31,hip:-35,lean:6,head:[8,-96],hand:[33,-54],elbow:[24,-65],frontK:[26,-40],frontF:[12,-25],backK:[-18,-36],backF:[-7,-21]}},
 'spin-kick':{wind:{shift:-8,hip:-40,lean:-12,head:[-8,-100],frontK:[12,-30],frontF:[14,-12]},impact:{shift:10,lift:-12,hip:-34,lean:-15,head:[-15,-94],frontK:[34,-40],frontF:[64,-43],backK:[-22,-31],backF:[-9,-24],hand:[22,-65]}},
 'tornado-kick':{wind:{shift:-6,hip:-42,lean:-8,head:[-6,-102],frontK:[8,-33],frontF:[12,-15]},impact:{shift:10,lift:-36,hip:-34,lean:-12,head:[-12,-96],frontK:[33,-54],frontF:[64,-58],backK:[-20,-39],backF:[-8,-29],hand:[20,-68]}},
 'backfist':{wind:{shift:-5,lean:-15,head:[-12,-98],hand:[-14,-66],elbow:[-25,-51]},impact:{shift:10,lean:14,head:[16,-94],elbow:[37,-58],hand:[64,-55],backF:[-38,0]}},
 'duck':{wind:{hip:-27,head:[-4,-82],hand:[22,-50]},impact:{shift:-6,hip:-16,lean:-8,head:[-12,-49],frontK:[24,-7],frontF:[34,0],backK:[-23,-7],backF:[-34,0],hand:[19,-36],elbow:[8,-28],backHand:[-7,-37],backElbow:[-22,-29]}},
 'jump':{wind:{hip:-23,head:[0,-80],frontK:[22,-9],backK:[-24,-9]},impact:{lift:-58,hip:-36,head:[3,-97],frontK:[23,-45],frontF:[10,-27],backK:[-20,-42],backF:[-8,-28],hand:[22,-70],backHand:[-8,-64]}},
 sweep:{wind:{shift:-6,hip:-42,lean:-5,head:[-4,-102],frontK:[8,-24],frontF:[17,0]},impact:{shift:9,hip:-20,lean:12,head:[13,-78],frontK:[38,-14],frontF:[65,-16],backK:[-19,-13],backF:[-32,0],hand:[29,-51],backHand:[0,-48]}}
};
const keyTimes=[0,.08,.16,.24,.34,.42,.48,.54,.66,.80,.92,1];
function merge(base,extra){return{...base,...extra}}
function interpolate(a,b,t){const out={};for(const key of Object.keys(ready))out[key]=mix(a[key],b[key],t);return out}
export function fighterPose(move,progress,now=0,energy=0){
 if(move==='walk'){const t=now/230,a=Math.sin(t),b=Math.cos(t),bob=Math.sin(t*2)*1.1;return merge(ready,{head:[3,-96+bob],hip:-34+bob,lean:b,frontK:[a*10,-18-Math.max(0,a)*3],frontF:[a*22,-Math.max(0,b)*6],backK:[-a*10,-18-Math.max(0,-a)*3],backF:[-a*22,-Math.max(0,-b)*6],hand:[8-a*13,-25+Math.abs(a)*2],backHand:[-10+a*12,-26+Math.abs(a)*2],elbow:[8-a*6,-43],backElbow:[-12+a*6,-43]})}
 if(!move){const bounce=Math.sin(now/135),weight=Math.sin(now/270);return merge(ready,{hip:-34+bounce*2,lean:weight*2,head:[4+weight*2,-96+bounce*2],hand:[33+weight*2,-58+bounce*2],backHand:[-4,-56-bounce*2],elbow:[20,-48+bounce],frontK:[15+weight*2,-18],backK:[-20+weight,-18],lift:-Math.max(0,bounce)*Math.min(2,energy*3)})}
 const spec=poses[move]||poses.punch,wind=merge(ready,spec.wind),hit=merge(ready,spec.impact);
 const follow=interpolate(hit,ready,.18),dodge=merge(ready,{shift:-7,hip:-38,lean:-13,head:[-13,-99],hand:[15,-64],backHand:[-8,-60]});
 const frames=[ready,interpolate(ready,wind,.5),wind,interpolate(wind,hit,.2),interpolate(wind,hit,.72),hit,hit,follow,interpolate(follow,dodge,.5),dodge,interpolate(dodge,ready,.8),ready];
 const p=Math.max(0,Math.min(1,progress));let i=0;while(i<keyTimes.length-2&&p>keyTimes[i+1])i++;
 let t=(p-keyTimes[i])/(keyTimes[i+1]-keyTimes[i]);t=t*t*(3-2*t);const result=interpolate(frames[i],frames[i+1],t);if(['spin-kick','tornado-kick','backfist','spinning-slash'].includes(move)){const spin=Math.max(0,Math.min(1,(p-.08)/.34));result.turn=Math.cos(spin*Math.PI*2)}return result;
}
export const fighterMove=(kind,index)=>kind==='low'?'sweep':kind==='mid'?(index%2?'punch':'flying-kick'):(index%2?'high-punch':'dragon-punch');

export const moveHeights={'punch':55,'high-punch':94,'dragon-punch':119,'flying-kick':55,'roundhouse':75,'spin-kick':55,'tornado-kick':94,'backfist':55,'sweep':16,'duck':99,'jump':20,'draw-slash':55,'rising-cut':105,'overhead-cut':75,'spinning-slash':55,'low-cut':23,'leaping-cut':94};
export const moveDeck=['roundhouse','spin-kick','punch','duck','tornado-kick','jump','sweep','dragon-punch','backfist','flying-kick','high-punch'];
export const isEvasion=move=>move==='duck'||move==='jump';

export const katanaDeck=['draw-slash','rising-cut','overhead-cut','spinning-slash','low-cut','leaping-cut','duck','jump'];
