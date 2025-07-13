(function () {
  /*** Ask‑Haining floating chat widget — v4 ***/
  const PRIMARY="#5c8374"; // green interior

  // Simple markdown parser for chat messages
  function parseMarkdown(text) {
    return text
      // Code blocks (triple backticks)
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code (single backticks)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Wrap in paragraphs
      .replace(/^(.+)$/gm, '<p>$1</p>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, '')
      // Lists (basic support)
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
  }

  // Mobile detection
  function isMobile() {
    return window.innerWidth <= 480 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Sample questions pool
  const SAMPLE_QUESTIONS = [
      "How does your work address the accessibility crisis in scientific communication?",
      "Data science, humanities, and biomedical informatics, really?",
      "How can your Fairness Evaluation Protocol be model-agnostic?",
      "How do you envision agentic AI systems transforming current science?",
      "What methodological innovations have you developed?",
      "What did you find in the Lu Xun paper?",
      "Can you explain your research on protecting author privacy?",
      "What's your philosophy on teaching and curriculum design?",
      "How will agentic AI transform knowledge management?",
      "What emerging research directions excite you most?",
      "How do you ensure reproducibility in your research?",
      "What challenges did you face developing your RL text simplification?",
      "What makes your scientific novelty measure unique?",
      "How do you balance privacy protection with beneficial AI?",
  ];

  /* ------------------------------------------------------------
   * 1.  Inject styles (animated multicolor border, green fill)
   * ----------------------------------------------------------*/
  const style=document.createElement("style");
  style.textContent=`
  /* launcher button ------------------------------------------------*/
  #ask-haining-launcher{position:fixed;bottom:24px;right:24px;display:flex;align-items:center;gap:8px;padding:10px 18px;background:${PRIMARY};color:#fff;font:600 16px/1.2 system-ui,sans-serif;border-radius:9999px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:9999;transition:transform .2s ease;position:fixed;}
  #ask-haining-launcher:active{transform:scale(0.95);}
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
  
  /* Zoom icon */
  #ask-haining-zoom{position:absolute;bottom:250px;right:12px;width:32px;height:32px;background:rgba(255,255,255,0.9);border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;color:#64748b;transition:all 0.2s ease;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
  #ask-haining-zoom:hover{background:#fff;color:${PRIMARY};transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,0.15);}
  
  /* Modal overlay and expanded chat */
  #ask-haining-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);z-index:10000;display:none;align-items:center;justify-content:center;}
  #ask-haining-expanded{width:90vw;max-width:800px;height:85vh;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,sans-serif;}
  #ask-haining-expanded #ask-haining-header{background:${PRIMARY};color:#fff;padding:16px 20px;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
  #ask-haining-expanded #ask-haining-messages{flex:1;padding:16px;overflow-y:auto;scrollbar-width:thin;}
  #ask-haining-expanded #ask-haining-suggestions{padding:16px;border-top:1px solid #e5e7eb;background:#f8fafc;}
  #ask-haining-expanded #ask-haining-input{display:flex;border-top:1px solid #e5e7eb;}
  #ask-haining-expanded #ask-haining-input textarea{flex:1;border:none;padding:16px;resize:none;font:inherit;outline:none;min-height:24px;max-height:120px;}
  #ask-haining-expanded #ask-haining-input button{border:none;background:${PRIMARY};color:#fff;padding:0 24px;font-weight:600;cursor:pointer;}
  
  /* Close button in modal */
  #ask-haining-modal-close{cursor:pointer;font-size:24px;color:#fff;padding:4px;border-radius:4px;transition:background 0.2s ease;}
  #ask-haining-modal-close:hover{background:rgba(255,255,255,0.2);}
  #ask-haining-messages{flex:1;padding:12px;overflow-y:auto;scrollbar-width:thin;}
  .ah-msg{margin:8px 0;padding:10px 12px;border-radius:12px;max-width:85%;word-wrap:break-word;font-size:14px;line-height:1.4;}
  .ah-user{background:#e0f2fe;align-self:flex-end;}
  .ah-bot{background:#f1f5f9;}
  .ah-thinking{background:#f1f5f9;font-style:italic;opacity:0.8;}
  
  /* Markdown styling in bot messages */
  .ah-bot h1,.ah-bot h2,.ah-bot h3{margin:8px 0 4px 0;font-weight:600;}
  .ah-bot h1{font-size:18px;border-bottom:1px solid #e5e7eb;}
  .ah-bot h2{font-size:16px;}
  .ah-bot h3{font-size:15px;}
  .ah-bot p{margin:4px 0;}
  .ah-bot ul,.ah-bot ol{margin:4px 0 4px 16px;padding-left:8px;}
  .ah-bot li{margin:2px 0;}
  .ah-bot code{background:#f1f3f4;padding:2px 4px;border-radius:3px;font-family:Monaco,Consolas,'Courier New',monospace;font-size:13px;}
  .ah-bot pre{background:#f8f9fa;border:1px solid #e9ecef;border-radius:6px;padding:8px;margin:6px 0;overflow-x:auto;}
  .ah-bot pre code{background:none;padding:0;}
  .ah-bot blockquote{border-left:3px solid ${PRIMARY};padding-left:12px;margin:6px 0;font-style:italic;color:#666;}
  .ah-bot strong{font-weight:600;}
  .ah-bot em{font-style:italic;}
  .ah-bot a{color:${PRIMARY};text-decoration:underline;}
  .ah-bot a:hover{color:#4a6b5d;}
  
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
  #ask-haining-input button:active{transform:scale(0.98);}
  
  /* responsive width & lower launcher on tall phones */
  @media (max-width:480px){
    #ask-haining-panel{width:95vw;right:2.5%;height:80vh;}
    #ask-haining-expanded{width:95vw;height:90vh;}
    /* Hide zoom icon on mobile - auto-expand instead */
    #ask-haining-zoom{display:none;}
    /* Larger touch targets on mobile */
    #ask-haining-launcher{padding:12px 20px;font-size:16px;}
    #ask-haining-close, #ask-haining-modal-close{font-size:24px;padding:8px;}
    .ah-suggestion{padding:12px 14px;font-size:14px;margin:6px 0;}
    #ask-haining-input button{padding:0 24px;font-size:16px;}
    #ask-haining-input textarea{padding:16px;font-size:16px;}
    /* Better spacing on mobile */
    .ah-msg{padding:12px 14px;font-size:15px;margin:10px 0;}
    #ask-haining-suggestions{padding:16px;}
  }
  @media (max-width:768px) and (min-width:481px){
    /* Tablet optimizations */
    #ask-haining-panel{width:85vw;right:7.5%;height:75vh;}
    #ask-haining-expanded{width:90vw;height:85vh;}
    #ask-haining-zoom{width:36px;height:36px;font-size:18px;}
    /* Slightly larger touch targets for tablets */
    .ah-suggestion{padding:10px 12px;font-size:13px;}
    #ask-haining-input button{padding:0 20px;}
  }
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
    #ask-haining-zoom{background:rgba(55,65,81,0.9);border-color:#4b5563;color:#d1d5db;}
    #ask-haining-zoom:hover{background:#374151;color:${PRIMARY};}
    /* Dark mode modal */
    #ask-haining-expanded{background:#1e1e1e;color:#f5f5f5;}
    #ask-haining-expanded #ask-haining-header{background:#46726a;}
    #ask-haining-expanded #ask-haining-input textarea{background:#262626;color:#f5f5f5;}
    #ask-haining-expanded #ask-haining-suggestions{background:#262626;border-color:#374151;}
    /* Dark mode markdown styles */
    .ah-bot h1{border-bottom-color:#374151;}
    .ah-bot code{background:#374151;color:#e5e7eb;}
    .ah-bot pre{background:#1f2937;border-color:#374151;}
    .ah-bot blockquote{border-left-color:${PRIMARY};color:#9ca3af;}
    .ah-bot a{color:#60a5fa;}
    .ah-bot a:hover{color:#93c5fd;}
  }
  
  /* Mobile-specific dark mode improvements */
  @media (max-width:480px) and (prefers-color-scheme: dark){
    #ask-haining-modal{background:rgba(0,0,0,0.8);}
    .ah-suggestion:active{background:${PRIMARY};color:#fff;transform:scale(0.98);}
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
      <textarea rows="2" placeholder="Ask Haining Anything… (Enter to send, Shift+Enter for new line)" required></textarea>
      <button type="submit">Send</button>
    </form>
    <div id="ask-haining-zoom" title="Expand chat">⛶</div>
  `;
  document.body.appendChild(panel);

  // Create modal for expanded chat
  const modal = document.createElement("div");
  modal.id = "ask-haining-modal";
  modal.innerHTML = `
    <div id="ask-haining-expanded">
      <div id="ask-haining-header">Ask&nbsp;Haining <span id="ask-haining-modal-close" title="Close expanded view">×</span></div>
      <div id="ask-haining-messages"></div>
      <div id="ask-haining-suggestions">
        <h4>💡 Try asking:</h4>
        ${suggestions}
      </div>
      <form id="ask-haining-input">
        <textarea rows="2" placeholder="Type your question… (Enter to send, Shift+Enter for new line)" required></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  /* ------------------------------------------------------------
   * 3. Interaction logic
   * ----------------------------------------------------------*/
  const closeBtn=panel.querySelector("#ask-haining-close");
  const zoomBtn=panel.querySelector("#ask-haining-zoom");
  const modalCloseBtn=modal.querySelector("#ask-haining-modal-close");

  // Get both regular and modal elements
  const regularElements = {
    messagesContainer: panel.querySelector("#ask-haining-messages"),
    suggestionsContainer: panel.querySelector("#ask-haining-suggestions"),
    form: panel.querySelector("#ask-haining-input"),
    textarea: panel.querySelector("textarea"),
    sendButton: panel.querySelector("button")
  };

  const modalElements = {
    messagesContainer: modal.querySelector("#ask-haining-messages"),
    suggestionsContainer: modal.querySelector("#ask-haining-suggestions"),
    form: modal.querySelector("#ask-haining-input"),
    textarea: modal.querySelector("textarea"),
    sendButton: modal.querySelector("button")
  };

  // Current active elements (switch between regular and modal)
  let currentElements = regularElements;
  let isExpanded = false;
  let messages=[];
  let bounced=false;

  function togglePanel(){
    const open=panel.style.display!=="flex";

    if(open) {
      // On mobile, auto-open in expanded mode
      if(isMobile()) {
        expandChat();
      } else {
        panel.style.display = "flex";
        currentElements.textarea.focus();
        refreshSuggestions();
      }
    } else {
      panel.style.display="none";
    }
  }

  function expandChat() {
    isExpanded = true;
    panel.style.display = "none";
    modal.style.display = "flex";
    currentElements = modalElements;

    // Sync content to modal
    syncContent();
    currentElements.textarea.focus();

    // On mobile, prevent body scroll
    if(isMobile()) {
      document.body.style.overflow = 'hidden';
    }
  }

  function collapseChat() {
    isExpanded = false;
    modal.style.display = "none";

    // On mobile, close completely instead of going to panel
    if(isMobile()) {
      currentElements = regularElements;
      document.body.style.overflow = '';
    } else {
      panel.style.display = "flex";
      currentElements = regularElements;

      // Sync content back to panel
      syncContent();
      currentElements.textarea.focus();
    }
  }

  function syncContent() {
    // Sync messages
    const sourceMessages = isExpanded ? regularElements.messagesContainer : modalElements.messagesContainer;
    const targetMessages = isExpanded ? modalElements.messagesContainer : regularElements.messagesContainer;
    targetMessages.innerHTML = sourceMessages.innerHTML;

    // Sync suggestions
    const sourceSuggestions = isExpanded ? regularElements.suggestionsContainer : modalElements.suggestionsContainer;
    const targetSuggestions = isExpanded ? modalElements.suggestionsContainer : regularElements.suggestionsContainer;
    targetSuggestions.innerHTML = sourceSuggestions.innerHTML;

    // Re-attach suggestion click handlers
    attachSuggestionHandlers();

    // Scroll to bottom
    targetMessages.scrollTop = targetMessages.scrollHeight;
  }

  launcher.onclick=togglePanel;
  closeBtn.onclick=()=>panel.style.display="none";
  zoomBtn.onclick=expandChat;
  modalCloseBtn.onclick=collapseChat;

  // Close modal when clicking outside (but not on mobile for better UX)
  modal.onclick=(e)=>{
    if(e.target === modal && !isMobile()) {
      collapseChat();
    }
  };

  // Mobile-specific improvements
  if(isMobile()) {
    // Add swipe-down gesture to close on mobile
    let startY = 0;
    let currentY = 0;

    modal.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });

    modal.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
    });

    modal.addEventListener('touchend', (e) => {
      const diffY = currentY - startY;
      // If swiped down more than 100px, close modal
      if(diffY > 100 && e.target === modal) {
        collapseChat();
      }
    });

    // Better keyboard handling on mobile
    window.addEventListener('resize', () => {
      if(modal.style.display === 'flex') {
        // Adjust modal height when keyboard appears
        const vh = window.innerHeight * 0.01;
        modal.querySelector('#ask-haining-expanded').style.height = `${window.innerHeight * 0.9}px`;
      }
    });
  }

  function refreshSuggestions() {
    const newSuggestions = getRandomQuestions().map(q =>
      `<div class="ah-suggestion">${q}</div>`
    ).join('');
    currentElements.suggestionsContainer.innerHTML = `<h4>💡 Try asking:</h4>${newSuggestions}`;

    attachSuggestionHandlers();
  }

  function attachSuggestionHandlers() {
    // Attach to both regular and modal if they exist
    [regularElements, modalElements].forEach(elements => {
      elements.suggestionsContainer.querySelectorAll('.ah-suggestion').forEach(suggestion => {
        suggestion.onclick = () => {
          currentElements.textarea.value = suggestion.textContent;
          currentElements.textarea.focus();
        };
      });
    });
  }

  // Initial suggestion click handlers
  attachSuggestionHandlers();

  function addMsg(role,content){
    const div=document.createElement("div");
    div.className=`ah-msg ${role==="user"?"ah-user":role==="thinking"?"ah-thinking":"ah-bot"}`;

    if (role === "bot" && content) {
      // Parse markdown for bot messages
      div.innerHTML = parseMarkdown(content);
    } else {
      // Use textContent for user messages and thinking state
      div.textContent = content;
    }

    currentElements.messagesContainer.appendChild(div);
    currentElements.messagesContainer.scrollTop=currentElements.messagesContainer.scrollHeight;
    return div;
  }

  function updateBotMsg(botMsg, content) {
    // Helper function to update bot message with markdown
    if (content) {
      botMsg.innerHTML = parseMarkdown(content);
    } else {
      botMsg.textContent = content;
    }
  }

  // Handle Enter key to send (but allow Shift+Enter for new lines) - for both textareas
  [regularElements.textarea, modalElements.textarea].forEach(textarea => {
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!textarea.disabled && textarea.value.trim()) {
          sendChat();
        }
      }
    });
  });

  async function sendChat(){
    const text=currentElements.textarea.value.trim();
    if(!text) return;

    // Disable input during processing
    currentElements.textarea.disabled = true;
    currentElements.sendButton.disabled = true;
    currentElements.sendButton.textContent = '...';

    currentElements.textarea.value="";
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

          // Update the bot message in real-time with markdown
          updateBotMsg(botMsg, fullResponse);

          // Auto-scroll to bottom
          currentElements.messagesContainer.scrollTop = currentElements.messagesContainer.scrollHeight;
        }

        // Final cleanup and save to messages
        const finalResponse = fullResponse.trim();
        if (finalResponse) {
          updateBotMsg(botMsg, finalResponse);
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
      currentElements.textarea.disabled = false;
      currentElements.sendButton.disabled = false;
      currentElements.sendButton.textContent = 'Send';
      currentElements.textarea.focus();

      // Refresh suggestions after each conversation
      refreshSuggestions();
    }
  }

  // Handle form submission for both forms
  [regularElements.form, modalElements.form].forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      sendChat();
    });
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