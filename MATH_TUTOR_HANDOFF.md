# MathTutor Curriculum Expansion: Status & Handoff

## Overview
We are expanding the MathTutor application to include 5 new graduate-level math tracks (Tracks 5-9), mapping deep mathematics to modern ML and LLM concepts. Each track consists of 6 lessons and uses bespoke interactive React/SVG visualizations. 

## ✅ Completed Work

**1. Infrastructure & Scaffolding**
- Surveyed existing track/registry/lesson infrastructure.
- Extended `src/curriculum/registry.ts` with new tracks and the `tutorRegister` field.
- Created `src/components/LessonBody.tsx` to export consistent typographic components (`P`, `Def`, `Thm`, `Practice`) for all new lessons.

**2. Track 5: Stochastics**
- Built 6 interactive visualizations: `KalmanViz.tsx`, `BrownianViz.tsx` (SDEs), `LangevinViz.tsx`, `ScoreFieldViz.tsx` (Score-matching), `DiffusionViz.tsx`, `FiltrationViz.tsx` (Itō).
- Completed 6 lessons: `Lesson5_1.tsx` through `Lesson5_6.tsx` in `src/lessons/stochastics/`.

**3. Track 6: Signal & Spectrum**
- Built 6 interactive visualizations: `FourierViz.tsx`, `RoPEViz.tsx`, `KernelViz.tsx`, `SpectralGraphViz.tsx`, `GaussianProcessViz.tsx`, `HilbertViz.tsx`.
- Completed 6 lessons: `Lesson6_1.tsx` through `Lesson6_6.tsx` in `src/lessons/signal/`.

**4. Track 7: Information Geometry (Partial)**
- Built all 6 interactive visualizations: `StatManifoldViz.tsx`, `FisherViz.tsx`, `KLViz.tsx`, `ExpFamilyViz.tsx`, `WassersteinViz.tsx`, `SinkhornViz.tsx`.
- Completed first 4 lessons: `Lesson7_1.tsx` through `Lesson7_4.tsx` in `src/lessons/infogeo/`.

---

## 🚧 Remaining Work (Tasks for Claude Code)

### 1. Finish Track 7: Information Geometry
Create the remaining two lessons in `src/lessons/infogeo/`:
- **`Lesson7_5.tsx`**: Optimal Transport & Wasserstein Distance (import and use `<WassersteinViz />`)
- **`Lesson7_6.tsx`**: Entropy-regularized OT & Sinkhorn Iterations (import and use `<SinkhornViz />`)

### 2. Build Track 8: Scaling & Chaos
- **Location**: `src/lessons/scaling/` and `src/viz/2d/`
- **Visualizations**: Create ~6 new interactive React/SVG visualizers covering: Fractals, RMT (Wigner Semicircle), RMT (Marchenko-Pastur), Power Laws, Lyapunov Exponents, and NTK (Neural Tangent Kernel).
- **Lessons**: Create `Lesson8_1.tsx` through `Lesson8_6.tsx`. Wrap them in standard `<LessonShell>` format, importing the typographic blocks from `LessonBody.tsx` and rendering math with `react-katex`.

### 3. Build Track 9: LLM Infrastructure
- **Location**: `src/lessons/llm/` and `src/viz/2d/`
- **Visualizations**: Create ~6 new visualizers covering: Attention-as-kernel, Softmax geometry, Tropical geometry, Measure concentration, etc. (Can reuse OT/Wasserstein/Sinkhorn if applicable, or build LLM-specific variants).
- **Lessons**: Create `Lesson9_1.tsx` through `Lesson9_6.tsx`.

### 4. System Prompt Tuning
- **Location**: `src/components/Tutor.tsx` (or wherever the tutor chat context is initialized)
- **Task**: Tune the per-track tutor system prompts to ensure the AI assistant adopts the right persona and context for each advanced math topic.

## Technical Implementation Details
- **Math Rendering**: Use `react-katex` (`InlineMath`, `BlockMath`).
- **Layout**: Exported components from `LessonBody.tsx` (`P`, `Def`, `Thm`, `Practice`) should be used for consistent text styling.
- **Interactivity**: Visualizations use React hooks (`useState`, `useEffect`) and raw SVG rendering to demonstrate mathematical principles dynamically. Note that `recharts` is also available if absolutely necessary, but bespoke SVGs grant more custom math visualization control.
- **State**: All code up to this point is committed to the `main` branch.