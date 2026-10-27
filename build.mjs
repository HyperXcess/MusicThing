import {build} from 'esbuild';import {mkdir,copyFile,writeFile,stat,readFile,cp,rm} from 'node:fs/promises';import {execFileSync} from 'node:child_process';
const meta=JSON.parse(await readFile('package.json','utf8'));
await mkdir('dist/server',{recursive:true});await mkdir('dist/client',{recursive:true});await mkdir('dist/icons',{recursive:true});
await build({entryPoints:['server.mjs'],outfile:'dist/server/index.js',bundle:true,platform:'node',format:'esm',target:'node20',banner:{js:"import {createRequire as _req} from 'node:module';import {fileURLToPath as _url} from 'node:url';import {dirname as _dir} from 'node:path';const require=_req(import.meta.url),__filename=_url(import.meta.url),__dirname=_dir(__filename);"}});
await build({entryPoints:['client.mjs'],outfile:'dist/client/app.js',bundle:true,platform:'browser',format:'iife',target:'chrome69'});await copyFile('index.html','dist/client/index.html');await copyFile('style.css','dist/client/style.css');
if(await stat('dist/server/visualizer-capture').then(s=>s.mtimeMs).catch(()=>0)<(await stat('visualizer.swift')).mtimeMs)execFileSync('/usr/bin/swiftc',['-module-cache-path','swift-cache','-target','arm64-apple-macos13.0','visualizer.swift','-o','dist/server/visualizer-capture','-framework','ScreenCaptureKit','-framework','Accelerate']);
await writeFile('dist/manifest.json',JSON.stringify({id:'musicthing',label:'VisualThing',version:meta.version,description:'Eight audio-reactive visualizers, animated runners, fighters and DJs, timed lyrics and Spotify controls',author:'HyperXcess',homepage:meta.homepage,repository:meta.homepage,postinstall:true,postinstall_script:'postinstall.mjs',postinstall_message:'Stages Spotify visualizer and VisualThing navigation support with backups. Push the staged client and restart Chromium after initialization.',platforms:['mac','macarm'],tags:['webappOnly'],isWebApp:true,requires:[],requiredVersions:{server:'>=0.11.17',client:'>=0.11.2 <0.11.3'}},null,2));
await writeFile('dist/icons/musicthing.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 9v6M7 4v16M12 7v10M17 2v20M21 9v6"/></svg>');

await build({entryPoints:['spotify-link.mjs'],outfile:'dist/spotify-musicthing.js',bundle:true,platform:'browser',format:'iife',target:'chrome69'});

await mkdir('dist/integrations',{recursive:true});await copyFile('dist/spotify-musicthing.js','dist/integrations/spotify-musicthing.js');
await copyFile('tools/postinstall.mjs','dist/postinstall.mjs');await copyFile('tools/integration-patches.mjs','dist/integration-patches.mjs');
await cp('third-party','dist/third-party',{recursive:true});await copyFile('LICENSE','dist/LICENSE');await copyFile('THIRD_PARTY_NOTICES.md','dist/THIRD_PARTY_NOTICES.md');

await build({entryPoints:['control-options.mjs'],outfile:'dist/client/control-options.js',bundle:true,platform:'browser',format:'iife',target:'chrome69'});await copyFile('control-options.html','dist/client/control-options.html');await rm('dist/client/fighter-art',{recursive:true,force:true});await mkdir('dist/client/fighter-art',{recursive:true});for(let i=0;i<6;i++)for(const kind of ['base','advanced'])await copyFile('fighter-art/'+i+'-'+kind+'.webp','dist/client/fighter-art/'+i+'-'+kind+'.webp');

await copyFile('tools/two-finger-root.mjs','dist/two-finger-root.mjs');
