/* ═══════════════════════════════════════════
   DIAMOND AQUA POOLS — Shared JavaScript
   shared.js
   ═══════════════════════════════════════════ */

/* ── BOT RIDER SVG (shared avatar markup) ── */
const BOT_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="bgg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#0099B3"/><stop offset="100%" stop-color="#003A50"/>
  </linearGradient></defs>
  <rect width="100" height="100" fill="url(#bgg)"/>
  <rect x="22" y="18" width="56" height="48" rx="13" fill="#00C2E0" opacity=".9"/>
  <circle cx="36" cy="36" r="8" fill="#070D18"/>
  <circle cx="64" cy="36" r="8" fill="#070D18"/>
  <circle cx="38.5" cy="33.5" r="3" fill="white"/>
  <circle cx="66.5" cy="33.5" r="3" fill="white"/>
  <path d="M35 54 Q50 64 65 54" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <line x1="50" y1="18" x2="50" y2="8" stroke="#00C2E0" stroke-width="3"/>
  <circle cx="50" cy="6" r="5" fill="#C9A84C"/>
  <rect x="14" y="28" width="8" height="14" rx="4" fill="#00C2E0" opacity=".7"/>
  <rect x="78" y="28" width="8" height="14" rx="4" fill="#00C2E0" opacity=".7"/>
  <rect x="28" y="70" width="44" height="24" rx="9" fill="#0099B3" opacity=".85"/>
  <circle cx="40" cy="82" r="4.5" fill="#00C2E0" opacity=".6"/>
  <circle cx="50" cy="82" r="4.5" fill="#C9A84C" opacity=".9"/>
  <circle cx="60" cy="82" r="4.5" fill="#00C2E0" opacity=".6"/>
</svg>`;

/* ═══════════════════ WATER CANVAS ═══════════════════ */
(function(){
  const c = document.getElementById('wc');
  if(!c) return;
  const ctx = c.getContext('2d');
  let W, H, parts=[], rips=[];
  function resize(){ W=c.width=innerWidth; H=c.height=innerHeight; }
  addEventListener('resize', resize); resize();
  class P {
    constructor(){ this.reset(true) }
    reset(r){
      this.x=Math.random()*W; this.y=r?Math.random()*H:H+5;
      this.r=Math.random()*1.8+.4; this.vy=-(Math.random()*.4+.1);
      this.vx=(Math.random()-.5)*.15; this.a=Math.random()*.5+.1;
      this.da=(Math.random()*.003+.001)*(Math.random()>.5?1:-1);
      this.col=Math.random()>.6?'#00C2E0':'#C9A84C';
    }
    update(){
      this.x+=this.vx+Math.sin(Date.now()*.001+this.y*.02)*.08;
      this.y+=this.vy; this.a+=this.da;
      if(this.a>.6) this.da=-Math.abs(this.da);
      if(this.a<.05||this.y<-10) this.reset(false);
    }
    draw(){
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=this.col+Math.floor(this.a*255).toString(16).padStart(2,'0');
      ctx.fill();
    }
  }
  class R {
    constructor(x,y){ this.x=x; this.y=y; this.r=0; this.a=.4; this.max=60+Math.random()*40; }
    update(){ this.r+=1.2; this.a-=.008; }
    done(){ return this.a<=0||this.r>=this.max; }
    draw(){
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,194,224,${this.a})`; ctx.lineWidth=1; ctx.stroke();
    }
  }
  for(let i=0;i<70;i++) parts.push(new P());
  document.addEventListener('mousemove', e=>{ if(Math.random()>.93) rips.push(new R(e.clientX,e.clientY)); },{passive:true});
  setInterval(()=>rips.push(new R(Math.random()*W, Math.random()*H)), 3500);
  function loop(){
    ctx.clearRect(0,0,W,H);
    parts.forEach(p=>{p.update();p.draw();});
    rips=rips.filter(r=>!r.done()); rips.forEach(r=>{r.update();r.draw();});
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ═══════════════════ CUSTOM CURSOR ═══════════════════ */
const c1=document.getElementById('cur'), c2=document.getElementById('cur2');
if(c1&&c2){
  let mx=0,my=0,r2x=0,r2y=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;c1.style.left=mx+'px';c1.style.top=my+'px';},{passive:true});
  (function loop(){r2x+=(mx-r2x)*.13;r2y+=(my-r2y)*.13;c2.style.left=r2x+'px';c2.style.top=r2y+'px';requestAnimationFrame(loop);})();
}

