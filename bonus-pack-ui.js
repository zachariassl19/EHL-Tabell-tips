(()=>{
'use strict';
if(typeof renderBonus!=='function')return;
let selectedPack=null;
let seasonExpanded=false;
let releaseTimer=null;
const featured=[
 {id:'2026-11',title:'November',emoji:'🍂'},
 {id:'2026-12',title:'Desember',emoji:'🎄'},
 {id:'2027-01',title:'Januar',emoji:'❄️'},
 {id:'2027-02',title:'Februar',emoji:'🏒'},
 {id:'2027-03',title:'Seriefinale',emoji:'🏆'}
];
const months=['','januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'];
const monthAlias={jan:1,feb:2,mar:3,apr:4,mai:5,may:5,jun:6,jul:7,aug:8,sep:9,okt:10,oct:10,nov:11,des:12,dec:12};
const css=document.createElement('style');
css.textContent=[
 '#bonusTasks{display:block!important;grid-template-columns:none!important;min-width:0}#bonusTasks>*{min-width:0}.bonusIntro{margin-bottom:12px}.bonusIntro h2{margin-bottom:5px}.bonusIntro p{margin:0}',
 '.packHeading{display:flex;justify-content:space-between;gap:10px;align-items:center;margin:10px 2px 12px}.packHeading h3{margin:0;font-size:19px}.packHeading .tiny{white-space:nowrap}',
 '.packGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:14px;width:100%}',
 '.packTile{min-width:0;overflow:hidden;width:100%;display:flex;flex-direction:column;align-items:stretch;gap:7px;text-align:left;min-height:140px;padding:15px;border:1px solid #2a3445;border-radius:17px;background:linear-gradient(150deg,#141b27,#0b1018);color:#fff;box-shadow:none;cursor:pointer}',
 '.packTile:hover{border-color:#a5662b}.packTile[aria-pressed="true"]{border-color:var(--accent);background:linear-gradient(145deg,#24190f,#101722);box-shadow:0 0 0 1px rgba(255,122,0,.15)}',
 '.packTileTop{display:flex;justify-content:space-between;align-items:center}.packIcon{font-size:30px}.packLock{font-size:15px;color:#a7b4c5}',
 '.packTitle{font-size:17px;font-weight:900;line-height:1.15;overflow-wrap:anywhere}.packMeta{font-size:12px;color:#aeb8ca}.packStatus{margin-top:auto;font-size:11px;font-weight:900;color:#ffbd7d}.packStatus.done{color:var(--green)}',
 '.packExpanded{padding:15px;margin:0 0 15px;border:1px solid #3f342b;border-radius:17px;background:#101620}.packExpanded h3{margin:0 0 5px}.packExpanded>.tiny{margin-bottom:12px;display:block}',
 '.packExpandedHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}.packExpandedHead h3{margin:0}.packClose{border:1px solid #45546b;background:#1b283b;color:#fff;border-radius:10px;padding:9px 12px;cursor:pointer;font-weight:800;flex-shrink:0}.packClose:focus-visible{outline:2px solid var(--accent)}',
 '.packTaskList{display:grid;grid-template-columns:1fr;gap:10px}.packTaskList>.card{margin:0}',
 '.bonusSeasonToggle{width:100%;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:16px;background:#101722;color:#fff;border:1px solid #2a3445;border-radius:15px;text-align:left;cursor:pointer}',
 '.bonusSeasonToggle strong{font-size:17px}.bonusSeasonToggle small{display:block;color:#aeb8ca;font-size:12px;margin-top:4px}',
 '.bonusSeasonList{display:grid;grid-template-columns:1fr;gap:10px;margin-top:12px}.bonusSeasonList>.card{margin:0}',
 '.bonusEmpty{border:1px dashed #35445b;border-radius:12px;padding:16px;color:#aeb8ca;font-size:13px}',
 '.packTileOpponents{font-size:11px;line-height:1.4;color:#d1d9e7;min-height:31px;overflow-wrap:anywhere}',
 '.packGames{border:1px solid #314158;border-radius:15px;background:#0b1420;padding:14px;margin:14px 0 17px;min-width:0}',
 '.packGamesTitle{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 6px}',
 '.packGamesTitle h4{font-size:16px;color:#f5f8fc;margin:0}',
 '.packGamesCaption{font-size:11px;color:#9fb2c9;line-height:1.5;margin:0 0 11px}',
 '.packGamesList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
 '.packGameRow{display:grid;grid-template-columns:65px minmax(0,1fr);gap:10px;align-items:center;padding:10px;border:1px solid #2a394d;border-radius:11px;background:#111d2d;min-width:0}',
 '.packGameDate{font-size:12px;font-weight:900;color:#f6ca97;line-height:1.35}',
 '.packGameDate small{display:block;font-size:11px;color:#aeb8ca;font-weight:700}',
 '.packGameOpponent{font-size:13px;font-weight:900;color:#f4f7fc;overflow-wrap:anywhere}',
 '.packGameSubtitle{font-size:11px;color:#acbdd0;line-height:1.4;margin-top:3px}',
 '.packGameResult{font-weight:900;color:#8ee1aa}',
 '@media(max-width:740px){.packGamesList{grid-template-columns:1fr}}',
 '@media(min-width:800px){.packGrid{grid-template-columns:repeat(5,minmax(0,1fr))}.packTaskList,.bonusSeasonList{grid-template-columns:repeat(2,minmax(0,1fr))}}',
 '@media(max-width:460px){.packTile{min-height:132px;padding:12px}.packTitle{font-size:16px}.packIcon{font-size:27px}.packHeading{align-items:flex-start;flex-direction:column}}'
].join('');
css.textContent += [
 '.packWarning{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:20px max(16px,env(safe-area-inset-right)) 20px max(16px,env(safe-area-inset-left));background:rgba(2,6,13,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);overflow-y:auto}',
 '.packWarningCard{position:relative;box-sizing:border-box;width:min(440px,100%);max-height:calc(100dvh - 40px);overflow-y:auto;padding:30px 22px 22px;border:1px solid #68431d;border-radius:22px;background:radial-gradient(circle at 50% 0%,rgba(255,122,0,.18),transparent 66%),#101723;color:#f8fafc;text-align:center;box-shadow:0 24px 90px rgba(0,0,0,.65)}',
 '.packWarningIcon{font-size:52px;line-height:1.1;margin-bottom:8px}',
 '.packWarningCard .ey{color:#ffb777;font-size:12px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}',
 '.packWarningCard h2{font-size:clamp(24px,6vw,30px);margin:9px 0 12px}',
 '.packWarningCard p{font-size:15px;line-height:1.6;margin:0 0 14px;color:#ccd5e2}',
 '.packWarningCard p.tiny{font-size:13px;color:#ffbe83;margin:8px 0 18px}',
 '.packWarningCard .primary{display:block;width:100%;min-height:48px;margin-top:6px}',
 '.packWarningClose{position:absolute;right:12px;top:12px;display:grid;place-items:center;width:36px;height:36px;padding:0;border:1px solid #354157;border-radius:10px;color:#f8fafc;background:#1b2636;cursor:pointer;font-size:18px}',
 '.packWarningClose:focus-visible,.packWarningCard .primary:focus-visible{outline:3px solid #ff9a3d;outline-offset:3px}',
 '@media(prefers-reduced-motion:no-preference){.packWarningCard{animation:packWarningEnter .18s ease-out}@keyframes packWarningEnter{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}}'
].join('');
document.head.append(css);

function getPackage(t){
 const raw=t?.source_rule?.package;
 if(raw===null||raw===undefined||raw==='')return null;
 const str=String(raw).trim().toLowerCase();
 const m=str.match(/^(20\d{2})[-_/](1[0-2]|0?[1-9])$/);
 if(m)return m[1]+'-'+String(+m[2]).padStart(2,'0');
 for(const [key,no] of Object.entries(monthAlias)){
  if(str.startsWith(key))return (no>=11?'2026':'2027')+'-'+String(no).padStart(2,'0');
 }
 return str;
}
function nameOf(id){
 const known=featured.find(p=>p.id===id);
 if(known)return known.title;
 const bits=String(id).match(/^(20\d{2})-(\d{2})$/);
 if(bits){const n=+bits[2];if(n>=1&&n<=12)return months[n].charAt(0).toUpperCase()+months[n].slice(1)+' '+bits[1]}
 return 'Ekstrapakke';
}
function addText(parent,tag,cls,value){
 const el=document.createElement(tag);
 if(cls)el.className=cls;
 el.textContent=String(value??'');
 parent.append(el);
 return el;
}
function fixturesFor(pkg){
 return (Array.isArray(D?.monthlyFixtures)?D.monthlyFixtures:[])
  .filter(g=>typeof g?.date==='string'&&g.date.slice(0,7)===pkg)
  .sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.time||'').localeCompare(String(b.time||'')));
}
function fixtureDate(date){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(date||'')))return String(date||'');
 const [y,m,d]=date.split('-').map(Number);
 return new Intl.DateTimeFormat('nb-NO',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,d,12)));
}
function renderFixtures(parent,pkg){
 const games=fixturesFor(pkg),wrap=document.createElement('section');
 wrap.className='packGames';
 const title=document.createElement('div');title.className='packGamesTitle';
 addText(title,'h4','','🏒 Storhamars kamper');
 addText(title,'span','packMeta',games.length+' kamper');
 wrap.append(title);
 if(!games.length){
  addText(wrap,'p','packGamesCaption','Ingen kamper funnet i den oppdaterte terminlisten. Sjekk HockeyLive for siste informasjon.');
  parent.append(wrap);return;
 }
 const home=games.filter(g=>g.home).length,away=games.length-home;
 addText(wrap,'p','packGamesCaption',home+' hjemme · '+away+' borte · Kilde: HockeyLive. Datoer og tider kan endres.');
 const list=document.createElement('div');list.className='packGamesList';
 games.forEach(g=>{
  const row=document.createElement('div');row.className='packGameRow';
  const when=document.createElement('div');
  addText(when,'div','packGameDate',fixtureDate(g.date));
  addText(when,'small','packGameSubtitle',g.time?'kl. '+g.time:'Tid ikke satt');
  const opponent=document.createElement('div');
  addText(opponent,'div','packGameOpponent',String(g.opponent||'Ukjent lag'));
  const finished=g.finished&&Number.isInteger(Number(g.goals))&&Number.isInteger(Number(g.against))&&g.goals!==null&&g.against!==null;
  addText(opponent,'div','packGameSubtitle'+(finished?' packGameResult':''),(g.home?'🏠 Hjemme':'🚌 Borte')+(finished?' · Resultat '+g.goals+'–'+g.against:''));
  row.append(when,opponent);list.append(row);
 });
 wrap.append(list);parent.append(wrap);
}
function isHiddenBeforeOpen(t,now){
 return !D.user.is_admin && t.status!=='settled' && (t.status==='draft'||(!!t.opens_at&&new Date(t.opens_at).getTime()>now));
}
function makeTask(t,picks){
 const p=picks.get(t.id),now=Date.now(),hasDeadline=!!t.deadline,past=hasDeadline&&now>new Date(t.deadline).getTime();
 const card=document.createElement('div');
 card.className='card bonus '+(t.status==='settled'?'settled':(!t.is_open?'locked':''));
 card.dataset.taskId=String(t.id);
 const state=t.status==='settled'?'AVGJORT':t.is_open?'ÅPEN':past?'FRIST UTE':'IKKE ÅPEN';
 const top=document.createElement('div');top.className='bonusTop';
 addText(top,'span','bonusState',state);
 if(hasDeadline){
  const wrap=document.createElement('div');wrap.className='bonusDeadlineWrap';
  addText(wrap,'span','deadlineBox '+(past?'deadlinePast':'deadlineOpen'),'⏰ Frist: '+fmt(t.deadline));
  if(past)addText(wrap,'span','tiny','Fristen er passert');
  top.append(wrap);
 }
 card.append(top);
 addText(card,'h3','',t.title);
 if(t.description)addText(card,'p','',t.description);
 if((t.kind==='number'||t.kind==='position_number')&&Array.isArray(t.options)&&t.options.length){const vals=t.options.map(Number).filter(Number.isFinite);if(vals.length)addText(card,'div','tiny','Velg et heltall fra '+Math.min(...vals)+' til '+Math.max(...vals)+'.')}
 const points=addText(card,'div','pointsInfo','Maks '+maxBonus(t)+' p · '+scoringText(t));
 points.setAttribute('aria-label','Poengberegning');
 addText(card,'div','meta',(p?'Ditt valg: '+bonusValue(t,p):'Ikke besvart')+(t.status==='settled'&&p?' · '+p.points+' p':''));
 if(t.is_open){
  const row=document.createElement('div');row.className='bonusPick';
  const inp=taskInput(t,bonusValue(t,p));
  const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=p?'Endre valg':'Lagre valg';
  const msg=document.createElement('div');msg.className='bonusSaveMsg';msg.setAttribute('role','status');
  button.onclick=async()=>{
   if(!inp.value){msg.className='bonusSaveMsg err';msg.textContent='Velg et svar først.';return}
   button.disabled=true;msg.className='bonusSaveMsg';msg.textContent='Lagrer…';
   try{
    await call('save_bonus',{task_id:t.id,value:inp.value});
    D=await call('bootstrap');
    renderBonus();renderLb();renderRules();
    const refreshed=[...document.querySelectorAll('#bonusTasks .bonus')].find(x=>x.dataset.taskId===String(t.id));
    if(refreshed)addText(refreshed,'div','bonusSaveMsg ok','✓ Lagret');
   }catch(e){button.disabled=false;msg.className='bonusSaveMsg err';msg.textContent=e.message||'Kunne ikke lagre.'}
  };
  row.append(inp,button);card.append(row,msg);
 }
 return card;
}
function showLockedPackWarning(pack,count,nextOpen,tile){
 if(document.getElementById('packWarning'))return;
 const modal=document.createElement('div');
 modal.id='packWarning';modal.className='packWarning';
 modal.innerHTML='<section class="packWarningCard" role="dialog" aria-modal="true" aria-labelledby="packWarningTitle" aria-describedby="packWarningDescription"><button type="button" class="packWarningClose" aria-label="Lukk pop-up">✕</button><div class="packWarningIcon" aria-hidden="true">🚨</div><div class="ey">Nysgjerrig, eller?</div><h2 id="packWarningTitle">Ro deg litt nå 😅</h2><p id="packWarningDescription"></p><p class="tiny" id="packWarningOpening"></p><button type="button" class="primary packWarningDismiss">Greit da 😂</button></section>';
 modal.querySelector('#packWarningDescription').textContent='Du har prøvd å åpne '+pack.title+'-pakken '+count+' ganger. Den kommer snart. Låsen åpner seg dessverre ikke fortere av at du trykker på den.';
 modal.querySelector('#packWarningOpening').textContent=nextOpen?'🔒 Åpner '+fmt(new Date(nextOpen)):'';
 const previousOverflow=document.body.style.overflow;
 const previousFocus=document.activeElement;
 const close=()=>{
  document.removeEventListener('keydown',onKeydown);
  document.body.style.overflow=previousOverflow;
  modal.remove();
  const focusTarget=tile.isConnected?tile:previousFocus;
  if(focusTarget&&focusTarget.isConnected)focusTarget.focus({preventScroll:true});
 };
 const onKeydown=e=>{
  if(e.key==='Escape'){e.preventDefault();close();return}
  if(e.key!=='Tab')return;
  const controls=[...modal.querySelectorAll('button:not([disabled])')];
  const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 };
 modal.querySelectorAll('button').forEach(button=>button.addEventListener('click',close));
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.body.append(modal);
 document.body.style.overflow='hidden';
 document.addEventListener('keydown',onKeydown);
 modal.querySelector('.packWarningClose').focus({preventScroll:true});
}
function lockedTap(pack,tile,nextOpen){
 const key='ehlPackTap:'+D.user.slug+':'+pack.id;
 const count=Number(localStorage.getItem(key)||0)+1;localStorage.setItem(key,String(count));
 tile.classList.remove('tease');void tile.offsetWidth;tile.classList.add('tease');
 const status=tile.querySelector('.packStatus');
 if(status&&count<5){status.textContent=count===1?'Ikke ennå 👀':count===2?'Fortsatt låst 😏':count===3?'Du er veldig nysgjerrig nå…':'Én gang til så får du beskjed 😅';tile.dataset.teaseUntil=String(Date.now()+3200)}
 if(count>=5)showLockedPackWarning(pack,count,nextOpen,tile);
}
renderBonus=function(){
 const root=document.querySelector('#bonusTasks');
 if(!root||typeof D==='undefined'||!D)return;
 root.replaceChildren();
 if(releaseTimer){clearInterval(releaseTimer);releaseTimer=null}
 const now=Date.now(),tasks=D.bonusTasks||[],picks=new Map((D.bonusPicks||[]).map(p=>[p.task_id,p]));
 const packages=new Map(),season=[];
 tasks.forEach(t=>{
  if(t.source_rule?.group==="nm"||t.source_rule?.group==="easter")return; // NM and secret easter egg do not belong in season bonus
  const id=getPackage(t);
  if(!id){season.push(t);return}
  if(!packages.has(id))packages.set(id,[]);
  packages.get(id).push(t);
 });
 const intro=document.querySelector('#bonusView>.card:first-child');
 if(intro){
  const heading=intro.querySelector('h2'),paragraph=intro.querySelector('p');
  if(heading)heading.textContent='Bonuspakker';
  if(paragraph)paragraph.textContent='Trykk på en månedspakke for å svare. Sesongbonusene finner du nederst. Alle lagrede svar og poeng beholdes.';
 }
 const total=featured.reduce((n,pack)=>n+(packages.get(pack.id)||[]).reduce((sum,t)=>sum+maxBonus(t),0),0);
 const header=document.createElement('div');header.className='packHeading';
 addText(header,'h3','','🗓️ Månedspakker');
 addText(header,'span','tiny',total?'Maks '+total+' poeng i publiserte pakker':'Nye bonusspørsmål kommer');
 root.append(header);
 const grid=document.createElement('div');grid.className='packGrid';
 const packs=featured.concat([...packages.keys()].filter(id=>!featured.some(p=>p.id===id)).sort().map(id=>({id,title:nameOf(id),emoji:'📦'})));
 packs.forEach(pack=>{
  const all=packages.get(pack.id)||[];
  const answered=all.filter(t=>picks.has(t.id)).length;
  const accessible=all.filter(t=>!isHiddenBeforeOpen(t,now));
  const nextOpen=all.filter(t=>isHiddenBeforeOpen(t,now)).map(t=>t.opens_at?new Date(t.opens_at).getTime():NaN).filter(Number.isFinite).sort((a,b)=>a-b)[0];
  const allDone=all.length&&all.every(t=>t.status==='settled');
  const selected=selectedPack===pack.id;
  const btn=document.createElement('button');btn.type='button';btn.className='packTile';btn.setAttribute('aria-pressed',String(selected));if(nextOpen&&!accessible.length)btn.dataset.opensAt=String(nextOpen);
  const top=document.createElement('div');top.className='packTileTop';
  addText(top,'span','packIcon',pack.emoji);
  addText(top,'span','packLock',allDone?'✓':accessible.length?'↗':'🔒');
  btn.append(top);
  addText(btn,'span','packTitle',pack.title);
  const games=fixturesFor(pack.id);
  addText(btn,'span','packMeta',all.length?all.length+' spørsmål · '+all.reduce((n,t)=>n+maxBonus(t),0)+' p':'Spørsmål kommer');
  if(games.length){
   const opponents=games.slice(0,2).map(g=>g.opponent).join(', ');
   addText(btn,'span','packTileOpponents','🏒 '+games.length+' kamper · '+opponents+(games.length>2?' + '+(games.length-2)+' til':''));
  }
  addText(btn,'span','packStatus'+(allDone?' done':''),allDone?'Avgjort':!all.length?'Kommer senere':accessible.length?answered+'/'+all.length+' besvart':nextOpen?'Åpner om '+countdownText(nextOpen-now):'Ikke åpnet');
  btn.onclick=()=>{if(!accessible.length&&nextOpen){lockedTap(pack,btn,nextOpen);return}selectedPack=selected?null:pack.id;seasonExpanded=false;renderBonus()};
  grid.append(btn);
 });
 root.append(grid);
 if(grid.querySelector('[data-opens-at]'))releaseTimer=setInterval(async()=>{let expired=false;grid.querySelectorAll('[data-opens-at]').forEach(tile=>{const ms=Number(tile.dataset.opensAt)-Date.now(),status=tile.querySelector('.packStatus');if(ms<=0)expired=true;else if(status){const hold=Number(tile.dataset.teaseUntil||0);if(Date.now()>=hold){status.textContent='Åpner om '+countdownText(ms);if(hold)delete tile.dataset.teaseUntil}}});if(expired){clearInterval(releaseTimer);releaseTimer=null;try{D=await call('bootstrap');renderBonus()}catch(e){console.warn('Kunne ikke oppdatere månedspakkene',e)}}},1000);
 if(selectedPack){
  const pack=packs.find(p=>p.id===selectedPack),all=packages.get(selectedPack)||[];
  if(pack){
   const panel=document.createElement('section');panel.className='packExpanded';
   const panelHead=document.createElement('div');panelHead.className='packExpandedHead';
   addText(panelHead,'h3','',pack.emoji+' '+pack.title);
   const close=document.createElement('button');close.type='button';close.className='packClose';close.textContent='✕ Lukk';close.setAttribute('aria-label','Lukk '+pack.title+'-pakken');close.onclick=()=>{selectedPack=null;renderBonus()};
   panelHead.append(close);panel.append(panelHead);
   renderFixtures(panel,pack.id);
   const accessible=all.filter(t=>!isHiddenBeforeOpen(t,now));
   const nextOpen=all.filter(t=>isHiddenBeforeOpen(t,now)).map(t=>new Date(t.opens_at).getTime()).sort((a,b)=>a-b)[0];
   if(!all.length)addText(panel,'div','bonusEmpty','Spørsmålene er ikke publisert ennå. De kommer senere i sesongen.');
   else if(!accessible.length)addText(panel,'div','bonusEmpty',nextOpen?'Denne pakken åpner '+fmt(new Date(nextOpen))+'.':'Denne pakken er ikke åpnet ennå.');
   else{
    addText(panel,'span','tiny',accessible.filter(t=>picks.has(t.id)).length+' av '+all.length+' besvart');
    const body=document.createElement('div');body.className='packTaskList';
    accessible.forEach(t=>body.append(makeTask(t,picks)));
    panel.append(body);
    if(accessible.length<all.length)addText(panel,'div','bonusEmpty','Flere spørsmål åpner senere i pakken.');
   }
   root.insertBefore(panel,grid);
  }
 }
 const seasonHead=document.createElement('button');seasonHead.type='button';seasonHead.className='bonusSeasonToggle';seasonHead.setAttribute('aria-expanded',String(seasonExpanded));
 const seasonLabel=document.createElement('span');
 addText(seasonLabel,'strong','','🏅 Sesongbonus');
 addText(seasonLabel,'small','',season.length?(season.filter(t=>picks.has(t.id)).length+'/'+season.length+' besvart · '+season.reduce((n,t)=>n+maxBonus(t),0)+' mulige poeng'):'Ingen sesongbonuser ennå');
 seasonHead.append(seasonLabel);
 addText(seasonHead,'span','',seasonExpanded?'⌃':'⌄');
 seasonHead.onclick=()=>{seasonExpanded=!seasonExpanded;if(seasonExpanded)selectedPack=null;renderBonus()};
 root.append(seasonHead);
 if(seasonExpanded){
  const body=document.createElement('div');body.className='bonusSeasonList';
  const accessible=season.filter(t=>!isHiddenBeforeOpen(t,now));
  const activeTasks=accessible.filter(t=>t.status!=='settled'&&(!t.deadline||new Date(t.deadline).getTime()>=now));
  const history=accessible.filter(t=>t.status==='settled'||(t.deadline&&new Date(t.deadline).getTime()<now));
  if(activeTasks.length){
    const h=document.createElement('div');h.style.gridColumn='1/-1';addText(h,'h4','','🎯 Aktive sesongbonuser');body.append(h);
    activeTasks.forEach(t=>body.append(makeTask(t,picks)));
  }
  if(history.length){
    const details=document.createElement('details');details.style.gridColumn='1/-1';details.className='bonusHistory';
    const s=document.createElement('summary');s.textContent='🗂️ Historikk · '+history.length+' tidligere oppgaver';s.style.cssText='cursor:pointer;font-weight:900;padding:12px;border:1px solid #2a3445;border-radius:12px;background:#0d1420';
    const hist=document.createElement('div');hist.className='bonusSeasonList';hist.style.marginTop='10px';history.forEach(t=>hist.append(makeTask(t,picks)));
    details.append(s,hist);body.append(details);
  }
  if(!activeTasks.length&&!history.length)addText(body,'div','bonusEmpty','Ingen sesongbonuser akkurat nå.');
  root.append(body);
 }
};
try{
 const info=document.querySelector('#intro li:nth-child(2)');
 if(info)info.innerHTML='<b>Bonus:</b> trykk på månedspakken du vil åpne. Sesongbonusene ligger for seg selv og hvert spørsmål har egen frist.';
 if(typeof D!=='undefined'&&D?.bonusTasks)renderBonus();
}catch(e){console.warn('Kunne ikke vise bonuspakker',e)}
})();
