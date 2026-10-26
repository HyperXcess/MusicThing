import {createRunner} from './runner.mjs';
export const modes=['EQ Bars','Warp Tunnel','Synth Grid','Spectrum Waves','Beat Runner'];
// Fast attack, slower release; never normalise silence into a full-scale signal.
export function audioLevels(bands,previous=Array(32).fill(0)) {return Array.from({length:32},(_,i)=>{const raw=Number(bands?.[i])||0,target=Math.max(0,Math.min(1,raw));const old=previous[i]||0;return old+(target-old)*(target>old?.8:.22)})}
export function audioEnergy(bands){return Math.sqrt(bands.reduce((sum,v)=>sum+v*v,0)/Math.max(1,bands.length))}
export function createVisuals(canvas,gpu){
 const runner=createRunner(),ctx=canvas.getContext('2d',{alpha:false});let mode=0,frame={bands:Array(32).fill(0),scope:[]},smooth=Array(32).fill(0),gridSmooth=Array(32).fill(0),history=Array.from({length:24},()=>Array(32).fill(0)),waveMotion=Array.from({length:3},(_,i)=>({level:0,position:0,velocity:0,phase:i*2.1})),skylineGain=1,runSpeed=1,sensitivity=1,last=0,active=true,enabled=false,webgl=null;
 try{webgl=feedback(gpu)}catch{webgl=null}
 function showCanvas(){const shader=mode===1&&!!webgl;canvas.hidden=shader;gpu.hidden=!shader;if(canvas.style)canvas.style.display=shader?'none':'block';if(gpu.style)gpu.style.display=shader?'block':'none'}
 try{runner.setCharacter(Number(localStorage.getItem('musicthing-runner-character'))||0)}catch{}
 showCanvas();
 function draw(now){if(!active)return;requestAnimationFrame(draw);if(!enabled)return;if(now-last<40)return;last=now;smooth=audioLevels(frame.bands.map(v=>Math.min(1,Math.max(0,Number(v)||0)*sensitivity)),smooth);const w=canvas.width,h=canvas.height,energy=audioEnergy(smooth);
  showCanvas();
  if(mode===1&&webgl){webgl.draw(now/1000,smooth,energy);return}
  ctx.fillStyle=mode===1?'rgba(8,6,14,.15)':'#08060e';ctx.fillRect(0,0,w,h);
  if(mode===0){const gap=5,bw=(w-40)/32-gap;for(let i=0;i<32;i++){const x=20+i*(bw+gap),height=smooth[i]*(h-35);ctx.fillStyle=i<10?'#27ead5':i<22?'#b782ff':'#ff2397';ctx.fillRect(x,h-15-height,bw,Math.max(3,height));ctx.fillStyle='#ffffff';ctx.fillRect(x,h-18-height,bw,3)}
  }else if(mode===1){ctx.save();ctx.translate(w/2,h/2);ctx.rotate(Math.sin(now/8000)*.3);for(let j=0;j<14;j++){const radius=((now/35+j*35)%500);ctx.strokeStyle=j%2?'#ff2397':'#27ead5';ctx.lineWidth=1+energy*7;ctx.beginPath();for(let i=0;i<=32;i++){const angle=i/32*Math.PI*2,r=radius*(1+smooth[i%32]*1.4),x=Math.cos(angle)*r,y=Math.sin(angle)*r*.65;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}ctx.restore();
  }else if(mode===3){
   const colors=['#27ead5','#b782ff','#ff2397'],ranges=[[0,10],[10,22],[22,32]];
   for(let layer=0;layer<3;layer++){
    const [lo,hi]=ranges[layer],motion=waveMotion[layer];
    const band=smooth.slice(lo,hi),level=audioEnergy(band),hit=Math.max(0,level-motion.level);
    motion.level=level;motion.velocity+=(level-motion.position)*.24+hit*(1.8+layer*.35);motion.velocity*=.68;motion.position+=motion.velocity;
    if(level<.0001){motion.position=0;motion.velocity=0}
    const bounce=Math.max(0,Math.min(1.35,motion.position)),amplitude=Math.pow(bounce,.7);
    motion.phase+=(.10+layer*.045)+level*.35+hit*1.2;
    ctx.strokeStyle=colors[layer];ctx.lineWidth=2.5+level*1.8;ctx.beginPath();
    for(let i=0;i<=160;i++){const u=i/160,pos=u*(hi-lo-1),index=Math.floor(pos),f=pos-index,blend=f*f*(3-2*f);
     const local=band[index]*(1-blend)+band[Math.min(hi-lo-1,index+1)]*blend;
     const envelope=Math.pow(Math.sin(u*Math.PI),.65);
     const wave=Math.sin(u*Math.PI*(4+layer*2)-motion.phase)*.68+Math.sin(u*Math.PI*(9+layer*3)+motion.phase*1.37)*.24+Math.sin(u*Math.PI*2+motion.phase*.7)*.08;
     const y=h/2+wave*amplitude*(.65+local*.65)*h*.43*envelope;
     i?ctx.lineTo(u*w,y):ctx.moveTo(u*w,y);
    }ctx.stroke();
   }
  }else if(mode===4){runner.draw(ctx,w,h,now,smooth,sensitivity,runSpeed,skylineGain);
  }else{gridSmooth=audioLevels(frame.bands,gridSmooth);history.unshift([...gridSmooth]);history.pop();const rowFloors=history.map(row=>Math.min(...row)*.75),horizon=h*.24;ctx.strokeStyle='#ff2397';ctx.lineWidth=2;ctx.beginPath();ctx.arc(w/2,horizon,35,Math.PI,0);ctx.stroke();
   function point(z,x,floor=false){const depth=(z+1)/25,spread=.08+depth*1.6,row=history[23-z];
    const base=horizon+depth*depth*(h-horizon),anchor=Math.pow(Math.sin(x/31*Math.PI),.7)*Math.sqrt(Math.sin(depth*Math.PI));
    const peak=Math.pow(Math.max(0,row[x]-rowFloors[23-z]),1.25)*sensitivity*h*.85*depth*anchor;
    return [w/2+(x-15.5)*w/25*spread,base-(floor?0:peak)]}
   // Fixed floor provides a stable reference; sensitivity scales only terrain height.
   ctx.strokeStyle='#44265f';ctx.lineWidth=1;
   for(let z=0;z<24;z++){ctx.beginPath();for(let x=0;x<32;x++){const p=point(z,x,true);x?ctx.lineTo(...p):ctx.moveTo(...p)}ctx.stroke()}
   for(let x=0;x<32;x++){ctx.beginPath();for(let z=0;z<24;z++){const p=point(z,x,true);z?ctx.lineTo(...p):ctx.moveTo(...p)}ctx.stroke()}
   for(let z=0;z<24;z++){ctx.strokeStyle=z%3?'#8947da':'#ff2397';ctx.beginPath();for(let x=0;x<32;x++){const p=point(z,x);x?ctx.lineTo(...p):ctx.moveTo(...p)}ctx.stroke()}
   ctx.strokeStyle='#27ead5';ctx.lineWidth=1;for(let x=0;x<32;x++){ctx.beginPath();for(let z=0;z<24;z++){const p=point(z,x);z?ctx.lineTo(...p):ctx.moveTo(...p)}ctx.stroke()}
  }
 }
 requestAnimationFrame(draw);return {setSkylineSensitivity:v=>{if(Number.isFinite(v))skylineGain=Math.max(.1,Math.min(2,v))},cycleRunner:()=>{if(mode!==4)return null;const chosen=runner.cycle();try{localStorage.setItem('musicthing-runner-character',String(chosen.index))}catch{}return chosen.name},tapRunner:(x,y)=>{if(mode!==4)return null;const chosen=runner.tap(x,y);if(chosen)try{localStorage.setItem('musicthing-runner-character',String(chosen.index))}catch{}return chosen?.name||null},setRunnerSpeed:v=>{if(Number.isFinite(v))runSpeed=Math.max(.5,Math.min(2.5,v))},setSensitivity:v=>{if(Number.isFinite(v))sensitivity=Math.max(.5,Math.min(4,v))},setFrame:f=>frame=f,setMode:i=>{mode=i;showCanvas();ctx.fillStyle='#08060e';ctx.fillRect(0,0,canvas.width,canvas.height)},setEnabled:v=>enabled=v,stop:()=>active=false,hasShaders:!!webgl};
}
function feedback(canvas){const gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:false});if(!gl)throw Error('No WebGL');
 const vertex='attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
 const fragment=`precision mediump float;varying vec2 uv;uniform sampler2D previous;uniform float t,energy,copyOnly;uniform float bands[32];void main(){if(copyOnly>.5){gl_FragColor=texture2D(previous,uv);return;}vec2 p=uv-.5;float radius=length(p),angle=atan(p.y,p.x);float twist=.008*sin(t*.7+radius*13.)+.08*energy;float c=cos(twist),s=sin(twist);vec2 q=mat2(c,-s,s,c)*p*(.99-energy*.10)+.5;q+=.002*vec2(sin(p.y*14.+t),cos(p.x*12.-t));vec3 old=texture2D(previous,q).rgb*.957;float wave=0.;for(int i=0;i<32;i++){float a=float(i)*.19635;vec2 spot=vec2(cos(a),sin(a))*(.12+bands[i]*.42);wave+=.0015/(.004+length(p-spot))*(.1+bands[i]);}float ring=pow(max(0.,sin(radius*44.-t*3.+sin(angle*6.+t)*energy)),18.);vec3 neon=.5+.5*cos(t*.3+angle+vec3(0.,2.,4.));vec3 color=old+neon*wave*(.04+energy*.7)+vec3(.55,.05,.8)*ring*(.008+energy*.15);gl_FragColor=vec4(min(color,vec3(1.)),1.);}`;
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader unavailable');return s}
 const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader unavailable');gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
 const textures=[0,1].map(()=>{const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,512,256,0,gl.RGBA,gl.UNSIGNED_BYTE,null);return texture});
 const fb=gl.createFramebuffer(),locations=['t','energy','copyOnly','bands'].reduce((o,k)=>{o[k]=gl.getUniformLocation(program,k==='bands'?'bands[0]':k);return o},{});let current=0;
 return {draw(t,bands,energy){gl.useProgram(program);gl.uniform1f(locations.t,t);gl.uniform1f(locations.energy,energy);gl.uniform1fv(locations.bands,bands);gl.uniform1f(locations.copyOnly,0);gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,textures[1-current],0);gl.bindTexture(gl.TEXTURE_2D,textures[current]);gl.viewport(0,0,512,256);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);current=1-current;gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.bindTexture(gl.TEXTURE_2D,textures[current]);gl.uniform1f(locations.copyOnly,1);gl.viewport(0,0,canvas.width,canvas.height);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}};
}
