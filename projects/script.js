// --- CONFIGURATION ---
// ⚠️ CHECK THIS URL CAREFULLY! 
// In your screenshot, it looked like ".../api/v1/status/all" or maybe ".../api/v1/stats"
// If this doesn't work, try changing "status/all" to "stats"
const CUSTOM_API_URL = "https://shotdevs.live/api/v1/status/all";
const WIDGET_API_URL = "https://discord.com/api/guilds/1105742461566988328/widget.json";

async function loadDiscordStats() {
  const headerText   = document.getElementById("discord-header-text");
  const membersEl    = document.getElementById("members-count");
  const onlineEl     = document.getElementById("online-count");
  const channelsEl   = document.getElementById("channels-count");
  const statusEl     = document.getElementById("status-text");
  const statusMsgEl  = document.getElementById("status-message");

  try {
    statusMsgEl.innerHTML = "Fetching...";

    // --- 1. FETCH CUSTOM API (NO KEY) ---
    // We removed the 'headers' part because your API seems to be public
    const customRes = await fetch(CUSTOM_API_URL, { 
      cache: "no-cache" 
    });

    if (!customRes.ok) {
        throw new Error(`API Error: ${customRes.status}`);
    }

    const data = await customRes.json();
    
    // --- 2. UPDATE DISCORD STATS ---
    const discord = data?.services?.discord;
    const guild = discord?.guild_info;

    if (!guild) throw new Error("Data received, but 'guild_info' is missing.");

    headerText.textContent = guild.name || "SHOT DEVS";
    membersEl.textContent  = guild.member_count ?? "--";
    channelsEl.textContent = guild.channel_count ?? "--";

    const rawStatus = discord.status || "unknown";
    statusEl.textContent = rawStatus === "operational" ? "Operational" : "Issues";
    statusEl.style.color = rawStatus === "operational" ? "#00ff88" : "#ff4d6d";

    // --- 3. FETCH WIDGET ---
    try {
        const widgetRes = await fetch(WIDGET_API_URL);
        if (widgetRes.ok) {
            const widgetData = await widgetRes.json();
            onlineEl.textContent = widgetData.presence_count;
        }
    } catch (e) { console.warn(e); }

    statusMsgEl.textContent = "System Operational • Live Data";
    statusMsgEl.style.color = "#999"; 
    headerText.classList.remove("error");

  } catch (err) {
    console.error(err);
    headerText.textContent  = "Error";
    headerText.classList.add("error");
    
    // Print error to screen
    statusMsgEl.innerHTML = `<span style="color: #ff4d6d;">⚠️ ${err.message}</span>`;
    
    if (err.message.includes("Failed to fetch")) {
        statusMsgEl.innerHTML += `<br><span style="font-size:0.8rem">(CORS Error. Add the CORS code to backend!)</span>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDiscordStats();
});