/* ═══════════════════ SCROLL PROGRESS ═══════════════════ */
const sl = document.getElementById('sl');
if(sl) window.addEventListener('scroll',()=>{
  const p=scrollY/(document.body.scrollHeight-innerHeight);
  sl.style.width=(p*100)+'%';
},{passive:true});

/* ═══════════════════ NAV STUCK ═══════════════════ */
const navEl = document.getElementById('nav');
if(navEl) window.addEventListener('scroll',()=>navEl.classList.toggle('stuck',scrollY>60),{passive:true});

/* ═══════════════════ MOBILE NAV ═══════════════════ */
const ham=document.getElementById('ham'), mobD=document.getElementById('mobD');
function closeMob(){if(!ham||!mobD)return;ham.classList.remove('open');mobD.classList.remove('open');document.body.style.overflow='';}
if(ham&&mobD){
  ham.addEventListener('click',()=>{
    if(ham.classList.contains('open')) closeMob();
    else{ ham.classList.add('open'); mobD.classList.add('open'); document.body.style.overflow='hidden'; }
  });
  document.querySelectorAll('.dl').forEach(a=>a.addEventListener('click',closeMob));
}

/* ═══════════════════ REVEAL ON SCROLL ═══════════════════ */
const obs=new IntersectionObserver(ens=>{ens.forEach(x=>{if(x.isIntersecting){x.target.classList.add('up');obs.unobserve(x.target);}});},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>obs.observe(el));

/* ═══════════════════ COUNT-UP ═══════════════════ */
function countUp(el){
  if(el._done) return; el._done=true;
  const t=+el.dataset.count; let c=0;
  const i=setInterval(()=>{c+=t/50;if(c>=t){el.textContent=t;clearInterval(i);}else el.textContent=Math.floor(c);},20);
}
const statsObs=new IntersectionObserver(ens=>{ens.forEach(x=>{if(x.isIntersecting)x.target.querySelectorAll('[data-count]').forEach(countUp);});},{threshold:.3});
document.querySelectorAll('.h-stats').forEach(el=>statsObs.observe(el));

/* ═══════════════════ RATING BARS ═══════════════════ */
const rbObs=new IntersectionObserver(ens=>{ens.forEach(x=>{if(x.isIntersecting)x.target.querySelectorAll('.rs-bf').forEach(b=>setTimeout(()=>b.style.width=b.dataset.pct+'%',200));});},{threshold:.3});
document.querySelectorAll('.rs-wrap').forEach(el=>rbObs.observe(el));

