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
  element.classList.remove('long-quote');
  let i = 0;
  
  if (typingInterval) clearInterval(typingInterval);

  typingInterval = setInterval(() => {
    element.innerText += text[i];
    i++;
    
    if (i >= text.length) {
      clearInterval(typingInterval);
      // Check if quote needs scrolling after typing completes
      if (text.length > 120) {
        element.classList.add('long-quote');
      }
    }
  }, 15); // Slightly faster typing
}

function copyQuote() {
  const quoteEl = document.getElementById("quote");
  const text = quoteEl.innerText;
  
  // Prevent copying loading text or error state
  if (!text || text === "Loading..." || text.includes("Failed to load") || text === "") return;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Quote copied to clipboard! 📋");
    
    // Button visual feedback
    const buttons = document.querySelectorAll('.buttons button');
    if (buttons.length > 1) {
      const copyBtn = buttons[1];
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      
      setTimeout(() => { 
        copyBtn.classList.remove('copied');
        copyBtn.innerText = "Copy";
      }, 2000);
    }
  }).catch(err => {
    console.error('Copy failed:', err);
    showToast("Failed to copy 😢");
  });
}

// Toast notification function
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// Load first quote on page load
document.addEventListener('DOMContentLoaded', () => {
  getQuote();
});