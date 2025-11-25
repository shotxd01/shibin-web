// projects/script.js

const API_URL = "https://shotdevs.live/api/v1/status/all";

async function loadDiscordStats() {
    // 1. Select all HTML elements
    const guildLabel    = document.getElementById("guildName");
    const membersLabel  = document.getElementById("members");
    const channelsLabel = document.getElementById("channels");
    const statusLabel   = document.getElementById("status");
    const updatedLabel  = document.getElementById("lastUpdated");
    const statusNote    = document.getElementById("statusNote");

    // 2. Helper to safely update text (prevents crashes if ID is wrong)
    const setText = (element, text) => {
        if (element) element.textContent = text;
    };

    // If we can't find the main element, stop (widget not on this page)
    if (!guildLabel) return;

    try {
        setText(statusNote, "Fetching data...");

        // 3. Fetch from API
        const res = await fetch(API_URL, {
            method: "GET",
            // 'cors' mode is default, but ensuring the server allows it is key
            mode: 'cors', 
            cache: "no-cache"
        });

        if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
        }

        const data = await res.json();
        
        // --- DEBUGGING ---
        // Open your browser Console (F12) to see this data structure
        console.log("API Response Success:", data); 

        // 4. Validate Data Structure
        // We look for data.services.discord.guild_info based on your structure
        const discord = data?.services?.discord;
        const guild   = discord?.guild_info;

        if (!discord || !guild) {
            throw new Error("JSON is valid, but 'discord' data is missing.");
        }

        // 5. Update HTML
        setText(guildLabel, guild.name || "Unknown Server");
        setText(membersLabel, guild.member_count ?? "0");
        setText(channelsLabel, guild.channel_count ?? "0");

        // Handle status text
        const statusText = discord.status || "Unknown";
        setText(statusLabel, statusText.toUpperCase());

        // Handle status color (Optional visual flare)
        if (statusLabel) {
            statusLabel.style.color = (statusText === 'online') ? '#00ff88' : '#ffaa00';
        }

        // Handle timestamp
        if (data.timestamp) {
            const date = new Date(data.timestamp);
            setText(updatedLabel, "Last updated: " + date.toLocaleTimeString());
        }

        setText(statusNote, discord.message || "System Operational");

    } catch (err) {
        // --- ERROR HANDLING ---
        console.error("Fetch Failed:", err);

        setText(statusLabel, "OFFLINE");
        setText(guildLabel, "Connection Failed");
        setText(membersLabel, "--");
        setText(channelsLabel, "--");
        
        // Show the specific error in the note so you know WHY it failed
        setText(statusNote, `Error: ${err.message}`);
    }
}

// Run on load, then refresh every 30 seconds
document.addEventListener("DOMContentLoaded", () => {
    loadDiscordStats();
    setInterval(loadDiscordStats, 30000);
});
