(function () {
  /*** Ask‑Haining floating chat widget — v4 ***/
  const PRIMARY="#5c8374"; // green interior

  // Sample questions pool
  const SAMPLE_QUESTIONS = [
    "What are your main research interests?",
    "Can you summarize your recent publications?",
    "How do you approach AI applications in healthcare?",
    "What's your perspective on large language models?",
    "Tell me about your work on medication records",
    "How do you make scientific content accessible?",
    "What tools do you use for biomedical informatics?",
    "What's your experience with natural language processing?",
    "How do you see AI transforming healthcare?",
    "What advice do you have for PhD students?",
    "Can you explain your research methodology?",
    "What collaborations are you most excited about?"
  ];

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
  @keyframes ah-slide{0%{background-position:0 0;}100%{background-position:400% 0;}}
  /* bounce attention */
  @keyframes ah-bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  #ask-haining-launcher.ah-attention{animation:ah-bounce .4s ease 0s 2;}
  /* chat panel ----------------------------------------------------*/
  #ask-haining-panel{position:fixed;bottom:96px;right:24px;width:420px;height:600px;max-height:85vh;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,sans-serif;z-index:9999;display:none;}
  #ask-haining-header{background:${PRIMARY};color:#fff;padding:12px 16px;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
  #ask-haining-messages{flex:1;padding:12px;overflow-y:auto;scrollbar-width:thin;}
  .ah-msg{margin:8px 0;padding:10px 12px;border-radius:12px;max-width:85%;word-wrap:break-word;font-size:14px;line-height:1.4;}
  .ah-user{background:#e0f2fe;align-self:flex-end;}
  .ah-bot{background:#f1f5f9;}
  .ah-thinking{background:#f1f5f9;font-style:italic;opacity:0.8;}
  
  /* Sample questions box */
  #ask-haining-suggestions{padding:12px;border-top:1px solid #e5e7eb;background:#f8fafc;}
  #ask-haining-suggestions h4{margin:0 0 8px 0;font-size:13px;font-weight:600;color:#64748b;}
  .ah-suggestion{display:block;padding:6px 10px;margin:3px 0;background:#fff;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;color:#475569;cursor:pointer;transition:all 0.2s ease;text-decoration:none;}
  .ah-suggestion:hover{background:${PRIMARY};color:#fff;border-color:${PRIMARY};}
  
  #ask-haining-input{display:flex;border-top:1px solid #e5e7eb;}
  #ask-haining-input textarea{flex:1;border:none;padding:12px;resize:none;font:inherit;outline:none;min-height:20px;max-height:100px;}
  #ask-haining-input button{border:none;background:${PRIMARY};color:#fff;padding:0 18px;font-weight:600;cursor:pointer;transition:background 0.2s ease;}
  #ask-haining-input button:hover{background:#4a6b5d;}
  #ask-haining-input button:disabled{background:#94a3b8;cursor:not-allowed;}
  
  /* responsive width & lower launcher on tall phones */
  @media (max-width:480px){#ask-haining-panel{width:95vw;right:2.5%;height:80vh;}}
  @media (min-height:700px){#ask-haining-launcher{bottom:40px;}}
  /* dark‑mode tweaks */
  @media (prefers-color-scheme: dark){
    #ask-haining-panel{background:#1e1e1e;color:#f5f5f5;}
    .ah-bot,.ah-thinking{background:#2b2b2b;}
    .ah-user{background:#395958;}
    #ask-haining-header{background:#46726a;}
    #ask-haining-input textarea{background:#262626;color:#f5f5f5;}
    #ask-haining-suggestions{background:#262626;border-color:#374151;}
    .ah-suggestion{background:#374151;color:#d1d5db;border-color:#4b5563;}
    .ah-suggestion:hover{background:${PRIMARY};color:#fff;}
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

  // Function to get random sample questions
  function getRandomQuestions(count = 3) {
    const shuffled = [...SAMPLE_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const panel=document.createElement("div");
  panel.id="ask-haining-panel";

  const suggestions = getRandomQuestions().map(q =>
    `<div class="ah-suggestion">${q}</div>`
  ).join('');

  panel.innerHTML=`
    <div id="ask-haining-header">Ask&nbsp;Haining <span id="ask-haining-close" style="cursor:pointer;font-size:18px;">×</span></div>
    <div id="ask-haining-messages"></div>
    <div id="ask-haining-suggestions">
      <h4>💡 Try asking:</h4>
      ${suggestions}
    </div>
    <form id="ask-haining-input">
      <textarea rows="2" placeholder="Type your question… (Enter to send, Shift+Enter for new line)" required></textarea>
      <button type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(panel);

  /* ------------------------------------------------------------
   * 3. Interaction logic
   * ----------------------------------------------------------*/
  const closeBtn=panel.querySelector("#ask-haining-close");
  const messagesContainer=panel.querySelector("#ask-haining-messages");
  const suggestionsContainer=panel.querySelector("#ask-haining-suggestions");
  const form=panel.querySelector("#ask-haining-input");
  const textarea=form.querySelector("textarea");
  const sendButton=form.querySelector("button");
  let messages=[];
  let bounced=false;

  function togglePanel(){
    const open=panel.style.display!=="flex";
    panel.style.display=open?"flex":"none";
    if(open) {
      textarea.focus();
      // Refresh suggestions when opening
      refreshSuggestions();
    }
  }
  launcher.onclick=togglePanel;
  closeBtn.onclick=()=>panel.style.display="none";

  function refreshSuggestions() {
    const newSuggestions = getRandomQuestions().map(q =>
      `<div class="ah-suggestion">${q}</div>`
    ).join('');
    suggestionsContainer.innerHTML = `<h4>💡 Try asking:</h4>${newSuggestions}`;

    // Re-attach click handlers
    suggestionsContainer.querySelectorAll('.ah-suggestion').forEach(suggestion => {
      suggestion.onclick = () => {
        textarea.value = suggestion.textContent;
        textarea.focus();
      };
    });
  }

  // Initial suggestion click handlers
  suggestionsContainer.querySelectorAll('.ah-suggestion').forEach(suggestion => {
    suggestion.onclick = () => {
      textarea.value = suggestion.textContent;
      textarea.focus();
    };
  });

  function addMsg(role,content){
    const div=document.createElement("div");
    div.className=`ah-msg ${role==="user"?"ah-user":role==="thinking"?"ah-thinking":"ah-bot"}`;
    div.textContent=content;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop=messagesContainer.scrollHeight;
    return div;
  }

  // Handle Enter key to send (but allow Shift+Enter for new lines)
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!textarea.disabled && textarea.value.trim()) {
        sendChat();
      }
    }
  });

  async function sendChat(){
    const text=textarea.value.trim();
    if(!text) return;

    // Disable input during processing
    textarea.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = '...';

    textarea.value="";
    messages.push({role:"user",content:text});
    addMsg("user",text);

    // Show thinking indicator
    const thinkingMsg = addMsg("thinking","🤗 Thinking...");

    try{
      console.log("Sending request to API...");
      const response = await fetch("https://api.hainingwang.org/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages })
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      // Remove thinking indicator and add bot response
      thinkingMsg.remove();
      const botMsg = addMsg("bot","");

      // Process the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      console.log("Starting to read stream...");

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream finished");
            break;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });
          console.log("Received chunk:", JSON.stringify(chunk));

          // Append to full response
          fullResponse += chunk;

          // Update the bot message in real-time
          botMsg.textContent = fullResponse;

          // Auto-scroll to bottom
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Final cleanup and save to messages
        const finalResponse = fullResponse.trim();
        if (finalResponse) {
          botMsg.textContent = finalResponse;
          messages.push({ role: "assistant", content: finalResponse });
          console.log("Chat completed successfully");
        } else {
          botMsg.textContent = "No response received.";
        }

      } catch (streamError) {
        console.error("Stream reading error:", streamError);
        botMsg.textContent = "Error reading response stream.";
      }

    } catch (error) {
      console.error("Chat error:", error);
      // Remove thinking message if it exists
      if (thinkingMsg.parentNode) {
        thinkingMsg.remove();
      }
      addMsg("bot", "Sorry, there was an error. Please try again.");
    } finally {
      // Re-enable input
      textarea.disabled = false;
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
      textarea.focus();

      // Refresh suggestions after each conversation
      refreshSuggestions();
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    sendChat();
  });

  /* idle bounce */
  setTimeout(()=>{
    if(panel.style.display!=="flex"&&!bounced){
      launcher.classList.add("ah-attention");
      bounced=true;
      setTimeout(()=>launcher.classList.remove("ah-attention"),800);
    }
  },7000);
})();