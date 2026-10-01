(()=>{
'use strict';
const META={
 jellyfish:['a',0],starfish:['a',1],turtle:['a',2],dolphin:['a',3],seahorse:['a',4],
 crab:['b',0],whale:['b',1],octopus:['b',2],clownfish:['b',3],anglerfish:['b',4]
};
const URLS={a:'assets/growth/growth-atlas-a.webp?v=12',b:'assets/growth/growth-atlas-b.webp?v=12'};
const imgs={},cache=new Map();
function load(k){if(imgs[k])return imgs[k];imgs[k]=new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=URLS[k];});return imgs[k];}
async function frame(id,stage){
 stage=Math.max(0,Math.min(4,Number(stage)||0));
 const key=id+':'+stage;if(cache.has(key))return cache.get(key);
 const m=META[id];if(!m)return '';
 const im=await load(m[0]);
 // Keep the crop at the atlas' native 300x300 resolution.
 // The previous implementation enlarged it to 600x600 and softened the artwork.
 const c=document.createElement('canvas');c.width=c.height=300;
 const x=c.getContext('2d',{alpha:true});
 x.clearRect(0,0,300,300);
 x.drawImage(im,stage*300,m[1]*300,300,300,0,0,300,300);
 const u=c.toDataURL('image/png');
 cache.set(key,u);return u;
}
function D(){return window.OceanData}function S(){return window.OceanStore?.get?.()}
function creature(id){return D()?.CREATURES?.find(c=>c.id===id)}
function stageFor(id){const s=S();return D()?.levelInfo?.(Number(s?.xp?.[id]||0))?.visualStage||0}
async function setImg(el,id,stage){
 if(!el||!META[id])return;
 const sig=id+':'+stage;if(el.dataset.growthV12===sig)return;
 try{
  el.src=await frame(id,stage);
  el.dataset.growthV12=sig;
  el.style.backgroundImage='none';
  el.style.objectFit='contain';
  el.style.objectPosition='center';
  el.style.imageRendering='auto';
 }catch(e){console.warn('growth image',id,e)}
}
function idFromAlt(alt=''){const list=D()?.CREATURES||[];return list.find(c=>alt.includes(c.name)||alt.includes(c.short))?.id}
async function apply(){const d=D(),s=S();if(!d||!s)return;
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
const start=()=>{load('a');load('b');schedule();new MutationObserver(schedule).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});window.addEventListener('ocean:state',schedule)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();