async function getQuote() {
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");

quoteEl.innerText = "Loading...";
authorEl.innerText = "";

try {
const res = await fetch("https://type.fit/api/quotes");
const data = await res.json();

const random = data[Math.floor(Math.random() * data.length)];

typeEffect(`"${random.text}"`, quoteEl);
authorEl.innerText = `- ${random.author || "Unknown"}`;

} catch (err) {
quoteEl.innerText = "Failed to load quote 😢";
}
}

function typeEffect(text, element) {
element.innerText = "";
let i = 0;

const interval = setInterval(() => {
element.innerText += text[i];
i++;
if (i >= text.length) clearInterval(interval);
}, 20);
}

function copyQuote() {
const text = document.getElementById("quote").innerText;
navigator.clipboard.writeText(text);
alert("Copied!");
}