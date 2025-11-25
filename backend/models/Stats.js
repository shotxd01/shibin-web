const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  members: Number,
  online: Number,
  channels: Number,
  boosts: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiscordStats', StatsSchema);
