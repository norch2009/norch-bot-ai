const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatBox = document.querySelector(".chat-box");
const loading = document.getElementById("loadingScreen");
const container = document.querySelector(".chat-container");

window.onload = () => {
  setTimeout(() => {
    loading.style.opacity = "0";
    setTimeout(() => {
      loading.style.display = "none";
      container.classList.add("visible"); // fade in
    }, 500); // after fade out
  }, 1500);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  appendMessage("user", question);
  input.value = "";
  appendThinkingAnimation();

  try {
    const prompt = `You are Norch, a Filipino GPT AI assistant created by April Manalo and trained by the Norch Team. Answer politely and clearly. Use markdown and LaTeX formatting when needed.\n\nUser: ${question}`;
    const res = await fetch(`https://gpt-40.onrender.com/api/gpt?ask=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    const botReply = data.response || "⚠️ Empty response.";

    removeThinkingAnimation();
    appendMessage("bot", botReply, true);
  } catch (err) {
    removeThinkingAnimation();
    appendMessage("bot", "❌ Failed to connect to GPT-40.");
  }
});

function appendMessage(sender, text, isBot = false) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;

  const html = marked.parse(text);
  bubble.innerHTML = `
    <span class="message-text">${html}</span>
    ${isBot ? `<button class="copyBtn" onclick="copyText(this)" title="Copy">⧉</button>` : ""}
  `;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (isBot) renderMath();
}

function appendThinkingAnimation() {
  const thinking = document.createElement("div");
  thinking.className = "bubble bot typing";
  thinking.innerHTML = `
    <span class="dot-wave">
      <span></span><span></span><span></span>
    </span>
  `;
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinkingAnimation() {
  const typingBubble = document.querySelector(".bubble.typing");
  if (typingBubble) typingBubble.remove();
}

function copyText(btn) {
  const temp = document.createElement("textarea");
  const rawText = btn.parentElement.querySelector(".message-text").innerText;
  temp.value = rawText.trim();
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

  btn.innerText = "✓";
  btn.title = "Copied!";
  setTimeout(() => {
    btn.innerText = "⧉";
    btn.title = "Copy";
  }, 1000);
}

function renderMath() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise && MathJax.typesetPromise();
  }
}
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatBox = document.querySelector(".chat-box");
const loading = document.getElementById("loadingScreen");
const container = document.querySelector(".chat-container");

window.onload = () => {
  setTimeout(() => {
    loading.style.opacity = "0";
    setTimeout(() => {
      loading.style.display = "none";
      container.classList.add("visible"); // fade in
    }, 500); // after fade out
  }, 1500);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  appendMessage("user", question);
  input.value = "";
  appendThinkingAnimation();

  try {
    const prompt = `You are Norch, a Filipino GPT AI assistant created by April Manalo and trained by the Norch Team. Answer politely and clearly. Use markdown and LaTeX formatting when needed.\n\nUser: ${question}`;
    const res = await fetch(`https://gpt-40.onrender.com/api/gpt?ask=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    const botReply = data.response || "⚠️ Empty response.";

    removeThinkingAnimation();
    appendMessage("bot", botReply, true);
  } catch (err) {
    removeThinkingAnimation();
    appendMessage("bot", "❌ Failed to connect to GPT-40.");
  }
});

function appendMessage(sender, text, isBot = false) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;

  const html = marked.parse(text);
  bubble.innerHTML = `
    <span class="message-text">${html}</span>
    ${isBot ? `<button class="copyBtn" onclick="copyText(this)" title="Copy">⧉</button>` : ""}
  `;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (isBot) renderMath();
}

function appendThinkingAnimation() {
  const thinking = document.createElement("div");
  thinking.className = "bubble bot typing";
  thinking.innerHTML = `
    <span class="dot-wave">
      <span></span><span></span><span></span>
    </span>
  `;
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinkingAnimation() {
  const typingBubble = document.querySelector(".bubble.typing");
  if (typingBubble) typingBubble.remove();
}

function copyText(btn) {
  const temp = document.createElement("textarea");
  const rawText = btn.parentElement.querySelector(".message-text").innerText;
  temp.value = rawText.trim();
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

  btn.innerText = "✓";
  btn.title = "Copied!";
  setTimeout(() => {
    btn.innerText = "⧉";
    btn.title = "Copy";
  }, 1000);
}

function renderMath() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise && MathJax.typesetPromise();
  }
}
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatBox = document.querySelector(".chat-box");
const loading = document.getElementById("loadingScreen");
const container = document.querySelector(".chat-container");

window.onload = () => {
  setTimeout(() => {
    loading.style.opacity = "0";
    setTimeout(() => {
      loading.style.display = "none";
      container.classList.add("visible"); // fade in
    }, 500); // after fade out
  }, 1500);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  appendMessage("user", question);
  input.value = "";
  appendThinkingAnimation();

  try {
    const prompt = `You are Norch, a Filipino GPT AI assistant created by April Manalo and trained by the Norch Team. Answer politely and clearly. Use markdown and LaTeX formatting when needed.\n\nUser: ${question}`;
    const res = await fetch(`https://gpt-40.onrender.com/api/gpt?ask=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    const botReply = data.response || "⚠️ Empty response.";

    removeThinkingAnimation();
    appendMessage("bot", botReply, true);
  } catch (err) {
    removeThinkingAnimation();
    appendMessage("bot", "❌ Failed to connect to GPT-40.");
  }
});

function appendMessage(sender, text, isBot = false) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;

  const html = marked.parse(text);
  bubble.innerHTML = `
    <span class="message-text">${html}</span>
    ${isBot ? `<button class="copyBtn" onclick="copyText(this)" title="Copy">⧉</button>` : ""}
  `;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (isBot) renderMath();
}

function appendThinkingAnimation() {
  const thinking = document.createElement("div");
  thinking.className = "bubble bot typing";
  thinking.innerHTML = `
    <span class="dot-wave">
      <span></span><span></span><span></span>
    </span>
  `;
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinkingAnimation() {
  const typingBubble = document.querySelector(".bubble.typing");
  if (typingBubble) typingBubble.remove();
}

function copyText(btn) {
  const temp = document.createElement("textarea");
  const rawText = btn.parentElement.querySelector(".message-text").innerText;
  temp.value = rawText.trim();
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

  btn.innerText = "✓";
  btn.title = "Copied!";
  setTimeout(() => {
    btn.innerText = "⧉";
    btn.title = "Copy";
  }, 1000);
}

function renderMath() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise && MathJax.typesetPromise();
  }
}
