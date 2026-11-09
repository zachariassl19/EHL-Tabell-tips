(()=>{
'use strict';
const style=document.createElement('style');style.id='adminLayoutV2Styles';style.textContent=`
#adminView.adminOrganized{display:block!important}
#adminView.adminOrganized>.card,#adminView.adminOrganized>button,#adminView.adminOrganized>.status,#adminView.adminOrganized>#nmAdminBracket{display:none!important}
#adminView .adminShell{display:block;width:100%;min-width:0}
#adminView .adminHero{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:14px;padding:18px 20px;border:1px solid #2b3748;border-radius:20px;background:linear-gradient(135deg,#151c28,#0c121c)}
#adminView .adminHero h2{font-size:28px;margin:2px 0 4px}
#adminView .adminHero p{margin:0;color:var(--muted);font-size:13px}
#adminView .adminNav{display:flex;gap:7px;overflow-x:auto;padding:6px;margin:0 0 16px;border:1px solid #293548;border-radius:16px;background:#0a1019;scrollbar-width:none}
#adminView .adminNav::-webkit-scrollbar{display:none}
#adminView .adminNav button{flex:0 0 auto;width:auto!important;margin:0!important;border:0;border-radius:11px;padding:11px 14px;background:transparent;color:#9eabba;font-size:13px;font-weight:900;white-space:nowrap}
#adminView .adminNav button.on{background:var(--accent);color:#120b05;box-shadow:0 6px 18px rgba(255,122,0,.18)}
#adminView .adminPane{display:none;min-width:0}
#adminView .adminPane.on{display:block}
#adminView .adminPane>.card,#adminView .adminPane>#nmAdminBracket{margin:0 0 14px!important;width:100%!important;max-width:none!important;box-sizing:border-box}
#adminView .adminPane>.primary,#adminView .adminPane>.secondary{margin:0 0 12px}
#adminView .adminPaneTitle{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:3px 2px 13px}
#adminView .adminPaneTitle h2{font-size:23px;margin:0 0 3px}
#adminView .adminPaneTitle p{margin:0;color:var(--muted);font-size:12px;line-height:1.45}
#adminView .adminQuickGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
#adminView .adminQuickGrid>.card{margin:0}
#adminView .adminActualFields{padding:18px!important;border-radius:18px!important;background:#0c121c!important;border:1px solid #273448!important}
#adminView .adminActualActions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}
#adminView .adminActualActions .primary{width:auto;min-width:170px;margin:0}
#adminView .adminActualActions .status{text-align:left}
#adminView .adminHintTop{padding:10px 12px;border:1px solid #2c394b;border-radius:12px;background:#0b1320;color:#aeb8ca;font-size:12px;line-height:1.45;margin-bottom:12px}
#adminView #nmAdminBracket{overflow:hidden}
#adminView #resetCard.hidden{display:none!important}
@media(max-width:720px){
 #adminView .adminHero{align-items:flex-start;flex-direction:column;padding:16px}
 #adminView .adminHero h2{font-size:24px}
 #adminView .adminNav{position:sticky;top:0;z-index:20;background:rgba(8,14,23,.96);backdrop-filter:blur(10px)}
 #adminView .adminNav button{padding:10px 12px}
 #adminView .adminQuickGrid{grid-template-columns:1fr}
}
`;document.head.append(style);

let active=localStorage.getItem('ehlAdminPane')||'overview';
const paneInfo={
 overview:['Oversikt','Status, deltakere, live-data og PIN-forespørsler.'],
 nm:['NM / sluttspill','Åpning, bracket, resultater og finaleutfordringer samlet på ett sted.'],
 actual:['Fasit','Grunnserie- og sesongfasit uten resten av adminstøyen.'],
 bonus:['Bonuspakker','Månedspakker, slippdatoer og manuell bonusfasit.']
};
function title(pane,key){if(pane.querySelector('.adminPaneTitle'))return;const w=document.createElement('div');w.className='adminPaneTitle';w.innerHTML='<div><h2>'+paneInfo[key][0]+'</h2><p>'+paneInfo[key][1]+'</p></div>';pane.prepend(w);if(key==='actual'){const h=document.createElement('div');h.className='adminHintTop';h.textContent='Live EHL-tabell hentes automatisk. Her trenger du bare å føre fasiter som ikke kan avgjøres av HockeyLive.';pane.append(h)}if(key==='bonus'){const h=document.createElement('div');h.className='adminHintTop';h.textContent='Månedspakker styres her. Automatiske spørsmål trenger normalt ikke manuell fasit.';pane.append(h)}}
function ensure(){
 const view=document.getElementById('adminView');if(!view||!window.D?.user?.is_admin)return;
 let shell=view.querySelector(':scope > .adminShell');
 if(!shell){
   shell=document.createElement('div');shell.className='adminShell';
   const hero=document.createElement('div');hero.className='adminHero';hero.innerHTML='<div><div class="ey">Kun for admin 🔒</div><h2>Kontrollrom</h2><p>Oversikt først. Detaljene ligger i egne faner når du trenger dem.</p></div>';
   const nav=document.createElement('div');nav.className='adminNav';nav.setAttribute('role','tablist');
   const defs=[['overview','🏠 Oversikt'],['nm','🏆 NM'],['actual','✅ Fasit'],['bonus','📦 Bonuspakker']];
   defs.forEach(([k,label])=>{const b=document.createElement('button');b.type='button';b.dataset.adminPane=k;b.textContent=label;b.onclick=()=>show(k);nav.append(b)});
   shell.append(hero,nav);
   for(const k of defs.map(x=>x[0])){const p=document.createElement('section');p.className='adminPane';p.dataset.pane=k;shell.append(p);title(p,k)}
   view.prepend(shell);view.classList.add('adminOrganized');
 }
 organize(view,shell);show(active,false);
}
function byHeading(view,text){return [...view.querySelectorAll(':scope > .card')].find(x=>x.querySelector('h3')?.textContent.trim()===text)||null}
function move(node,pane){if(node&&pane&&!pane.contains(node))pane.append(node)}
function organize(view,shell){
 const panes={};shell.querySelectorAll('.adminPane').forEach(p=>panes[p.dataset.pane]=p);
 // Hide the old generic Admin intro; the compact hero replaces it.
 const intro=[...view.querySelectorAll(':scope > .card')].find(x=>x.querySelector('h2')?.textContent.trim()==='Admin');if(intro)intro.remove();
 const perks=view.querySelector(':scope > .adminPerks');if(perks){const ey=perks.querySelector(':scope > .ey');if(ey)ey.textContent='STATUS';const h=perks.querySelector(':scope > h3');if(h)h.textContent='Dagens oversikt';const p=perks.querySelector(':scope > p');if(p)p.textContent='Deltakelse, siste synk og live-data samlet på ett sted.'}move(perks,panes.overview);
 move(view.querySelector(':scope > #resetCard'),panes.overview);

 const nmCard=[...view.querySelectorAll(':scope > .card')].find(x=>x.querySelector('#nmUnlock'));move(nmCard,panes.nm);
 move(view.querySelector(':scope > #nmAdminBracket'),panes.nm);

 const actualCard=[...view.querySelectorAll(':scope > .card')].find(x=>x.querySelector('#actualRanking'));move(actualCard,panes.actual);
 const actualFields=[...view.querySelectorAll(':scope > .card.grid')].find(x=>x.querySelector('#aCoach'));if(actualFields){actualFields.classList.add('adminActualFields');move(actualFields,panes.actual)}
 const save=view.querySelector(':scope > #saveActual'),msg=view.querySelector(':scope > #adminMsg');
 if(save||msg){let actions=panes.actual.querySelector('.adminActualActions');if(!actions){actions=document.createElement('div');actions.className='adminActualActions';panes.actual.append(actions)}if(save)actions.append(save);if(msg)actions.append(msg)}

 const bonusCard=[...view.querySelectorAll(':scope > .card')].find(x=>x.querySelector('#adminBonus'));move(bonusCard,panes.bonus);

 // Elements dynamically recreated by NM/bonus scripts can briefly appear as direct children.
 const dynamicNm=view.querySelector(':scope > #nmAdminBracket');if(dynamicNm)move(dynamicNm,panes.nm);
}
function show(key,scroll=false){
 const view=document.getElementById('adminView');const shell=view?.querySelector(':scope > .adminShell');if(!shell)return;
 if(!paneInfo[key])key='overview';active=key;localStorage.setItem('ehlAdminPane',key);
 shell.querySelectorAll('.adminPane').forEach(p=>p.classList.toggle('on',p.dataset.pane===key));
 shell.querySelectorAll('.adminNav button').forEach(b=>{const on=b.dataset.adminPane===key;b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false')});
 if(scroll)shell.scrollIntoView({behavior:'smooth',block:'start'});
}
const oldRender=window.renderAdmin;
if(typeof oldRender==='function')window.renderAdmin=function(){const r=oldRender.apply(this,arguments);setTimeout(ensure,0);setTimeout(ensure,120);return r};
const oldBonus=window.renderAdminBonus;
if(typeof oldBonus==='function')window.renderAdminBonus=function(){const r=oldBonus.apply(this,arguments);setTimeout(ensure,0);return r};

const observer=new MutationObserver(()=>{if(document.getElementById('adminView')&&!document.getElementById('adminView').classList.contains('hidden'))requestAnimationFrame(ensure)});
observer.observe(document.body,{childList:true,subtree:true});
setTimeout(ensure,250);setTimeout(ensure,1000);
})();