/* ═══════════════════ STAR PICKER ═══════════════════ */
const sLabels=['','Poor','Fair','Good','Very Good','Outstanding! ★'];
let selRating=0;
document.querySelectorAll('.sp-star').forEach(s=>{
  s.addEventListener('mouseenter',()=>{
    const v=+s.dataset.v;
    document.querySelectorAll('.sp-star').forEach(x=>x.classList.toggle('on',+x.dataset.v<=v));
    const l=document.getElementById('spLbl'); if(l) l.textContent=sLabels[v]||'';
  });
  s.addEventListener('mouseleave',()=>{
    document.querySelectorAll('.sp-star').forEach(x=>x.classList.toggle('on',+x.dataset.v<=selRating));
    const l=document.getElementById('spLbl'); if(l) l.textContent=selRating?sLabels[selRating]:'Tap a star to rate';
  });
  s.addEventListener('click',()=>{
    selRating=+s.dataset.v;
    document.querySelectorAll('.sp-star').forEach(x=>x.classList.toggle('on',+x.dataset.v<=selRating));
    const l=document.getElementById('spLbl'); if(l) l.textContent=sLabels[selRating];
  });
});
function openRevForm(){ const w=document.getElementById('rfWrap'); if(w){w.classList.add('open');w.scrollIntoView({behavior:'smooth',block:'start'});} }
function closeRevForm(){ const w=document.getElementById('rfWrap'); if(w) w.classList.remove('open'); }
function submitRev(){
  const name=(document.getElementById('rfName')||{value:''}).value.trim();
  const area=(document.getElementById('rfArea')||{value:''}).value.trim();
  const svc=(document.getElementById('rfSvc')||{value:''}).value;
  const text=(document.getElementById('rfText')||{value:''}).value.trim();
  if(!selRating){alert('Please select a star rating.');return;}
  if(!name||!text){alert('Please enter your name and review.');return;}
  const stars='★'.repeat(selRating)+'☆'.repeat(5-selRating);
  const initials=name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const today=new Date().toLocaleDateString('en-ZA',{month:'short',year:'numeric'});
  const card=document.createElement('div'); card.className='tc new';
  card.innerHTML=`<div class="tc-stars">${stars}</div><p class="tc-q">"${text}"</p><div class="tc-auth"><div class="tc-av">${initials}</div><div><div class="tc-nm">${name}</div><div class="tc-ar">${area?area+' · ':''}${svc} · ${today}</div></div></div>`;
  const grid=document.getElementById('tcGrid'); if(grid) grid.insertBefore(card,grid.firstChild);
  const cnt=document.getElementById('ratingCount'); if(cnt){const c=parseInt(cnt.textContent.match(/\d+/)[0]);cnt.textContent=`Based on ${c+1} reviews`;}
  selRating=0; ['rfName','rfArea','rfText'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.querySelectorAll('.sp-star').forEach(s=>s.classList.remove('on'));
  const l=document.getElementById('spLbl'); if(l) l.textContent='Tap a star to rate';
  closeRevForm(); if(card) card.scrollIntoView({behavior:'smooth',block:'center'});
}
function submitForm(btn){
  const fn=(document.getElementById('cfFirst')||{value:''}).value.trim();
  const em=(document.getElementById('cfEmail')||{value:''}).value.trim();
  const ph=(document.getElementById('cfPhone')||{value:''}).value.trim();
  if(!fn||!em||!ph){alert('Please fill in name, email and phone.');return;}
  btn.textContent="✅ Submitted! We'll call you within 2 hours.";
  btn.style.background='linear-gradient(135deg,#2ecc71,#27ae60)';
  btn.style.color='white'; btn.disabled=true;
}

/* ═══════════════════════════════════════════════════════════
   BOT-RIDER PAGE TRANSITION
   Intercepts all data-page links, sweeps slices across the
   screen while the Aqua Intelligence bot "rides" from left
   to right carrying a paper (next page) — then navigates.
   ═══════════════════════════════════════════════════════════ */
function navigateTo(url){
  if(window._navigating) return; window._navigating=true;
  const rider=document.getElementById('botRider');
  if(rider){
    // Kick bot into view, animate across
    rider.style.transition='none'; rider.style.left='-150px'; rider.style.top='50%';
    rider.style.transform='translateY(-50%)';
    void rider.offsetWidth; // force reflow
    rider.classList.add('active');
    // animate left: from -150 → 110vw over the same time as transition
    rider.style.transition='left .75s cubic-bezier(.4,0,.2,1)';
    setTimeout(()=>{ rider.style.left='110vw'; },30);
  }
  // trigger slice sweep
  document.body.classList.add('t-out');
  setTimeout(()=>{
    window.location.href=url;
  }, 600);
}

// On page load: run reverse (slices retract) and hide rider
(function(){
  document.body.classList.add('t-in');
  const rider=document.getElementById('botRider');
  if(rider){ rider.classList.remove('active'); rider.style.left='-150px'; }
  setTimeout(()=>document.body.classList.remove('t-in'), 800);
})();

// Wire up all data-page links
document.querySelectorAll('a[data-page]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault(); navigateTo(a.href);
  });
});

/* ═══════════════════════════════════════════════════════════
   CHAT — AQUA INTELLIGENCE™
   Real Claude API + structured lead-capture flow
   FASTER typing: 8-16ms per char, shorter delays
   ═══════════════════════════════════════════════════════════ */
const chatModal=document.getElementById('chatModal');
const cmBody=document.getElementById('cmBody');
const cmInp=document.getElementById('cmInp');
let chatOpen=false, chatStarted=false, waitInput=false, curKey='';
let leadData={service:'',location:'',q1:'',q2:'',q3:'',name:'',phone:'',email:''};
const leads=[];
const nowT=()=>`${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2,'0')}`;

