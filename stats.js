const API_URL = "http://localhost:3000/api/discord/stats"; 
// 👉 Change this to your domain when hosted
// Example: https://shotdevs.live/api/discord/stats

async function loadStats() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("API response failed");
    }

    const data = await response.json();

    document.getElementById("members").textContent = data.members ?? "---";
    document.getElementById("online").textContent = data.online ?? "---";
    document.getElementById("channels").textContent = data.channels ?? "---";
    document.getElementById("boosts").textContent = data.boosts ?? "---";

    console.log("✅ Stats refreshed:", data);

  } catch (error) {
    console.error("❌ Failed to load Discord stats:", error);

    // Fallback display if API fails
    document.getElementById("members").textContent = "---";
    document.getElementById("online").textContent = "---";
    document.getElementById("channels").textContent = "---";
    document.getElementById("boosts").textContent = "---";
  }
}

// Initial load
loadStats();

// Auto refresh every 30 seconds
setInterval(loadStats, 30000);
