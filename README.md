# GameGen

_Author – **Pratham Amritkar**_
_Repository – [https://github.com/prathamamritkar/GameGen](https://github.com/prathamamritkar/GameGen)_

## Overview

**GameGen** is a web-first, no-code game-maker that lets anyone create, reskin, and export classic HTML5 games in minutes. The platform is built with Firebase Studio for rapid scaffolding and relies on Firebase. Artificial-intelligence modules handle art, music, and balancing so users can focus on creativity.

## Table of Contents

1. Features
2. Usage Workflow
3. Accessibility \& Theming
4. Competitor Analysis
5. Applications
6. Getting Started
7. License

## 1. Features

| Category | Capability | Benefit |
| :-- | :-- | :-- |
| **Web-Based Platform** | Runs entirely in the browser; no installs | Instant access on any device |
| **Guided Workflow** | Pick Template → Reskin → Set Parameters → Export | Removes technical jargon for non-coders |
| **Mobile-Friendly Exports** | Touch, accelerometer, and PWA support | Games play smoothly on phones \& tablets |
| **Classic Templates** | Flappy Bird, Speed Runner, Whack-a-Mole, Match-3, Crossy Road | Ready-made foundations to learn and iterate |
| **AI Reskin Integration** | Text-to-asset generation for characters, backgrounds, obstacles | Fresh art in under a minute; fallbacks ensure continuity |
| **AI Parameter Control** | Natural-language tweaks (“increase gravity”, “make it harder”) | Fine-tune difficulty without numbers |
| **AI-Generated BGM** | Prompt-based 8-bit or chiptune loops | Unique atmospheres for each game |
| **Logic Extensions** | Plain-English requests (“moles shake before appearing”) | Safe code patches without breaking gameplay |
| **One-Click Export** | Zipped HTML5 bundle ready for offline or web | Share or host instantly—Firebase Hosting optional |

## 2. Usage Workflow

1. **Pick Template** – choose one of the five starter games.
2. **Reskin with Prompts** – describe a theme; GameGen generates sprites, tiles, and UI.
3. **Set Parameters** – use sliders or text commands for speed, gravity, spawn rate.
4. **Preview \& Iterate** – live-preview inside the editor; tweaks apply in real time.
5. **Export Game** – click **Export** to receive a zipped `index.html`, assets, and manifest.

Cloud Functions handle on-demand art and music creation.

## 3. Accessibility \& Theming

| Theme | Primary | Background | Accent | Contrast Compliance* |
| :-- | :-- | :-- | :-- | :-- |
| **Dark** | Electric Blue `#0074D9` | Charcoal `#23272F` | Emerald Green `#2ECC71` | 4.5 : 1+ for UI text |
| **Light** | Soft Tangerine `#FFAA5A` | Pale Gray `#F4F6FB` | Teal-Mint `#29B76A` | 4.5 : 1+ for UI text |

*Meets WCAG 2.1 level AA for normal text and AAA for large text.

Additional aids

- Keyboard-navigable menus
- Focus outlines and skip-links
- High-contrast toggle

Color choices draw on research linking blue to trust, orange to enthusiasm, and green to success, fostering engagement and clear call-to-action signals.

## 4. Competitor Analysis

| Platform | Strengths | GameGen Advantage |
| :-- | :-- | :-- |
| **Construct 3** | Mature drag-and-drop engine | Simpler parameter editing; deeper AI asset pipeline |
| **GDevelop** | Open-source, event sheets | Faster reskin via prompts; no manual sprite prep |
| **Ready Maker** | Visual logic blocks | Integrated art, music, and balance generation |
| **Pixel Game Maker MV** | Robust desktop tool | 100% browser-based; no installation |
| **Canva for Games** | Quick graphic layout | Full game logic and export, not just visuals |

## 5. Applications

- **Education** – illustrate physics or logic without coding lessons.
- **Rapid Prototyping** – designers validate ideas before full production.
- **Entertainment \& Social** – users craft and share personalised challenges.
- **Marketing** – brands deploy themed mini-games for campaigns.
- **Therapy \& Accessibility** – custom games for motor-skill rehab or special-needs learning.


## 6. Getting Started

```bash
# 1. Clone repository
git clone https://github.com/prathamamritkar/GameGen.git
cd GameGen

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev      # launches http://localhost:3000

# 4. Build & deploy to Firebase
npm run build
firebase deploy  # requires 'firebase login' & configured project
```

_Requirements_: Node 18+, npm 9+, Firebase CLI.

## 7. License

GameGen is released under the **MIT License**. See `LICENSE` in the repository for details.


