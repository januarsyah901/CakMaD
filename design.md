# Cak MaD (Phase 1) — Style Reference & Design System
> Precision document studio turning raw AI Markdown into polished, print-ready documents.

**Theme:** Light (default) & Dark (class-based `dark`)

Source measurements are normalized to Tailwind CSS rem scales; tokens and component rules reflect Phase 1 product evolution from a raw technical editor into an intuitive document publishing product.

Cak MaD operates on a clean slate studio philosophy. Instead of facing a blank, intimidating code terminal, users are greeted with high-clarity typography, deliberate breathing room, soft borders, and purposeful accent moments. The visual tone is utilitarian yet refined: slate neutral surfaces, crisp borders, rounded 8px to 16px geometry for cards and modals, and a vibrant indigo brand core (#4f46e5) that signals action, export readiness, and document craft. The layout transitions seamlessly between a welcoming product landing layer, a guided empty document state, a focused dual-pane editing workshop, and a crystal-clear export preview modal.

## Tokens — Colors

| Name | Hex Value | Token / Utility | Role |
|------|-----------|-----------------|------|
| Studio Canvas Light | `#f9fafb` | `--color-bg-light` (`bg-gray-50`) | Primary application canvas and backdrop behind elevated workspace panels |
| Studio Surface Light | `#ffffff` | `--color-surface-light` (`bg-white`) | Primary card, modal, tab bar, header, and paper preview background in light mode |
| Studio Canvas Dark | `#121212` | `--color-bg-dark` (`dark:bg-dark-900`) | Main page backdrop and CodeMirror canvas in dark mode |
| Studio Surface Dark | `#1e1e1e` | `--color-surface-dark` (`dark:bg-dark-800`) | Header, modal, card, and sidebar container background in dark mode |
| Studio Surface Muted Dark | `#2d2d2d` | `--color-surface-muted-dark` (`dark:bg-dark-700`) | Toolbar, hover fills, and nested wells in dark mode |
| Hairline Border Light | `#e5e7eb` | `--color-border-light` (`border-gray-200`) | Structural dividers, panel resize handles, and card outlines in light mode |
| Hairline Border Dark | `#374151` | `--color-border-dark` (`dark:border-gray-700`) | Structural dividers and container outlines in dark mode |
| Text Primary Light | `#111827` | `--color-text-primary-light` (`text-gray-900`) | Display headings, title inputs, and high-emphasis body in light mode |
| Text Primary Dark | `#f3f4f6` | `--color-text-primary-dark` (`dark:text-gray-100`) | Display headings and editor text in dark mode |
| Text Secondary Light | `#4b5563` | `--color-text-secondary-light` (`text-gray-600`) | Secondary descriptions, subheadings, and toolbar icons |
| Text Secondary Dark | `#9ca3af` | `--color-text-secondary-dark` (`dark:text-gray-400`) | Subtitles, helper text, and inactive icons in dark mode |
| Text Tertiary | `#6b7280` | `--color-text-tertiary` (`text-gray-500`) | Micro-copy, hotkey badges, and word counter tags |
| Brand Amber Accent | `#ff9d00` | `--color-brand-primary` (`bg-brand-500`, `text-brand-500`) | Primary CTA buttons, logo accent, active indicators, focus rings, and export highlight |
| Brand Amber Hover | `#ea8c00` | `--color-brand-hover` (`hover:bg-brand-600`) | Hover state for primary action buttons |
| Brand Amber Soft | `#fffbeb` | `--color-brand-soft` (`bg-brand-50`, `dark:bg-brand-950/40`) | Active tab highlights, badge fills, and toggle active states |
| Accent Orange | `#ea580c` | `--color-accent-orange` (`bg-orange-600`, `text-orange-600`) | Secondary badges, warm alerts, and markdown highlight elements |
| Success Emerald | `#10b981` | `--color-success` (`text-emerald-500`, `bg-emerald-50`) | Export success badges, copy confirmations, and completion marks |
| Danger Rose | `#ef4444` | `--color-danger` (`text-rose-500`, `bg-rose-50`) | Delete document confirmations and destructive modal warnings |

## Tokens — Typography

### Inter / System UI — Primary Application Typeface
The workhorse font family powering the entire studio shell, navigation, modals, and landing view. Clear, highly legible at small sizes, and clean across dark and light modes.
- **Font Stack:** `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Scale:** 11px, 12px, 13px, 14px, 16px, 18px, 20px, 24px, 32px, 44px

### Document Reader Typography (Markdown Preview Options)
Preview documents support selectable typography to fit various publishing styles:
1. **Sans-Serif (`font-sans`):** System UI / Inter (default modern technical documentation)
2. **Poppins (`font-poppins`):** Polished, friendly marketing & agency reports
3. **Lora (`font-lora`):** Editorial, literary, and academic research papers
4. **Playfair Display (`font-playfair`):** Sophisticated luxury and formal publications
5. **Fira Code (`font-mono`):** Monospace technical specs, code snippets, and raw markdown

### Type Scale

| Role | Weight | Size | Line Height | Tracking | Token / Class |
|------|--------|------|-------------|----------|---------------|
| Display Hero | 700 | 44px (2.75rem) | 1.15 | -0.025em | `text-4xl sm:text-5xl font-bold tracking-tight` |
| Section Title | 700 | 28px (1.75rem) | 1.25 | -0.02em | `text-2xl sm:text-3xl font-bold tracking-tight` |
| Modal Title | 600 | 18px (1.125rem)| 1.35 | -0.015em | `text-lg font-semibold` |
| Subtitle / Lead | 400 | 18px (1.125rem)| 1.5 | normal | `text-lg text-gray-600 dark:text-gray-300` |
| Body Regular | 400 | 14px (0.875rem)| 1.5 | normal | `text-sm text-gray-700 dark:text-gray-300` |
| Body Medium | 500 | 14px (0.875rem)| 1.5 | normal | `text-sm font-medium` |
| Caption / Micro | 500 | 12px (0.75rem) | 1.4 | 0.01em | `text-xs font-medium text-gray-500` |
| Code Inline | 400 | 13px (0.8125rem)| 1.4 | normal | `text-xs font-mono px-1.5 py-0.5 rounded` |

## Tokens — Spacing & Shapes

**Density:** Comfortable in landing and modals; compact and space-efficient in editor toolbar and status bar.

### Spacing Scale

| Value | Utility | Role |
|-------|---------|------|
| 4px | `p-1`, `gap-1` | Micro padding for toolbar icons and small badge items |
| 8px | `p-2`, `gap-2` | Standard button internal padding and file list items |
| 12px | `p-3`, `gap-3` | Header element gaps, card interior padding |
| 16px | `p-4`, `gap-4` | Standard modal interior padding, card gap in grids |
| 24px | `p-6`, `gap-6` | Modal sections, landing card interiors, preview padding |
| 32px | `p-8`, `gap-8` | Preview container padding, landing section spacing |
| 48px | `py-12` | Landing sub-section breathing room |
| 64px | `py-16` | Hero section top/bottom padding |

### Border Radius

| Element | Value | Tailwind Class |
|---------|-------|----------------|
| Badges & Shortcuts | 4px | `rounded` |
| Buttons & Inputs | 6px to 8px | `rounded-md` / `rounded-lg` |
| Empty State Cards & Modal Dialogs | 12px to 16px | `rounded-xl` / `rounded-2xl` |
| Landing Use Case Cards | 16px | `rounded-2xl` |
| Pill Tags & Avatar Rings | 9999px | `rounded-full` |

### Shadows & Elevation

| Level | Value | Utility | Role |
|-------|-------|---------|------|
| Ambient Hairline | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `shadow-sm` | Top header, tab strip, and subtle card lift |
| Surface Elevation | `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` | `shadow-md` | Floating tooltips, dropdown menus |
| Modal & Showcase | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | `shadow-xl` | Export modal, template picker, onboarding modal |
| Glass Backdrop | `backdrop-blur-md bg-black/40` | `backdrop-blur-sm bg-black/50` | Overlay behind modals and mobile drawer |

## Key Components

### 1. Landing Hero Band
**Role:** Welcome visitors, explain value proposition instantly ("AI Output -> Cak MaD -> Beautiful Document").
- **Container:** Centered max-width 1024px, 64px top/bottom padding.
- **Title:** "Edit and export Markdown beautifully" in 44px/48px bold, tight tracking.
- **Subtitle:** "Turn AI-generated Markdown into clean, professional documents instantly" in 18px text-gray-600.
- **Action Group:**
  - Primary button: Indigo pill/rounded button (`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-semibold rounded-lg shadow-sm`). Label: "Start Writing".
  - Secondary button: Subtle border pill (`border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-dark-700 px-6 py-3 font-medium rounded-lg`). Label: "View Example".

### 2. Use Case Grid Cards
**Role:** Immediate problem-solution alignment for new users.
- **Grid:** 4 columns on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`).
- **Cards:** Surface white / dark-800, border-gray-200 / dark-700, 16px radius (`rounded-2xl`), 24px padding (`p-6`).
- **Card Content:**
  1. **AI Reports:** "Generate content with AI -> polish and export" (Icon: Sparkles / Bot).
  2. **Research Documents:** "Convert structured Markdown into readable documents" (Icon: BookOpen / GraduationCap).
  3. **Documentation:** "Create clean technical documentation" (Icon: FileCode / Terminal).
  4. **Personal Notes:** "Organize notes with better readability" (Icon: Notebook / PenTool).

