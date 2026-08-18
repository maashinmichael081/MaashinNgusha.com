const USERS=[
{id:"dad",name:"Dad",role:"Father",pass:"Dad@123",photo:"dad_mum.jpg"},
{id:"mom",name:"Mum",role:"Mother",pass:"Mom@123",photo:"dad_mum.jpg"},
{id:"me",name:"Maashin Michael Kpamor",role:"Son",pass:"Me@123",photo:"me.jpg"},
{id:"sister",name:"Ngusha Nadoo Christabel",role:"Daughter",pass:"Sister@123",photo:"sister.jpg"},
{id:"brother1",name:"Maashin Sesugh M",role:"Brother",pass:"Brother1@123",photo:"brother1.jpg"},
{id:"brother2",name:"Maashin Vershima G",role:"Brother",pass:"Brother2@123",photo:"brother2.jpg"}];

const $=s=>document.querySelector(s), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let me=USERS.find(u=>u.id===sessionStorage.getItem("ngushaUser"));
let messages=JSON.parse(localStorage.getItem("ngushaMessages")||"[]");
let customPhotos=JSON.parse(localStorage.getItem("ngushaPhotos")||"{}");
let extraGallery=JSON.parse(localStorage.getItem("ngushaGallery")||"[]");
let announcements=JSON.parse(localStorage.getItem("ngushaAnnouncements")||"[]");
let recorder=null,recordChunks=[];

