(()=>{
'use strict';
const css=document.createElement('style');css.textContent='.scoreTotal{margin-top:19px;padding:15px 16px;border:1px solid #70491f;border-radius:16px;background:linear-gradient(120deg,#25190e,#101720);display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:20px;font-weight:950}.scoreSection{font-size:19px;margin:26px 0 8px}.scoreNote{font-size:12px;color:#aeb8ca;line-height:1.5;margin:10px 0}';document.head.append(css);
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const row=(name,pts,desc)=>'<div class="rule"><span>'+safe(name)+(desc?'<div class="tiny">'+safe(desc)+'</div>':'')+'</span><b>'+Number(pts||0)+' p</b></div>';
const total=a=>a.reduce((n,t)=>n+maxBonus(t),0);
renderRules=function(){
 if(!D?.scoring)return;
 const s=D.scoring,t=D.bonusTasks||[];
 const season=t.filter(x=>!x.source_rule?.package&&x.source_rule?.group!=='nm'&&x.source_rule?.group!=='easter');
 const nm=t.filter(x=>x.source_rule?.group==='nm');
 const months=['2026-11','2026-12','2027-01','2027-02','2027-03'];
 const names=['🍂 November','🎄 Desember','❄️ Januar','🏒 Februar','🏆 Seriefinale'];
 const base=41+s.coach+s.points+s.worst+s.positive;
 const bracket=D.nmBracketScoring||{quarter:4,finalist:7,allQuarter:10,bothFinalists:10};
 const bracketExtra=4*bracket.quarter+2*bracket.finalist+bracket.allQuarter+bracket.bothFinalists;
 const nmBase=s.nm+s.playoffPoints+s.mvp+bracketExtra;
 const monthly=months.map(x=>t.filter(q=>q.source_rule?.package===x));
 const monthlyMax=monthly.reduce((n,p)=>n+total(p),0);
 const nmMax=nmBase+total(nm),bonusMax=total(season);
 const easterMax=3;
 const grand=base+bonusMax+monthlyMax+nmMax+easterMax;
 const out=['<h3 class="scoreSection">🏒 Sesongtips – '+base+' p</h3>',
 row('Tabelltips inkl. topp 3 og seriemester',41,'Riktig plassering og topp 3-bonus'),
 row('Første trener som ryker',s.coach),
 row('Poengkonge grunnserie',s.points,'Riktig klubb med feil spiller: '+(s.clubPoints||0)+' p'),
 row('Verste ny-signering',s.worst,'Riktig klubb med feil spiller: '+(s.clubWorst||0)+' p'),
 row('Positiv klubb-overraskelse',s.positive),
 '<h3 class="scoreSection">⭐ Sesongbonus – '+bonusMax+' p</h3>'];
 season.forEach(x=>out.push(row(x.title,maxBonus(x),scoringText(x))));
 out.push('<h3 class="scoreSection">🗓️ Månedspakker – '+monthlyMax+' p</h3>');
 monthly.forEach((p,i)=>out.push(row(names[i],total(p),p.length+' spørsmål')));
 out.push('<p class="scoreNote">Tallspørsmål gir delpoeng etter avstand til fasit. Lengst unna får 0 poeng når avvikene er ulike.</p>');
 out.push('<h3 class="scoreSection">🏆 NM-sluttspill – '+nmMax+' p</h3>',
 '<p class="scoreNote">Hele bracketen fylles ut før kvartfinalene. Fasit for oppgjør og mesteren føres manuelt av admin.</p>',
 row('Riktige kvartfinalevinnere',4*bracket.quarter,'4 poeng for hvert riktig lag som går til semifinale'),
 row('Riktige finalister',2*bracket.finalist,'7 poeng per riktig lag. Rekkefølgen spiller ingen rolle'),
 row('Norgesmester',s.nm,'Velg vinneren blant dine to finalister. Riktig lag gir 20 poeng'),
 row('Perfekt kvartfinalerunde',bracket.allQuarter,'Ekstra bonus når alle fire kvartfinalevinnere er riktige'),
 row('Begge finalistene riktig',bracket.bothFinalists,'Ekstra bonus når begge finalelagene er riktige'),
 row('Poengkonge sluttspill',s.playoffPoints,'Riktig spiller gir 10 p · riktig klubb med feil spiller gir '+(s.clubPlayoff||0)+' p'),
 row('Sluttspill-MVP',s.mvp,'Riktig spiller gir 10 p · riktig klubb med feil spiller gir '+(s.clubMvp||0)+' p'));
 nm.forEach(x=>out.push(row(x.title,maxBonus(x),x.description||'Dette tipset åpner før NM-finalen.')));
 out.push('<h3 class="scoreSection">🥚 Easter egg – 3 p</h3>');
 out.push('<div id="easterScoreRow" class="rule"><span><b>Easter egg</b><div class="tiny">Skjult utfordring. Hint kan åpnes her.</div></span><span style="display:flex;align-items:center;gap:8px"><button id="easterHintBtn" class="secondary" type="button" style="width:auto;margin:0;padding:7px 10px">Hint</button><b>3 p</b></span></div>');
 out.push('<div id="easterHintText" class="scoreNote hidden"></div>');
 out.push('<div class="scoreTotal"><span>🏆 Maks totalt</span><b>'+grand+' p</b></div>');
 const root=document.getElementById('rules');if(root)root.innerHTML=out.join('');
};
try{if(D?.scoring)renderRules()}catch(e){console.error('Score overview',e)}
})();