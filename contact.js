var sb=supabase.createClient(SB_URL,SB_KEY);
document.getElementById('cf').addEventListener('submit',async function(e){
 e.preventDefault();var f=e.target,s=document.getElementById('st'),b=f.querySelector('button');
 if(f.website.value)return; // spam trap
 var d={name:f.n.value.trim(),email:f.e.value.trim(),body:f.m.value.trim()};
 if(!d.name||!d.email||!d.body){s.textContent='Please fill in every field.';return}
 if(!document.getElementById('ack').checked){s.textContent='Please confirm that you have read the privacy information and that you are 18 or older.';return}
 b.disabled=true;s.textContent='Sending...';
 try{
  var r=await sb.from('messages').insert(d);
  if(r.error){s.textContent='Sorry, your message could not be sent. Please try again later.';b.disabled=false}
  else{s.textContent='Thank you. Your message has been sent to the author.';f.reset();setTimeout(function(){b.disabled=false},15000)}
 }catch(x){s.textContent='Sorry, your message could not be sent. Please try again later.';b.disabled=false}
});
