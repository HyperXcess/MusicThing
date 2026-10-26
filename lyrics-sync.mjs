export function parseLrc(source=''){
 const result=[],offset=Number(source.match(/\[offset:([+-]?\d+)\]/i)?.[1]||0);
 for(const row of source.split(/\r?\n/)){const stamps=[...row.matchAll(/\[(\d+):(\d{2})(?:\.(\d{1,3}))?\]/g)];const text=row.replace(/\[[^\]]*\]/g,'').trim();for(const stamp of stamps){const seconds=Number(stamp[2]);if(seconds>=60)continue;result.push({at:Math.max(0,(Number(stamp[1])*60+seconds)*1000+Number((stamp[3]||'').padEnd(3,'0'))+offset),text})}}
 result.sort((a,b)=>a.at-b.at);const merged=[];for(const line of result){const last=merged[merged.length-1];if(last?.at===line.at){if(line.text&&!last.text.includes(line.text))last.text=[last.text,line.text].filter(Boolean).join('\n')}else merged.push(line)}return merged;
}
export function lyricIndex(lines,position){let lo=0,hi=lines.length-1,found=-1;while(lo<=hi){const mid=(lo+hi)>>1;if(lines[mid].at<=position){found=mid;lo=mid+1}else hi=mid-1}return found}
export function playbackPosition(playback,receivedAt,now){return Math.max(0,Math.min(playback?.track?.duration||Infinity,(playback?.progress||0)+(playback?.playing?Math.max(0,now-receivedAt):0)))}
