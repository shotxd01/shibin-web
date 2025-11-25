// --- CONFIGURATION ---
const CUSTOM_API_URL = "https://shotdevs.live/api/v1/status/all";
const WIDGET_API_URL = "https://discord.com/api/guilds/1105742461566988328/widget.json";

// 🔴 PASTE YOUR API KEY HERE 🔴
const API_KEY = "YOUR_API_KEY_HERE"; 

async function loadDiscordStats() {
  const headerText   = document.getElementById("discord-header-text");
  const membersEl    = document.getElementById("members-count");
  const onlineEl     = document.getElementById("online-count"); // New Element
  const channelsEl   = document.getElementById("channels-count");
  const statusEl     = document.getElementById("status-text");
  const lastUpdated  = document.getElementById("last-updated");
  const statusMsgEl  = document.getElementById("status-message");

  try {
    statusMsgEl.textContent = "Fetching live data...";

    // --- FETCH 1: Your Custom Backend (For Total Members & Status) ---
    const customRes = await fetch(CUSTOM_API_URL, { 
      cache: "no-cache",
      headers: { "Authorization": API_KEY, "Content-Type": "application/json" }
    });

    if (!customRes.ok) throw new Error(`API Error: ${customRes.status}`);
    const customData = await customRes.json();
    const discord = customData?.services?.discord;
    const guild = discord?.guild_info;

    // --- FETCH 2: Discord Public Widget (For Online Count) ---
    // We use a separate try/catch so if widget fails, the rest still works
    let onlineCount = "--";
    try {
        const widgetRes = await fetch(WIDGET_API_URL);
        if (widgetRes.ok) {
            const widgetData = await widgetRes.json();
            onlineCount = widgetData.presence_count; // This is the "Online" number
        }
    } catch (e) {
        console.warn("Widget fetch failed", e);
    }

    // --- UPDATE UI ---
    
    // 1. Server Name
    headerText.textContent = guild?.name || "SHOT DEVS";

    // 2. Counts
    membersEl.textContent  = guild?.member_count ?? "--";
    channelsEl.textContent = guild?.channel_count ?? "--";
    onlineEl.textContent   = onlineCount; // Set the new online count

    // 3. Status
    const rawStatus = discord?.status || "unknown";
    statusEl.textContent = rawStatus === "operational" ? "Operational" : rawStatus;
    statusEl.style.color = rawStatus === "operational" ? "#00ff88" : "#ff4d6d";

    // 4. Time
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
  setInterval(loadDiscordStats, 30000); // Update every 30 seconds
});
