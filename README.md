# ⚔️ Solo Dungeon Crawler (OPSE + AI GM)

A lightweight, web-based solo dungeon crawler featuring a fixed 4-character party, driven by the deterministic mechanics of **One Page Solo Engine (OPSE)** and narrated in real-time by an **AI Game Master**.

---

## 🎥 Demo

https://github.com/user-attachments/assets/0c9908c5-4b03-4b00-8bb0-714a11293771

*If the video above doesn't play, [click here to view it directly](./Demo-ITA.mp4).*

---

## ✨ Features

- **Solo Party Play:** Control a balanced party of 4 adventurers (Warrior, Rogue, Mage, Cleric) through procedural dungeon runs in 20–30 minute sessions.
- **Deterministic OPSE Core:** All room generation, oracle inquiries (Yes/No), action outcomes (*Strong Hit*, *Weak Hit*, *Miss*), and pacing moves are computed client-side with zero AI hallucinations on rules.
- **AI-Powered Dungeon Master:** Leveraging Large Language Models strictly for dynamic storytelling, room atmosphere, and context-aware tactical choices.
- **Multi-Provider & BYOK Support:** Play using your own API key with **Google Gemini**, **OpenRouter** (including free community models), **Anthropic Claude**, **OpenAI**, local **Ollama** endpoints, or fully in-browser with **WebLLM**.
- **Privacy-First & Zero Backend Cost:** Static single-page application (SPA) with no centralized database. All keys and game states are saved locally in your browser's `localStorage`.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite (TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons
- **State Management:** Zustand (with local persistence)
- **Rules Engine:** Standalone One Page Solo Engine (OPSE) TypeScript logic
- **AI Integration:** Client-side modular LLM adapter layer

---

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone [https://github.com/your-username/solo-dungeon-crawler.git](https://github.com/your-username/solo-dungeon-crawler.git)
cd solo-dungeon-crawler
```

2. Install dependencies:
```Bash
npm install
```

3. Start the local development server:
```Bash
npm run dev
```

4. Open your browser, head to the settings modal, select your preferred AI provider, and start your expedition!

---

## 📜 Credits & Attributions

- **Game Mechanics & Oracle Tables:** Based on **[One Page Solo Engine](https://inflatablestudios.itch.io/one-page-solo-engine)** by **Inflatable Studios**, licensed under [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- **Application Code:** Licensed under the [MIT License](LICENSE).
