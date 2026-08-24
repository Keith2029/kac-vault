let items=[];
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
function render(){
 const q=document.getElementById('search').value.toLowerCase();
 const pub=document.getElementById('publisher').value;
 const st=document.getElementById('status').value;
 const filtered=items.filter(x=>{
   const hay=[x.sku,x.title,x.issue,x.significance,x.publisher].join(' ').toLowerCase();
   return (!q||hay.includes(q))&&(!pub||x.publisher===pub)&&(!st||x.status.startsWith(st));
 });
 document.getElementById('count').textContent=filtered.length;
 document.getElementById('grid').innerHTML=filtered.map(x=>{
   const img=(x.photos&&x.photos.front)?`<img class="thumbimg" src="${x.photos.front}" alt="${x.title} ${x.issue}">`:`<div class="placeholder">${x.sku}</div>`;
   const link=x.sku==="C-0036"?"item-c0036.html":"#";
   return `<article class="item"><a href="${link}">${img}<div class="sku">${x.sku}</div><h3>${x.title}</h3><div class="issue">${x.issue}</div></a><div class="meta">${x.year||''} ${x.publisher?`· ${x.publisher}`:''} ${x.grade?`· ${x.grade}`:''}</div><div class="sig">${x.significance}</div><div class="value">${x.low||x.high?`${money(x.low)}–${money(x.high)}`:'Value TBD'}</div></article>`;
 }).join('');
}
fetch('data/inventory.json').then(r=>r.json()).then(d=>{
 items=d;
 const pubs=[...new Set(items.map(x=>x.publisher).filter(Boolean))].sort();
 document.getElementById('publisher').innerHTML+=[...pubs].map(p=>`<option>${p}</option>`).join('');
 ['search','publisher','status'].forEach(id=>document.getElementById(id).addEventListener(id==='search'?'input':'change',render));
 render();
});