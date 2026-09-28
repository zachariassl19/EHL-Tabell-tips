(()=>{
const API='https://bioqeczhqedlhbvprxci.supabase.co/functions/v1/ehl-provisional-table';
const css=document.createElement('style');css.textContent=`
.provisionalScore{margin-bottom:14px;padding:14px 16px;border-radius:16px;border:1px solid #4b5f7e;background:linear-gradient(135deg,#101a2b,#0d1422);display:flex;justify-content:space-between;align-items:center;gap:14px}.provisionalScore b{font-size:24px}.provisionalScore .ey{margin-bottom:4px}.provisionalScore .sub{max-width:520px}.provisionalScore .scoreRight{text-align:right;white-space:nowrap}.provisionalScore .change{font-size:11px;color:#ffd7a6;font-weight:800;margin-top:3px}.provisionalScore.loading{opacity:.8}@media(max-width:640px){.provisionalScore{align-items:flex-start;flex-direction:column}.provisionalScore .scoreRight{text-align:left}.provisionalScore b{font-size:21px}}
`;document.head.append(css);
let busy=false,lastFetch=0;
function ensureBox(){const tips=document.querySelector('#tipsView');if(!tips)return null;let box=document.querySelector('#provisionalTableScore');if(!box){box=document.createElement('div');box.id='provisionalTableScore';box.className='provisionalScore loading';box.innerHTML='<div><div class="ey">Foreløpig tabelltips</div><div class="sub">Henter live-poeng…</div></div>';tips.insertBefore(box,tips.firstChild)}return box}
async function drawProvisional(force=false){
 const token=localStorage.getItem('ehlToken')||'';if(!token)return;
 const box=ensureBox();if(!box||busy)return;
 if(!force&&Date.now()-lastFetch<15000)return;
 busy=true;lastFetch=Date.now();
 try{
  const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json','x-session-token':token},body:'{}'});const x=await r.json();if(!r.ok)throw Error(x.error||'Kunne ikke hente foreløpig poeng');
  if(x.reason==='admin'){box.remove();return}
  box.classList.remove('loading');
  if(!x.available){box.innerHTML='<div><div class="ey">Foreløpig tabelltips</div><div class="sub">Poengene vises når både tipset ditt og live-tabellen er tilgjengelig.</div></div>';return}
  box.innerHTML='<div><div class="ey">Foreløpig tabelltips</div><div class="sub">Dette er poengene tabelltipset ditt ville gitt mot tabellen akkurat nå.</div><div class="tiny">'+x.exact+' eksakte plasseringer · '+x.oneOff+' én plass unna · '+x.top3Hits+' av dine topp 3 er i topp 3</div></div><div class="scoreRight"><b>'+x.points+' p</b><div class="change">Kan endre seg etter hver kamp</div></div>';
 }catch(e){box.classList.remove('loading');box.innerHTML='<div><div class="ey">Foreløpig tabelltips</div><div class="tiny">Kunne ikke hente live-poengene akkurat nå.</div></div>'}finally{busy=false}
}
function boot(){ensureBox();drawProvisional(true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,250));else setTimeout(boot,250);
const obs=new MutationObserver(()=>{if(document.querySelector('#tipsView')&&localStorage.getItem('ehlToken')){ensureBox();drawProvisional()}});obs.observe(document.documentElement,{childList:true,subtree:true});
setInterval(()=>drawProvisional(true),60000);
})();