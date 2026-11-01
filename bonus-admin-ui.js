(()=>{
if(typeof renderAdminBonus!=='function')return;
const original=renderAdminBonus;
const packs=[['2026-11','🍂','November'],['2026-12','🎄','Desember'],['2027-01','❄️','Januar'],['2027-02','🏒','Februar'],['2027-03','🏆','Seriefinale']];
let active='2026-11';const messages={};
const style=document.createElement('style');style.textContent='#adminBonus .monthlyAdminGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,350px),1fr));gap:12px;margin:12px 0 24px}#adminBonus .monthlyAdminCard{background:#0b111c;border:1px solid #2c394a;border-radius:16px;overflow:hidden;min-width:0}#adminBonus .monthlyAdminCard[open]{border-color:#a1642d}#adminBonus .monthlyAdminCard>summary{cursor:pointer;list-style:none;padding:16px}#adminBonus .monthlyAdminCard>summary::-webkit-details-marker{display:none}#adminBonus .monthlyAdminCard>summary strong{font-size:17px}#adminBonus .monthlyAdminCard>summary small{display:block;color:#aeb8ca;margin-top:5px}#adminBonus .monthlyAdminBody{padding:14px;border-top:1px solid #2c394a}#adminBonus .monthlyAdminBody label{display:block;font-size:13px;font-weight:800;margin:10px 0}#adminBonus .monthlyAdminBody input,#adminBonus .monthlyAdminBody select,#adminBonus .monthlyAdminBody textarea{display:block;width:100%;padding:11px;color:white;background:#0b121e;border:1px solid #324057;border-radius:10px;margin-top:6px;box-sizing:border-box;font:inherit;font-size:14px}#adminBonus .monthlyAdminBody textarea{min-height:70px;resize:vertical}#adminBonus .monthlyAdminBody .secondary{margin-top:9px}#adminBonus .monthlyAdminMsg{font-size:12px;font-weight:800;margin:9px 0;overflow-wrap:anywhere}#adminBonus .monthlyAdminAdd{margin-top:14px;border-top:1px solid #2a3648;padding-top:12px}#adminBonus .monthlyAdminAdd>summary{cursor:pointer;color:#ffb46e;font-weight:850}#adminBonus .monthlyAdminSmall{font-size:12px;color:#aeb8ca;margin-top:8px}';document.head.append(style);
const el=(t,s,c)=>{const n=document.createElement(t);if(s!==undefined)n.textContent=s;if(c)n.className=c;return n};
const field=(parent,name,node)=>{const lab=el('label',name);lab.append(node);parent.append(lab);return lab};
const local=iso=>{if(!iso)return '';const d=new Date(iso);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)};
renderAdminBonus=function(){
 original();
 const root=document.querySelector('#adminBonus');if(!root||!D?.user?.is_admin)return;
 root.querySelectorAll(':scope > .packageAdmin').forEach(n=>n.remove());
 if(root.firstElementChild?.querySelector('h4')?.textContent?.includes('Månedspakker'))root.firstElementChild.remove();
 const intro=el('div');intro.append(el('h3','📦 Månedspakker'),el('p','Velg pakke for å legge til spørsmål og styre slippdato.'));
 const grid=el('div',undefined,'monthlyAdminGrid');
 for(const [pkg,emoji,name] of packs){
  const tasks=(D.bonusTasks||[]).filter(t=>t.source_rule?.package===pkg);
  const total=tasks.reduce((a,t)=>a+maxBonus(t),0),opening=tasks.map(t=>t.opens_at).filter(Boolean).sort()[0];
  const card=el('details',undefined,'monthlyAdminCard');card.open=active===pkg;
  card.addEventListener('toggle',()=>{if(card.open)active=pkg});
  const summary=el('summary');summary.append(el('strong',emoji+' '+name),el('small',tasks.length?tasks.length+' spørsmål · '+total+' poeng':'Ingen spørsmål ennå'));card.append(summary);
  const body=el('div',undefined,'monthlyAdminBody');body.append(el('p',opening?'Slipp satt: '+fmt(opening):'Ingen slippdato satt','monthlyAdminSmall'));
  const when=document.createElement('input');when.type='datetime-local';when.value=local(opening);field(body,'Åpnes dato og klokkeslett',when);
  const save=el('button',tasks.length?'Lagre slippdato':'Legg til spørsmål først','secondary');save.type='button';save.disabled=!tasks.length;
  const msg=el('div',messages[pkg]||'','monthlyAdminMsg');
  save.onclick=async()=>{if(!when.value){msg.textContent='Velg tidspunkt først';return}save.disabled=true;msg.textContent='Lagrer…';try{
   const result=await call('admin_set_bonus_package_unlock',{package:pkg,opens_at:new Date(when.value).toISOString()});
   messages[pkg]='✓ Slipp lagret for '+result.count+' spørsmål';D=await call('bootstrap');renderAdminBonus();renderBonus();
  }catch(e){msg.textContent='Feil: '+e.message;save.disabled=false}};
  body.append(save,msg);
  tasks.forEach(t=>body.append(el('div','• '+t.title,'monthlyAdminSmall')));
  if(!tasks.length)body.append(el('p','Legg til spørsmål før du setter slippdato.','monthlyAdminSmall'));
  const details=el('details',undefined,'monthlyAdminAdd');details.append(el('summary','+ Legg til spørsmål'));
  const form=document.createElement('form');
  const question=document.createElement('input');question.placeholder='Skriv spørsmålet';question.required=true;question.maxLength=200;field(form,'Spørsmål',question);
  const kind=document.createElement('select');kind.add(new Option('Velg svar','option_choice'));kind.add(new Option('Tipp antall','number'));field(form,'Svartype',kind);
  const choices=document.createElement('textarea');choices.value='Ja\nNei';const choicesLabel=field(form,'Alternativer (ett per linje)',choices);kind.onchange=()=>choicesLabel.style.display=kind.value==='number'?'none':'';
  const points=document.createElement('input');points.type='number';points.min='1';points.max='5';points.value='1';points.required=true;field(form,'Poeng for helt riktig svar (1–5)',points);
  const deadline=document.createElement('input');deadline.type='datetime-local';deadline.required=true;field(form,'Svarfrist',deadline);
  const description=document.createElement('textarea');description.placeholder='Valgfri beskrivelse';field(form,'Beskrivelse',description);
  const create=el('button','Opprett spørsmål','secondary');create.type='submit';const feedback=el('div','', 'monthlyAdminMsg');form.append(create,feedback);
  form.onsubmit=async e=>{e.preventDefault();const options=choices.value.split('\n').map(s=>s.trim()).filter(Boolean);if(kind.value==='option_choice'&&options.length<2){feedback.textContent='Minst to svaralternativer';return}
   if(!deadline.value){feedback.textContent='Velg svarfrist';return}create.disabled=true;feedback.textContent='Oppretter…';
   try{await call('admin_create_bonus_task',{package:pkg,title:question.value,description:description.value,kind:kind.value,options,points:Number(points.value),deadline:new Date(deadline.value).toISOString()});
    messages[pkg]='✓ Spørsmål opprettet';D=await call('bootstrap');renderAdminBonus();renderBonus();renderRules();
   }catch(err){feedback.textContent='Feil: '+err.message;create.disabled=false}
  };
  details.append(form);body.append(details);card.append(body);grid.append(card);
 }
 root.prepend(grid);root.prepend(intro);
};
if(typeof D!=='undefined'&&D?.user?.is_admin)renderAdminBonus();
})();