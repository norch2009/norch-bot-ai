const express = require("express");
const app = express();
const path = require("path");

// Serve static files like script.js, style.css, index.html
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(3000, () => console.log("Norch UI running on http://localhost:3000"));
