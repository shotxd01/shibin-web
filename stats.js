const API_URL = "PASTE_YOUR_API_URL_HERE"; // example: https://api.shotdevs.live/stats

async function loadStats() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API Error");

    const data = await response.json();

    document.getElementById("members").textContent  = data.members ?? "---";
    document.getElementById("online").textContent   = data.online ?? "---";
    document.getElementById("channels").textContent = data.channels ?? "---";
    document.getElementById("boosts").textContent   = data.boosts ?? "---";

  } catch (error) {
    console.error("Stats load failed:", error);
  }
}

loadStats();
setInterval(loadStats, 30000);
