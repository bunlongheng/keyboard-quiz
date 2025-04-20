// backend/server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Character selection
app.post("/select-character", (req, res) => {
    console.log("🧠 Character selected:", req.body.name);
    res.send({ status: "ok" });
});

// Quiz feedback
app.post("/quiz-feedback", (req, res) => {
    console.log("✅ Answer result:", req.body.correct ? "Correct" : "Wrong");
    res.send({ status: "ok" });
});

// Start server
app.listen(5001, () => {
    console.log("🔌 Backend API running on http://localhost:5001");
});
