(()=>{
'use strict';
const META={
 jellyfish:['a',0],starfish:['a',1],turtle:['a',2],dolphin:['a',3],seahorse:['a',4],
 crab:['b',0],whale:['b',1],octopus:['b',2],clownfish:['b',3],anglerfish:['b',4]
};
const URLS={a:'assets/growth/growth-atlas-a.webp?v=11',b:'assets/growth/growth-atlas-b.webp?v=11'};
const CLEAR='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const imgs={};
function preload(k){if(imgs[k])return;const im=new Image();im.decoding='async';im.src=URLS[k];imgs[k]=im;}
function D(){return window.OceanData}function S(){return window.OceanStore?.get?.()}
function creature(id){return D()?.CREATURES?.find(c=>c.id===id)}
function stageFor(id){const s=S();return D()?.levelInfo?.(Number(s?.xp?.[id]||0))?.visualStage||0}
function setImg(el,id,stage){
 if(!el||!META[id])return;
 stage=Math.max(0,Math.min(4,Number(stage)||0));
 const m=META[id],sig=id+':'+stage;
 if(el.dataset.growthV11===sig)return;
 preload(m[0]);
 // Use the original atlas directly. This avoids the old 300→600 canvas upscale,
 // WebP re-encode, then CSS downscale chain that softened artwork on Retina screens.
 el.src=CLEAR;
 el.style.backgroundImage='url("'+URLS[m[0]]+'")';
 el.style.backgroundSize='500% 500%';
 el.style.backgroundPosition=(stage*25)+'% '+(m[1]*25)+'%';
 el.style.backgroundRepeat='no-repeat';
 el.style.backgroundColor='transparent';
 el.style.objectFit='contain';
 el.style.objectPosition='center';
 el.style.imageRendering='auto';
 el.dataset.growthV11=sig;
}
function idFromAlt(alt=''){const list=D()?.CREATURES||[];return list.find(c=>alt.includes(c.name)||alt.includes(c.short))?.id}
function apply(){const d=D(),s=S();if(!d||!s)return;
 const active=s.active||'jellyfish';
 document.querySelectorAll('.creature-visual img').forEach(el=>{const id=idFromAlt(el.alt)||active;setImg(el,id,stageFor(id))});
 document.querySelectorAll('.growth-road .growth-step img').forEach((el,i)=>setImg(el,active,i));
 document.querySelectorAll('.creature-card img').forEach(el=>{const id=el.closest('[data-id]')?.dataset.id||idFromAlt(el.alt);if(id)setImg(el,id,stageFor(id))});
 const demo=[creature(active),...(d.CREATURES||[]).filter(c=>c.id!==active).slice(0,3)].filter(Boolean);
 document.querySelectorAll('.race-demo .race-lane img').forEach((el,i)=>{const c=demo[i];if(c)setImg(el,c.id,i===0?stageFor(c.id):d.levelInfo(200).visualStage)});
 document.querySelectorAll('.study-race-live .live-lane img').forEach((el,i)=>{const c=i===0?creature(active):d.CREATURES[(i+1)%d.CREATURES.length];if(c)setImg(el,c.id,i===0?stageFor(c.id):2)});
 document.querySelectorAll('.xp-recovery-row img').forEach((el,i)=>{const c=d.CREATURES[i];if(c)setImg(el,c.id,stageFor(c.id))});
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
const start=()=>{preload('a');preload('b');schedule();new MutationObserver(schedule).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});window.addEventListener('ocean:state',schedule)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();