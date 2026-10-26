import http from 'node:http';import net from 'node:net';
const suffixes=['spotify.com','scdn.co','spotifycdn.com','spotifycdn.net','spotify.net','pscdn.co','spotifycdn.net','spotifycdn.com'];
export const allowedHost=host=>suffixes.some(s=>host===s||host.endsWith('.'+s));
export function startSpotifyProxy(){const sockets=new Set();const pac='function FindProxyForURL(url,host){var domains='+JSON.stringify(suffixes)+';for(var i=0;i<domains.length;i++)if(host===domains[i]||dnsDomainIs(host,"."+domains[i]))return "PROXY 127.0.0.1:8892";return "DIRECT";}';
 const server=http.createServer((req,res)=>{if(req.url==='/proxy.pac'){res.writeHead(200,{'Content-Type':'application/x-ns-proxy-autoconfig','Cache-Control':'no-store'});res.end(pac);return}res.writeHead(403);res.end('Only Spotify HTTPS connections are supported.');});
 server.on('connect',(req,client,head)=>{let target;try{target=new URL('https://'+req.url)}catch{client.end('HTTP/1.1 400 Bad Request\r\n\r\n');return}if((target.port&&target.port!=='443')||!allowedHost(target.hostname)){client.end('HTTP/1.1 403 Forbidden\r\n\r\n');return}
  const upstream=net.connect(443,target.hostname);sockets.add(client);sockets.add(upstream);upstream.setTimeout(120000,()=>upstream.destroy());client.on('error',()=>upstream.destroy());upstream.on('error',()=>client.destroy());upstream.on('connect',()=>{client.write('HTTP/1.1 200 Connection Established\r\n\r\n');if(head.length)upstream.write(head);client.pipe(upstream);upstream.pipe(client)});client.on('close',()=>{upstream.destroy();sockets.delete(client);sockets.delete(upstream)});
 });
 server.on('error',()=>{});server.listen(8892,'127.0.0.1');return {close:()=>{for(const s of sockets)s.destroy();server.close()}};
}
