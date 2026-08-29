# 01 - PROJECT OVERVIEW & ARCHITECTURAL SPECS

## 1. Project Goal
Build a web-based, solo-player dungeon crawler application featuring a fixed party of 4 characters. The application uses the mechanics of "One Page Solo Engine" (OPSE) executed by a deterministic code engine, while leveraging an LLM (as a Game Master) strictly for narrative dressing, atmosphere, and contextual choices.

## 2. Core Architectural Principles
- **Deterministic Rules Engine:** The web client/code handles all dice rolls, card draws, tables lookup (OPSE), party HP/status tracking, and room progression. The LLM NEVER rolls virtual dice or decides mechanical damage on its own.
- **Stateless LLM with Structured Payload:** Every request to the LLM passes a tightly scoped JSON payload (Current Room, Party State, OPSE Resolution Result, Player Input). The LLM responds with structured JSON containing narrative prose and suggested action prompts.
- **Fixed Dungeon Scope:** A single dungeon run consists of 5 to 7 sequential rooms (Entry -> Encounters/Hazards -> Mini-Boss/Puzzle -> Final Boss/Objective) ensuring a 20-30 minute session.

## 3. Mandatory Tech Stack & Tooling

To ensure consistency, modularity, and zero boilerplate drift, the project MUST use the following stack:

* **Frontend Framework:** React 18+ with Vite (TypeScript)
* **Styling & UI:** Tailwind CSS (with Lucide React for icons)
* **State Management:** Zustand (lightweight, predictable, single-store with `persist` middleware for LocalStorage)
* **RNG / OPSE Core:** Standalone TypeScript pure functions (zero React dependency for deterministic testing)
* **API & LLM Client:** Direct modular API service layer (supporting Anthropic Claude / OpenAI / Gemini client SDKs or standard `fetch` with configurable endpoint and API key)
* **Persistence:** Browser `localStorage` (state autosave on every room change or action resolution)
* **Build / Dev Environment:** Node.js (v20+), npm / pnpm