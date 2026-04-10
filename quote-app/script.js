let apiQuotes = [];
let typingInterval;

async function getQuote() {
  const quoteEl = document.getElementById("quote");
  const authorEl = document.getElementById("author");

  // Clear previous typing effect to prevent text overlapping glitches
  if (typingInterval) clearInterval(typingInterval);

  // Improve loading behavior: Clear previous and show Loading...
  quoteEl.innerText = "Loading...";
  authorEl.innerText = "";

  try {
    // Only fetch once and cache the full array for performance
    if (apiQuotes.length === 0) {
      // Primary API defined in requirements
      const primaryUrl = "https://type.fit/api/quotes";
      // Reliable backup mirror if the primary fails due to CORS or downtime
      const backupUrl = "https://jacintodesign.github.io/quotes-api/data/quotes.json";

      let res;
      try {
        res = await fetch(primaryUrl);
        if (!res.ok) throw new Error("Primary API unavailable");
      } catch (err) {
        // Fallback to bypass CORS issues on local or GitHub Pages
        console.warn("Primary API failed, switching to backup...", err);
        res = await fetch(backupUrl);
      }

      apiQuotes = await res.json();
    }

    // Select a random quote from the full array
    const random = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    
    // Clean up author text (some responses have ", type.fit" attached)
    let author = random.author;
    if (!author || author === 'type.fit') author = "Unknown";
    author = author.replace(', type.fit', '');

    // Execute the existing typing effect
    typeEffect(`"${random.text}"`, quoteEl);
    authorEl.innerText = `- ${author}`;

  } catch (err) {
    // Proper error handling: friendly fallback message
    quoteEl.innerText = "Failed to load quote. Please check connection! 😢";
    authorEl.innerText = "";
    console.error("Quote fetch error:", err);
  }
}

function typeEffect(text, element) {
  element.innerText = "";
  let i = 0;
  
  if (typingInterval) clearInterval(typingInterval);

  typingInterval = setInterval(() => {
    element.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(typingInterval);
  }, 20); // Faster smooth typing
}

function copyQuote() {
  const text = document.getElementById("quote").innerText;
  
  // Prevent copying loading text or error state
  if (!text || text === "Loading..." || text.includes("Failed to load")) return;

  navigator.clipboard.writeText(text);
  
  // Visual feedback without blocking page
  const buttons = document.querySelectorAll('.buttons button');
  if (buttons.length > 1) {
    const copyBtn = buttons[1];
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "Copied!";
    setTimeout(() => { copyBtn.innerText = originalText; }, 1500);
  } else {
    alert("Copied!");
  }
}