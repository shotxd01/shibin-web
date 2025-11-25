const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files (projects.html, css, js)
app.use(express.static(__dirname + "/../public"));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// ===== Discord Bot Stats Model =====
const Stats = require("./models/Stats");

// ===== API ROUTE: get stats =====
app.get("/api/stats", async (req, res) => {
    try {
        const data = await Stats.findOne().sort({ updatedAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// ===== ROUTE: Projects Page =====
app.get("/projects", (req, res) => {
    res.sendFile("projects.html", { root: __dirname + "/../public" });
});

// ===== ROOT TEST =====
app.get("/", (req, res) => {
    res.send("✅ ShotDevs Backend Running");
});

// IMPORTANT: expose server to network
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API running on http://0.0.0.0:${PORT}`);
});
