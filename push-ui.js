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
async function registration(){return navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(()=>navigator.serviceWorker.ready)}
async function currentSub(){if(!('serviceWorker'in navigator))return null;const reg=await registration();return reg.pushManager.getSubscription()}
function makeCard(){
  if(document.getElementById('pushCard'))return document.getElementById('pushCard');
  const app=document.getElementById('app');if(!app)return null;
  const card=document.createElement('div');card.id='pushCard';card.className='card';
  card.innerHTML='<div class="ey">Varsler</div><h3 style="margin:8px 0 4px">🔔 Pushvarsler</h3><p id="pushText" class="muted" style="margin:0 0 10px"></p><div id="pushActions" style="display:flex;gap:8px;flex-wrap:wrap"></div>';
  const deadline=app.querySelector(':scope > .deadline');
  if(deadline)deadline.insertAdjacentElement('afterend',card);else app.prepend(card);
  return card;
}
function button(text,fn,primary=false){
  const b=document.createElement('button');b.className=primary?'primary':'secondary';b.style.width='auto';b.style.margin='0';b.textContent=text;b.onclick=fn;return b;
}
async function render(){
  if(!token())return;
  const card=makeCard();if(!card)return;
  const text=card.querySelector('#pushText'),actions=card.querySelector('#pushActions');actions.innerHTML='';
  if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window)){
    text.textContent='Denne nettleseren støtter ikke pushvarsler.';return;
  }
  if(isIOS()&&!standalone()){
    text.innerHTML='På iPhone/iPad må Familietips først legges til på Hjem-skjermen. Trykk <b>Del</b> → <b>Legg til på Hjem-skjerm</b>. Åpne deretter appen fra ikonet og slå på varsler.';
    return;
  }
  let sub=null;try{sub=await currentSub()}catch(e){text.textContent='Kunne ikke starte varsler: '+e.message;return}
  if(Notification.permission==='granted'&&sub){
    text.textContent='Pushvarsler er på på denne enheten.';
    actions.append(button('Send testvarsel',async e=>{const b=e.currentTarget;b.disabled=true;b.textContent='Sender…';try{const r=await api('test');b.textContent=r.sent?'Test sendt ✓':'Fant ingen aktiv enhet'}catch(err){b.textContent=err.message}finally{setTimeout(()=>{b.disabled=false;b.textContent='Send testvarsel'},2200)}}));
    actions.append(button('Slå av',async()=>{try{const s=await currentSub();if(s){await api('unsubscribe',{endpoint:s.endpoint});await s.unsubscribe()}await render()}catch(e){alert(e.message)}}));
    return;
  }
  if(Notification.permission==='denied'){
    text.textContent='Varsler er blokkert i nettleseren. Tillat varsler i innstillingene for denne appen/nettsiden.';return;
  }
  text.textContent=isIOS()?'Trykk under for å tillate varsler på iPhone/iPad.':'Trykk under for å slå på pushvarsler på denne enheten.';
  actions.append(button('Slå på varsler',async e=>{
    const b=e.currentTarget;b.disabled=true;
    try{
      const permission=await Notification.requestPermission();if(permission!=='granted')throw Error('Varsler ble ikke tillatt');
      const reg=await registration();const key=await api('public_key');
      const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(key.publicKey)});
      await api('subscribe',{subscription:sub.toJSON(),userAgent:navigator.userAgent});
      await render();
    }catch(err){text.textContent=err.message;b.disabled=false}
  },true));
}
if('serviceWorker'in navigator)registration().catch(()=>{});
const boot=()=>{let tries=0;const t=setInterval(()=>{tries++;if(localStorage.getItem('ehlToken')&&document.getElementById('app')){clearInterval(t);render()}else if(tries>80)clearInterval(t)},250)};
boot();
window.addEventListener('focus',()=>{if(token())render()});
})();