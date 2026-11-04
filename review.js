document.addEventListener('DOMContentLoaded',async function(){
 await window.ready;await new Promise(function(r){setTimeout(r,0)});
 var id=new URLSearchParams(location.search).get('b'),b=ALL.filter(function(x){return x.id===id})[0];
 if(!b||typeof supabase==='undefined'||typeof SB_URL==='undefined')return;
 var S=el('section');S.id='reviews';S.append(el('h2',0,'Reader reviews'));document.getElementById('main').append(S);
 if(!b.dbid){S.append(el('p','muted','Reviews will open once this book is in the online catalogue.'));return}
 var db=supabase.createClient(SB_URL,SB_KEY),list=el('div'),area=el('div'),note=el('p','muted');
 S.append(list,el('h3',0,'Write a review'),area,note);
 function say(t){note.textContent=t}
 async function showList(){
  var r=await db.from('reviews').select('rating,body,author_reply').eq('book_id',b.dbid).eq('status','approved').order('created_at',{ascending:false});
  list.replaceChildren();
  if(r.error){list.append(el('p','muted','Reviews could not be loaded right now.'));return}
  if(!r.data.length){list.append(el('p','muted','No reviews yet. Be the first to share your thoughts.'));return}
  r.data.forEach(function(v){var c=el('div','note');c.style.marginBottom='14px';
   c.append(el('b',0,'\u2605'.repeat(v.rating)+'\u2606'.repeat(5-v.rating)+'  Reader'));
   if(v.body){var p=el('p',0,v.body);p.style.whiteSpace='pre-line';c.append(p)}
   if(v.author_reply)c.append(el('p','muted','Reply from Varun Sai: '+v.author_reply));list.append(c)})}
 function field(f,id,lbl,t){var i=el(t||'input');i.id=id;f.append(el('label',0,lbl),i);f.lastChild.previousSibling.htmlFor=id;return i}
 async function showArea(){
  say('');area.replaceChildren();
  var s=(await db.auth.getSession()).data.session;
  if(!s){
   var f=el('form'),em=field(f,'rem','Email'),pw=field(f,'rpw','Password (at least 8 characters)');em.type='email';pw.type='password';pw.minLength=8;em.required=pw.required=true;
   var p=el('p'),a=el('button','btn','Sign in'),c=el('button','btn ghost','Create account');a.type='submit';c.type='button';p.append(a,' ',c);f.append(p);
   f.addEventListener('submit',async function(e){e.preventDefault();var r=await db.auth.signInWithPassword({email:em.value,password:pw.value});r.error?say('Sign in failed. Check your email and password, or confirm your email first.'):showArea()});
   c.addEventListener('click',async function(){if(!f.reportValidity())return;var r=await db.auth.signUp({email:em.value,password:pw.value});
    if(r.error)return say('Could not create the account: '+r.error.message);
    r.data.session?showArea():say('Almost done. Check your email and tap the confirmation link, then sign in here.')});
   area.append(el('p','muted','Sign in to write a review. Your email is only used for your account and is never shown with your review.'),f);return}
  var f2=el('form'),rt=field(f2,'rrt','Rating','select'),tx=field(f2,'rtx','Your review (optional)','textarea');
  [5,4,3,2,1].forEach(function(n){var o=el('option',0,n+' out of 5');o.value=n;rt.append(o)});tx.maxLength=2000;tx.rows=4;
  var p2=el('p'),sub=el('button','btn','Submit review'),so=el('button','btn ghost','Sign out');sub.type='submit';so.type='button';p2.append(sub,' ',so);f2.append(p2);
  f2.addEventListener('submit',async function(e){e.preventDefault();sub.disabled=true;
   var r=await db.from('reviews').insert({book_id:b.dbid,user_id:s.user.id,rating:+rt.value,body:tx.value.trim()||null,status:'pending'});
   if(r.error){say(r.error.code==='23505'?'You have already reviewed this book.':'Your review could not be saved. Please try again.');sub.disabled=false}
   else{f2.reset();say('Thank you. Your review will appear after the author approves it.')}});
  so.addEventListener('click',async function(){await db.auth.signOut();showArea()});
  area.append(f2)}
 showList();showArea()});
