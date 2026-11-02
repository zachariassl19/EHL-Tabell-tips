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
 '.packTaskList{display:grid;grid-template-columns:1fr;gap:10px}.packTaskList>.card{margin:0}',
 '.bonusSeasonToggle{width:100%;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:16px;background:#101722;color:#fff;border:1px solid #2a3445;border-radius:15px;text-align:left;cursor:pointer}',
 '.bonusSeasonToggle strong{font-size:17px}.bonusSeasonToggle small{display:block;color:#aeb8ca;font-size:12px;margin-top:4px}',
 '.bonusSeasonList{display:grid;grid-template-columns:1fr;gap:10px;margin-top:12px}.bonusSeasonList>.card{margin:0}',
 '.bonusEmpty{border:1px dashed #35445b;border-radius:12px;padding:16px;color:#aeb8ca;font-size:13px}',
 '@media(min-width:800px){.packGrid{grid-template-columns:repeat(5,minmax(0,1fr))}.packTaskList,.bonusSeasonList{grid-template-columns:repeat(2,minmax(0,1fr))}}',
 '@media(max-width:460px){.packTile{min-height:132px;padding:12px}.packTitle{font-size:16px}.packIcon{font-size:27px}.packHeading{align-items:flex-start;flex-direction:column}}'
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
renderBonus=function(){
 const root=document.querySelector('#bonusTasks');
 if(!root||typeof D==='undefined'||!D)return;
 root.replaceChildren();
 if(releaseTimer){clearInterval(releaseTimer);releaseTimer=null}
 const now=Date.now(),tasks=D.bonusTasks||[],picks=new Map((D.bonusPicks||[]).map(p=>[p.task_id,p]));
 const packages=new Map(),season=[];
 tasks.forEach(t=>{
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
  addText(btn,'span','packMeta',all.length?all.length+' spørsmål · '+all.reduce((n,t)=>n+maxBonus(t),0)+' p':'Spørsmål kommer');
  addText(btn,'span','packStatus'+(allDone?' done':''),allDone?'Avgjort':!all.length?'Kommer senere':accessible.length?answered+'/'+all.length+' besvart':nextOpen?'Åpner om '+countdownText(nextOpen-now):'Ikke åpnet');
  btn.onclick=()=>{selectedPack=selected?null:pack.id;seasonExpanded=false;renderBonus()};
  grid.append(btn);
 });
 root.append(grid);
 if(grid.querySelector('[data-opens-at]'))releaseTimer=setInterval(async()=>{let expired=false;grid.querySelectorAll('[data-opens-at]').forEach(tile=>{const ms=Number(tile.dataset.opensAt)-Date.now(),status=tile.querySelector('.packStatus');if(ms<=0)expired=true;else if(status)status.textContent='Åpner om '+countdownText(ms)});if(expired){clearInterval(releaseTimer);releaseTimer=null;try{D=await call('bootstrap');renderBonus()}catch(e){console.warn('Kunne ikke oppdatere månedspakkene',e)}}},1000);
 if(selectedPack){
  const pack=packs.find(p=>p.id===selectedPack),all=packages.get(selectedPack)||[];
  if(pack){
   const panel=document.createElement('section');panel.className='packExpanded';
   addText(panel,'h3','',pack.emoji+' '+pack.title);
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
   root.append(panel);
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
  if(accessible.length)accessible.forEach(t=>body.append(makeTask(t,picks)));
  else addText(body,'div','bonusEmpty','Ingen åpne sesongbonuser akkurat nå.');
  root.append(body);
 }
};
try{
 const info=document.querySelector('#intro li:nth-child(2)');
 if(info)info.innerHTML='<b>Bonus:</b> trykk på månedspakken du vil åpne. Sesongbonusene ligger for seg selv og hvert spørsmål har egen frist.';
 if(typeof D!=='undefined'&&D?.bonusTasks)renderBonus();
}catch(e){console.warn('Kunne ikke vise bonuspakker',e)}
})();
