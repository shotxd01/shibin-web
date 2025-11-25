async function loadStats() {
  try {
    const res = await fetch('/api/discord/stats');
    const data = await res.json();

    document.getElementById('totalMembers').textContent = data.members;
    document.getElementById('onlineMembers').textContent = data.online;
    document.getElementById('totalChannels').textContent = data.channels;
    document.getElementById('boostLevel').textContent = data.boosts;

  } catch (err) {
    console.error("Stats API error:", err);
  }
}

// Initial load
loadStats();

// Auto refresh every 30 seconds
setInterval(loadStats, 30000);
