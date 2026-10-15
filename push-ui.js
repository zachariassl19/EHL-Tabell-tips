(()=>{'use strict';
const API='https://bioqeczhqedlhbvprxci.supabase.co/functions/v1/ehl-push';
const token=()=>localStorage.getItem('ehlToken')||'';
const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const b64=s=>{const pad='='.repeat((4-s.length%4)%4);const raw=atob((s+pad).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)))};
async function api(action,body={}){
  const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json',...(token()?{'x-session-token':token()}:{})},body:JSON.stringify({action,...body})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Kunne ikke koble til push');return j;
}
async function registration(){return navigator.serviceWorker.register('./sw.js?v=20261016a',{scope:'./'}).then(()=>navigator.serviceWorker.ready)}
async function currentSub(){if(!('serviceWorker'in navigator))return null;const reg=await registration();return reg.pushManager.getSubscription()}
function button(text,fn,primary=false){
  const b=document.createElement('button');b.className=primary?'primary':'secondary';b.style.width='auto';b.style.margin='0';b.textContent=text;b.onclick=fn;return b;
}
function makeCard(){
  if(document.getElementById('pushCard'))return document.getElementById('pushCard');
  const app=document.getElementById('app');if(!app)return null;
  const card=document.createElement('div');card.id='pushCard';card.className='card';
  card.innerHTML='<div class="ey">Varsler</div><h3 style="margin:8px 0 4px">🔔 Pushvarsler</h3><p id="pushText" class="muted" style="margin:0 0 10px"></p><div id="pushActions" style="display:flex;gap:8px;flex-wrap:wrap"></div><div id="pushPrefs" style="margin-top:12px"></div><div id="pushAdmin" style="margin-top:12px"></div>';
  const deadline=app.querySelector(':scope > .deadline');
  if(deadline)deadline.insertAdjacentElement('afterend',card);else app.prepend(card);
  return card;
}
function toggleRow(label,key,checked){
  const row=document.createElement('label');row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-top:1px solid var(--line);font-size:13px;font-weight:800';
  const s=document.createElement('span');s.textContent=label;
  const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!checked;cb.style.cssText='width:22px;height:22px;margin:0;accent-color:var(--accent)';
  cb.onchange=async()=>{cb.disabled=true;try{await api('preferences',{[key]:cb.checked})}catch(e){cb.checked=!cb.checked;alert(e.message)}finally{cb.disabled=false}};
  row.append(s,cb);return row;
}
async function renderPrefs(holder,prefs){
  holder.innerHTML='<div class="tiny" style="margin-bottom:4px"><b>Hva vil du få varsel om?</b></div>';
  holder.append(
    toggleRow('Ny bonusoppgave','new_bonus',prefs.new_bonus),
    toggleRow('Manglende svar – ca. 24 timer før frist','deadline_24h',prefs.deadline_24h),
    toggleRow('Manglende svar – ca. 2 timer før frist','deadline_2h',prefs.deadline_2h),
    toggleRow('Bonusoppgave avgjort + poeng','results',prefs.results),
    toggleRow('Viktige meldinger fra admin','admin_broadcast',prefs.admin_broadcast)
  );
}
async function renderAdmin(holder){
  if(typeof D==='undefined'||!D?.user?.is_admin){holder.innerHTML='';return}
  try{
    const s=await api('admin_status');
    const on=s.users.filter(x=>x.enabled).length,total=s.users.length;
    holder.innerHTML='<div class="notice"><b>Push-status: '+on+'/'+total+' aktive deltakere</b><div class="tiny" style="margin-top:5px">'+s.users.map(x=>(x.enabled?'✓ ':'○ ')+x.name+(x.devices>1?' ('+x.devices+' enheter)':'')).join(' · ')+'</div></div><div style="margin-top:10px"><b style="font-size:13px">Send melding til alle med varsler</b><input id="pushAdminTitle" placeholder="Tittel" value="🏒 EHL Familietips"><input id="pushAdminMsg" placeholder="Melding"><button id="pushAdminSend" class="secondary" style="width:auto">Send push</button><span id="pushAdminStatus" class="tiny" style="margin-left:8px"></span></div>';
    holder.querySelector('#pushAdminSend').onclick=async()=>{
      const b=holder.querySelector('#pushAdminSend'),st=holder.querySelector('#pushAdminStatus');
      const title=holder.querySelector('#pushAdminTitle').value.trim(),message=holder.querySelector('#pushAdminMsg').value.trim();
      if(!message){st.textContent='Skriv en melding først.';return}
      b.disabled=true;st.textContent='Sender…';
      try{const r=await api('admin_send_all',{title,message,url:'./'});st.textContent='Sendt til '+r.sent+' enhet(er)'+(r.failed?' · '+r.failed+' feilet':'');}
      catch(e){st.textContent=e.message}finally{b.disabled=false}
    };
  }catch(e){holder.innerHTML='<div class="err">'+e.message+'</div>'}
}
async function render(){
  if(!token())return;
  const card=makeCard();if(!card)return;
  const text=card.querySelector('#pushText'),actions=card.querySelector('#pushActions'),prefs=card.querySelector('#pushPrefs'),admin=card.querySelector('#pushAdmin');
  actions.innerHTML='';prefs.innerHTML='';
  await renderAdmin(admin);
  if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window)){
    text.textContent='Denne nettleseren støtter ikke pushvarsler.';return;
  }
  if(isIOS()&&!standalone()){
    text.innerHTML='På iPhone/iPad må Familietips først legges til på Hjem-skjermen. Trykk <b>Del</b> → <b>Legg til på Hjem-skjerm</b>. Åpne appen fra ikonet og slå på varsler.';
    return;
  }
  let sub=null;try{sub=await currentSub()}catch(e){text.textContent='Kunne ikke starte varsler: '+e.message;return}
  if(Notification.permission==='granted'&&sub){
    text.textContent='Varsler er på på denne enheten. Nye bonusoppgaver og manglende svar kan varsles automatisk.';
    let st={preferences:{new_bonus:true,deadline_24h:true,deadline_2h:true,results:true,admin_broadcast:true}};
    try{st=await api('status')}catch{}
    await renderPrefs(prefs,st.preferences||{});
    actions.append(button('Send testvarsel',async e=>{const b=e.currentTarget;b.disabled=true;b.textContent='Sender…';try{const r=await api('test');b.textContent=r.sent?'Test sendt ✓':'Fant ingen aktiv enhet'}catch(err){b.textContent=err.message}finally{setTimeout(()=>{b.disabled=false;b.textContent='Send testvarsel'},2200)}}));
    actions.append(button('Slå av på denne enheten',async()=>{try{const s=await currentSub();if(s){await api('unsubscribe',{endpoint:s.endpoint});await s.unsubscribe()}await render()}catch(e){alert(e.message)}}));
    return;
  }
  if(Notification.permission==='denied'){
    text.textContent='Varsler er blokkert. Tillat varsler i telefonens innstillinger for Familietips/nettleseren.';return;
  }
  text.textContent=isIOS()?'Trykk under for å tillate varsler på denne iPhone/iPad-en.':'Trykk under for å slå på varsler på denne enheten.';
  actions.append(button('Slå på varsler',async e=>{
    const b=e.currentTarget;b.disabled=true;
    try{
      const permission=await Notification.requestPermission();if(permission!=='granted')throw Error('Varsler ble ikke tillatt');
      const reg=await registration(),key=await api('public_key');
      const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(key.publicKey)});
      await api('subscribe',{subscription:sub.toJSON(),userAgent:navigator.userAgent});
      await render();
    }catch(err){text.textContent=err.message;b.disabled=false}
  },true));
}
function openHashView(){
  if(location.hash!=='#bonus')return;
  const btn=document.querySelector('.tab[data-view="bonus"]');
  if(btn)btn.click();
}
if('serviceWorker'in navigator)registration().catch(()=>{});
const boot=()=>{let tries=0;const t=setInterval(()=>{tries++;if(localStorage.getItem('ehlToken')&&document.getElementById('app')){clearInterval(t);render();setTimeout(openHashView,300)}else if(tries>80)clearInterval(t)},250)};
boot();
window.addEventListener('focus',()=>{if(token())render()});
window.addEventListener('hashchange',openHashView);
})();