const express = require("express");
const path = require("path");

const app = express();

// Serve all files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when visiting root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
