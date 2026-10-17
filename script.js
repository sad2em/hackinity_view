(()=>{'use strict';
const $=id=>document.getElementById(id),config=window.HACKINITY_CONFIG||{},geo=window.HACKINITY_GEOMETRY,reduced=matchMedia('(prefers-reduced-motion: reduce)');
$('year').textContent=new Date().getFullYear();
try{const url=new URL(config.telegram);if(url.protocol==='https:'&&url.hostname==='t.me'&&url.pathname.length>1){$('telegram').href=url.href;$('telegram').hidden=false;}}catch{}
if(typeof config.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)){$('email').href='mailto:'+config.email;$('email').hidden=false;}
if(!geo)return;
const parts=[$('part-left'),$('part-right')],slash=$('slash'),finals=parts.map(p=>p.getAttribute('d')),group=$('shards'),shards=[];
for(let i=0;i<12;i++){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d','M-3 -1 L3 0 L-1 4Z');p.setAttribute('fill',i%4?'#c8ff1b':'#b4e9df');p.style.opacity=0;group.append(p);shards.push(p);}
const clamp=x=>Math.min(1,Math.max(0,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},step=(t,a,d)=>ease((t-a)/d);
function shape(i,k){return geo.starts[i].map((a,j)=>{const b=geo.ends[i][j];return(j?'L':'M')+(a[0]+(b[0]-a[0])*k).toFixed(2)+' '+(a[1]+(b[1]-a[1])*k).toFixed(2)}).join(' ')+'Z';}
function finish(){parts.forEach((p,i)=>{p.setAttribute('d',finals[i]);p.removeAttribute('style');p.removeAttribute('transform');});slash.removeAttribute('style');slash.removeAttribute('transform');shards.forEach(p=>p.style.opacity=0);}
let elapsed=0,last=0,frame=0,paused=false,visible=true,done=false;
function render(t){const morph=step(t,1.65,.55);parts.forEach((p,i)=>{p.setAttribute('d',morph===1?finals[i]:shape(i,morph));p.style.fillOpacity=step(t,.8,.35);p.style.stroke='#c8ff1b';p.style.strokeWidth=String(1-step(t,1.1,.2));p.setAttribute('pathLength','1');p.style.strokeDasharray='1';p.style.strokeDashoffset=String(1-step(t,.1+i*.12,.9));});const strike=step(t,1.5,.18);slash.style.opacity=String(strike);slash.setAttribute('transform',`translate(${(1-strike)*110} ${(1-strike)*-65})`);
shards.forEach((p,i)=>{const u=Math.max(0,t-1.65),angle=i*2.399;p.style.opacity=t<1.65?'0':String(1-step(t,1.8,.8));p.setAttribute('transform',`translate(${150+i%4*14+Math.cos(angle)*u*65} ${116+Math.sin(angle)*u*55+18*u*u}) rotate(${i*30+u*140})`);});}
function tick(now){if(last)elapsed+=Math.min(now-last,80);last=now;render(elapsed/1000);if(elapsed>=2700){finish();done=true;frame=0;return;}frame=requestAnimationFrame(tick);}
function start(){cancelAnimationFrame(frame);elapsed=0;last=0;done=false;paused=false;document.body.classList.remove('paused');if($('pause')){$('pause').textContent='إيقاف الحركة';$('pause').setAttribute('aria-pressed','false');}if(reduced.matches){finish();done=true;return;}render(0);if(visible)frame=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(frame);frame=0;last=0;document.body.classList.toggle('paused',paused||!visible);if(!paused&&visible&&!done&&!reduced.matches)frame=requestAnimationFrame(tick);}
$('replay')?.addEventListener('click',start);$('pause')?.addEventListener('click',()=>{paused=!paused;$('pause').textContent=paused?'تشغيل الحركة':'إيقاف الحركة';$('pause').setAttribute('aria-pressed',String(paused));sync();});
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;sync();});
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&!document.hidden;sync();},{threshold:0});observer.observe($('emblem'));
reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);finish();done=true;}else start();});start();
})();
