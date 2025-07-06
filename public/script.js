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

// Show preview of uploaded image
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

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question && !imageInput.files.length) return;

  // Show user message
  if (question) appendMessage("user", question);

  // Show thinking
  appendThinkingAnimation();

  try {
    let imageUrl = "";
    if (imageInput.files.length) {
      imageUrl = await uploadImage(imageInput.files[0]); // Simulated upload
    }

    const uid = "example"; // You can dynamically set this
    const encodedQuestion = encodeURIComponent(question || "What is this?");
    const fullUrl = `https://gpt-scraper-vtv2.onrender.com/api/chat?img_url=${encodeURIComponent(imageUrl)}&ask=${encodedQuestion}&uid=${uid}`;

    const res = await fetch(fullUrl);
    const data = await res.json();

    removeThinkingAnimation();

    if (data.type === "image-generation") {
      appendImage(data.answer); // API returns direct image URL
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
  input.value = "";
  imageInput.value = "";
  previewImageContainer.style.display = "none";
});

// Append text message
function appendMessage(sender, text, isBot = false) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;

  const messageSpan = document.createElement("span");
  messageSpan.className = "message-text";
  bubble.appendChild(messageSpan);

  if (isBot) {
    const copyBtn = document.createElement("button");
    copyBtn.className = "copyBtn";
    copyBtn.title = "Copy";
    copyBtn.innerHTML = "⧉";
    copyBtn.onclick = () => copyText(copyBtn);
    bubble.appendChild(copyBtn);
  }

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (isBot) {
    typeEffect(messageSpan, text, () => {
      renderMath();
    });
  } else {
    messageSpan.textContent = text;
  }
}

// Append generated image
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

// Typing animation indicator
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

// Copy text message
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

// Copy image link
function copyImage(url) {
  navigator.clipboard.writeText(url).then(() => {
    alert("Image URL copied to clipboard!");
  });
}

// Render LaTeX (MathJax)
function renderMath() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise && MathJax.typesetPromise();
  }
}

// Simulate image upload via Base64 (fake image hosting)
async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // Base64
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Typing effect (letter by letter)
function typeEffect(target, text, callback) {
  let i = 0;
  let html = "";
  const speed = 10;

  const interval = setInterval(() => {
    html += text[i++];
    target.innerHTML = marked.parse(html);

    if (i >= text.length) {
      clearInterval(interval);
      callback && callback();
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  }, speed);
}
