require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stats = require('./models/Stats');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.get('/api/discord/stats', async (req, res) => {
  try {
    const stats = await Stats.findOne().sort({ updatedAt: -1 });
    res.json(stats || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
