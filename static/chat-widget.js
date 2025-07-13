(function () {
  /*** Ask‑Haining floating chat widget — v3 ***/
  const PRIMARY="#5c8374"; // green interior

  /* ------------------------------------------------------------
   * 1.  Inject styles (animated multicolor border, green fill)
   * ----------------------------------------------------------*/
  const style=document.createElement("style");
  style.textContent=`
  /* launcher button ------------------------------------------------*/
  #ask-haining-launcher{position:fixed;bottom:24px;right:24px;display:flex;align-items:center;gap:8px;padding:10px 18px;background:${PRIMARY};color:#fff;font:600 16px/1.2 system-ui,sans-serif;border-radius:9999px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:9999;transition:transform .2s ease;position:fixed;}
  #ask-haining-launcher img{width:24px;height:24px;border-radius:50%;object-fit:cover;}
  /* animated border — built with :before pseudo */
  #ask-haining-launcher{position:fixed;overflow:hidden;}
  #ask-haining-launcher::before{content:"";position:absolute;inset:0;border-radius:9999px;padding:3px;background:linear-gradient(90deg,#00E4FF 0%,#7A5CFF 25%,#FF6EC7 50%,#FFD700 75%,#00E4FF 100%);background-size:400% 100%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:ah-slide 6s linear infinite;}
  @keyframes ah-slide{0%{background-position:0 0;}100%{background-position:400% 0;}}}
  /* bounce attention */
  @keyframes ah-bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  #ask-haining-launcher.ah-attention{animation:ah-bounce .4s ease 0s 2;}
  /* chat panel ----------------------------------------------------*/
  #ask-haining-panel{position:fixed;bottom:96px;right:24px;width:350px;height:460px;max-height:80vh;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,sans-serif;z-index:9999;display:none;}
  #ask-haining-header{background:${PRIMARY};color:#fff;padding:10px 14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
  #ask-haining-messages{flex:1;padding:10px;overflow-y:auto;scrollbar-width:thin;}
  .ah-msg{margin:6px 0;padding:8px 10px;border-radius:10px;max-width:80%;word-wrap:break-word;font-size:14px;line-height:1.3;}
  .ah-user{background:#e0f2fe;align-self:flex-end;}
  .ah-bot{background:#f1f5f9;}
  #ask-haining-input{display:flex;border-top:1px solid #e5e7eb;}
  #ask-haining-input textarea{flex:1;border:none;padding:10px;resize:none;font:inherit;outline:none;}
  #ask-haining-input button{border:none;background:${PRIMARY};color:#fff;padding:0 16px;font-weight:600;cursor:pointer;}
    /* responsive width & lower launcher on tall phones */
  @media (max-width:360px){#ask-haining-panel{width:92vw;right:4%;height:75vh;}}
  @media (min-height:700px){#ask-haining-launcher{bottom:40px;}}
  /* dark‑mode tweaks */
  @media (prefers-color-scheme: dark){
    #ask-haining-panel{background:#1e1e1e;color:#f5f5f5;}
    .ah-bot{background:#2b2b2b;}
    .ah-user{background:#395958;}
    #ask-haining-header{background:#46726a;}
    #ask-haining-input textarea{background:#262626;color:#f5f5f5;}
  }
  `;
  document.head.appendChild(style);

  /* ------------------------------------------------------------
   * 2. Build launcher & panel DOM
   * ----------------------------------------------------------*/
  const launcher=document.createElement("div");
  launcher.id="ask-haining-launcher";
  launcher.innerHTML=`Ask&nbsp;Haining <img src="/images/profile.png" alt="Haining avatar">`;
  document.body.appendChild(launcher);

  const panel=document.createElement("div");
  panel.id="ask-haining-panel";
  panel.innerHTML=`<div id="ask-haining-header">Ask&nbsp;Haining <span id="ask-haining-close" style="cursor:pointer;font-size:18px;">×</span></div><div id="ask-haining-messages"></div><form id="ask-haining-input"><textarea rows="2" placeholder="Type your question…" required></textarea><button type="submit">Send</button></form>`;
  document.body.appendChild(panel);

  /* ------------------------------------------------------------
   * 3. Interaction logic
   * ----------------------------------------------------------*/
  const closeBtn=panel.querySelector("#ask-haining-close");
  const messagesContainer=panel.querySelector("#ask-haining-messages");
  const form=panel.querySelector("#ask-haining-input");
  const textarea=form.querySelector("textarea");
  let messages=[];
  let bounced=false;

  function togglePanel(){const open=panel.style.display!=="flex";panel.style.display=open?"flex":"none";if(open) textarea.focus();}
  launcher.onclick=togglePanel;closeBtn.onclick=()=>panel.style.display="none";

  function addMsg(role,content){const div=document.createElement("div");div.className=`ah-msg ${role==="user"?"ah-user":"ah-bot"}`;div.textContent=content;messagesContainer.appendChild(div);messagesContainer.scrollTop=messagesContainer.scrollHeight;}

  async function sendChat(){const text=textarea.value.trim();if(!text)return;textarea.value="";messages.push({role:"user",content:text});addMsg("user",text);addMsg("bot","…");const placeholder=messagesContainer.lastChild;try{const res=await fetch("https://api.hainingwang.org/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages})});if(!res.ok) throw new Error("Network error");const data=await res.json();placeholder.textContent=(data.answer||"(no answer)").trim();messages.push({role:"assistant",content:placeholder.textContent});}catch(e){console.error(e);placeholder.textContent="Sorry, there was an error. Please try again.";}}
  form.addEventListener("submit",e=>{e.preventDefault();sendChat();});

  /* idle bounce */
  setTimeout(()=>{if(panel.style.display!=="flex"&&!bounced){launcher.classList.add("ah-attention");bounced=true;setTimeout(()=>launcher.classList.remove("ah-attention"),800);}},7000);
})();
