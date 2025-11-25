require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const Stats = require('./models/Stats');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user.tag}`);

  setInterval(async () => {
    try {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const members = await guild.members.fetch();

      const totalMembers = guild.memberCount;
      const onlineMembers = members.filter(m => m.presence?.status === 'online').size;
      const channels = guild.channels.cache.size;
      const boosts = guild.premiumTier;

      await Stats.findOneAndUpdate({}, {
        members: totalMembers,
        online: onlineMembers,
        channels: channels,
        boosts: boosts,
        updatedAt: new Date()
      }, { upsert: true });

      console.log("Stats updated:", totalMembers, onlineMembers);

    } catch (err) {
      console.error("Bot stats error:", err);
    }
  }, 30000);
});

client.login(process.env.DISCORD_TOKEN);
