(()=>{
const style=document.createElement('style');style.textContent=`
.bonusTop{align-items:flex-start}.bonusDeadlineWrap{display:flex;flex-direction:column;gap:4px;align-items:flex-end}.deadlineBox{display:inline-flex;align-items:center;gap:5px}.deadlinePast{background:#281419;border-color:#6f2d38;color:#ffadb7}.deadlineOpen{background:#23180d;border-color:#6e481e;color:#ffd7a6}.bonusSaveMsg{font-size:12px;font-weight:800;margin-top:8px}.bonusSaveMsg.ok{color:var(--green)}.bonusSaveMsg.err{color:var(--red)}
@media(max-width:560px){.bonusTop{align-items:stretch}.bonusDeadlineWrap{align-items:stretch}.deadlineBox{justify-content:center;text-align:center}.bonusPick{flex-direction:column;align-items:stretch}}
`;document.head.append(style);

const originalRenderBonus=typeof renderBonus==='function'?renderBonus:null;
renderBonus=function(){
 const c=$('#bonusTasks');if(!c||!D)return;c.innerHTML='';
 const picks=new Map((D.bonusPicks||[]).map(p=>[p.task_id,p]));
 (D.bonusTasks||[]).forEach(t=>{
  const p=picks.get(t.id),now=Date.now(),hasDeadline=!!t.deadline,past=hasDeadline&&now>new Date(t.deadline).getTime();
  const div=document.createElement('div');
  div.className='card bonus '+(t.status==='settled'?'settled':(!t.is_open?'locked':''));
  const state=t.status==='settled'?'AVGJORT':t.is_open?'ÅPEN':past?'FRIST UTE':'IKKE ÅPEN';
  const deadlineHtml=hasDeadline
   ?'<div class="bonusDeadlineWrap"><span class="deadlineBox '+(past?'deadlinePast':'deadlineOpen')+'">⏰ Frist: '+fmt(t.deadline)+'</span>'+(past?'<span class="tiny">Fristen er passert</span>':'')+'</div>'
   :'<div class="bonusDeadlineWrap"><span class="deadlineBox deadlinePast">⚠️ Ingen frist satt</span></div>';
  div.innerHTML='<div class="bonusTop"><span class="bonusState">'+state+'</span>'+deadlineHtml+'</div><h3>'+t.title+'</h3><p>'+(t.description||'')+'</p><div class="pointsInfo"><b>Maks '+maxBonus(t)+' p</b> · '+scoringText(t)+'</div><div class="meta">'+(p?'Ditt valg: '+bonusValue(t,p):'Ikke besvart')+(t.status==='settled'&&p?' · '+p.points+' p':'')+'</div>';
  if(t.is_open){
   const row=document.createElement('div');row.className='bonusPick';
   const inp=taskInput(t,bonusValue(t,p));
   const b=document.createElement('button');b.className='secondary';b.textContent=p?'Endre valg':'Lagre valg';
   const msg=document.createElement('div');msg.className='bonusSaveMsg';
   b.onclick=async()=>{
    if(!inp.value){msg.className='bonusSaveMsg err';msg.textContent='Velg et svar først.';return}
    b.disabled=true;msg.className='bonusSaveMsg';msg.textContent='Lagrer…';
    try{
     await call('save_bonus',{task_id:t.id,value:inp.value});
     D=await call('bootstrap');
     renderBonus();renderLb();
     const refreshed=[...document.querySelectorAll('.bonus')].find(x=>x.querySelector('h3')?.textContent===t.title);
     if(refreshed){const ok=document.createElement('div');ok.className='bonusSaveMsg ok';ok.textContent='✓ Lagret';refreshed.append(ok);setTimeout(()=>ok.remove(),2500)}
    }catch(e){b.disabled=false;msg.className='bonusSaveMsg err';msg.textContent=e.message||'Kunne ikke lagre.'}
   };
   row.append(inp,b);div.append(row,msg)
  }
  c.append(div)
 })
};

try{
 const intro=document.querySelector('#intro li:nth-child(2)');
 if(intro)intro.innerHTML='<b>Bonus:</b> hver bonusoppgave har sin egen frist, og fristen vises direkte på hvert kort.';
 if(typeof D!=='undefined'&&D?.bonusTasks?.length)renderBonus();
}catch{}
})();