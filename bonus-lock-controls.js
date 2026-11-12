(()=>{'use strict';
if(typeof renderAdminBonus!=='function')return;
const old=renderAdminBonus;
const style=document.createElement('style');style.textContent='.bonusLockTools{border-top:1px solid #354257;margin-top:15px;padding-top:12px}.bonusLockTools button{margin:5px 5px 5px 0;width:auto}.bonusLockTools select,.bonusLockTools input{max-width:100%;box-sizing:border-box;background:#111d2d;color:#fff;border:1px solid #354257;border-radius:8px;padding:10px}.bonusLockTools label{display:block;margin:8px 0}.bonusLockWarning{color:#ffbe81;font-size:12px}';document.head.append(style);
function make(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n}
function local(iso){if(!iso)return '';const d=new Date(iso);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}
renderAdminBonus=function(){
 old();
 if(!D?.user?.is_admin)return;
 document.querySelectorAll('#adminBonus .monthlyAdminCard').forEach((card,i)=>{
  const pkg=['2026-11','2026-12','2027-01','2027-02','2027-03'][i];if(!pkg)return;
  const tasks=(D.bonusTasks||[]).filter(t=>t.source_rule?.package===pkg);
  if(!tasks.length)return;
  const body=card.querySelector('.monthlyAdminBody');if(!body)return;
  const wrap=make('section');wrap.className='bonusLockTools';
  wrap.append(make('h4','🔐 Låsing av oppgaver'));
  const pick=make('select');pick.append(new Option('Hele pakken',''));
  tasks.forEach(t=>pick.append(new Option(t.title,String(t.id))));
  const label=make('label','Velg hva du vil styre');label.append(pick);wrap.append(label);
  const date=make('input');date.type='datetime-local';date.value=local(tasks[0].deadline);
  const dl=make('label','Egen svarfrist');dl.append(date);wrap.append(dl);
  const warning=make('p','⚠️ Åpning etter kampstart kan gi deltakere tilgang til kjent resultat.');warning.className='bonusLockWarning';wrap.append(warning);
  const status=make('p','');status.className='monthlyAdminMsg';status.setAttribute('role','status');
  async function run(mode){
   if(mode==='open'&&!confirm('Åpne igjen? Etter kampstart kan resultatet allerede være kjent.'))return;
   const payload={package:pkg,mode,...(pick.value?{task_id:Number(pick.value)}:{}),...(mode==='deadline'?{deadline:new Date(date.value).toISOString()}:{}),...(mode==='open'?{minutes:90}:{})};
   status.textContent='Lagrer…';
   try{const result=await call('admin_bonus_lock_control',payload);status.textContent='✓ Oppdatert '+result.count+' oppgave(r). Frist: '+fmt(result.deadline);D=await call('bootstrap');renderAdminBonus();renderBonus()}
   catch(e){status.textContent='Feil: '+(e.message||'Kunne ikke lagre')}
  }
  for(const [name,mode] of [['Åpne i 90 minutter','open'],['Lås nå','lock'],['Lagre egen frist','deadline'],['Lås ved første kampstart','first_game']]){
   const b=make('button',name);b.type='button';b.className='secondary';b.onclick=()=>run(mode);wrap.append(b);
  }
  wrap.append(status);body.append(wrap);
 });
};
if(D?.user?.is_admin)renderAdminBonus();
})();