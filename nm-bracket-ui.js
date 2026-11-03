(()=>{
'use strict';
const css=document.createElement('style');css.id='nmBracket2027Style';css.textContent=[
'#bracket{display:block!important;min-width:0;margin-top:18px}',
'#nmOpen .nmBracketIntro{background:linear-gradient(115deg,#34200e,#131f34);border:1px solid #8e612c;border-radius:16px;padding:15px;margin-bottom:16px}',
'#nmOpen .nmBracketIntro h3{font-size:20px;margin:0 0 6px}',
'#nmOpen .nmBracketIntro p{margin:0;font-size:13px;line-height:1.5;color:#d9dfeb}',
'#nmOpen .nmBracketScroller{width:100%;max-width:100%;overflow-x:auto;padding:3px 2px 15px;-webkit-overflow-scrolling:touch}',
'#nmOpen .nmBracketColumns{display:grid;grid-template-columns:repeat(4,minmax(158px,1fr));gap:10px;min-width:680px}',
'#nmOpen .nmBracketColumn{border-radius:15px;padding:10px;background:rgba(9,17,30,.67);border:1px solid #293b54;min-width:0}',
'#nmOpen .nmBracketColumn h4{font-size:12px;letter-spacing:.025em;text-transform:uppercase;color:#f3b973;margin:0 0 14px}',
'#nmOpen .nmBracketColumn[data-stage="champion"]{border-color:#ad7d35;background:linear-gradient(165deg,#35220e,#0e1625)}',
'#nmOpen .nmBracketMatch{min-height:102px;padding:12px;margin:9px 0 18px;border:1px solid #354760;border-radius:12px;background:#111e30;display:flex;flex-direction:column;justify-content:center;gap:7px}',
'#nmOpen .nmBracketMatch strong{font-size:13px;line-height:1.4}',
'#nmOpen .nmBracketMatch small{font-size:11px;color:#aebdd3}',
'#nmOpen .nmBracketMatch select{width:100%;margin:3px 0;font-size:12px;padding:9px 6px}',
'#nmOpen .nmBracketMatch .nmVs{font-size:10px;color:#e5ab65;text-align:center;font-weight:800}',
'#nmOpen .nmBracketColumn[data-stage="semis"] .nmBracketMatch{margin:37px 0 45px;min-height:144px}',
'#nmOpen .nmBracketColumn[data-stage="final"] .nmBracketMatch{margin-top:114px;min-height:146px}',
'#nmOpen .nmBracketColumn[data-stage="champion"] .nmBracketMatch{margin-top:130px;min-height:164px;text-align:center;border-color:#8d6533;background:#261d17}',
'#nmOpen .nmBracketColumn[data-stage="champion"] .nmBracketMatch select{margin:10px 0}',
'#nmOpen .nmSaveInfo{font-size:12px;color:#b9c7d9;margin:8px 0;line-height:1.5}',
'#nmOpen .nmSmallBadge{display:inline-block;border-radius:100px;background:#253c59;color:#f3be78;padding:4px 9px;font-size:11px;font-weight:800}',
'#nmOpen .nmRuleSection{border:1px solid #33435a;border-radius:14px;padding:15px;background:#101b2a;margin:14px 0}',
'#nmOpen .nmRuleSection h3{margin:0 0 7px;font-size:18px}',
'#nmOpen .nmRuleSection p{font-size:13px;color:#c5d0de;line-height:1.5}',
'#nmOpen .nmFinalGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,275px),1fr));gap:12px}',
'#nmOpen .nmFinalCard{padding:14px;border:1px solid #33435a;border-radius:13px;background:#0b1523;min-width:0}',
'#nmOpen .nmFinalCard h4{margin:8px 0;font-size:15px}',
'#nmOpen .nmFinalCard select,#nmOpen .nmFinalCard button{width:100%;margin-top:8px}',
'#nmOpen .nmFinalCard p{font-size:12px;color:#b6c5d7;line-height:1.5}',
'#nmAdminBracket{margin:15px 0;min-width:0}',
'#nmAdminBracket .nmAdminGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px;margin:12px 0 18px}',
'#nmAdminBracket .nmAdminMatch{border:1px solid #35435a;border-radius:13px;padding:13px;background:#0a1525;min-width:0}',
'#nmAdminBracket label{display:block;margin:10px 0;font-size:12px;font-weight:750}',
'#nmAdminBracket select,#nmAdminBracket input{width:100%;margin-top:5px}',
'#nmAdminBracket .nmHelp{font-size:12px;color:#b7c6d5;line-height:1.55}',
'#nmAdminBracket .nmAdminActions{display:flex;flex-wrap:wrap;gap:9px;margin:12px 0}',
'#nmAdminBracket .nmAdminActions button{flex:1;min-width:140px}',
'#nmAdminBracket h3{margin:22px 0 6px}',
'#nmAdminBracket .nmStatus{font-size:12px;color:#e3b16c;margin:9px 0;min-height:16px}'
].join('');document.head.append(css);
const elem=(tag,text,klass)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(klass)x.className=klass;return x};
const cap=(parent,heading,content)=>{parent.append(elem('h3',heading));parent.append(elem('p',content,'nmHelp'))};
const selector=(values,selected='',placeholder='Velg lag')=>{const s=elem('select');s.append(new Option(placeholder,''));values.forEach(x=>s.append(new Option(String(x),String(x))));s.value=String(selected||'');return s};
const field=(parent,label,control)=>{const w=elem('label',label);w.append(control);parent.append(w);return control};
const dateLocal=iso=>{if(!iso)return'';const d=new Date(iso);if(!Number.isFinite(d.getTime()))return'';return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)};
const dateField=(parent,label,iso)=>{const inp=elem('input');inp.type='datetime-local';inp.value=dateLocal(iso);field(parent,label,inp);return inp};
const distinct=a=>new Set(a.filter(Boolean)).size===a.filter(Boolean).length;
let draft={q:['','','',''],finalists:['',''],champion:''},lastData=null;
function hydrate(){
 if(!D||lastData===D)return;
 lastData=D;
 const p=D.nmBracketPick||{};
 draft={q:Array.isArray(p.quarter_winners)&&p.quarter_winners.length===4?[...p.quarter_winners]:['','','',''],finalists:Array.isArray(p.finalists)&&p.finalists.length===2?[...p.finalists]:['',''],champion:D.tip?.champion_pick||''};
}
function lockedNm(){return !D?.nmOpen||!D.settings?.nm_deadline||Date.now()>new Date(D.settings.nm_deadline).getTime()||D.user?.is_admin}
function cleanDraft(){
 const pairs=D.nmBracket?.quarter_pairs||[];
 for(let i=0;i<4;i++)if(!pairs[i]?.includes(draft.q[i]))draft.q[i]='';
 draft.finalists=draft.finalists.map(x=>draft.q.includes(x)?x:'');
 if(draft.finalists[0]&&draft.finalists[0]===draft.finalists[1])draft.finalists[1]='';
 if(!draft.finalists.includes(draft.champion))draft.champion='';
}
function drawBracket(){
 if(!D)return;
 hydrate();
 const root=document.getElementById('bracket');if(!root)return;
 cleanDraft();root.replaceChildren();
 const intro=elem('div',undefined,'nmBracketIntro');
 intro.append(elem('h3','🏆 Veien til NM-gull · 75 poeng'));
 intro.append(elem('p','Tipp fire kvartfinalevinnere, to finalister og én norgesmester. Riktige kvartfinaler gir 4 poeng hver, riktige finalister 7 hver og riktig mester 20. Du får 10 ekstra for alle fire kvartfinalene riktig og 10 ekstra for begge finalistene.'));
 root.append(intro);
 const pairs=D.nmBracket?.quarter_pairs||[],hasPairs=pairs.length===4,readonly=lockedNm();
 if(!hasPairs){root.append(elem('p','🔒 Admin må registrere de åtte sluttspillagene og kvartfinaleoppsettet først.','nmSaveInfo'));return}
 const scroll=elem('div',undefined,'nmBracketScroller'),cols=elem('div',undefined,'nmBracketColumns');
 const cQ=elem('div',undefined,'nmBracketColumn');cQ.dataset.stage='quarters';cQ.append(elem('h4','① Kvartfinaler · 8 lag'));
 pairs.forEach((pair,i)=>{
  const box=elem('div',undefined,'nmBracketMatch');box.append(elem('small','KVARTFINALE '+(i+1)));
  box.append(elem('strong',pair[0]));box.append(elem('div','VS','nmVs'));box.append(elem('strong',pair[1]));
  const sel=selector(pair,draft.q[i],'Hvem går videre?');sel.disabled=readonly;sel.setAttribute('aria-label','Vinner i kvartfinale '+(i+1));
  sel.onchange=()=>{draft.q[i]=sel.value;cleanDraft();drawBracket()};
  box.append(sel);cQ.append(box);
 });
 const cS=elem('div',undefined,'nmBracketColumn');cS.dataset.stage='semis';cS.append(elem('h4','② Finalister · 4 lag'));
 for(let i=0;i<2;i++){
  const box=elem('div',undefined,'nmBracketMatch');box.append(elem('small','VELG FINALIST '+(i+1)));
  const available=draft.q.filter(Boolean);const sel=selector(available,draft.finalists[i],'Hvem når finalen?');
  sel.disabled=readonly||available.length<4;sel.setAttribute('aria-label','Finalist '+(i+1));
  sel.onchange=()=>{draft.finalists[i]=sel.value;if(sel.value&&draft.finalists[1-i]===sel.value)draft.finalists[1-i]='';cleanDraft();drawBracket()};
  box.append(sel,elem('small','Velg én av dine fire kvartfinalevinnere'));cS.append(box);
 }
 const cF=elem('div',undefined,'nmBracketColumn');cF.dataset.stage='final';cF.append(elem('h4','③ NM-finalen · 2 lag'));
 const final=elem('div',undefined,'nmBracketMatch');
 const fa=draft.finalists[0]||'Finalist 1',fb=draft.finalists[1]||'Finalist 2';
 final.append(elem('strong',fa),elem('div','VS','nmVs'),elem('strong',fb));
 final.append(elem('small','Dine to finalister. Riktig lag gir 7 poeng hver.'));cF.append(final);
 const cM=elem('div',undefined,'nmBracketColumn');cM.dataset.stage='champion';cM.append(elem('h4','④ NM-mester · 1 lag'));
 const winner=elem('div',undefined,'nmBracketMatch');winner.append(elem('strong','🏆 NORGESMESTER'));
 const oldChamp=document.getElementById('champ');
 if(oldChamp){
  const oldLabel=oldChamp.closest('label');if(oldLabel){oldLabel.style.display='block';oldLabel.style.margin='10px 0';winner.append(oldLabel)}
  oldChamp.replaceChildren();oldChamp.add(new Option('Velg vinner',''));
  draft.finalists.filter(Boolean).forEach(t=>oldChamp.add(new Option(t,t)));
  oldChamp.value=draft.champion||'';
  oldChamp.disabled=readonly||draft.finalists.some(x=>!x);
  oldChamp.onchange=()=>{draft.champion=oldChamp.value;drawBracket()};
 }
 winner.append(elem('small','Riktig norgesmester gir 20 poeng.'));cM.append(winner);
 cols.append(cQ,cS,cF,cM);scroll.append(cols);root.append(scroll);
 const foot=elem('p','⇆ På mobil kan du sveipe sidelengs for å se hele veien til NM-gull.','nmSaveInfo');root.append(foot);
 const actual=D.nmBracket||{};
 const correct=[(actual.quarter_winners||[]).filter(Boolean).length,(actual.finalists||[]).filter(Boolean).length,actual.champion?1:0];
 if(correct.some(Boolean))root.append(elem('p','Fasit registrert: '+correct[0]+'/4 kvartfinaler · '+correct[1]+'/2 finalister · '+(correct[2]?'NM-mester avgjort':'Mester ikke avgjort'),'nmSaveInfo'));
}
async function loadUpdated(){
 D=await call('bootstrap');lastData=null;
 renderNmState();renderRules();renderBonus();renderLb();
 if(D.user?.is_admin)renderAdminBonus();
}
function saveWholeBracket(){
 const el=document.getElementById('nmMsg'),button=document.getElementById('saveNm');if(!el||!button)return;
 cleanDraft();
 if(draft.q.some(x=>!x)||draft.finalists.some(x=>!x)||!draft.champion){el.textContent='Velg alle fire kvartfinalevinnere, begge finalister og norgesmester.';return}
 const pp=document.getElementById('pp'),mvp=document.getElementById('mvp');
 button.disabled=true;el.textContent='Lagrer alle NM-tips…';
 call('save_nm_bracket',{quarter_winners:[...draft.q],finalists:[...draft.finalists],champion:draft.champion,playoff_points_pick:pp?.value||'',mvp_pick:mvp?.value||''})
 .then(async()=>{await loadUpdated();const msg=document.getElementById('nmMsg');if(msg)msg.textContent='✓ Hele NM-bracketen og spillertipsene er lagret!'})
 .catch(err=>{el.textContent=err.message||'Kunne ikke lagre';button.disabled=false});
}
function finalBonus(){
 if(!D)return;
 const root=document.getElementById('nmExtra')||elem('section',undefined,'nmRuleSection');root.id='nmExtra';
 const target=document.getElementById('nmOpen');if(!target)return;if(!root.parentElement)target.append(root);
 root.replaceChildren();root.append(elem('h3','🔥 Finaleutfordringer · 10 poeng'));
 root.append(elem('p','Disse åpnes før den første finalekampen. Du kan tippe dem separat etter at bracketen er låst.'));
 const grid=elem('div',undefined,'nmFinalGrid');const picks=new Map((D.bonusPicks||[]).map(x=>[x.task_id,x]));
 const questions=(D.bonusTasks||[]).filter(t=>t.source_rule?.group==='nm'&&t.source_rule?.stage==='final');
 questions.forEach(task=>{
  const card=elem('div',undefined,'nmFinalCard');card.append(elem('span','5 POENG','nmSmallBadge'),elem('h4',task.title),elem('p',task.description||''));
  const saved=picks.get(task.id);
  if(task.status==='settled'){
   card.append(elem('p','✅ Fasit: '+String(task.actual_value?.value||'—')+' · '+(saved?saved.points+' poeng':'Ikke besvart')));
  }else if(task.is_open&&!D.user.is_admin){
   const sel=selector(task.options||[],saved?.value?.value??saved?.value??'','Velg svar');
   sel.setAttribute('aria-label',task.title);
   const btn=elem('button',saved?'Oppdater tips':'Lagre svar','secondary'),message=elem('p','');
   btn.onclick=async()=>{
    if(!sel.value){message.textContent='Velg et svar først.';return}
    btn.disabled=true;
    try{await call('save_bonus',{task_id:task.id,value:sel.value});await loadUpdated()}
    catch(e){message.textContent=e.message;btn.disabled=false}
   };
   card.append(elem('p','Frist: '+fmt(task.deadline)),sel,btn,message);
  }else{
   card.append(elem('p',task.status==='draft'?'🔒 Åpnes når finalen er klar.':task.opens_at&&Date.now()<new Date(task.opens_at).getTime()?'🔒 Åpner '+fmt(task.opens_at):'🔒 Svarfristen er ute.'));
   if(saved)card.append(elem('p','Ditt svar: '+String(saved.value?.value??saved.value)));
  }
  grid.append(card);
 });
 root.append(grid);
}
const previousNm=renderNmState;
renderNmState=function(){
 previousNm();hydrate();drawBracket();finalBonus();
 const save=document.getElementById('saveNm');if(save){save.onclick=saveWholeBracket;save.textContent=D.nmBracketPick?'Oppdater hele NM-tipset':'Lagre hele NM-tipset';save.disabled=lockedNm()||!Array.isArray(D.nmBracket?.quarter_pairs)||D.nmBracket.quarter_pairs.length!==4}
 const oldNote=document.getElementById('nmTotalLocked');if(oldNote)oldNote.textContent='NM har 100 poeng: bracket 70, poengkonge 10, MVP 10 og finaleutfordringer 10.';
};
renderBracket=function(){drawBracket()};
function adminPanel(){
 if(!D?.user?.is_admin)return;
 const anchor=document.getElementById('nmUnlock')?.closest('.card');if(!anchor)return;
 let root=document.getElementById('nmAdminBracket');
 if(!root){const card=elem('section',undefined,'card');card.id='nmAdminBracket';root=card;anchor.insertAdjacentElement('afterend',card)}
 root.replaceChildren();root.append(elem('h2','🏆 Admin · NM-bracket 8 → 4 → 2 → 1'));
 cap(root,'1. Sett opp kvartfinalene','Legg inn åtte forskjellige EHL-lag. Hvem møter hvem? Du styrer alle oppgjørene manuelt. Oppsettet låses mot endringer så snart noen har tippet.');
 const stored=D.nmBracket||{},pairs=stored.quarter_pairs||[];
 const startGrid=elem('div',undefined,'nmAdminGrid'),setupInputs=[];
 for(let i=0;i<4;i++){
  const card=elem('div',undefined,'nmAdminMatch');card.append(elem('strong','Kvartfinale '+(i+1)));
  const pair=[];
  for(let j=0;j<2;j++){const s=selector(D.teams||[],pairs[i]?.[j]||'','Velg lag');field(card,'Lag '+(j+1),s);pair.push(s)}
  setupInputs.push(pair);startGrid.append(card);
 }
 root.append(startGrid);
 const setupMsg=elem('div','','nmStatus'),setupActions=elem('div',undefined,'nmAdminActions'),setupBtn=elem('button','Lagre de fire kvartfinalene','secondary');
 setupBtn.onclick=async()=>{
  const pairs=setupInputs.map(arr=>arr.map(sel=>sel.value));
  if(pairs.flat().some(v=>!v)||new Set(pairs.flat()).size!==8){setupMsg.textContent='Velg åtte ulike lag i de fire kvartfinalene.';return}
  setupBtn.disabled=true;setupMsg.textContent='Lagrer…';
  try{await call('admin_nm_setup',{quarter_pairs:pairs});await loadUpdated()}
  catch(e){setupMsg.textContent=e.message;setupBtn.disabled=false}
 };setupActions.append(setupBtn);root.append(setupActions,setupMsg);
 cap(root,'2. Registrer resultatene','Etter hver serie registrerer du riktig vinner. Når de fire kvartfinalene er avgjort velger du selv de to semifinalemøtene. Vinnerne flyttes til finalen.');
 if(!pairs.length){root.append(elem('p','Registrer kvartfinalene før du legger inn resultater.','nmHelp'))}
 else{
  const qGrid=elem('div',undefined,'nmAdminGrid'),qInputs=[];
  const qStored=stored.quarter_winners||[],semiStored=stored.semi_pairs||[],fStored=stored.finalists||[];
  pairs.forEach((pair,i)=>{
   const card=elem('div',undefined,'nmAdminMatch');card.append(elem('strong','Kvartfinale '+(i+1)),elem('p',pair.join(' – '),'nmHelp'));
   const select=selector(pair,qStored[i]||'','Vinner / ikke avgjort');field(card,'Vinner',select);qInputs.push(select);qGrid.append(card);
  });root.append(qGrid);
  const semiGrid=elem('div',undefined,'nmAdminGrid'),semiPairSelect=[],semiWinnerSelect=[];
  const semifinalTeams=qStored.filter(Boolean);
  for(let i=0;i<2;i++){
   const card=elem('div',undefined,'nmAdminMatch');card.append(elem('strong','Semifinale '+(i+1)));
   const row=[];
   for(let j=0;j<2;j++){const s=selector(semifinalTeams,semiStored[i]?.[j]||'','Velg lag');s.disabled=semifinalTeams.length!==4;field(card,'Lag '+(j+1),s);row.push(s)}
   const win=selector(semiStored[i]||[],fStored[i]||'','Vinner / ikke avgjort');win.disabled=semiStored.length!==2;field(card,'Hvem gikk til finalen?',win);
   semiPairSelect.push(row);semiWinnerSelect.push(win);semiGrid.append(card);
  }
  root.append(elem('h4','Semifinaler (når de fire vinnerne er klare)'),semiGrid);
  const trophy=selector(fStored.filter(Boolean),stored.champion||'','Vinner / ikke avgjort');trophy.disabled=fStored.filter(Boolean).length!==2;
  const champWrap=elem('div',undefined,'nmAdminMatch');field(champWrap,'🏆 Norgesmester',trophy);root.append(champWrap);
  const msg=elem('div','','nmStatus'),actions=elem('div',undefined,'nmAdminActions'),save=elem('button','Lagre NM-resultater','secondary');
  save.onclick=async()=>{
   const q=qInputs.map(x=>x.value),actualSemi=semiPairSelect.map(arr=>arr.map(x=>x.value));
   const haveSemi=actualSemi.flat().some(Boolean);
   const semi=haveSemi?actualSemi:[];
   if(semi.length&&(q.some(x=>!x)||semi.flat().some(x=>!x)||new Set(semi.flat()).size!==4)){msg.textContent='Fullfør alle kvartfinalene og velg fire unike lag i semifinalene.';return}
   const f=semi.length?semiWinnerSelect.map(x=>x.value):[];
   const champ=trophy.value;
   if(champ&&(!f.length||f.some(x=>!x)||!f.includes(champ))){msg.textContent='Mesteren må være en av de to registrerte finalistene.';return}
   save.disabled=true;msg.textContent='Lagrer…';
   try{await call('admin_nm_progress',{quarter_winners:q,semi_pairs:semi,finalists:f,champion:champ});await loadUpdated()}
   catch(e){msg.textContent=e.message;save.disabled=false}
  };
  actions.append(save);root.append(actions,msg);
 }
 cap(root,'3. Finaleutfordringer · 10 poeng','Åpne begge samtidig med én felles frist før første finalekamp. Registrer fasit når hele finalen er ferdig.');
 const finals=(D.bonusTasks||[]).filter(t=>t.source_rule?.group==='nm'&&t.source_rule?.stage==='final');
 if(finals.length){
  const fGrid=elem('div',undefined,'nmAdminGrid'),adminFinalMsg=elem('div','','nmStatus');
  const opens=dateField(root,'Begge finaleutfordringer åpner',finals[0].opens_at);
  const closing=dateField(root,'Felles svarfrist før første finalekamp',finals[0].deadline);
  finals.forEach(t=>{
   const box=elem('div',undefined,'nmAdminMatch');box.append(elem('strong',t.title),elem('p',t.description||'','nmHelp'));
   box.append(elem('p','Svaralternativer: '+t.options.map(String).join(' / '),'nmHelp'));
   if(t.status==='open'){
    const sel=selector(t.options||[],'','Sett riktig svar'),btn=elem('button','Registrer fasit','secondary'),note=elem('div','','nmStatus');
    field(box,'Fasit etter at finalen er ferdig',sel);
    btn.onclick=async()=>{
     if(!sel.value){note.textContent='Velg riktig svar først.';return}
     if(!confirm('Sette fasit for '+t.title+' til '+sel.value+'?'))return;
     btn.disabled=true;
     try{await call('admin_set_bonus_actual',{task_id:t.id,value:sel.value});await loadUpdated()}
     catch(e){note.textContent=e.message;btn.disabled=false}
    };box.append(btn,note);
   }
   if(t.status==='settled')box.append(elem('p','✅ Avgjort: '+String(t.actual_value?.value||''),'nmHelp'));
   fGrid.append(box);
  });
  root.append(fGrid);
  const actions=elem('div',undefined,'nmAdminActions'),publish=elem('button','Publiser begge finaleoppgavene','secondary');
  publish.disabled=finals.some(t=>t.status==='settled');
  publish.onclick=async()=>{
   if(!opens.value||!closing.value){adminFinalMsg.textContent='Velg begge tidspunktene.';return}
   publish.disabled=true;adminFinalMsg.textContent='Lagrer…';
   try{await call('admin_publish_nm_question',{task_id:finals[0].id,opens_at:new Date(opens.value).toISOString(),deadline:new Date(closing.value).toISOString()});await loadUpdated()}
   catch(e){adminFinalMsg.textContent=e.message;publish.disabled=false}
  };
  actions.append(publish);root.append(actions,adminFinalMsg);
 }
}
const prevAdmin=renderAdminBonus;
renderAdminBonus=function(){prevAdmin();adminPanel()};
try{if(D?.bonusTasks){renderNmState();if(D.user?.is_admin)adminPanel()}}catch(e){console.error('NM-bracket',e)}
})();