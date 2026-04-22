# MathTutor — MBD Mathematics Educator

An interactive, Socratic graduate-level mathematics curriculum grounded in the **Memory as Baseline Deviation (MBD)** framework and modern AI architecture.

**Live:** [https://yellowhapax.github.io/MathTutor/](https://yellowhapax.github.io/MathTutor/)

---

## What It Is

Nine progressive tracks spanning foundational intuition through advanced ML mathematics. Each lesson is:
- Taught **Socratically** via an embedded LLM tutor that adapts its persona per track
- Bridged explicitly to **MBD theory** ($B_{t+1} = B_t + \lambda(I - B_t)$) and Transformer/LLM architecture
- Illustrated with **bespoke interactive visualizers** (React, Three.js, Canvas)

## Tracks

| # | Track | Register |
|---|-------|----------|
| 1 | Topology & Geometry | Foundational |
| 2 | Linear Algebra | Foundational |
| 3 | Probability & Information | Foundational |
| 4 | Calculus of Variation | Foundational |
| 5 | Stochastics | Measure-theoretic |
| 6 | Signal & Spectrum | Operator-theoretic |
| 7 | Information Geometry | Information |
| 8 | Scaling & Chaos | Scaling |
| 9 | LLM Infrastructure | Architectural |

## Run Locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The Socratic tutor requires an [OpenRouter](https://openrouter.ai/) API key, entered directly in the UI.

## LLM / Crawler Access

- `public/llms.txt` — Philosophy, agent directives, tech overview
- `public/llms-full.txt` — Complete concatenated source for all 54 lessons (~164 KB)

Both are served live at the GitHub Pages URL above.
