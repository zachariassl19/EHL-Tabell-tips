(()=>{
'use strict';
let prizeCount=0,prizeTimer=null,busy=false;

function easterTask(){
  return (D?.bonusTasks||[]).find(t=>t.code==='easter_egg_360');
}
function solved(){
  const t=easterTask();
  return !!(t&&(D?.bonusPicks||[]).some(p=>p.task_id===t.id&&Number(p.points)===3));
}
async function step(event){
  if(busy||typeof D==='undefined'||!D?.user||D.user.is_admin||solved())return false;
  busy=true;
  try{
    const r=await call('easter_step',{event});
    if(r?.solved){
      D=await call('bootstrap');
      try{renderLb();renderRules()}catch{}
      showSolved();
      return true;
    }
  }catch(e){console.warn('Easter egg step failed',e)}
  finally{busy=false}
  return false;
}
function showSolved(){
  document.getElementById('easterSolvedModal')?.remove();
  const modal=document.createElement('div');modal.id='easterSolvedModal';
  modal.style.cssText='position:fixed;inset:0;z-index:5000;background:rgba(2,5,10,.92);display:grid;place-items:center;padding:18px';
  modal.innerHTML='<div style="width:min(520px,100%);padding:28px;border-radius:24px;border:1px solid #735025;background:radial-gradient(circle at 50% 0,rgba(255,122,0,.20),transparent 55%),#0d131d;text-align:center;box-shadow:0 30px 100px rgba(0,0,0,.6)"><div style="font-size:62px">🥚</div><div class="ey">FUNNET</div><h2 style="font-size:30px;margin:8px 0">Du fant easter egget!</h2><p style="color:#cbd5e1">Ikke verst. Det var ikke meningen at denne skulle være enkel.</p><div style="font-size:34px;font-weight:950;color:#ffb56e;margin:16px 0">+3 poeng</div><button class="primary" type="button">Ta meg tilbake</button></div>';
  modal.querySelector('button').onclick=()=>modal.remove();
  modal.onclick=e=>{if(e.target===modal)modal.remove()};
  document.body.append(modal);
}
function decorateRules(){
  const btn=document.getElementById('easterHintBtn'),hint=document.getElementById('easterHintText'),row=document.getElementById('easterScoreRow');
  if(!btn||!hint||!row)return;
  if(solved()){
    btn.textContent='Funnet ✓';btn.disabled=true;
    hint.classList.remove('hidden');hint.innerHTML='🥚 <b>Funnet.</b> Du har sikret deg de 3 skjulte poengene.';
    row.style.borderColor='#3a7156';
  }else{
    btn.onclick=e=>{
      e.stopPropagation();
      hint.classList.toggle('hidden');
      hint.innerHTML='<b>Hint:</b> Start der sesongen ble spådd. Tredje plass skjuler mer enn den viser. Derfra må du se på spillerne på isen. Vinneren feires tre ganger. Sluttspillet sender deg tilbake til poengene. Først da er egget klart.';
      btn.textContent=hint.classList.contains('hidden')?'Hint':'Skjul hint';
    };
    row.style.cursor='pointer';
    row.onclick=e=>{if(e.target.closest('button'))return;step('egg_claim')};
  }
}
const oldRules=typeof renderRules==='function'?renderRules:null;
if(oldRules){
  renderRules=function(){const r=oldRules.apply(this,arguments);setTimeout(decorateRules,0);return r};
}

document.addEventListener('click',e=>{
  if(typeof D==='undefined'||!D?.user||D.user.is_admin||solved())return;

  const seasonRow=e.target.closest('#tipsView #ranking tbody tr,#tipsView #selectRanking tbody tr');
  if(seasonRow){
    const rows=[...seasonRow.parentElement.children];
    if(rows.indexOf(seasonRow)===2)step('season_third');
    return;
  }

  const livePlayers=e.target.closest('#liveView .livebtn[data-live="statistics"]');
  if(livePlayers){step('live_players');return}

  const prize=e.target.closest('#leaderboardView .prize');
  if(prize){
    clearTimeout(prizeTimer);
    prizeCount++;
    if(prizeCount>3)prizeCount=1;
    const event=['','prize_one','prize_two','prize_three'][prizeCount];
    step(event);
    prizeTimer=setTimeout(()=>{prizeCount=0},3800);
    return;
  }

  const tab=e.target.closest('.tab[data-view]');
  if(tab?.dataset.view==='nm'){step('nm_visit');return}
  if(tab?.dataset.view==='rules'){step('rules_return');setTimeout(decorateRules,20);return}
});

setTimeout(decorateRules,500);
})();