function photo(u){return customPhotos[u.id]||("assets/"+u.photo)}
function logout(){sessionStorage.removeItem("ngushaUser");location.href="index.html"}
function protect(){if(!me){location.href="index.html";return false}return true}
function nav(page){return `<header class="top"><a class="brand" href="home.html"><img src="assets/logo.svg"><div><strong>Maashin Ngusha Family</strong><small>PRIVATE FAMILY PORTAL</small></div></a><nav class="nav" id="mainNav"><a class="${page==="home"?"active":""}" href="home.html">Home</a><a class="${page==="family"?"active":""}" href="family.html">Family</a><a class="${page==="gallery"?"active":""}" href="gallery.html">Gallery</a><a class="${page==="chat"?"active":""}" href="chat.html">Chat</a><a class="${page==="events"?"active":""}" href="events.html">Events</a><a class="${page==="profile"?"active":""}" href="profile.html">Profile</a></nav><div class="mobile-actions"><span class="who">${esc(me.name)}</span><button class="mobile-menu" id="menuBtn" aria-label="Open menu">☰</button><button class="logout" onclick="logout()">Sign out</button></div></header>`}
function layout(page,html){if(!protect())return;$("#app").innerHTML=nav(page)+`<main class="wrap">${html}</main>`;let b=$("#menuBtn"),n=$("#mainNav");if(b&&n)b.onclick=()=>{n.classList.toggle("open");b.textContent=n.classList.contains("open")?"✕":"☰"};if(n)n.querySelectorAll("a").forEach(a=>a.onclick=()=>n.classList.remove("open"))}
function login(){
 const f=$("#loginForm"); if(!f)return;
 document.querySelectorAll(".account").forEach(b=>b.onclick=()=>{$("#username").value=b.dataset.id;$("#password").focus()});
 f.onsubmit=e=>{e.preventDefault();let id=$("#username").value.trim().toLowerCase(),pass=$("#password").value;let u=USERS.find(x=>x.id===id&&x.pass===pass);if(!u){$("#error").hidden=false;return}sessionStorage.setItem("ngushaUser",u.id);location.href="home.html"}
}
function familyCards(){return USERS.map(u=>`<div class="card member" onclick="location.href='profile.html?u=${u.id}'"><img src="${photo(u)}"><div class="member-info"><h3>${esc(u.name)}</h3><div class="role">${esc(u.role)}</div><div class="online">● Family member</div></div></div>`).join("")}
function home(){
 layout("home",`<section class="hero"><div><div class="eyebrow">MAASHIN NGUSHA FAMILY</div><h1>Together is our favorite place to be.</h1><p>A private family space for conversations, memories, photographs and the moments that keep us close — wherever we are.</p><a class="btn gold" href="chat.html">Open Family Chat</a></div><img class="hero-logo" src="assets/logo.svg"></section>
 <div class="section"><div><div class="eyebrow">THE FAMILY</div><h2>Our People</h2></div><a class="muted" href="family.html">View everyone</a></div><div class="members">${familyCards()}</div>
 <div class="section"><div><div class="eyebrow">FAMILY LIFE</div><h2>Stay connected</h2></div></div>
 <div class="grid"><a class="card" href="chat.html"><h3>Family Chat</h3><p class="muted">Share messages with everyone from your phone or computer.</p></a><a class="card" href="gallery.html"><h3>Family Memories</h3><p class="muted">Add photographs directly from your device.</p></a><a class="card" href="events.html"><h3>Events & Celebrations</h3><p class="muted">Keep birthdays and family occasions together.</p></a></div>`)
}
function family(){layout("family",`<div class="section"><div><div class="eyebrow">PEOPLE</div><h2>Maashin Ngusha Family</h2></div></div><div class="members">${familyCards()}</div>`)}
function gallery(){
 layout("gallery",`<div class="section"><div><div class="eyebrow">MEMORIES</div><h2>Family Gallery</h2></div></div>
 <div class="gallery" id="gallery">${USERS.map(u=>`<div class="card photo-card"><img src="${photo(u)}"><b>${esc(u.name)}</b><div class="muted" style="font-size:11px;margin-top:4px">Family profile photo</div></div>`).join("")}
 <div class="card add-box"><div><div style="font-size:30px">＋</div><b>Add a family picture</b><p class="muted" style="font-size:11px">Choose a photo from your phone.</p><label for="galleryUpload">Choose picture</label><input id="galleryUpload" type="file" accept="image/*"></div></div></div>
 <div class="notice" style="margin-top:15px">Photos added here are stored in this browser on this device. To make new photos appear for every family member on every phone, the site needs a shared online database/storage service.</div>`);
 $("#galleryUpload").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{extraGallery.push({src:r.result,by:me.name});localStorage.setItem("ngushaGallery",JSON.stringify(extraGallery));renderExtraGallery();toast("Picture added to this device");};r.readAsDataURL(f)}
 renderExtraGallery()
}
function renderExtraGallery(){let g=$("#gallery");if(!g)return;extraGallery.forEach((x,i)=>{if(document.querySelector(`[data-extra="${i}"]`))return;let d=document.createElement("div");d.className="card photo-card";d.dataset.extra=i;d.innerHTML=`<img src="${x.src}"><b>Family memory</b><div class="muted" style="font-size:11px;margin-top:4px">Added by ${esc(x.by)}</div>`;g.insertBefore(d,g.lastElementChild)})}
function chat(){
 layout("chat",`<div class="section"><div><div class="eyebrow">COMMUNICATION</div><h2>Family Chat</h2></div></div>
 <div class="card chat">
   <div class="messages" id="messages"></div>
   <div class="emoji-row" id="emojiRow">
     <button type="button" onclick="addEmoji('😀')">😀</button><button type="button" onclick="addEmoji('😂')">😂</button><button type="button" onclick="addEmoji('❤️')">❤️</button><button type="button" onclick="addEmoji('😍')">😍</button><button type="button" onclick="addEmoji('🎉')">🎉</button><button type="button" onclick="addEmoji('🙏')">🙏</button><button type="button" onclick="addEmoji('👍')">👍</button><button type="button" onclick="addEmoji('🥳')">🥳</button>
   </div>
   <form class="composer" id="cf">
     <button class="tool-btn" type="button" id="emojiBtn" title="Emoji">😊</button>
     <input id="ci" placeholder="Write a family message…" autocomplete="off">
     <label class="tool-btn" title="Send picture">📷<input id="chatImage" type="file" accept="image/*" hidden></label>
     <button class="tool-btn" type="button" id="voiceBtn" title="Record voice note">🎙️</button>
     <button class="btn" type="submit">Send</button>
   </form>
   <div id="voiceStatus" class="voice-status" hidden>Recording… tap 🎙️ again to stop</div>
 </div>`);
 renderMessages();
 $("#cf").onsubmit=e=>{e.preventDefault();sendText()};
 $("#emojiBtn").onclick=()=>$("#emojiRow").classList.toggle("show");
 $("#chatImage").onchange=e=>sendChatImage(e.target.files[0]);
 $("#voiceBtn").onclick=toggleVoiceRecording;
}
function addEmoji(e){let i=$("#ci");if(!i)return;i.value+=e;i.focus()}
function saveMessages(){localStorage.setItem("ngushaMessages",JSON.stringify(messages))}
function sendText(){
 let t=$("#ci").value.trim();if(!t)return;
 messages.push({type:"text",from:me.name,text:t,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});
 saveMessages();$("#ci").value="";$("#emojiRow").classList.remove("show");renderMessages()
}
function sendChatImage(file){
 if(!file)return;
 let r=new FileReader();r.onload=()=>{messages.push({type:"image",from:me.name,src:r.result,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});saveMessages();renderMessages();$("#chatImage").value=""};r.readAsDataURL(file)
}
async function toggleVoiceRecording(){
 const btn=$("#voiceBtn"),status=$("#voiceStatus");
 if(recorder && recorder.state==="recording"){recorder.stop();return}
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast("Voice notes need microphone permission and HTTPS");return}
 try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});
   recordChunks=[];recorder=new MediaRecorder(stream);
   recorder.ondataavailable=e=>{if(e.data.size)recordChunks.push(e.data)};
   recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());let blob=new Blob(recordChunks,{type:recorder.mimeType||"audio/webm"});let r=new FileReader();r.onload=()=>{messages.push({type:"voice",from:me.name,src:r.result,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});saveMessages();renderMessages();status.hidden=true;btn.classList.remove("recording")};r.readAsDataURL(blob)};
   recorder.start();status.hidden=false;btn.classList.add("recording");
 }catch(err){toast("Microphone permission was not allowed")}
}
function renderMessages(){
 if(!$("#messages"))return;
 $("#messages").innerHTML=messages.map(m=>{
   let content=m.type==="image"?`<img class="chat-image" src="${m.src}" alt="Family picture">`:
     m.type==="voice"?`<audio class="voice-player" controls src="${m.src}"></audio>`:esc(m.text);
   return `<div class="msg ${m.from===me.name?"mine":""}"><div class="bubble"><b>${esc(m.from)}</b><br>${content}<small>${esc(m.time)}</small></div></div>`
 }).join("");
 $("#messages").scrollTop=$("#messages").scrollHeight
}
function events(){
 layout("events",`<div class="section"><div><div class="eyebrow">FAMILY LIFE</div><h2>Events & Announcements</h2></div></div>
 <div class="card announcement-box">
   <h3>Post an announcement</h3>
   <p class="muted">Any family member can share an important family update.</p>
   <form id="announcementForm">
     <input id="announcementTitle" placeholder="Announcement title" maxlength="80" required>
     <textarea id="announcementText" placeholder="Write your announcement…" maxlength="500" required></textarea>
     <button class="btn" type="submit">📢 Post announcement</button>
   </form>
 </div>
 <div class="section"><div><div class="eyebrow">LATEST</div><h2>Family Announcements</h2></div></div>
 <div id="announcements" class="announcement-list"></div>
 <div class="section"><div><div class="eyebrow">CALENDAR</div><h2>Family Events</h2></div></div>
 <div class="grid"><div class="card"><h3>Family Meeting</h3><p class="muted">Time for everyone to connect and plan together.</p></div><div class="card"><h3>Birthdays</h3><p class="muted">Celebrate the people who make the family special.</p></div><div class="card"><h3>Family Day</h3><p class="muted">Food, laughter and memories.</p></div></div>`);
 renderAnnouncements();
 $("#announcementForm").onsubmit=e=>{e.preventDefault();let title=$("#announcementTitle").value.trim(),text=$("#announcementText").value.trim();if(!title||!text)return;announcements.unshift({title,text,by:me.name,time:new Date().toLocaleString()});localStorage.setItem("ngushaAnnouncements",JSON.stringify(announcements));$("#announcementForm").reset();renderAnnouncements();toast("Announcement posted")};
}
function renderAnnouncements(){
 let box=$("#announcements");if(!box)return;
 box.innerHTML=announcements.length?announcements.map(a=>`<article class="card announcement"><div class="announcement-head"><h3>${esc(a.title)}</h3><span>📢</span></div><p>${esc(a.text)}</p><small>Posted by <b>${esc(a.by)}</b> · ${esc(a.time)}</small></article>`).join(""):`<div class="card muted">No announcements yet. Be the first family member to post one.</div>`
}
function profile(){
 let q=new URLSearchParams(location.search).get("u")||me.id,u=USERS.find(x=>x.id===q)||me;
 layout("profile",`<div class="section"><div><div class="eyebrow">FAMILY PROFILE</div><h2>${esc(u.name)}</h2></div></div>
 <div class="profile"><div class="card profile-center"><img id="profileImg" class="profile-photo" src="${photo(u)}"><h2 style="font-size:24px;margin:14px 0 4px">${esc(u.name)}</h2><p class="muted">${esc(u.role)}</p>
 ${u.id===me.id?`<div class="upload"><label for="profileUpload">Change profile picture</label><input id="profileUpload" type="file" accept="image/*"></div>`:""}</div>
 <div class="card"><div class="info"><b>Family role</b><div class="muted">${esc(u.role)}</div></div><div class="info"><b>Status</b><div style="color:var(--green)">● Active</div></div><div class="info"><b>Profile photo</b><div class="muted">${u.id===me.id?"You can change your picture anytime from your profile.":"This family member's current picture."}</div></div>
 <div class="notice">You are signed in as <b>${esc(me.name)}</b>. Your own profile settings are available only to you.</div></div></div>`);
 if(u.id===me.id) $("#profileUpload").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{customPhotos[me.id]=r.result;localStorage.setItem("ngushaPhotos",JSON.stringify(customPhotos));$("#profileImg").src=r.result;toast("Profile picture updated")};r.readAsDataURL(f)}
}
document.addEventListener("DOMContentLoaded",()=>{login();let p=document.body.dataset.page;if(p==="home")home();if(p==="family")family();if(p==="gallery")gallery();if(p==="chat")chat();if(p==="events")events();if(p==="profile")profile()});
