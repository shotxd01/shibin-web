// projects/script.js

const API_URL = "https://shotdevs.live/api/v1/status/all";

async function loadDiscordStats() {
    const guildLabel    = document.getElementById("guildName");
    const membersLabel  = document.getElementById("members");
    const channelsLabel = document.getElementById("channels");
    const statusLabel   = document.getElementById("status");
    const updatedLabel  = document.getElementById("lastUpdated");
    const statusNote    = document.getElementById("statusNote");

    // If page doesn't have these, do nothing
    if (!guildLabel) return;

    try {
        statusNote.textContent = "Fetching latest stats…";

        const res = await fetch(API_URL, {
            method: "GET",
            cache: "no-cache",
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        // Only care about Discord
        const discord = data?.services?.discord;
        const guild   = discord?.guild_info;

        if (!discord || !guild) {
            throw new Error("Discord data missing in API response");
        }

        guildLabel.textContent    = guild.name || "Unknown";
        membersLabel.textContent  = guild.member_count ?? "--";
        channelsLabel.textContent = guild.channel_count ?? "--";

        const statusText = discord.status || "unknown";
        statusLabel.textContent = statusText.toUpperCase();

        if (updatedLabel && data.timestamp) {
            const date = new Date(data.timestamp);
            updatedLabel.textContent = "Last updated: " + date.toLocaleString();
        }

        statusNote.textContent = discord.message || "Discord connection OK";

    } catch (err) {
        console.error("Discord stats error:", err);

        statusLabel.textContent   = "ERROR";
        guildLabel.textContent    = "ShotDevs Discord";
        membersLabel.textContent  = "--";
        channelsLabel.textContent = "--";
        updatedLabel.textContent  = "Last updated: --";
        statusNote.textContent    = "Could not load Discord stats right now.";
    }
}

// Run once and then every 30s
document.addEventListener("DOMContentLoaded", () => {
    loadDiscordStats();
    setInterval(loadDiscordStats, 30000);
});
