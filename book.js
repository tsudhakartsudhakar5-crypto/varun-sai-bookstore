document.addEventListener('DOMContentLoaded',async function(){
 var box=document.getElementById('detail'),id=new URLSearchParams(location.search).get('b');
 await window.ready;
 var b=ALL.filter(function(x){return x.id===id})[0];
 if(!b){var back=el('a','btn','Browse all books');back.href='books.html';
  box.replaceChildren(el('h1',0,'Book not found'),el('p','muted','We could not find that book. It may not be published yet.'),back);document.title='Book not found | VARUN SAI BOOKSTORE';return}
 var cv=safe(b.cover),cover;
 if(cv){cover=el('img');cover.src=cv;cover.alt='Cover of '+b.title+' by Varun Sai';cover.style.cssText='width:100%;display:block;aspect-ratio:3/4;object-fit:cover;border-bottom:3px solid #D4AF37';cover.onerror=function(){cover.replaceWith(typo(b))}}else cover=typo(b);
 var info=el('div');info.append(el('h1',0,b.title));
 if(b.subtitle)info.append(el('p','tag',b.subtitle));
 info.append(el('p',0,'By Varun Sai'));
 if(b.category)info.append(el('p','tag','Category: '+b.category));
 if(b.tagline)info.append(el('p',0,b.tagline));
 if(b.description){var d=el('p',0,b.description);d.style.whiteSpace='pre-line';info.append(d)}
 var L=el('div','links');
 b.links.forEach(function(x){var u=safe(x.url);
  if(u){var k=el('a','btn',x.label);k.href=u;k.target='_blank';k.rel='noopener';L.append(k)}
  else{var k2=el('span','btn',x.label);k2.setAttribute('aria-disabled','true');L.append(k2)}});
 if(!b.links.length)L.append(el('span','btn','Retailer links coming soon'));
 info.append(L);
 var all=el('p'),a=el('a',0,'Back to all books');a.href='books.html';all.append(a);info.append(all);
 var wrap=el('div','detail');wrap.append(cover,info);box.replaceChildren(wrap);
 var t=b.title+' | VARUN SAI BOOKSTORE',desc=(b.tagline||b.subtitle||'A book by Varun Sai.').slice(0,160);
 document.title=t;
 [['meta[name=description]',desc],['meta[property="og:title"]',t],['meta[property="og:description"]',desc]].forEach(function(p){var m=document.querySelector(p[0]);if(m)m.setAttribute('content',p[1])});
 var u2='https://tsudhakartsudhakar5-crypto.github.io/varun-sai-bookstore/book.html?b='+encodeURIComponent(b.id);
 var c=document.querySelector('link[rel=canonical]');if(c)c.href=u2;
 var o=document.querySelector('meta[property="og:url"]');if(o)o.setAttribute('content',u2)});
