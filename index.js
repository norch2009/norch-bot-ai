const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/api/gpt", async (req, res) => {
  const { ask, uid = "April Manalo", imageUrl = "" } = req.query;

  if (!ask) return res.status(400).json({ error: "Missing 'ask' query" });

  try {
    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt4o-latest?ask=${encodeURIComponent(ask)}&uid=${encodeURIComponent(uid)}&imageUrl=${encodeURIComponent(imageUrl)}&apikey=0c919818-e23a-4174-bc8a-18130389a7ba`;

    const result = await axios.get(apiUrl);
    const data = result.data;

    if (!data || !data.response) {
      return res.status(500).json({ error: "Invalid response from Norch API" });
    }

    return res.json({
      author: uid,
      response: data.response
    });
  } catch (err) {
    console.error("❌ Error calling norch API:", err.message);
    return res.status(500).json({ error: "Failed to contact Norch API" });
  }
});

app.get("/", (req, res) => {
  res.send("🤖 Norch GPT-4o Scraper API is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
