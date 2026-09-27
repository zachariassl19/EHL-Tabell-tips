(()=>{
const API='https://bioqeczhqedlhbvprxci.supabase.co/functions/v1/ehl-provisional-table';
const css=document.createElement('style');css.textContent=`
.provisionalScore{margin-bottom:14px;padding:14px 16px;border-radius:16px;border:1px solid #4b5f7e;background:linear-gradient(135deg,#101a2b,#0d1422);display:flex;justify-content:space-between;align-items:center;gap:14px}.provisionalScore b{font-size:24px}.provisionalScore .ey{margin-bottom:4px}.provisionalScore .sub{max-width:520px}.provisionalScore .scoreRight{text-align:right;white-space:nowrap}.provisionalScore .change{font-size:11px;color:#ffd7a6;font-weight:800;margin-top:3px}@media(max-width:640px){.provisionalScore{align-items:flex-start}.provisionalScore b{font-size:21px}}
`;document.head.append(css);
async function drawProvisional(){try{
 if(typeof D==='undefined'||!D?.user||D.user.is_admin)return;
 const tips=document.querySelector('#tipsView');if(!tips)return;
 let box=document.querySelector('#provisionalTableScore');if(!box){box=document.createElement('div');box.id='provisionalTableScore';box.className='provisionalScore';tips.insertBefore(box,tips.firstChild)}
 const token=localStorage.getItem('ehlToken')||'';const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json','x-session-token':token},body:'{}'});const x=await r.json();if(!r.ok)throw Error(x.error||'Kunne ikke hente foreløpig poeng');
 if(!x.available){box.innerHTML='<div><div class="ey">Foreløpig tabelltips</div><div class="sub">Poengene vises når både tipset ditt og live-tabellen er tilgjengelig.</div></div>';return}
 box.innerHTML='<div><div class="ey">Foreløpig tabelltips</div><div class="sub">Dette er poengene tabelltipset ditt ville gitt mot tabellen akkurat nå.</div><div class="tiny">'+x.exact+' eksakte plasseringer · '+x.oneOff+' én plass unna · '+x.top3Hits+' av dine topp 3 er i topp 3</div></div><div class="scoreRight"><b>'+x.points+' p</b><div class="change">Kan endre seg etter hver kamp</div></div>';
 }catch(e){const box=document.querySelector('#provisionalTableScore');if(box)box.innerHTML='<div class="tiny">Kunne ikke hente foreløpig tabellscore akkurat nå.</div>'}}
}
const oldLoad=window.load;if(typeof oldLoad==='function'){window.load=async function(){const r=await oldLoad.apply(this,arguments);setTimeout(drawProvisional,0);return r}}
setInterval(()=>{try{if(typeof D!=='undefined'&&D?.user&&!D.user.is_admin)drawProvisional()}catch{}},60000);
setTimeout(drawProvisional,1200);
})();