### 3. First-Time Onboarding Modal
**Role:** Walkthrough modal shown once on first entry.
- **Card Surface:** Max-width 480px, 16px radius, shadow-xl, centered modal.
- **Header:** "Welcome to Cak MaD" with brand logo icon.
- **Subtitle:** "Create beautiful documents from Markdown."
- **Workflow Stepper (4 Steps):**
  1. *Paste your Markdown* (from ChatGPT, Claude, DeepSeek, or Gemini).
  2. *Edit your content* (with instant live syntax styling).
  3. *Preview your document* (styled with typography presets).
  4. *Export* (one-click clean PDF or clean Markdown).
- **CTA:** "Start Editing" button full width (`w-full bg-indigo-600 text-white py-2.5 rounded-lg`).
- **Persistence:** Tracked via `localStorage.getItem('cakmad_onboarded_v1')`.

### 4. Empty State Creation Guidance
**Role:** Replaces the blank "File Not Found / No Document Open" screen with actionable creation pathways.
- **Headline:** "What do you want to create today?" in 24px bold.
- **Action Cards Grid (2x2 or 4-row flex):**
  - **Create AI Report:** Seeds editor with executive summary and key findings starter template.
  - **Create Documentation:** Seeds editor with README / API docs structure.
  - **Create Notes:** Seeds editor with organized meeting & personal notes structure.
  - **Import Markdown:** Drag-and-drop or file picker button.