function openChat(){
  if(!chatModal) return;
  chatModal.classList.add('open'); chatOpen=true;
  const bub=document.getElementById('chatBub'); if(bub) bub.style.display='none';
  const notif=document.querySelector('.chat-notif'); if(notif) notif.style.display='none';
  if(!chatStarted){ chatStarted=true; startChat(); }
}
function closeChat(){ if(!chatModal) return; chatModal.classList.remove('open'); chatOpen=false; }

/* Typing indicator + fast char-by-char streaming */
function addBot(text, delay=0){
  return new Promise(resolve=>{
    if(!cmBody) return resolve();
    const tp=document.createElement('div'); tp.className='cm-typing';
    tp.innerHTML='<span></span><span></span><span></span>';
    cmBody.appendChild(tp); cmBody.scrollTop=cmBody.scrollHeight;
    setTimeout(()=>tp.classList.add('show'),40);
    // Short typing indicator — just enough to feel human, but fast
    const typingMs=Math.min(Math.max(text.length*8,400),1400)+delay;
    setTimeout(()=>{
      tp.classList.remove('show');
      setTimeout(()=>{
        tp.remove();
        const d=document.createElement('div'); d.className='cm bot';
        const cs=document.createElement('div'); cs.className='cs'; cs.textContent='Aqua Intelligence™';
        const content=document.createElement('div');
        const tEl=document.createElement('div'); tEl.className='cmt'; tEl.textContent=nowT();
        d.appendChild(cs); d.appendChild(content); d.appendChild(tEl);
        cmBody.appendChild(d); cmBody.scrollTop=cmBody.scrollHeight;
        // FASTER streaming: 8-16ms per char
        let i=0; const chars=text.split('');
        function typeChar(){
          if(i<chars.length){
            content.innerHTML=chars.slice(0,i+1).join('').replace(/\n/g,'<br>');
            i++; cmBody.scrollTop=cmBody.scrollHeight;
            const ch=chars[i-1];
            const ms = ch==='.'||ch==='!'||ch==='?' ? 60
                      : ch===',' ? 25
                      : ch===' ' ? 6
                      : 8+Math.random()*8;
            setTimeout(typeChar,ms);
          } else { resolve(); }
        }
        typeChar();
      },220);
    },typingMs);
  });
}

function addUser(text){
  if(!cmBody) return;
  const d=document.createElement('div'); d.className='cm usr';
  d.innerHTML=`${text}<div class="cmt">${nowT()}</div>`;
  cmBody.appendChild(d); cmBody.scrollTop=cmBody.scrollHeight;
}
function addOpts(opts, cb){
  if(!cmBody) return;
  const w=document.createElement('div'); w.className='cm-opts';
  opts.forEach(o=>{
    const b=document.createElement('div'); b.className='cm-opt'; b.textContent=o;
    b.addEventListener('click',()=>{ w.remove(); addUser(o); cb(o); });
    w.appendChild(b);
  });
  cmBody.appendChild(w); cmBody.scrollTop=cmBody.scrollHeight;
}
function askInput(key, ph){
  waitInput=true; curKey=key;
  if(cmInp){ cmInp.placeholder=ph||'Type your answer...'; cmInp.disabled=false; cmInp.focus(); }
}

