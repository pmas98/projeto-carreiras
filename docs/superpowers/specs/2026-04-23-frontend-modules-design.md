# Design Spec: New Interactive Frontend Modules (Updated)

This document outlines the design for three interactive modules in the "Career Path" learning platform. These modules are designed to be immersive, educational, and automatically validated.

## Goal
Replace the existing placeholder frontend tasks with three high-quality, interactive experiences that teach UI/UX, Motion, and Accessibility using a guided, step-by-step approach.

## User Review Required
> [!IMPORTANT]
> The modules use a "Guided Discovery" approach. The Framer and Accessibility tasks now feature a "Learning Bar" that guides the user through specific code implementations step-by-step.

## Components & Architecture

### 1. Task Shell (`/frontend/[taskId]`)
A dynamic layout that wraps each task.
- **Top Bar**: Task title, progress indicator, and "Back to Dashboard" button.
- **Workspace**: The main area where the specific task UI lives.
- **Learning Bar**: A new component for tutorial-based tasks that shows the current goal, the snippet to write, and an educational explanation.

### 2. Validation & Tutorial Engine
A React hook (`useTutorialProgress`) that:
- Manages an array of "Steps".
- Each step has a `targetSnippet`, `description`, `explanation`, and `validation` logic.
- Monitors `currentState` and unlocks the next step when criteria are met.

### 3. Modules

#### Module 1: Design Inspector (Expanded)
- **ID**: `frontend_inspector`
- **Objective**: Align a UI component with a semi-transparent mockup.
- **New Properties**: 
  - `padding`, `gap`, `borderRadius` (existing)
  - `boxShadow`: Control the elevation and depth.
  - `borderWidth`: Control the emphasis of boundaries.
  - `fontSize`: Control hierarchy and readability.
- **UI**: Sidebar with sliders and "Mockup Toggle".

#### Module 2: Micro-interactions (Guided Framer Motion)
- **ID**: `frontend_framer`
- **Tutorial Steps**:
  1. **Interaction**: Add `whileHover={{ scale: 1.05 }}` to the button.
  2. **Physics**: Add `transition={{ type: "spring", stiffness: 400 }}`.
  3. **Orchestration**: Add `staggerChildren: 0.1` to the container.
- **Learning Bar**: Provides the code to write and explains "Why" (e.g., "Spring physics feel more natural than linear ones").

#### Module 3: Screen Reader Nightmare (Guided A11y)
- **ID**: `frontend_a11y`
- **Tutorial Steps**:
  1. **Semantics**: Change `div` to `button` for the close action.
  2. **Description**: Add `aria-label="Fechar modal"`.
  3. **Visual Accessibility**: Change text color for better contrast (e.g., `text-zinc-900`).
- **Learning Bar**: Explains how each change helps assistive technology.

## Data Flow
1. User enters task.
2. `useTutorialProgress` initializes at Step 0.
3. User types in the editor.
4. Hook validates current code against current step's `targetSnippet` or logic.
5. On success:
   - Play success sound/animation.
   - Advance to next step in the Learning Bar.
6. When all steps are done:
   - Trigger Confetti and show "Task Complete" overlay.

## Success Criteria
- Guided experience: Users never feel "lost" on what to do next.
- Immediate feedback: UI changes as the user types.
- Educational value: Every step explains a core frontend concept.