### 5. Template Discovery Modal
**Role:** Categorized template selection modal with preview panel.
- **Layout:** Split modal with category sidebar on the left and template grid on the right.
- **Categories:**
  - `Academic` (Research Paper, Thesis Notes, Essay)
  - `Documentation` (Project README, API Spec, Release Notes)
  - `Professional` (Executive AI Report, Meeting Minutes, Proposal)
  - `Personal` (Journal, Daily Notes, Reading List)
- **Recent Section:** Top row displaying the last 2 used templates.
- **Preview Drawer:** Clicking a template shows a scrollable mini-preview before applying.

### 6. Export Flow & Confirmation Modal
**Role:** High-trust value moment before generating PDF or sharing document.
- **Surface:** Max-width 640px, rounded-2xl, border-gray-200.
- **Preview Thumbnail:** Real-time mini viewport of page layout showing chosen paper size (A4 / Letter) and margins.
- **Configuration Controls:**
  - Paper size segment control (`A4`, `Letter`, `A3`).
  - Margins toggle (`Normal`, `Compact`, `Wide`).
  - Filename input with `.pdf` extension tag.
- **Primary CTA:** "Download PDF" (`bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm`).
- **Confirmation State:** Animated checkmark toast: "Document is ready to share".

### 7. Responsive Mobile Navigation & Viewport
**Role:** Ensure users pasting AI results on mobile phones can review and export without UI breaking.
- **Segmented View Switcher:** Mobile-only top bar tab toggle: `[Editor] | [Preview]`.
- **Target Sizes:** Minimum 44px touch targets on all mobile buttons.
- **Drawer Sidebar:** Off-canvas navigation sliding from left with smooth backdrop overlay.

