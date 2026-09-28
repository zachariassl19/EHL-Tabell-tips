(()=>{
const css=document.createElement('style');css.textContent='.top10Toggle{margin:10px 0 0;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:#111c2d;color:#fff;font-weight:800;cursor:pointer}.top10Meta{margin-top:6px;color:var(--muted);font-size:11px}';document.head.append(css);
let expanded=false;
function applyTop10(){
 const box=document.querySelector('#newSigningTable');if(!box)return;
 const table=box.querySelector('table');if(!table)return;
 const rows=[...table.querySelectorAll('tbody tr')];
 const search=document.querySelector('#newSigningSearch');
 const team=document.querySelector('#newSigningTeam');
 const filtering=!!((search?.value||'').trim()||(team?.value||''));
 rows.forEach((tr,i)=>{tr.style.display=(!filtering&&!expanded&&i>=10)?'none':''});
 let wrap=box.querySelector('.top10Controls');
 if(!wrap){wrap=document.createElement('div');wrap.className='top10Controls';box.appendChild(wrap)}
 if(filtering){wrap.innerHTML='<div class="top10Meta">Filter aktivt – viser alle treff.</div>';return}
 wrap.innerHTML='<button type="button" class="top10Toggle">'+(expanded?'Vis topp 10':'Vis alle '+rows.length)+'</button><div class="top10Meta">Viser '+(expanded?rows.length:Math.min(10,rows.length))+' av '+rows.length+' ny-signeringer.</div>';
 const btn=wrap.querySelector('button');if(btn)btn.onclick=()=>{expanded=!expanded;applyTop10()};
}
const mo=new MutationObserver(()=>setTimeout(applyTop10,0));mo.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('input',e=>{if(e.target?.id==='newSigningSearch')setTimeout(applyTop10,0)});
document.addEventListener('change',e=>{if(e.target?.id==='newSigningTeam')setTimeout(applyTop10,0)});
setTimeout(applyTop10,1600);
})();