export function faceState(now,id,{resting=false,walking=false,attack=null,visible=false,newTarget=Infinity,celebrate=Infinity}={}){
 const period=3700+id*290,t=(now+id*733)%period,cycle=Math.floor((now+id*733)/period);const blink=t<105||cycle%4===0&&t>210&&t<280;
 const emotion=resting?'peaceful':attack?.move==='duck'?'shock':attack?.move==='jump'?'surprise':attack&&attack.age<.3?'anticipation':attack&&attack.impactAge!=null&&attack.impactAge<.15?'anger':celebrate<650?'happy':visible&&newTarget<220?'shock':visible?'anticipation':walking?'happy':'focused';return{emotion,blink};
}
export function paintFace({line,oval,shape},x,y,face,id,accent){
 const {emotion,blink}=face,wide=emotion==='shock'||emotion==='surprise',angry=emotion==='anger',happy=emotion==='happy'||emotion==='peaceful',iris=['#8d5a24','#744193','#197e75','#a65a23','#27ead5','#7d633d'][id];
 if(id===4){for(const dx of [2,15]){if(blink)line(accent,1.4,[[x+dx-3,y+1],[x+dx+3,y+1]]);else shape(accent,[[x+dx-3,y-(wide?5:2)],[x+dx+3,y-(wide?5:2)],[x+dx+3,y+(wide?6:4)],[x+dx-3,y+(wide?6:4)]])}line(accent,1.2,[[x+6,y+13],[x+11,y+(happy?16:13)],[x+17,y+13]]);return}
 for(const [dx,rx]of [[1,3],[12,5]]){if(blink){line('#251b32',1.6,[[x+dx-rx,y+1],[x+dx+rx,y+1]]);continue}oval('#fff7ef',x+dx,y+1,rx,wide?7:4.8);oval(iris,x+dx+1,y+1,rx*.56,wide?4.6:3.2);oval('#151422',x+dx+1.5,y+1,rx*.27,wide?3:2);oval('#fff',x+dx+2,y-.5,.8,.8);line('#382538',1.3,[[x+dx-rx,y-(angry?6:8)],[x+dx+rx,y-(angry?3:wide?10:7)]])}
 if(wide)oval('#63374a',x+13,y+14,3.7,5);
 else if(happy)line('#8d4e51',1.5,[[x+7,y+12],[x+12,y+16],[x+18,y+12]]);
 else if(angry){shape('#fff1d9',[[x+8,y+12],[x+18,y+11],[x+17,y+15],[x+9,y+15]]);line('#63374a',1,[[x+8,y+12],[x+18,y+11]])}
 else line('#9c6054',1.3,[[x+9,y+13],[x+17,y+12]]);
}
