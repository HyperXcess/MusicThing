import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const assets=process.argv[2];if(!assets)throw Error('Specify a staged DeskThing assets directory');
const edits=[['index-BoMDv8nD.js','ye'],['index-legacy-DSl9FxfH.js','t']];
const changes=[];
for(const [name,v]of edits){const file=join(assets,name),source=await readFile(file,'utf8'),before=`${v}.app==="musicthing"&&${v}.type==="visualizer-frame"`,after=`${v}.app==="musicthing"&&(${v}.type==="visualizer-frame"||${v}.type==="music-result")`;if(source.includes(after))continue;if(source.split(before).length!==2)throw Error('Unsupported client forwarding in '+name);changes.push([file,source.replace(before,after)])}
for(const [file,source]of changes)await writeFile(file,source);
