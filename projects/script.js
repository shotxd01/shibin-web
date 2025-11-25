// projects/script.js

const API_URL = "https://shotdevs.live/api/v1/stat";

async function loadDiscordStats() {
    const statusLabel   = document.getElementById("discord-status");
    const guildLabel    = document.getElementById("discord-guild");
    const membersLabel  = document.getElementById("discord-members");
    const channelsLabel = document.getElementById("discord-channels");
    const updatedLabel  = document.getElementById("last-updated");
    const overallBadge  = document.getElementById("overall-status");

    // Safety: if page IDs don’t exist, just stop
    if (!statusLabel) return;

    try {
        statusLabel.textContent = "Loading…";

        const res = await fetch(API_URL, {
            method: "GET",
            cache: "no-cache",
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        // ----- pull ONLY discord info -----
        const discord = data?.services?.discord;
        const guild   = discord?.guild_info;

        if (!discord || !guild) {
            throw new Error("Discord data missing in API response");
        }

        // Status text
        statusLabel.textContent = discord.status === "operational"
            ? "Operational"
            : discord.status.charAt(0).toUpperCase() + discord.status.slice(1);

        // Badge at the top (optional – if you added that element)
        if (overallBadge) {
            overallBadge.textContent = statusLabel.textContent;
            overallBadge.classList.remove("badge-error", "badge-ok");

            if (discord.status === "operational") {
                overallBadge.classList.add("badge-ok");
            } else {
                overallBadge.classList.add("badge-error");
            }
        }

        // Guild name / members / channels
        if (guildLabel)    guildLabel.textContent    = guild.name || "Unknown";
        if (membersLabel)  membersLabel.textContent  = guild.member_count ?? "--";
        if (channelsLabel) channelsLabel.textContent = guild.channel_count ?? "--";

        // Last updated
        if (updatedLabel && data.timestamp) {
            const date = new Date(data.timestamp);
            updatedLabel.textContent = date.toLocaleString();
        }
    } catch (err) {
        console.error("Discord stats error:", err);

        // Friendly message for users
        if (statusLabel) {
            statusLabel.textContent = "Could not load Discord stats right now.";
        }
        if (guildLabel)    guildLabel.textContent    = "--";
        if (membersLabel)  membersLabel.textContent  = "--";
        if (channelsLabel) channelsLabel.textContent = "--";
        if (updatedLabel)  updatedLabel.textContent  = "--";
    }
}

// Run once and then every 30s
document.addEventListener("DOMContentLoaded", () => {
    loadDiscordStats();
    setInterval(loadDiscordStats, 30000);
});
