import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const loading = document.getElementById("loadingScreen");
const container = document.querySelector(".chat-container");
const loginBox = document.getElementById("loginBox");
const aboutSection = document.getElementById("aboutSection");

let currentUser = null;
let chatHistory = [];

window.onload = () => {
  setTimeout(() => {
    loading.style.opacity = "0";
    setTimeout(() => {
      loading.style.display = "none";
      container.classList.add("visible");
    }, 500);
  }, 1500);
};

// Listen for auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    loginBox.hidden = true;
    chatBox.hidden = false;
    form.hidden = false;
    await loadHistory();
    renderStoredChat();
  } else {
    currentUser = null;
    loginBox.hidden = false;
    chatBox.hidden = true;
    form.hidden = true;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  appendMessage("user", question);
  input.value = "";
  chatHistory.push({ role: "user", content: question });
  await saveHistory();
  appendThinkingAnimation();

  try {
    const res = await fetch("https://gpt-40.onrender.com/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are Norch, a Filipino GPT AI assistant created by April Manalo and trained by the Norch Team. Answer politely and clearly. Use markdown and LaTeX formatting when needed."
          },
          ...chatHistory
        ]
      })
    });

    const data = await res.json();
    const botReply = data.response || "⚠️ Empty response.";
    removeThinkingAnimation();
    appendMessage("bot", botReply, true);
    speakTagalog(botReply);
    chatHistory.push({ role: "assistant", content: botReply });
    await saveHistory();
  } catch {
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
    ${
      isBot
        ? `<button class="copyBtn" onclick="copyText(this)" title="Copy">⧉</button>`
        : ""
    }
  `;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (isBot) renderMath();
}

function renderStoredChat() {
  chatBox.innerHTML = "";
  chatHistory.forEach((entry) => {
    if (entry.role === "user") appendMessage("user", entry.content);
    else if (entry.role === "assistant")
      appendMessage("bot", entry.content, true);
  });
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

// Voice in Tagalog
function speakTagalog(text) {
  if (!"speechSynthesis" in window) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "tl-PH";
  speechSynthesis.speak(utter);
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light-theme");
}

// About toggle
function toggleAbout() {
  aboutSection.style.display =
    aboutSection.style.display === "block" ? "none" : "block";
}

// Auth
window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (!email || !pass) return alert("Fill both fields");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch {
    alert("Login failed.");
  }
};

window.register = async () => {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (!email || !pass) return alert("Fill both fields");
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
  } catch {
    alert("Registration failed.");
  }
};

window.logout = () => signOut(auth);

window.clearChat = async () => {
  chatHistory = [];
  await saveHistory();
  chatBox.innerHTML = "";
};

async function saveHistory() {
  if (!currentUser) return;
  await setDoc(doc(db, "chats", currentUser.uid), {
    history: chatHistory
  });
}

async function loadHistory() {
  if (!currentUser) return;
  const docRef = doc(db, "chats", currentUser.uid);
  const snap = await getDoc(docRef);
  chatHistory = snap.exists() ? snap.data().history : [];
}