/* ── Chat flow ── */
async function startChat(){
  await addBot("👋 Hey! I'm Aqua Intelligence™ — your personal AI pool advisor.\n\nLet me help you get a free quote in under 2 minutes. What do you need today?", 200);
  addOpts(['🏊 New Pool Installation','🔨 Pool Renovation','🧹 Maintenance Plan','💎 View Pricing','❓ Ask me anything'], handleService);
}
async function handleService(choice){
  leadData.service=choice;
  if(choice.includes('Pricing')){
    await addBot("Here's a quick pricing overview:\n\n💎 New Installation — from R85,000\n🔨 Renovation — from R22,000\n🧹 Maintenance — from R1,200/month\n\nAll prices are fixed — no hidden surprises! Want a personalised quote?",300);
    addOpts(['Yes — get me a quote!','No thanks, just browsing'],async v=>{
      if(v.includes('Yes')){ leadData.service='General Quote'; await addBot("Let's do it!",200); await askLoc(); }
    });
    return;
  }
  if(choice.includes('anything')){
    await addBot("Of course! Ask me anything about pools, our services, pricing, timelines — I'm here to help. 😊",300);
    askInput('freeq','Type your question...');
    return;
  }
  await addBot("Great choice! 🎉 A few quick questions so I can get you the most accurate quote.\n\nWhich area are you in?",300);
  askInput('location','e.g. Sandton, Fourways, Midrand...');
}
async function askLoc(){ await addBot("Which suburb or area are you based in?",200); askInput('location','e.g. Sandton, Fourways...'); }
async function handleLocation(val){
  leadData.location=val;
  if(leadData.service.includes('Installation')) await askInstall();
  else if(leadData.service.includes('Renovation')) await askReno();
  else if(leadData.service.includes('Maintenance')) await askMaint();
  else await askName();
}
async function askInstall(){
  await addBot("Awesome! Do you have a design in mind, or would you like guidance?",300);
  addOpts(['I have a design','Need design guidance','Not sure yet'],async v=>{leadData.q1=v;
    await addBot("What type of pool?",300);
    addOpts(['Fibreglass','Concrete / Gunite','Vinyl liner','Need advice'],async v2=>{leadData.q2=v2;
      await addBot("When would you like to start?",300);
      addOpts(['ASAP','1–3 months','3–6 months','Just exploring'],async v3=>{leadData.q3=v3;await askName();});
    });
  });
}
async function askReno(){
  await addBot("What's the main reason for renovation?",300);
  addOpts(['Cracking / damage','New look','Equipment upgrade','Resurfacing','Multiple things'],async v=>{leadData.q1=v;
    await addBot("Is the pool still in use?",300);
    addOpts(['Yes','Out of service','Partially working'],async v2=>{leadData.q2=v2;
      await addBot("How soon do you need it?",300);
      addOpts(['ASAP','Within a month','Within 3 months','Flexible'],async v3=>{leadData.q3=v3;await askName();});
    });
  });
}
async function askMaint(){
  await addBot("How often would you like visits?",300);
  addOpts(['Weekly','Every 2 weeks','Monthly','Once-off clean'],async v=>{leadData.q1=v;
    await addBot("Pump and filtration working?",300);
    addOpts(['Yes — fully working','Needs attention','Needs installation','Not sure'],async v2=>{leadData.q2=v2;
      await addBot("When to start?",300);
      addOpts(['ASAP','Next week','Next month','Just a price'],async v3=>{leadData.q3=v3;await askName();});
    });
  });
}
async function askName(){
  await addBot("Almost there! 🎉 Quick contact details so Marcus's team can reach you.\n\nWhat's your name?",300);
  askInput('name','Your first name...');
}
async function handleName(val){leadData.name=val;await addBot(`Great to meet you, ${val}! 👋\n\nBest phone number for our team?`,300);askInput('phone','e.g. 071 234 5678');}
async function handlePhone(val){leadData.phone=val;await addBot("And your email for the written quote?",300);askInput('email','your@email.com');}
async function handleEmail(val){leadData.email=val;waitInput=false;await showSummary();}
async function handleFreeQ(val){
  await addBot("Let me think... 🤔",100);
  try{
    const resp=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:1000,
        system:`You are Aqua Intelligence™, the friendly AI for Diamond Aqua Pools — a premium pool company in Johannesburg, South Africa, founded by Marcus Van Zyl in 2012. Answer questions about pools, pool care, pricing in ZAR (new installs from R85,000, renovations from R22,000, maintenance from R1,200/month), timelines, fibreglass vs concrete vs vinyl, South African pool regulations, and pool maintenance tips. Always be warm and helpful. End by gently encouraging a free quote. Refuse politely if asked about unrelated topics. Keep responses concise — 2-3 short paragraphs max. Use light emoji.`,
        messages:[{role:"user",content:val}]
      })
    });
    const data=await resp.json();
    const answer=data.content?.[0]?.text||"Great question! Our team would love to answer that in detail. Want me to arrange a callback?";
    await addBot(answer,50);
    setTimeout(()=>addOpts(['💬 Get a free quote','❓ Ask another question','👍 That helps, thanks'],async v=>{
      if(v.includes('quote')){leadData.service='General Enquiry';await addBot("Let's go!",200);await askLoc();}
      else if(v.includes('another')){await addBot("Of course! What else would you like to know?",200);askInput('freeq','Type your question...');}
      else{await addBot("Happy to help! 😊 Click below whenever you're ready for a quote.",200);addOpts(['💎 Get my free quote'],async()=>{leadData.service='General Enquiry';await askLoc();});}
    }),400);
  } catch(e){
    await addBot("Great question! Our experts can answer that in detail. Shall I arrange a call?",200);
    addOpts(['Yes — arrange a call','Not right now'],async v=>{
      if(v.includes('Yes')){leadData.service='General Enquiry';await askLoc();}
    });
  }
}
async function showSummary(){
  const svc=leadData.service.replace(/[🏊🔨🧹💎❓]\s*/,'');
  await addBot(`Here's your summary:\n\n📋 ${svc}\n📍 ${leadData.location}\n📞 ${leadData.phone}\n✉️ ${leadData.email}\n\nLooks good?`,400);
  addOpts(['Yes — submit! ✅','Let me update something'],async v=>{
    if(v.includes('submit')) await confirmLead();
    else{await addBot("No problem, what needs changing?",200);askInput('correction','What to update?');}
  });
}
async function confirmLead(){
  const lead={...leadData,time:nowT()}; leads.unshift(lead); renderLeads();
  await addBot(`🎉 You're all set, ${leadData.name}!\n\n1️⃣ Your details are with Marcus's team now\n2️⃣ Callback to ${leadData.phone} within 2 hours\n3️⃣ Written quote to ${leadData.email} same day\n\nThank you — we can't wait to build something incredible for you! 💎`,600);
  if(cmInp){cmInp.disabled=true;cmInp.placeholder='Enquiry submitted ✅';}
  const sendBtn=document.querySelector('.cm-send'); if(sendBtn) sendBtn.style.opacity='.3';
  setTimeout(()=>{
    const b=document.createElement('div');
    b.style.cssText='background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:12px;padding:14px;margin:8px 0;font-size:12px;color:#c9a84c;text-align:center;line-height:1.75';
    b.innerHTML='🤖 AI powered by <strong>Maphake Automation</strong><br><a href="https://maphakeautomation.co.za" target="_blank" style="color:#00C2E0;text-decoration:none;font-weight:700">Get this for your business →</a>';
    if(cmBody){cmBody.appendChild(b);cmBody.scrollTop=cmBody.scrollHeight;}
  },3000);
}
function renderLeads(){
  const p=document.getElementById('leadsPanel'); if(!p) return;
  p.style.display='block';
  p.querySelectorAll('.lead-item').forEach(x=>x.remove());
  leads.slice(0,5).forEach(l=>{
    const el=document.createElement('div'); el.className='lead-item';
    el.innerHTML=`<div class="l-nm">${l.name}</div><div class="l-em">✉️ ${l.email}</div><div class="l-sv">📋 ${(l.service||'').replace(/[🏊🔨🧹💎❓]\s*/,'')} · 📍 ${l.location}</div><div class="l-tm">📞 ${l.phone} · ${l.time}</div>`;
    p.appendChild(el);
  });
}
async function processInput(val){
  if(!val||!val.trim()) return;
  const v=val.trim(); if(cmInp) cmInp.value='';
  waitInput=false; addUser(v);
  if(curKey==='location')      await handleLocation(v);
  else if(curKey==='name')     await handleName(v);
  else if(curKey==='phone')    await handlePhone(v);
  else if(curKey==='email')    await handleEmail(v);
  else if(curKey==='correction'){await addBot("Got it, updating!",200);await showSummary();}
  else await handleFreeQ(v);
}
function sendMsg(){ if(cmInp) processInput(cmInp.value); }
function handleKey(e){ if(e.key==='Enter') processInput(cmInp?cmInp.value:''); }

// Auto-hide chat bubble after 9s
setTimeout(()=>{
  const b=document.getElementById('chatBub');
  if(b){b.style.transition='opacity .6s';b.style.opacity='0';setTimeout(()=>b.style.display='none',600);}
},9000);