## Do's and Don'ts

### Do
- Use 8px (`rounded-lg`) for primary interactive controls and 16px (`rounded-2xl`) for elevated cards and modals.
- Reserve Brand Indigo (`#4f46e5`) for focal action triggers (Start Writing, Export, Primary Confirmation).
- Keep the light mode canvas slightly warm/cool neutral (`#f9fafb`) so the white document paper stands out with clear contrast.
- Ensure all inputs and buttons provide clear visible focus rings (`focus:ring-2 focus:ring-indigo-500 focus:outline-none`).
- Provide instant feedback (loading spinners, checkmark icons) on every export and import action.

### Don't
- Do not present new users with a raw blank gray screen without guidance or starter choices.
- Do not use more than two high-saturation accent colors; let user document content supply visual personality.
- Do not hide mobile view toggles behind multi-nested menus; keep switching between code and preview one tap away.
- Do not collect or transmit document markdown content to any analytics server.
- Do not break existing keyboard shortcuts (`Ctrl/Cmd+S`, `Ctrl/Cmd+E`, `Ctrl/Cmd+Shift+F`).

## Surfaces & Elevations

| Level | Light Mode Hex | Dark Mode Hex | Purpose |
|-------|----------------|---------------|---------|
| Level 0 (Canvas) | `#f9fafb` | `#121212` | Root page background behind panels |
| Level 1 (Surface) | `#ffffff` | `#1e1e1e` | Editor panels, preview paper, sidebar, top header |
| Level 2 (Well / Inset)| `#f3f4f6` | `#2d2d2d` | Toolbar bars, status bar footer, input field fills |
| Level 3 (Modal / Card)| `#ffffff` | `#1e1e1e` | Floating dialogs, onboarding card, template preview |
| Level 4 (Overlay) | `rgba(0, 0, 0, 0.4)` | `rgba(0, 0, 0, 0.6)` | Dimmed backdrop behind open modals |

## Quick Start Reference

### CSS Custom Properties (`src/index.css`)

```css
:root {
  /* Surfaces */
  --surface-canvas: #f9fafb;
  --surface-surface: #ffffff;
  --surface-muted: #f3f4f6;
  --surface-border: #e5e7eb;

  /* Typography Colors */
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-tertiary: #9ca3af;

  /* Brand Accents */
  --brand-indigo: #4f46e5;
  --brand-indigo-hover: #4338ca;
  --brand-indigo-soft: #e0e7ff;
  --brand-blue: #2563eb;
  
  /* Radii */
  --radius-button: 8px;
  --radius-card: 16px;
  --radius-pill: 9999px;
}

.dark {
  --surface-canvas: #121212;
  --surface-surface: #1e1e1e;
  --surface-muted: #2d2d2d;
  --surface-border: #374151;

  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;

  --brand-indigo-soft: rgba(79, 70, 229, 0.15);
}
```

### Component Tailwind Patterns

1. **Hero Primary Button:**
   ```jsx
   <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
     Start Writing
   </button>
   ```

2. **Use Case Card:**
   ```jsx
   <div className="p-6 bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-all">
     <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
       <Sparkles size={20} />
     </div>
     <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">AI Reports</h4>
     <p className="text-sm text-gray-600 dark:text-gray-400">Generate content with AI, then polish and export cleanly.</p>
   </div>
   ```

3. **Empty State Guidance Card:**
   ```jsx
   <button className="flex items-center gap-3 p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl transition text-left">
     <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-dark-700 text-indigo-600 dark:text-indigo-400">
       <FileText size={20} />
     </div>
     <div>
       <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Create AI Report</span>
       <span className="block text-xs text-gray-500">Starter layout for analysis and summaries</span>
     </div>
   </button>
   ```
