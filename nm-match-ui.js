(()=>{
'use strict';
const st=document.createElement('style');st.textContent=[
'#nmExtra .nmMatchGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:12px}',
'#nmExtra .nmMatchCard{background:#0b121d;border:1px solid #2b384c;padding:14px;border-radius:14px;min-width:0}',
'#nmExtra .nmMatchCard h4{font-size:15px;margin:0 0 10px}',
'#nmExtra .nmSmall{color:#aeb8ca;font-size:12px;line-height:1.5;margin:7px 0}',
'#nmExtra .nmMatchCard select{width:100%}',
'#nmAdminMatches{border-top:1px solid #334155;margin-top:16px;padding-top:15px}',
'#nmAdminMatches details{border:1px solid #2c3c51;border-radius:12px;background:#0b121c;margin:10px 0;padding:12px}',
'#nmAdminMatches summary{cursor:pointer;font-weight:800}',
'#nmAdminMatches label{display:block;font-size:12px;font-weight:800;margin-top:10px}',
'#nmAdminMatches input,#nmAdminMatches select{width:100%;margin-top:7px}',
'#nmAdminMatches .nmError{color:#ff9c9c;font-size:12px;margin-top:7px}',
'#nmAdminMatches .nmActions{display:flex;gap:9px;flex-wrap:wrap}',
'#nmAdminMatches .nmActions button{flex:1;min-width:110px}'
].join('');document.head.append(st);
const el=(tag,text,klass)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(klass)e.className=klass;return e};
const field=(parent,label,control)=>{const e=el('label',label);e.append(control);parent.append(e);return control};
const dateInput=value=>{const i=document.createElement('input');i.type='datetime-local';if(value){const d=new Date(value);if(Number.isFinite(d.getTime()))i.value=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}return i};
const nmTasks=()=>D?.bonusTasks?.filter(t=>t.source_rule?.group==='nm')||[];
const picks=()=>new Map((D?.bonusPicks||[]).map(p=>[p.task_id,p]));
function nmShow(){
 if(!D)return;
 const area=document.getElementById('nmOpen');if(!area)return;
 let root=document.getElementById('nmExtra');if(!root){root=el('section',undefined,'card');root.id='nmExtra';area.append(root)}root.replaceChildren();
 root.append(el('h3','🏆 NM-oppgjør · 40 poeng'),el('p','Tipp kvartfinalevinnere og finalelag når oppgjørene er klare.','nmSmall'));
 const list=el('div',undefined,'nmMatchGrid'),byUser=picks();
 for(const task of nmTasks()){
   const card=el('div',undefined,'nmMatchCard'),p=byUser.get(task.id);
   card.append(el('h4',task.title),el('div','Maks '+maxBonus(task)+' poeng','nmSmall'));
   if(task.status==='settled'){
     card.append(el('div','✅ Avgjort · '+(p?p.points+' poeng':'Ikke besvart'),'nmSmall'));
     card.append(el('div','Fasit: '+String(task.actual_value?.value||'—'),'nmSmall'));
     if(p)card.append(el('div','Ditt svar: '+bonusValue(task,p),'nmSmall'));
   }else if(task.status==='draft'||task.options?.length!==2){
     card.append(el('div','🔒 Oppgjøret blir lagt ut når lagene er klare.','nmSmall'));
   }else if(task.is_open){
     card.append(el('div','Frist: '+fmt(task.deadline),'nmSmall'));
     const input=el('select');input.add(new Option('Velg lag',''));task.options.forEach(x=>input.add(new Option(x,x)));
     input.value=String(p?.value?.value??p?.value??'');
     const save=el('button',p?'Endre tips':'Lagre tips','secondary');save.type='button';save.style.width='100%';
     const info=el('div','','nmSmall');
     save.onclick=async()=>{
       if(!input.value){info.textContent='Velg et lag først.';return}
       save.disabled=true;info.textContent='Lagrer…';
       try{
         await call('save_bonus',{task_id:task.id,value:input.value});
         D=await call('bootstrap');renderNmState();renderRules();renderLb();renderBonus();
       }catch(e){info.textContent=e.message||'Kunne ikke lagre';save.disabled=false}
     };
     card.append(input,save,info);
   }else{
     card.append(el('div',task.opens_at&&Date.now()<new Date(task.opens_at).getTime()?'🔒 Åpner '+fmt(task.opens_at):'🔒 Svarfristen er ute.','nmSmall'));
     if(p)card.append(el('div','Ditt svar: '+bonusValue(task,p),'nmSmall'));
   }
   list.append(card);
 }
 root.append(list);
}
const oldRenderNm=renderNmState;
renderNmState=function(){
 oldRenderNm();
 const locked=document.getElementById('nmLocked');
 if(locked&&!D.nmOpen){
   let text=document.getElementById('nmTotalLocked');
   if(!text){text=el('div',undefined,'tiny');text.id='nmTotalLocked';locked.append(text)}
   text.textContent='Totalt 100 poeng: Norgesmester 30 · Poengkonge 15 · MVP 15 · NM-oppgjør 40.';
 }
 nmShow();
};
function nmAdmin(){
 if(!D?.user?.is_admin)return;
 const anchor=document.getElementById('nmUnlock')?.closest('.card');if(!anchor)return;
 let root=document.getElementById('nmAdminMatches');if(!root){root=el('div');root.id='nmAdminMatches';anchor.append(root)}
 root.replaceChildren();root.append(el('h3','🥇 NM-oppgjør · 40 poeng'),el('p','Legg inn lag og svarfrist når sluttspilloppsettet er offisielt. Svarfristen må komme før kampstart.','tiny'));
 for(const task of nmTasks()){
   const details=el('details');const summary=el('summary',task.title+' · '+maxBonus(task)+' p · '+(task.status==='draft'?'Ikke klar':task.status==='settled'?'Avgjort':'Åpen/planlagt'));
   details.append(summary);
   const a=el('select'),b=el('select');
   for(const sel of [a,b]){sel.add(new Option('Velg lag',''));(D.teams||[]).forEach(team=>sel.add(new Option(team,team)))}
   a.value=task.options?.[0]||'';b.value=task.options?.[1]||'';
   field(details,'Lag 1',a);field(details,'Lag 2',b);
   const opening=dateInput(task.opens_at||D.settings?.nm_unlock_at),deadline=dateInput(task.deadline);
   field(details,'Åpnes dato og tid',opening);field(details,'Svarfrist før kampstart',deadline);
   const btnRow=el('div',undefined,'nmActions'),info=el('div','','nmError');
   const save=el('button','Lagre oppgjør','secondary');save.type='button';save.disabled=task.status==='settled';
   save.onclick=async()=>{
     if(!a.value||!b.value||a.value===b.value||!opening.value||!deadline.value){info.textContent='Velg to ulike lag og begge datoene.';return}
     save.disabled=true;info.textContent='Lagrer…';
     try{
       await call('admin_set_nm_match',{task_id:task.id,team_a:a.value,team_b:b.value,opens_at:new Date(opening.value).toISOString(),deadline:new Date(deadline.value).toISOString()});
       D=await call('bootstrap');renderAdminBonus();renderNmState();renderRules();renderBonus();
     }catch(e){info.textContent=e.message||'Kunne ikke lagre';save.disabled=false}
   };
   btnRow.append(save);
   if(task.options?.length===2&&task.status==='open'){
     const result=el('select');result.add(new Option('Velg vinner',''));task.options.forEach(team=>result.add(new Option(team,team)));
     field(details,'Fasit etter at serien er avgjort',result);
     const settle=el('button','Sett fasit','secondary');settle.type='button';
     settle.onclick=async()=>{
       if(!result.value){info.textContent='Velg vinneren først.';return}
       if(!confirm('Avgjøre '+task.title+' med '+result.value+'?'))return;
       settle.disabled=true;info.textContent='Setter fasit…';
       try{await call('admin_set_bonus_actual',{task_id:task.id,value:result.value});D=await call('bootstrap');renderAdminBonus();renderNmState();renderLb();renderRules();}
       catch(e){info.textContent=e.message;settle.disabled=false}
     };
     btnRow.append(settle);
   }
   details.append(btnRow,info);root.append(details);
 }
}
const oldAdmin=renderAdminBonus;
renderAdminBonus=function(){oldAdmin();nmAdmin()};
try{if(D?.bonusTasks){renderNmState();if(D.user.is_admin)nmAdmin()}}catch(e){console.error('NM extras',e)}
})();