const key='musicthing-playback-state';
export function createPlaybackSync({api,visuals,windowObject=typeof window==='undefined'?undefined:window,storage=typeof localStorage==='undefined'?undefined:localStorage,now=Date.now}){
 let nativeAt=-Infinity;
 function set(playing,persist=true,priority=true){if(typeof playing!=='boolean')return;if(priority)nativeAt=now();visuals.setPlayback?.(playing);if(persist)try{storage?.setItem(key,JSON.stringify({playing,at:now()}))}catch{}}
 const native=message=>{const value=message?.payload??message;if(typeof value?.is_playing==='boolean')set(value.is_playing);else if(typeof value?.playing==='boolean')set(value.playing)};
 api.on('song',native);api.on('music',native);api.on('music-result',message=>{const result=message?.payload;if(!result?.error&&result?.section==='playing'&&typeof result.data?.playing==='boolean'&&now()-nativeAt>=2000)set(result.data.playing,true,false)});
 windowObject?.addEventListener('storage',event=>{if(event.key!==key)return;try{const data=JSON.parse(event.newValue);if(now()-data.at<10000)set(data.playing,false)}catch{}});
 try{const data=JSON.parse(storage?.getItem(key)||'null');if(data&&now()-data.at<10000)set(data.playing,false)}catch{}
 return{set};
}
