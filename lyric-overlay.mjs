import {createCharacterPicker} from './character-picker.mjs';
import {setButtonIcon} from './icons.mjs';
import {lyricIndex,playbackPosition} from './lyrics-sync.mjs';
// Separate request IDs keep the overlay independent of VisualThing's Lyrics page.
export function createLyricOverlay({api,root,active,scopeApp,visuals}){
 const button=document.createElement('button'),caption=document.createElement('div'),line=document.createElement('div'),nextLine=document.createElement('div');
 setButtonIcon(button,'lyrics',20);button.title='Show or hide lyrics';button.setAttribute('aria-label','Show lyrics over visuals');
 button.style.cssText='position:absolute;left:12px;top:8px;z-index:12;width:48px;min-width:48px;min-height:48px;padding:8px;border:1px solid #744193;border-radius:12px;background:#08060e;color:#fff;font:18px Arial;touch-action:manipulation';
 caption.style.cssText='position:absolute;left:45%;right:64px;top:28px;z-index:11;text-align:right;pointer-events:none;background:transparent';
 line.style.cssText='color:#f5effa;font:400 20px/1.35 Arial;overflow-wrap:break-word;white-space:pre-line';
 nextLine.style.cssText='margin-top:8px;color:#82718f;font:400 16px/1.35 Arial;overflow-wrap:break-word;white-space:pre-line';
 caption.setAttribute('aria-live','off');caption.append(line,nextLine);root.append(button,caption);
 const picker=visuals?createCharacterPicker({root,visuals,active}):null;
 let enabled=false,playback=null,receivedAt=0,track=null,lines=[],pending=new Map(),sequence=0,lastPoll=0,notice='',wasActive=false;
 const key='musicthing-lyric-overlay';try{enabled=localStorage.getItem(key)==='true'}catch{}
 function request(section){const id='lyric-overlay-'+(scopeApp?'spotify':'musicthing')+'-'+(++sequence);pending.set(section,id);api.send({...scopeApp?{app:scopeApp}:{},type:'music-request',payload:{section,id}})}
 function render(){picker?.render();const shown=active();button.hidden=!shown;button.setAttribute('aria-pressed',String(enabled));button.style.color=enabled?'#27ead5':'#fff';button.setAttribute('aria-label',enabled?'Hide lyrics over visuals':'Show lyrics over visuals');const i=lyricIndex(lines,playbackPosition(playback,receivedAt,Date.now()));const text=notice||(track===playback?.track?.id&&i>=0?lines[i]?.text:'');if(line.textContent!==(text||''))line.textContent=text||'';const upcoming=!notice&&track===playback?.track?.id?lines.slice(i+1).find(item=>item.text?.trim())?.text||'':'';if(nextLine.textContent!==upcoming)nextLine.textContent=upcoming;line.hidden=!shown||!enabled||!text;nextLine.hidden=!shown||!enabled||!upcoming;caption.hidden=!shown||!enabled;}
 function reset(){track=null;lines=[];notice='';pending.delete('lyrics')}
 function refresh(){reset();notice='Finding live lyrics…';lastPoll=Date.now();request('playing');render()}
 button.onclick=e=>{e?.stopPropagation();enabled=!enabled;try{localStorage.setItem(key,String(enabled))}catch{}if(enabled)refresh();else{reset();pending.clear()}render()};
 api.on('music-result',message=>{const m=message.payload;if(!enabled||pending.get(m.section)!==m.id)return;pending.delete(m.section);if(m.error){if(m.section==='lyrics'){track=playback?.track?.id;notice='Live lyrics unavailable'}else{reset();notice='Connect Spotify for lyrics'}render();return}if(m.section==='playing'){const previous=playback?.track?.id;playback=m.data;receivedAt=Date.now();if(previous!==playback?.track?.id||track!==playback?.track?.id&&!pending.has('lyrics')){reset();if(playback?.track?.id){notice='Finding live lyrics…';request('lyrics')}else notice='Start a song for lyrics'}}else if(m.section==='lyrics'){if(m.data.trackId!==playback?.track?.id){reset();request('playing');return}track=m.data.trackId;lines=Array.isArray(m.data.lines)?m.data.lines:[];notice=lines.length?'':'No timed lyrics for this track'}render()});
 window.addEventListener('storage',e=>{if(e.key!==key)return;enabled=e.newValue==='true';if(enabled)refresh();else reset();render()});
 setInterval(()=>{const now=Date.now(),shown=active();if(enabled&&shown&&(!wasActive||now-lastPoll>=2500)){lastPoll=now;request('playing')}wasActive=shown;render()},100);
 render();return{button,line,nextLine};
}
