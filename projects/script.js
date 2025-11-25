// --- CONFIGURATION ---
const CUSTOM_API_URL = "https://shotdevs.live/api/v1/status/all";
const WIDGET_API_URL = "https://discord.com/api/guilds/1105742461566988328/widget.json";

// 🔴 PASTE YOUR API KEY HERE 🔴
const API_KEY = "https://shotdevs.live/api/v1/status/all"; 

async function loadDiscordStats() {
  // UI Elements
  const headerText   = document.getElementById("discord-header-text");
  const membersEl    = document.getElementById("members-count");
  const onlineEl     = document.getElementById("online-count");
  const channelsEl   = document.getElementById("channels-count");
  const statusEl     = document.getElementById("status-text");
  const lastUpdated  = document.getElementById("last-updated");
  const statusMsgEl  = document.getElementById("status-message");

  try {
    statusMsgEl.textContent = "Fetching live data...";

    // --- 1. FETCH CUSTOM API ---
    const customRes = await fetch(CUSTOM_API_URL, { 
      cache: "no-cache",
      headers: { "Authorization": API_KEY, "Content-Type": "application/json" }
    });

    if (!customRes.ok) throw new Error(`API Error: ${customRes.status}`);
    const data = await customRes.json();
    
    // --- 2. UPDATE DISCORD STATS ---
    const discord = data?.services?.discord;
    const guild = discord?.guild_info;

    headerText.textContent = guild?.name || "SHOT DEVS";
    membersEl.textContent  = guild?.member_count ?? "--";
    channelsEl.textContent = guild?.channel_count ?? "--";

    const rawStatus = discord?.status || "unknown";
    statusEl.textContent = rawStatus === "operational" ? "Operational" : "Issues";
    statusEl.style.color = rawStatus === "operational" ? "#00ff88" : "#ff4d6d";

    // --- 3. FETCH WIDGET (For Online Count) ---
    try {
        const widgetRes = await fetch(WIDGET_API_URL);
        if (widgetRes.ok) {
            const widgetData = await widgetRes.json();
            onlineEl.textContent = widgetData.presence_count;
        }
    } catch (e) {
        console.warn("Widget fetch failed", e);
    }

    // --- 4. FINISH ---
    const dt = new Date();
    lastUpdated.textContent = "Last updated: " + dt.toLocaleTimeString();

    statusMsgEl.textContent = "System Operational • Live Data";
    statusMsgEl.style.color = "#999"; 
    headerText.classList.remove("error");

  } catch (err) {
    console.error(err);
    headerText.textContent  = "Offline";
    headerText.classList.add("error");
    statusMsgEl.innerHTML = `<span style="color: #ff4d6d;">⚠️ ${err.message}</span>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDiscordStats();
  setInterval(loadDiscordStats, 30000);
});
