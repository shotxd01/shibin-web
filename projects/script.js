// Configuration
const API_URL = "https://shotdevs.live/api/v1/status/all";

// 🔴 PASTE YOUR KEY INSIDE THE QUOTES BELOW 🔴
const API_KEY = "https://shotdevs.live/api/v1/status/all"; 

async function loadDiscordStats() {
  const headerText   = document.getElementById("discord-header-text");
  const membersEl    = document.getElementById("members-count");
  const channelsEl   = document.getElementById("channels-count");
  const statusEl     = document.getElementById("status-text");
  const lastUpdated  = document.getElementById("last-updated");
  const statusMsgEl  = document.getElementById("status-message");

  try {
    // 1. Set Loading State
    statusMsgEl.textContent = "Fetching data from ShotDevs API...";
    
    // 2. Fetch Data
    const res = await fetch(API_URL, { 
      cache: "no-cache",
      headers: {
         "Authorization": API_KEY,
         "Content-Type": "application/json"
      }
    });

    // 3. Handle HTTP Errors (401, 403, 500)
    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    // 4. Validate Data Structure
    if (!data.services || !data.services.discord) {
        throw new Error("Invalid Data: 'services.discord' missing.");
    }

    const discord = data.services.discord;
    const guild   = discord.guild_info;

    // 5. Update UI
    headerText.textContent = guild?.name || "SHOT DEVS";
    membersEl.textContent  = guild?.member_count ?? "--";
    channelsEl.textContent = guild?.channel_count ?? "--";

    // Set Status Color
    const rawStatus = discord.status || "unknown";
    statusEl.textContent = rawStatus === "operational" ? "Operational" : rawStatus;
    statusEl.style.color = rawStatus === "operational" ? "#00ff88" : "#ff4d6d";

    // Update Timestamp
    if (data.timestamp) {
      const dt = new Date(data.timestamp);
      lastUpdated.textContent = "Last updated: " + dt.toLocaleTimeString();
    }

    statusMsgEl.textContent = discord.message || "Connected successfully.";
    statusMsgEl.style.color = "#999"; 

    // Remove any error classes if they exist
    headerText.classList.remove("error");

  } catch (err) {
    // 6. Mobile Debugging (Show error on screen)
    console.error(err);
    
    headerText.textContent  = "Error";
    headerText.classList.add("error");
    
    // Display the specific error message on the page so you can read it
    statusMsgEl.innerHTML = `<span style="color: #ff4d6d; font-weight: bold;">⚠️ ${err.message}</span>`;
    
    // Hint for CORS errors
    if (err.message.includes("Failed to fetch")) {
         statusMsgEl.innerHTML += `<br><span style="font-size: 0.8rem;">(Likely CORS blocked. Check API settings.)</span>`;
    }
  }
}

// Run on load and refresh every 60 seconds
document.addEventListener("DOMContentLoaded", () => {
  loadDiscordStats();
  setInterval(loadDiscordStats, 60000);
});
