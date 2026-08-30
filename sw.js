const CACHE='lawbook-flat-v1';
const CORE=["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./행정규제기본법.pdf", "./행정기본법.pdf", "./행정대집행법.pdf", "./행정소송법.pdf", "./행정심판법.pdf", "./행정절차법.pdf", "./형법.pdf", "./형사소송법.pdf"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      const clone=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); return resp;
    })));
  }
});
