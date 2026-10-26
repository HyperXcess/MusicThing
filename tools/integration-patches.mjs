export const bundleSpecs=[
 {file:'index-BoMDv8nD.js',v:'ye',app:'l',dispatch:'Se',method:'async handleServerAction(o){',arg:'o',pref:'$',buttons:'de',jsx:'u',view:'s'},
 {file:'index-legacy-DSl9FxfH.js',v:'t',app:'e',dispatch:'k',method:'async handleServerAction(e){',arg:'e',pref:'bt',buttons:'Gt',jsx:'m',view:'n'}
];
export function patchBundle(source,spec){source=patchSongMetadata(source);source=source.replace('const previous=window.__hyperMusicReturnApp||"spotify";','const remembered=window.__hyperMusicReturnApp;const previous=remembered&&!["landing","settings","musicthing"].includes(remembered)?remembered:"spotify";');
 const {v,app,dispatch,arg,pref,buttons,method,view}=spec;
 const previousForwarded=`(${v}.app==${app}||${app}==="spotify"&&${v}.app==="musicthing"&&(${v}.type==="visualizer-frame"||${v}.type==="music-result"))&&${dispatch}(${v})`;
 const forwarded=`(${v}.app==${app}||${app}==="musicthing"&&${v}.app==="spotify"&&${v}.type==="song"||${app}==="spotify"&&${v}.app==="musicthing"&&(${v}.type==="visualizer-frame"||${v}.type==="music-result"))&&${dispatch}(${v})`;
 if(!source.includes(forwarded)){
  const candidates=[previousForwarded,`${v}.app==${app}&&${dispatch}(${v})`,`(${v}.app==${app}||${app}==="spotify"&&${v}.app==="musicthing"&&${v}.type==="visualizer-frame")&&${dispatch}(${v})`];
  const before=candidates.find(x=>source.includes(x));if(!before)throw Error('Unsupported Spotify forwarding: '+spec.file);source=source.replace(before,forwarded);
 }
 const currentArg=spec.file==='index-BoMDv8nD.js'?'s':'n';
 const edits=[
  {marker:'/*music-preserve-view*/',anchor:`updateCurrentView:${currentArg}=>{`,text:`updateCurrentView:${currentArg}=>{/*music-preserve-view*/if(${currentArg}.name==="landing"){const current=${pref}.getState().preferences.currentView;if(current&&["musicthing","spotify"].includes(current.name))${currentArg}=current;}`},
  {marker:'/*music-open-context*/',anchor:method,text:method+`/*music-open-context*/if(${arg}.id==="open"&&${arg}.value==="musicthing"){const current=${pref}.getState().preferences.currentView.name;if(current!=="musicthing")window.__hyperMusicReturnApp=current;}`},
  {marker:'/*music-return*/',anchor:method,text:method+`/*music-return*/if(${arg}.id==="music-dismiss"){const remembered=window.__hyperMusicReturnApp;const previous=remembered&&!["landing","settings","musicthing"].includes(remembered)?remembered:"spotify";window.__hyperMusicReturnApp=null;${buttons}.getState().executeAction({id:"open",source:"server",value:previous,enabled:true});return;}`},
  {marker:'/*music-no-player-padding*/',anchor:`${view}.onboarding&&${view}.miniplayer.visible&&`,text:`${view}.onboarding&&${view}.miniplayer.visible&&${view}.currentView.name!=="musicthing"&&/*music-no-player-padding*/`},
  {marker:'/*music-no-mini-player*/',anchor:`${view}.miniplayer.visible&&${view}.onboarding&&`,text:`${view}.miniplayer.visible&&${view}.onboarding&&${view}.currentView.name!=="musicthing"&&/*music-no-mini-player*/`}
 ];
 for(const edit of edits){if(source.includes(edit.marker))continue;if(!source.includes(edit.anchor))throw Error('Unsupported MusicThing integration: '+spec.file);source=source.replace(edit.anchor,edit.text)}
 return source;
}
export function patchSpotifyIndex(source){if(source.includes('musicthing-link.js'))return source;if(!source.includes('</body>'))throw Error('Spotify client index has no body end');return source.replace('</body>','<script src="./musicthing-link.js"></script></body>')}

// Artwork may already be proxied; skip rewriting it, never the song update.
export function patchSongMetadata(source){
 const edits=[
 ['if(s.thumbnail.includes("".concat(v.ip,":").concat(v.port)))return;s.thumbnail="http://".concat(v.ip,":").concat(v.port,"/proxy/v1?url=").concat(encodeURIComponent(s.thumbnail))','/*music-song-metadata*/if(!s.thumbnail.includes("".concat(v.ip,":").concat(v.port)))s.thumbnail="http://".concat(v.ip,":").concat(v.port,"/proxy/v1?url=").concat(encodeURIComponent(s.thumbnail))'],
 ['if(n.thumbnail.includes(`${e.ip}:${e.port}`))return;n.thumbnail=`http://${e.ip}:${e.port}/proxy/v1?url=${encodeURIComponent(n.thumbnail)}`','/*music-song-metadata*/if(!n.thumbnail.includes(`${e.ip}:${e.port}`))n.thumbnail=`http://${e.ip}:${e.port}/proxy/v1?url=${encodeURIComponent(n.thumbnail)}`']
 ];for(const [before,after] of edits)source=source.replace(before,after);return source;
}
// A secondary library lookup must never block publishing current playback metadata.
export function patchSpotifyMetadata(source){return source.replace('const isLiked = await this.checkLiked(currentPlayback.item.id);','/*music-nonblocking-metadata*/const isLiked = undefined;').replace('liked: isLiked[0],','liked: isLiked,')}
