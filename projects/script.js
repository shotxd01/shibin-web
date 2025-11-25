// --- CONFIGURATION ---
const CUSTOM_API_URL = "https://shotdevs.live/api/v1/status/all";
const WIDGET_API_URL = "https://discord.com/api/guilds/1105742461566988328/widget.json";

// 🔴 PASTE YOUR API KEY HERE 🔴
const API_KEY = "YOUR_API_KEY_HERE"; 

async function loadDiscordStats() {
  // UI Elements
  const headerText   = document.getElementById("discord-header-text");
  const membersEl    = document.getElementById("members-count");
  const onlineEl     = document.getElementById("online-count");
  const channelsEl   = document.getElementById("channels-count");
  const statusEl     = document.getElementById("status-text");
  const serverIcon   = document.getElementById("server-icon"); // Icon Image
  const lastUpdated  = document.getElementById("last-updated");
  const statusMsgEl  = document.getElementById("status-message");

  // System Health Dots
  const dbDot        = document.getElementById("db-indicator");
  const mcDot        = document.getElementById("mc-indicator");
  const mediaDot     = document.getElementById("media-indicator");

  try {
    statusMsgEl.textContent = "Fetching live data...";

    // --- 1. FETCH CUSTOM API ---
    const customRes = await fetch(CUSTOM_API_URL, { 
      cache: "no-cache",
      headers: { "Authorization": API_KEY, "Content-Type": "application/json" }
    });

    if (!customRes.ok) throw new Error(`API Error: ${customRes.status}`);
    const data = await customRes.json();
    
    // --- 2. UPDATE SYSTEM HEALTH ---
    // Helper function to set color based on status string
    const setStatus = (element, status) => {
        element.className = "status-dot"; // Reset
        if(status === "operational" || status === "connected") element.classList.add("operational");
        else if(status === "error" || status === "offline") element.classList.add("error");
        else element.classList.add("degraded");
    };

    // Check services from your JSON
    setStatus(dbDot, data.services?.database?.status || "error");
    setStatus(mcDot, data.services?.minecraft?.status || "error");
    setStatus(mediaDot, data.services?.cloudinary?.status || "error");

    // --- 3. UPDATE DISCORD STATS ---
    const discord = data?.services?.discord;
    const guild = discord?.guild_info;

    headerText.textContent = guild?.name || "SHOT DEVS";
    membersEl.textContent  = guild?.member_count ?? "--";
    channelsEl.textContent = guild?.channel_count ?? "--";

    const rawStatus = discord?.status || "unknown";
    statusEl.textContent = rawStatus === "operational" ? "Operational" : "Issues";
    statusEl.style.color = rawStatus === "operational" ? "#00ff88" : "#ff4d6d";

    // --- 4. FETCH WIDGET (For Online Count & Icon) ---
    try {
        const widgetRes = await fetch(WIDGET_API_URL);
        if (widgetRes.ok) {
            const widgetData = await widgetRes.json();
            
            // Set Online Count
            onlineEl.textContent = widgetData.presence_count;
            
            // Set Dynamic Icon (If available in widget)
            // Note: Widget API doesn't always give the icon URL directly, 
            // but we can construct it if we have the ID, or use your hardcoded fallback.
            // For now, let's keep your hardcoded image if widget doesn't verify.
        }
    } catch (e) {
        console.warn("Widget fetch failed", e);
    }

    // --- 5. FINISH ---
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
