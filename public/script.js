import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9oMxtjoG1Zjs1Jvvn5gFiBND16yHL6oA",
  authDomain: "norch-app-da539.firebaseapp.com",
  projectId: "norch-app-da539",
  storageBucket: "norch-app-da539.appspot.com",
  messagingSenderId: "610778572844",
  appId: "1:610778572844:web:bd064667e5dee374e20989"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const loginPanel = document.getElementById("loginPanel");
const chatBox = document.querySelector(".chat-box");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const loading = document.getElementById("loadingScreen");

let currentUser = null;
let chatHistory = [];

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    loginPanel.classList.add("hidden");
    chatBox.classList.remove("hidden");
    form.classList.remove("hidden");
    await loadHistory();
    renderStoredChat();
  } else {
    currentUser = null;
    loginPanel.classList.remove("hidden");
    chatBox.classList.add("hidden");
    form.classList.add("hidden");
  }
});

window.login = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  if (!email || !pass) return alert("Fill both fields");
  try {
    showLoading("Logging in...");
    await signInWithEmailAndPassword(auth, email, pass);
    hideLoading();
  } catch {
    hideLoading();
    alert("❌ Login failed.");
  }
};

window.register = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  if (!email || !pass) return alert("Fill both fields");
  try {
    showLoading("Registering...");
    await createUserWithEmailAndPassword(auth, email, pass);
    hideLoading();
  } catch {
    hideLoading();
    alert("❌ Registration failed.");
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  appendMessage("user", question);
  input.value = "";
  chatHistory.push({ role: "user", content: question });
  await saveHistory();
  appendThinking();

  try {
    const res = await fetch("https://gpt-40.onrender.com/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are Norch, a Filipino GPT AI assistant created by April Manalo and trained by the Norch Team. Be helpful, polite, and support Markdown/LaTeX."
          },
          ...chatHistory
        ]
      })
    });
    const data = await res.json();
    const reply = data.response || "⚠️ No response";
    removeThinking();
    appendMessage("bot", reply, true);
    chatHistory.push({ role: "assistant", content: reply });
    await saveHistory();
    speakTagalog(reply);
  } catch {
    removeThinking();
    appendMessage("bot", "❌ Failed to connect.");
  }
});

function appendMessage(sender, text, isBot = false) {
  const div = document.createElement("div");
  div.className = `bubble ${sender}`;
  div.innerHTML = `
    <span class="message-text">${marked.parse(text)}</span>
    ${isBot ? `<button class="copyBtn" onclick="copyText(this)">⧉</button>` : ""}
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (isBot) renderMath();
}

function renderStoredChat() {
  chatBox.innerHTML = "";
  chatHistory.forEach((entry) => {
    appendMessage(entry.role === "user" ? "user" : "bot", entry.content, entry.role === "assistant");
  });
}

function appendThinking() {
  const div = document.createElement("div");
  div.className = "bubble bot thinking";
  div.innerHTML = `
    <span class="dot-wave"><span></span><span></span><span></span></span>
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinking() {
  const t = document.querySelector(".thinking");
  if (t) t.remove();
}

function copyText(btn) {
  const raw = btn.parentElement.querySelector(".message-text").innerText;
  navigator.clipboard.writeText(raw.trim());
  btn.innerText = "✓";
  setTimeout(() => (btn.innerText = "⧉"), 1000);
}

function renderMath() {
  if (window.MathJax) MathJax.typesetPromise();
}

function speakTagalog(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "tl-PH";
  speechSynthesis.speak(utter);
}

window.toggleTheme = () => {
  document.body.classList.toggle("light-theme");
};

window.toggleAbout = () => {
  const about = document.getElementById("aboutPanel");
  about.style.display = about.style.display === "none" ? "block" : "none";
};

window.toggleLogin = () => {
  loginPanel.classList.toggle("hidden");
};

window.clearChat = async () => {
  chatHistory = [];
  await saveHistory();
  chatBox.innerHTML = "";
};

async function saveHistory() {
  if (!currentUser) return;
  await setDoc(doc(db, "chats", currentUser.uid), { history: chatHistory });
}

async function loadHistory() {
  if (!currentUser) return;
  const snap = await getDoc(doc(db, "chats", currentUser.uid));
  chatHistory = snap.exists() ? snap.data().history : [];
}

function showLoading(msg) {
  loading.style.display = "flex";
  loading.querySelector("h2").innerText = msg;
}

function hideLoading() {
  loading.style.display = "none";
}
