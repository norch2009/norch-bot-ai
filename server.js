const express = require("express");
const path = require("path");

const app = express();

// Serve all static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on root access
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Norch server running at http://localhost:${PORT}`);
});
