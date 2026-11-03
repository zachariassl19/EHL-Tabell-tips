(()=>{
'use strict';
const styles=document.createElement('style');styles.id='nmPlayoffV2';
styles.textContent=[
'#nmExtra .nmIntro{padding:16px;border-radius:17px;background:linear-gradient(110deg,#25190e,#111927);border:1px solid #704b25;margin-bottom:18px}',
'#nmExtra .nmIntro h3{margin:0 0 6px;font-size:22px}',
'#nmExtra .nmIntro p{margin:0;color:#d4dce8;font-size:13px;line-height:1.5}',
'#nmExtra .nmStageTitle{display:flex;align-items:center;justify-content:space-between;gap:9px;margin:23px 0 10px}',
'#nmExtra .nmStageTitle h4{font-size:18px;margin:0}',
'#nmExtra .nmStageTitle .nmPointsPill{color:#ffc38a;background:#302013;border:1px solid #85512b;border-radius:99px;padding:6px 11px;white-space:nowrap;font-size:12px;font-weight:900}',
'#nmExtra .nmMatchGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:12px}',
'#nmExtra .nmMatchCard{background:linear-gradient(#111b2b,#0b121d);border:1px solid #2b384c;padding:17px;border-radius:17px;min-width:0}',
'#nmExtra .nmMatchCard h4{font-size:17px;margin:8px 0;line-height:1.35;color:#f7f8fa}',
'#nmExtra .nmSmall{color:#aeb8ca;font-size:12px;line-height:1.5;margin:8px 0}',
'#nmExtra .nmStageChip{color:#ffbb7a;font-size:11px;font-weight:900;letter-spacing:.04em}',
'#nmExtra .nmVersus{display:flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;background:#0b121d;border:1px solid #34455b;padding:12px;margin:12px 0;font-size:13px;font-weight:850;text-align:center}',
'#nmExtra .nmVersus strong{color:#ff9a3d;font-size:11px}',
'#nmExtra .nmMatchCard select{width:100%;margin:7px 0}',
'#nmExtra .nmMatchCard button{width:100%;margin-top:6px}',
'#adminView>#nmMatchAdminCard{grid-column:span 12;min-width:0}',
'#nmAdminMatches details{border:1px solid #2e4056;border-radius:14px;background:#0a111b;margin:10px 0;padding:14px}',
'#nmAdminMatches summary{cursor:pointer;font-weight:850;line-height:1.5}',
'#nmAdminMatches label{display:block;font-size:12px;font-weight:750;margin-top:12px}',
'#nmAdminMatches input,#nmAdminMatches select{width:100%;margin-top:7px}',
'#nmAdminMatches .nmError{color:#ffada4;font-size:12px;margin-top:9px}',
'#nmAdminMatches .nmAdminHint{color:#aeb8ca;font-size:12px;line-height:1.5;margin:12px 0}',
'#nmAdminMatches .nmAdminButtons{display:flex;gap:9px;flex-wrap:wrap;margin-top:10px}',
'#nmAdminMatches .nmAdminButtons button{width:auto;flex:1;min-width:120px;margin:0}'
].join('');document.head.append(styles);
const element=(tag,value,klass)=>{const node=document.createElement(tag);if(value!==undefined)node.textContent=value;if(klass)node.className=klass;return node};
const field=(parent,label,control)=>{const e=element('label',label);e.append(control);parent.append(e);return control};
function localTime(dt){if(!dt)return'';const d=new Date(dt);if(!Number.isFinite(d.getTime()))return'';return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}
function dateInput(value){const el=document.createElement('input');el.type='datetime-local';el.value=localTime(value);return el}
const getQuestions=()=>D?.bonusTasks?.filter(t=>t.source_rule?.group==='nm')||[];
const getSaved=()=>new Map((D?.bonusPicks||[]).map(p=>[p.task_id,p]));
function isQuarter(t){return t.source_rule?.stage==='quarter'}
function optionText(t){return t.kind==='number'?'Velg antall kamper':'Velg Ja eller Nei'}
function stage(title,total){const e=element('div',undefined,'nmStageTitle');const h=element('h4',title);const p=element('span',total+' poeng','nmPointsPill');e.append(h,p);return e}
async function reloadNm(){
 D=await call('bootstrap');
 renderNmState();
 renderRules();
 renderLb();
 renderBonus();
 if(D.user?.is_admin)renderAdminBonus();
}
function questionCard(task,saved){
 const card=element('article',undefined,'nmMatchCard');
 const phrase=isQuarter(task)?'KVARTFINALE · 5 P':'SEMIFINALE · 10 P';
 card.append(element('div',phrase,'nmStageChip'),element('h4',task.title));
 if(task.description)card.append(element('p',task.description,'nmSmall'));
if(task.status==='settled'){
  card.append(element('p','✅ Avgjort · '+(saved?saved.points+' poeng':'Ikke besvart'),'nmSmall'));
  card.append(element('p','Riktig svar: '+String(task.actual_value?.value??'—'),'nmSmall'));
  if(saved)card.append(element('p','Ditt tips: '+String(saved.value?.value??saved.value),'nmSmall'));
  return card;
 }
 if(task.status==='draft'){
  card.append(element('p',isQuarter(task)?'🔒 Spørsmålet åpner når svarfristen er bestemt.':'🔒 Åpnes etter kvartfinalene og låses før første semifinale.','nmSmall'));
  return card;
 }
 if(!task.is_open){
  card.append(element('p',task.opens_at&&Date.now()<new Date(task.opens_at).getTime()?'🔒 Åpner '+fmt(task.opens_at):'🔒 Svarfristen er ute.','nmSmall'));
  if(saved)card.append(element('p','Ditt tips: '+String(saved.value?.value??saved.value),'nmSmall'));
  return card;
 }
 card.append(element('p','Svarfrist: '+fmt(task.deadline),'nmSmall'));
 const select=element('select');select.setAttribute('aria-label',task.title);
 select.add(new Option(optionText(task),''));
 (task.options||[]).forEach(x=>select.add(new Option(String(x),String(x))));
 select.value=String(saved?.value?.value??saved?.value??'');
 const message=element('div','','nmSmall');
 const button=element('button',saved?'Oppdater svaret':'Lagre svar','secondary');
 button.type='button';
 button.onclick=async()=>{
  if(!select.value){message.textContent='Velg et svar først.';return}
  button.disabled=true;message.textContent='Lagrer…';
  try{await call('save_bonus',{task_id:task.id,value:select.value});await reloadNm()}
  catch(err){message.textContent=err.message||'Kunne ikke lagre';button.disabled=false}
 };
 card.append(select,button,message);
 return card;
}
function nmView(){
 if(!D)return;
 const parent=document.getElementById('nmOpen');if(!parent)return;
 let root=document.getElementById('nmExtra');
 if(!root){root=element('section',undefined,'card');root.id='nmExtra';parent.append(root)}
 root.replaceChildren();
 const intro=element('div',undefined,'nmIntro');
 intro.append(element('h3','🏆 Veien til NM-gull'));
 intro.append(element('p','Fire kvartfinaletips og to semifinaletips. Velg Ja/Nei eller antall. Svarene låses før den første kampen i hver runde.'));
 root.append(intro);
 const questions=getQuestions(),saved=getSaved();
 for(const [title,pts,filter] of [
  ['🔥 Kvartfinaler',20,isQuarter],
  ['🥇 Semifinaletips',20,t=>!isQuarter(t)]
 ]){
  const selected=questions.filter(filter);
  root.append(stage(title,pts));
  const grid=element('div',undefined,'nmMatchGrid');
  selected.forEach(t=>grid.append(questionCard(t,saved.get(t.id))));
  root.append(grid);
 }
}
const oldRender=renderNmState;
renderNmState=function(){
 oldRender();
 const locked=document.getElementById('nmLocked');
 if(locked&&!D.nmOpen){
  let info=document.getElementById('nmTotalLocked');
  if(!info){info=element('p',undefined,'tiny');info.id='nmTotalLocked';locked.append(info)}
  info.textContent='🏆 NM er verdt 100 poeng: Norgesmester 30, poengkonge 15, MVP 15 og spennende sluttspilltips 40.';
 }
 nmView();
};
function adminSelect(options,initial='',placeholder='Velg svar'){
 const e=element('select');e.append(new Option(placeholder,''));
 options.forEach(v=>e.append(new Option(String(v),String(v))));
 e.value=String(initial??'');return e;
}
function adminNM(){
 if(!D?.user?.is_admin)return;
 const anchor=document.getElementById('nmUnlock')?.closest('.card');if(!anchor)return;
 let root=document.getElementById('nmAdminMatches');
 if(!root){
  const panel=element('section',undefined,'card');panel.id='nmMatchAdminCard';
  root=element('div');root.id='nmAdminMatches';panel.append(root);
  anchor.insertAdjacentElement('afterend',panel);
 }
 root.replaceChildren();
 root.append(element('h3','🏆 Veien til NM-gull · 40 poeng'));
 root.append(element('p','Alle spørsmål har ferdige svarvalg. Sett åpning og svarfrist. Begge semifinalespørsmålene får automatisk samme frist og må låses før den første semifinalekampen.','nmAdminHint'));
 if(!D.settings?.nm_deadline)root.append(element('p','Husk å sette hovedfristen for NM i feltet ovenfor før NM åpnes.','nmError'));
 const tasks=getQuestions();
 for(const [heading,filter] of [['🔥 Kvartfinaletips',isQuarter],['🥇 Semifinaletips',t=>!isQuarter(t)]]){
  const h=element('h4',heading);h.style.margin='20px 0 8px';root.append(h);
  for(const t of tasks.filter(filter)){
   const details=element('details'),label=t.status==='draft'?'Ikke publisert':t.status==='settled'?'Avgjort':'Klargjort';
   const summary=element('summary',t.title+' · '+maxBonus(t)+' p · '+label);
   details.append(summary);
   if(t.description)details.append(element('p',t.description,'nmAdminHint'));
   const choices=t.options.map(String).join(' / ');
   details.append(element('p','Svaralternativer: '+choices,'nmAdminHint'));
   if(!isQuarter(t))details.append(element('p','Begge semifinalespørsmålene publiseres samtidig med identisk svarfrist.','nmAdminHint'));
   const op=dateInput(t.opens_at||D.settings?.nm_unlock_at),dl=dateInput(t.deadline);
   field(details,'Når skal spørsmålet åpne?',op);
   field(details,'Svarfrist før kampene starter',dl);
   const errors=element('div','','nmError');
   const buttons=element('div',undefined,'nmAdminButtons');
   const save=element('button',t.status==='draft'?'Publiser spørsmålet':'Oppdater datoene','secondary');
   save.type='button';save.disabled=t.status==='settled';
   save.onclick=async()=>{
    if(!op.value||!dl.value){errors.textContent='Legg inn både åpning og svarfrist.';return}
    const start=new Date(op.value),end=new Date(dl.value);
    if(!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||end<=start){errors.textContent='Svarfristen må være etter åpningstiden.';return}
    save.disabled=true;errors.textContent='Lagrer…';
    try{
     await call('admin_publish_nm_question',{task_id:t.id,opens_at:start.toISOString(),deadline:end.toISOString()});await reloadNm();
    }catch(err){errors.textContent=err.message||'Kunne ikke lagre';save.disabled=false}
   };
   buttons.append(save);
   if(t.status==='open'&&t.options?.length>=2){
    const result=adminSelect(t.options,'','Velg riktig svar');
    field(details,'Fasit når dette er avgjort',result);
    const settle=element('button','Registrer fasit','secondary');settle.type='button';
    settle.onclick=async()=>{
     if(!result.value){errors.textContent='Velg riktig svar først.';return}
     if(!confirm('Sette «'+result.value+'» som fasit for «'+t.title+'»? Dette oppdaterer poengene.'))return;
     settle.disabled=true;errors.textContent='Setter fasit…';
     try{await call('admin_set_bonus_actual',{task_id:t.id,value:result.value});await reloadNm()}
     catch(err){errors.textContent=err.message||'Kunne ikke avgjøre';settle.disabled=false}
    };
    buttons.append(settle);
   }
   details.append(buttons,errors);
   root.append(details);
  }
 }
}
const oldAdmin=renderAdminBonus;
renderAdminBonus=function(){oldAdmin();adminNM()};
try{if(D?.bonusTasks){renderNmState();if(D.user?.is_admin)adminNM()}}catch(e){console.error('NM-utforming',e)}
})();