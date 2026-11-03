// Public catalogue. Published books come from the database; the list below is the backup/fallback.
// A fallback book is hidden automatically once a book with the same slug is published in the admin panel.
var STATIC=[
{id:'the-time-changes',title:'The Time Changes',subtitle:'A Philosophical & Motivational Book',tagline:'A journey from awareness to transformation.',category:'Philosophy & Motivation',
 links:[{label:'eBook on Pothi',url:'https://store.pothi.com/book/ebook-thipparapu-varun-sai-the-time-changes/'},{label:'Amazon',url:'https://amzn.in/d/0bx8LoKo'}]},
{id:'learn-it-build-it-master-it',title:'Learn It. Build It. Master It.',subtitle:'Learning and Technology',tagline:'A book for learning technology by building.',category:'Learning & Technology',
 links:[{label:'Amazon',url:'https://amzn.in/d/01b334fL'},{label:'Pothi (link coming soon)',url:null}]}
];
var ALL=STATIC;
function safe(u){return /^https?:\/\//.test(u||'')?u:null}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function typo(b){var d=el('div','cover');d.setAttribute('role','img');d.setAttribute('aria-label','Cover of '+b.title+' by Varun Sai');
 d.append(el('small',0,b.subtitle||''),el('b',0,b.title),el('small',0,'Varun Sai'));return d}
function card(b){
 var a=el('article','card'),cv=safe(b.cover);a.id=b.id;
 if(cv){var i=el('img');i.src=cv;i.alt='Cover of '+b.title+' by Varun Sai';i.loading='lazy';
  i.style.cssText='width:100%;aspect-ratio:3/4;object-fit:cover;display:block;border-bottom:3px solid #D4AF37';
  i.onerror=function(){i.replaceWith(typo(b))};a.append(i)}else a.append(typo(b));
 var body=el('div','body');body.append(el('h3',0,b.title));
 if(b.category)body.append(el('p','tag',b.category));
 if(b.subtitle)body.append(el('p',0,b.subtitle));
 if(b.tagline)body.append(el('p',0,b.tagline));
 if(b.description){var d=el('details'),s=el('summary',0,'About this book'),p=el('p',0,b.description);p.style.whiteSpace='pre-line';d.append(s,p);body.append(d)}
 var L=el('div','links'),n=0;
 var v=el('a','btn ghost','View details');v.href='book.html?b='+encodeURIComponent(b.id);L.append(v);
 b.links.forEach(function(x){var u=safe(x.url);
  if(u){var k=el('a','btn',x.label);k.href=u;k.target='_blank';k.rel='noopener';L.append(k);n++}
  else{var k2=el('span','btn',x.label);k2.setAttribute('aria-disabled','true');L.append(k2)}});
 if(!b.links.length)L.append(el('span','btn','Retailer links coming soon'));
 body.append(L);a.append(body);return a}
function render(){
 var box=document.getElementById('books');if(!box)return;
 var q=(document.getElementById('q')||{value:''}).value.toLowerCase(),c=(document.getElementById('cat')||{value:''}).value;
 var r=ALL.filter(function(b){return(!c||b.category===c)&&[b.title,b.subtitle,b.tagline,b.description].join(' ').toLowerCase().indexOf(q)>-1});
 box.replaceChildren.apply(box,r.length?r.map(card):[el('p','muted','No books match your search. Clear the search or choose "All categories".')])}
function cats(){var cat=document.getElementById('cat');if(!cat)return;
 while(cat.options.length>1)cat.remove(1);
 ALL.map(function(b){return b.category}).filter(function(v,i,a){return v&&a.indexOf(v)===i}).forEach(function(v){var o=document.createElement('option');o.value=o.textContent=v;cat.appendChild(o)})}
async function load(){
 if(typeof SB_URL==='undefined'||!(document.getElementById('books')||document.getElementById('detail')))return;
 try{
  var r=await fetch(SB_URL+'/rest/v1/books?select=*,categories(name)&published=eq.true&order=created_at.asc',{headers:{apikey:SB_KEY}});
  if(!r.ok)return;var rows=await r.json();if(!rows.length)return;
  var db=rows.map(function(x){var s=STATIC.filter(function(y){return y.id===x.slug})[0]||{};
   var cover=x.cover_path?(/^https?:/.test(x.cover_path)?x.cover_path:SB_URL+'/storage/v1/object/public/covers/'+x.cover_path):null;
   var links=[];if(x.pothi_url)links.push({label:'eBook on Pothi',url:x.pothi_url});if(x.amazon_url)links.push({label:'Amazon',url:x.amazon_url});
   return{id:x.slug,dbid:x.id,title:x.title,subtitle:x.subtitle,description:x.description,cover:cover,links:links,category:(x.categories&&x.categories.name)||s.category||''}});
  var have=db.map(function(b){return b.id});
  ALL=db.concat(STATIC.filter(function(b){return have.indexOf(b.id)<0}));cats();render()
 }catch(e){/* keep the backup list */}}
document.addEventListener('DOMContentLoaded',function(){
 var m=document.querySelector('.menu'),n=document.querySelector('nav');
 m.addEventListener('click',function(){var o=n.classList.toggle('open');m.setAttribute('aria-expanded',o)});
 document.getElementById('year').textContent=new Date().getFullYear();
 var cat=document.getElementById('cat');
 if(cat){document.getElementById('q').addEventListener('input',render);cat.addEventListener('change',render)}
 var fw=document.querySelector('footer .wrap');if(fw){var pp=el('p'),pa=el('a',0,'Privacy Policy');pa.href='privacy.html';pp.append(pa);fw.append(pp)}
 cats();render();window.ready=load()});
