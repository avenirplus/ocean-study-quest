const CACHE='ocean-study-quest-v12';
const ASSETS=[
  "./",
  "./index.html",
  "./css/parts/part1.css?v=12",
  "./css/parts/part2.css?v=12",
  "./css/parts/part3.css?v=12",
  "./css/parts/part4.css?v=12",
  "./css/parts/atlas.css?v=12",
  "./js/creatures/anglerfish.js?v=12",
  "./js/creatures/bundle1.js?v=12",
  "./js/creatures/bundle2.js?v=12",
  "./js/creatures/bundle3.js?v=12",
  "./js/data.js?v=12",
  "./js/storage.js?v=12",
  "./js/audio.js?v=12",
  "./js/app-gzip.js?v=12",
  "./js/app-loader.js?v=12",
  "./js/growth-v10.js?v=12",
  "./js/xp-recovery.js?v=12",
  "./assets/growth/growth-atlas-a.webp?v=12",
  "./assets/growth/growth-atlas-b.webp?v=12",
  "./manifest.webmanifest?v=12",
  "./assets/ui/icon.svg?v=12"
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const nav=e.request.mode==='navigate';
  if(nav){
    e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return resp;}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;}).catch(()=>caches.match(e.request)));
});
