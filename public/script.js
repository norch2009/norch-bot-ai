const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatBox = document.querySelector(".chat-box");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const previewImageContainer = document.getElementById("previewImageContainer");
const loading = document.getElementById("loadingScreen");
const container = document.querySelector(".chat-container");
const sendBtn = document.getElementById("sendBtn");

window.onload = () => {
  setTimeout(() => {
    loading.style.opacity = "0";
    setTimeout(() => {
      loading.style.display = "none";
      container.classList.add("visible");
    }, 500);
  }, 1500);
};

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      previewImageContainer.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImageContainer.style.display = "none";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question && !imageInput.files.length) return;

  appendMessage("user", question);
  input.value = "";
  sendBtn.disabled = true;
  sendBtn.textContent = "⏳";
  appendThinkingAnimation();

  try {
    let imageUrl = "";
    if (imageInput.files.length) {
      imageUrl = await uploadImage(imageInput.files[0]); // Upload image
    }

    const uid = "example";
    const encodedQuestion = encodeURIComponent(question || "What is this?");
    const fullUrl = `https://gpt-scraper-vtv2.onrender.com/api/chat?img_url=${encodeURIComponent(imageUrl)}&ask=${encodedQuestion}&uid=${uid}`;
    const res = await fetch(fullUrl);
    const data = await res.json();

    removeThinkingAnimation();
    if (data.type === "image-generation") {
      appendImage(data.answer);
    } else {
      appendMessage("bot", data.answer || "⚠️ Empty response.", true);
    }
  } catch (err) {
    console.error(err);
    removeThinkingAnimation();
    appendMessage("bot", "❌ Failed to connect to Norch.");
  }

  sendBtn.disabled = false;
  sendBtn.textContent = "Send";
  imageInput.value = "";
  previewImageContainer.style.display = "none";
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

function appendImage(imageUrl) {
  const bubble = document.createElement("div");
  bubble.className = `bubble bot`;
  bubble.innerHTML = `
    <img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 12px;" />
    <button class="copyBtn" onclick="copyImage('${imageUrl}')" title="Copy Image">⧉</button>
  `;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
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

function copyImage(url) {
  navigator.clipboard.writeText(url).then(() => {
    alert("Image URL copied to clipboard!");
  });
}

function renderMath() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise && MathJax.typesetPromise();
  }
}

async function uploadImage(file) {
  // For now, convert image to base64 Data URL to simulate upload
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // Use base64 data
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
