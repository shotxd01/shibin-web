# ⚡ Shibinsoju Portfolio & Live Dashboard

![Project Status](https://img.shields.io/badge/Status-Live-00ff88?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML_CSS_JS-blue?style=for-the-badge)
![ShotDevs](https://img.shields.io/badge/Powered_By-ShotDevs_API-ff007f?style=for-the-badge)

Welcome to my personal developer portfolio. This site showcases my work as the **Founder of ShotDevs**, my Discord bots, and my community roles. 

It features a custom **Real-time Server Stats Dashboard** that connects to my backend API to display live community data.

## 🔗 Live Demo
**[Visit Portfolio](https://shibin.shotdevs.live)**

---

## ✨ Key Features

### 🎨 Core Portfolio
* **Modern UI/UX:** Dark theme with "ShotDevs" Pink & Cyan neon accents.
* **📱 Fully Responsive:** Optimized for Mobile, Tablet, and Desktop.
* **🔄 Infinite Tech Scroll:** Smooth animation showcasing my skills (Node.js, MongoDB, etc.).
* **🤖 Discord Integration:** "Copy Username" functionality and status widget.

### 📡 New: Live Stats Dashboard (`projects.html`)
A custom-built dashboard that fetches real-time data from the **ShotDevs API** and Discord Widget.
* **Live Member Count:** Fetches total members from my private API.
* **Online Presence:** Fetches online user count from Discord's widget.
* **API Health Check:** Displays "Operational" or "Issues" based on backend status codes.
* **Auto-Refresh:** Data updates automatically every 30 seconds without reloading.

---

## 🛠️ Tech Stack

| Technology | Usage |
| :--- | :--- |
| **HTML5** | Semantic structure for Portfolio and Dashboard |
| **CSS3** | Neon glow effects, animations, Grid/Flexbox |
| **JavaScript (ES6+)** | `Fetch API` for backend communication, DOM manipulation |
| **ShotDevs API** | Custom Node.js backend providing server stats |
| **Font Awesome** | Icons for UI elements |

---

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/shibinsoju/shibin-web.git](https://github.com/shibinsoju/shibin-web.git)
    ```
2.  **Navigate to the folder:**
    ```bash
    cd shibin-web
    ```
3.  **Open in Browser:**
    * Double-click `index.html` to see the **Main Portfolio**.
    * Double-click `projects.html` to see the **Live Stats Dashboard**.

> **Note:** For the API to work locally, the backend must allow CORS from `localhost` or `null` (file system). If you see a CORS error locally, it is a security feature, not a bug. It works perfectly on the live domain.

---

## 📂 Project Structure

```text
shibin-web/
├── 📄 index.html      # Main Portfolio Page
├── 📄 projects.html   # Live Stats Dashboard (API Integration)
├── 📄 style.css       # Global Styles and Animations
├── 📄 script.js       # Main site logic (Mobile menu, etc.)
└── 📄 README.md       # Documentation
```
## 👨‍💻 Author
**Shibin Hussain MK (Shibinsoju)**
 * 👑 Founder: ShotDevs
 * 💬 Discord: shibinsoju
 * 📸 Instagram: @shibn_hussn
⭐ Support
If you like this portfolio, please give this repository a Star! 🌟

## 💡 Why this is better:
1.  **Highlights the API:** I added a specific section for the "Live Stats Dashboard" because fetching data from a custom backend is a **senior-level skill** that recruiters/clients look for.
2.  **Updated Structure:** It correctly lists `projects.html` in the root folder instead of the `project/` folder we deleted.
3.  **CORS Note:** I added a small note about CORS so people (or you) don't get confused if the API doesn't load when opening the file directly from a hard drive.
