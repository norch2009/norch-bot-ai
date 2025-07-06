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

// Show image preview
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

// Handle chat submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question && !imageInput.files.length) return;

  if (question) appendMessage("user", question);
  appendThinkingAnimation();

  try {
    let imageUrl = "";
    if (imageInput.files.length) {
      imageUrl = await uploadImage(imageInput.files[0]);
    }

    const uid = "example"; // replace with real UID
    const fullUrl = `https://gpt-scraper-vtv2.onrender.com/api/chat?img_url=${encodeURIComponent(imageUrl)}&ask=${encodeURIComponent(question)}&uid=${uid}`;

    const response = await axios.get(fullUrl);
    const data = response.data;

    removeThinkingAnimation();

    if (!data || !data.answer) {
      appendMessage("bot", "⚠️ Walang sagot mula kay Norch.", true);
      return;
    }

    if (data.type === "image-generation") {
      appendImage(data.answer);
    } else {
      appendMessage("bot", data.answer, true);
    }

  } catch (err) {
    console.error("❌ ERROR:", err.message || err);
    removeThinkingAnimation();
    appendMessage("bot", "❌ Failed to connect to Norch.", true);
  }

  sendBtn.disabled = false;
  sendBtn.textContent = "Send";
  input.value = "";
  imageInput.value = "";
  previewImageContainer.style.display = "none";
});

// Upload image using ImgBB
async function uploadImage(file) {
  const apiKey = "35132e805bfdcb6f70e048cd1305f112";
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
    return res.data.data.url;
  } catch (err) {
    console.error("❌ Image upload failed:", err);
    throw new Error("Image upload failed");
  }
}

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

// Append image message
function appendImage(imageUrl) {
  const bubble = document.createElement("div");
  bubble.className = "bubble bot";
  bubble.innerHTML = `
    <img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 12px;" />
    <button class="copyBtn" onclick="copyImage('${imageUrl}')" title="Copy Image">⧉</button>
  `;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing animation
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

// Copy image
function copyImage(url) {
  navigator.clipboard.writeText(url).then(() => {
    alert("Image URL copied to clipboard!");
  });
}

// LaTeX render
function renderMath() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise && MathJax.typesetPromise();
  }
}

// Typing effect
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
