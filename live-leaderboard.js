(()=>{
const API='https://bioqeczhqedlhbvprxci.supabase.co/functions/v1/ehl-live-leaderboard';
const css=document.createElement('style');css.textContent=`
.liveLbNote{margin-bottom:12px;padding:10px 12px;border:1px solid #33445f;border-radius:12px;background:#0c1321;color:#cbd5e1;font-size:12px;line-height:1.4}.lbBreak{margin-top:3px;font-size:11px;color:var(--muted)}
`;document.head.append(css);
async function drawLiveLeaderboard(){try{
 if(typeof D==='undefined'||!D?.user)return;
 const el=document.querySelector('#lb');if(!el)return;
 const token=localStorage.getItem('ehlToken')||'';
 const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json','x-session-token':token},body:'{}'}),x=await r.json();if(!r.ok)throw Error(x.error||'Kunne ikke hente leaderboard');
 const rows=x.leaderboard||[];
 el.innerHTML='<div class="liveLbNote"><b>Live leaderboard</b><br>Poengene består av <b>Tabelltips</b> mot EHL-tabellen akkurat nå + avgjorte <b>Sesongtips</b> + avgjorte <b>Bonus</b>. Tabelltips kan derfor endre seg etter hver kamp.</div>'+rows.map((u,i)=>'<div class="lb"><div class="pos">'+(i+1)+'</div><div><b>'+u.name+'</b><div class="lbBreak">Tabelltips '+u.table+' p · Sesongtips '+(u.season??u.categories??0)+' p · Bonus '+u.bonus+' p</div></div><div class="pts">'+u.points+' p</div></div>').join('');
 window.__liveLeaderboard=x;
 }catch(e){console.error('live leaderboard',e)}
}
const oldRender=window.renderLb;if(typeof oldRender==='function'){window.renderLb=function(){oldRender.apply(this,arguments);setTimeout(drawLiveLeaderboard,0)}}
setInterval(()=>{try{if(typeof D!=='undefined'&&D?.user)drawLiveLeaderboard()}catch{}},60000);
setTimeout(drawLiveLeaderboard,1400);
})();