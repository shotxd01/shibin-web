// projects/script.js

const API_URL = "https://shotdevs.live/api/v1/status/all";

async function loadDiscordStats() {
    // Select elements
    const guildLabel    = document.getElementById("guildName");
    const membersLabel  = document.getElementById("members");
    const channelsLabel = document.getElementById("channels");
    const statusLabel   = document.getElementById("status");
    const updatedLabel  = document.getElementById("lastUpdated");
    const statusNote    = document.getElementById("statusNote");

    // Helper to safely set text if element exists
    const setText = (element, text) => {
        if (element) element.textContent = text;
    };

    // If the main label is missing, we assume the widget isn't on this page
    if (!guildLabel) return;

    try {
        setText(statusNote, "Fetching latest stats…");

        const res = await fetch(API_URL, {
            method: "GET",
            cache: "no-cache", // Ensures we don't get stale data
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        
        // Debugging: View the actual API response in Console
        console.log("API Response:", data); 

        // Extract Data
        const discord = data?.services?.discord;
        const guild   = discord?.guild_info;

        if (!discord || !guild) {
            throw new Error("Discord data missing in API response");
        }

        // Update DOM safely
        setText(guildLabel, guild.name || "Unknown");
        setText(membersLabel, guild.member_count ?? "--");
        setText(channelsLabel, guild.channel_count ?? "--");

        const statusText = discord.status || "unknown";
        setText(statusLabel, statusText.toUpperCase());

        if (data.timestamp) {
            const date = new Date(data.timestamp);
            setText(updatedLabel, "Last updated: " + date.toLocaleString());
        }

        setText(statusNote, discord.message || "Discord connection OK");

    } catch (err) {
        console.error("Discord stats error:", err);

        // Fallback UI
        setText(statusLabel, "ERROR");
        setText(guildLabel, "ShotDevs Discord"); // Or keep previous text
        setText(membersLabel, "--");
        setText(channelsLabel, "--");
        setText(updatedLabel, "Last updated: --");
        setText(statusNote, "Could not load Discord stats.");
    }
}

// Run once and then every 30s
document.addEventListener("DOMContentLoaded", () => {
    loadDiscordStats();
    setInterval(loadDiscordStats, 30000);
});
