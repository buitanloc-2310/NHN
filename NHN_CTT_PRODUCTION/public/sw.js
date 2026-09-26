const CACHE='nhn-v4.4-public-ui-rebuild';
const SHELL=['/','/styles.css','/app.js','/assets/nhn-logo-official.jpg','/assets/favicon.png','/assets/apple-touch-icon.png','/assets/nhn-icon-192.png','/assets/nhn-icon-512.png','/manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/files/')){event.respondWith(fetch(req));return;}
  if(req.mode==='navigate'){event.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('/',cp));return r;}).catch(()=>caches.match('/')));return;}
  if(['/app.js','/styles.css','/manifest.webmanifest'].includes(url.pathname)){event.respondWith(fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;}).catch(()=>caches.match(req)));return;}
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})));
});
