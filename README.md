<div align="center">

# ⚡ FocusForge
### *Build Discipline. Earn Your Focus.*

An aesthetic, high-performance Pomodoro sanctuary engineered for deep flow state, featuring a verifiable **30-Day Challenge Engine**, **LeetCode-style achievement tiers**, **continuous Spotify streaming**, and a **14-track ambient mixer**.

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spotify Embed](https://img.shields.io/badge/Spotify-Official_Embed-1DB954?style=for-the-badge&logo=spotify&logoColor=white)](https://developer.spotify.com/)
[![Unit Tests](https://img.shields.io/badge/Tests-21%2F21_Passing-43D9A3?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License MIT](https://img.shields.io/badge/License-MIT-F5C26B?style=for-the-badge)](LICENSE)

[Live Application](https://ais-pre-obf6ytyfzwkkgi3aos7zey-314102039317.asia-southeast1.run.app) • [Architecture](#-system-architecture) • [Features](#-core-features) • [Installation](#-getting-started) • [Tests](#-testing--verification)

---

</div>

## 🌌 Overview

**FocusForge** is built for engineers, designers, researchers, and students who require uncompromising concentration. Unlike ordinary timers that rely on randomized placeholder numbers or fake streaks, FocusForge is driven by an **event-sourced verification engine**:

- **Real Calendar Gating:** A challenge day only advances when you log genuine completed focus time meeting your configurable daily goal (default: 60 minutes).
- **Decoupled Continuous Spotify Playback:** Music streams smoothly from Spotify's official embed without pausing or reloading when switching routes, resetting timers, or changing theme palettes.
- **Zero Pill / Anti-Slop Aesthetic:** Crafted with deep navy blues (`#0B1020`), neon turquoise accents (`#43E6C3`), subtle borders, responsive layout, and typographic hierarchy.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FocusForge Client Shell                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar & Global State                                                │
│  ├─ Theme Engine (Midnight Aurora, Warm Paper, Forest, Obsidian, etc.) │
│  ├─ Command Palette (Ctrl + K) & Global Keyboard Shortcuts             │
│  └─ Active Task Bus & Daily Goals Counter                              │
├──────────────────────────────────┬─────────────────────────────────────┤
│  Navigation & Workspaces         │  Decoupled Persistent Audio Root    │
│  ├─ Dashboard View               │  ┌───────────────────────────────┐  │
│  ├─ Precision Timer View         │  │    PersistentSpotifyHost      │  │
│  ├─ Task Manager View            │  │  ├─ Official Spotify Embed    │  │
│  ├─ 30-Day Challenge View        │  │  ├─ Floating Mini-Player      │  │
│  ├─ LeetCode Achievements View   │  │  ├─ Expand / Minimize Dock    │  │
│  ├─ Analytics & Stats View       │  │  └─ Favorites & Recents Sync  │  │
│  └─ Spotify Music Workspace      │  └───────────────────────────────┘  │
├──────────────────────────────────┴─────────────────────────────────────┤
│  Verification & Persistence Layer                                      │
│  ├─ Session Event Stream (Real start/end timestamps, genuine minutes)   │
│  ├─ 30-Day Calendar State Engine (Consecutive streak + cycle rollover)  │
│  ├─ LeetCode Achievement Evaluator (Pure functional evaluation)        │
│  └─ Multi-Layer Local Storage Sync                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

### 1. 🗓️ Real 30-Day Focus Challenge
- **Authentic Progression:** Starts genuinely at **Day 0 / 30** with 0% progress for new users.
- **Configurable Goal Threshold:** Counts a challenge day only when the user logs 60 completed focus minutes in a calendar day.
- **Strict Anti-Inflation:** Multiple sessions on the same calendar day accumulate toward lifetime statistics, but advance the challenge day counter only once.
- **Missed-Day Resilience:** Clearly separates **Consecutive-Day Streak** from **Total Challenge Days Completed**. A missed day resets streak without erasing your earned challenge days.
- **Month Rollover (Post-Day 30):** Completing all 30 days triggers the "FocusForge Champion" milestone, preserves lifetime statistics, and unlocks **Month 2: Master Discipline** with fresh challenge badges.

### 2. 🏆 LeetCode-Style Achievement Badges
Eight mathematically evaluated achievement tiers that persist across cycles:

| Badge | Title | Unlock Condition | Reward Tier |
|---|---|---|---|
| 🎯 | **First Focus** | Complete 1 genuine focus session | Bronze |
| 🚀 | **Getting Started** | 3 consecutive challenge days completed | Bronze |
| ⚔️ | **One-Week Warrior** | 7 consecutive challenge days completed | Silver |
| 🛡️ | **Two-Week Discipline** | 14 consecutive challenge days completed | Gold |
| 👑 | **FocusForge Champion** | Complete all 30 challenge days in a cycle | Diamond |
| 🔮 | **Focus Master** | Complete 100 genuine focus sessions | Master |
| ⚡ | **Deep Work Legend** | Complete 1,000 verified focus minutes | Mythic |
| 🔥 | **Consistency Legend** | Maintain a 30-day consecutive streak | Legendary |

*Features celebratory unlock modal with confetti effects, audio chime, and optional mute toggle.*

### 3. 🎵 Spotify Music Integration (Zero Interruptions)
- **Supported Formats:** Paste any Spotify link:
  - Album (`https://open.spotify.com/album/{id}`)
  - Playlist (`https://open.spotify.com/playlist/{id}`)
  - Track (`https://open.spotify.com/track/{id}`)
  - Internationalized URLs (`https://open.spotify.com/intl-de/album/...`)
  - Spotify URIs (`spotify:album:{id}`)
- **Persistent Root Mount:** The Spotify embed is mounted in `PersistentSpotifyHost.tsx` at the app root. It **never unmounts** during route navigation, timer ticks, or theme switches.
- **Full Song Guidance:** In-app guide explaining how to log into Spotify inside the player or browser to unlock full playback (bypassing Spotify's 30-second preview policy for logged-out browsers).
- **Curated Focus Soundtracks:** 8 instant presets including *Lo-Fi Beats*, *Deep Focus*, *Peaceful Piano*, *Retro Synthwave*, *Brain Food*, *Instrumental Study*, *Ambient Chill*, and *Coffeehouse Jazz*.
- **Floating Mini-Player:** Minimizes into a compact floating pill or expands to a 352px full tracklist view.

### 4. ⏱️ Focus Block & Precision Pacing
- **Pacing Modes:**
  - `Classic 25/5`: 25 min focus, 5 min short break
  - `Deep Work 50/10`: 50 min high-velocity sprint, 10 min break
  - `Sprint 15/3`: 15 min quick burst for immediate momentum
  - `Marathon 90/20`: Ultradian rhythm deep-flow protocol
  - `Custom`: Set any minute duration from settings
- **Inline Compact Indicators:** Displays active streak (`🔥 12-day streak`), daily goal progress (`45 / 60m`), and challenge progress (`Day 12 / 30`) right on the card.

### 5. 🎧 14-Track High-Fidelity Ambient Soundboard
Synthesized real-time audio generator that runs alongside Spotify:
- 🌧️ Rain • ⚡ Thunder • 🌲 Forest Birds • 🌊 Ocean Waves • 🔥 Campfire • ☕ Cozy Café • 📻 White Noise • 💿 Vinyl Crackle • 🌙 Night Crickets • 🔔 Zen Singing Bowl • ⌨️ Mechanical Keys • 💨 Humming Fan • 💧 Mountain Stream • 🍃 Alpine Wind

### 6. 🎨 6 Handcrafted Theme Palettes
- **Midnight Aurora:** Deep sapphire navy (`#0B1020`) with neon turquoise accents (`#43E6C3`).
- **Warm Paper:** Tactile cream stationery (`#F7F4ED`) with olive ink (`#65866D`) for daylight study.
- **Forest Focus:** Evergreen canopy (`#101A16`) with lime moss (`#A3D977`).
- **Lavender Dream:** Twilight purple (`#161224`) with electric violet (`#B084FF`).
- **Obsidian:** Pure OLED pitch black (`#0A0A0A`) with icy cyan (`#00F2FE`).
- **Ember Sunset:** Smoldering mahogany (`#171114`) with solar amber (`#FFB45B`).

---

## 📂 Project Structure

```
focusforge/
├── src/
│   ├── components/
│   │   ├── views/
│   │   │   ├── MusicView.tsx               # Dedicated Spotify music workspace
│   │   │   ├── ChallengeView.tsx           # 30-day challenge calendar & cycle controls
│   │   │   ├── AchievementsView.tsx        # LeetCode-style badge collection
│   │   │   ├── TimerView.tsx               # Fullscreen precision focus timer
│   │   │   ├── TasksView.tsx               # Task manager with estimates
│   │   │   ├── StatsView.tsx               # Analytics, telemetry, velocity charts
│   │   │   ├── GoalsView.tsx               # Daily & weekly goal progress
│   │   │   └── PalettesView.tsx            # Theme gallery & custom accents
│   │   ├── PersistentSpotifyHost.tsx       # Decoupled root player (never unmounts)
│   │   ├── AtlasSidebar.tsx                # Responsive sidebar with Music navigation
│   │   ├── FocusBlock.tsx                  # Dashboard timer card with streak indicator
│   │   ├── ChallengeProgressCard.tsx       # 30-day calendar progress overview
│   │   ├── CommandPalette.tsx              # Quick action modal (Ctrl + K)
│   │   └── AchievementUnlockedModal.tsx    # Celebratory reward popup
│   ├── types/
│   │   ├── music.ts                        # Spotify types & item schemas
│   │   ├── challenge.ts                    # 30-day challenge state & milestones
│   │   ├── timer.ts                        # Session records & timer modes
│   │   └── atlas.ts                        # Navigation views & sound effects
│   ├── utils/
│   │   ├── spotify.ts                      # Safe link parser & curated collections
│   │   ├── challenge.ts                    # Verification math & streak calculators
│   │   ├── achievements.ts                 # LeetCode achievement evaluation logic
│   │   ├── storage.ts                      # Local storage persistence adapters
│   │   ├── proAudio.ts                     # Web Audio API ambient synthesizer
│   │   └── __tests__/
│   │       ├── spotify.test.ts             # 7 unit tests for Spotify parsing
│   │       ├── focusforge.test.ts          # 8 unit tests for challenge engine
│   │       ├── atlas.test.ts               # 2 unit tests for presets & audio
│   │       └── themes.test.ts              # 4 unit tests for theme tokens
│   ├── App.tsx                             # Application root & view router
│   ├── main.tsx                            # React DOM entry point
│   └── index.css                           # Tailwind CSS v4 styling
├── index.html                              # SEO title & OpenGraph metadata
├── vite.config.ts                          # Vite build & dev server config
├── tsconfig.json                           # Strict TypeScript configuration
└── package.json                            # Scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/focusforge.git

# 2. Enter directory
cd focusforge

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🧪 Testing & Verification

FocusForge uses the native **Node.js Test Runner** (`node:test`) with `tsx` for sub-second, zero-dependency unit tests.

Run all tests:
```bash
npm run test   # or: npx tsx --test src/utils/__tests__/*.ts
```

### Test Suite Summary:
```
✔ pacing presets: provides valid timing configurations for all modes
✔ sound effects metadata: has 14 distinct high-fidelity ambient categories
✔ FocusForge: Initial user state starts genuinely at zero
✔ FocusForge: Challenge day only advances when daily goal is met
✔ FocusForge: Multiple sessions on same calendar day do not artificially inflate challenge days
✔ FocusForge: Consecutive-day streak calculation and missed-day handling
✔ FocusForge: Milestone calculation tracks 3, 7, 14, and 30 day targets accurately
✔ FocusForge: Month 30 completion and Cycle 2 rollover preserves lifetime records
✔ FocusForge: LeetCode-style achievements evaluation awards correct badges without duplicates
✔ FocusForge: calculateProductivityStats returns clean zero state for brand new users
✔ Spotify: Parses standard album URL correctly
✔ Spotify: Parses playlist URL with query parameters correctly
✔ Spotify: Parses track URL correctly
✔ Spotify: Parses internationalized URLs (e.g. /intl-de/album/...)
✔ Spotify: Parses URI scheme formats (spotify:album:...)
✔ Spotify: Rejects invalid or dangerous non-Spotify URLs safely
✔ Spotify: Default and curated playlists are all valid Spotify links
✔ theme system: default theme is midnight-aurora
✔ theme presets: all 6 complete themes exist with full token definitions
✔ warm paper: correctly configured as light theme with high contrast text
✔ ambient presets: includes the 6 requested environments

21 passing (615ms)
```

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6.2](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Audio** | [Spotify Embed API](https://developer.spotify.com/) + Web Audio API |
| **Celebrations** | [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Testing** | Node.js Test Runner (`node:test`) + `tsx` |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Start / Pause Active Session |
| `R` | Reset Current Session |
| `S` | Skip to Next Break / Focus Sprint |
| `Ctrl + K` / `Cmd + K` | Open Quick Command Palette |
| `1` | Jump to Precision Timer |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
<sub>Built with precision for unshakeable focus.</sub>
</div>
