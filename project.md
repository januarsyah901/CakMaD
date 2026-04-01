# 📝 Markdown Editor + Export PDF — Project Plan

## Overview

Local web app for writing markdown with live preview and export to PDF.

## Tech Stack

- **Frontend**: React + Vite

- **Editor**: CodeMirror 6 (`@uiw/react-codemirror`)

- **Markdown Rendering**: `react-markdown` + `remark-gfm`

- **Export PDF**: `html2pdf.js`

- **Styling**: Tailwind CSS

---

## Project Structure

markdown-editor/
├── public/
├── src/
│   ├── components/
│   │   ├── Editor.jsx
│   │   ├── Preview.jsx
│   │   ├── Toolbar.jsx
│   │   └── ExportButton.jsx
│   ├── hooks/
│   │   └── useMarkdown.js
│   ├── utils/
│   │   └── exportPdf.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json

---

## Dependencies

```json

{

  "dependencies": {

    "react": "^18",

    "react-dom": "^18",

    "react-markdown": "^9",

    "remark-gfm": "^4",

    "@uiw/react-codemirror": "^4",

    "@codemirror/lang-markdown": "^6",

    "@codemirror/theme-one-dark": "^6",

    "html2pdf.js": "^0.10"

  },

  "devDependencies": {

    "vite": "^5",

    "@vitejs/plugin-react": "^4",

    "tailwindcss": "^3",

    "autoprefixer": "^10",

    "postcss": "^8"

  }

}

Features

- Split view: editor on the left, preview on the right

- Toolbar: Bold, Italic, Heading, Link, Code, Blockquote, Divider

- Real-time live preview

- Export preview as PDF (file name can be customized)

- Dark / Light mode toggle

- Auto-save to localStorage

Layout┌─────────────────────────────────────────────────┐

│  Toolbar: [B] [I] [H1] [H2] [Link] [Code] [---] │

├────────────────────┬────────────────────────────┤

│                    │                            │

│   Editor Panel     │    Preview Panel           │

│   (CodeMirror)     │    (react-markdown)        │

│                    │                            │

├────────────────────┴────────────────────────────┤

│  Word Count: 0     [🌙 Dark Mode] [Export PDF]  │

└─────────────────────────────────────────────────┘

Export PDF Flow

1. Get HTML content from the Preview panel via ‎⁠ref⁠

2. Inject print-safe CSS (font, margin, page-break)

3. Run ‎⁠html2pdf().from(element).save(filename)⁠

Build Steps (for Agent)

1. Scaffold project: ‎⁠npm create vite@latest markdown-editor -- --template react⁠

2. Enter folder: ‎⁠cd markdown-editor⁠

3. Install dependencies according to the list above

4. Set up Tailwind CSS (‎⁠tailwind.config.js⁠ + ‎⁠postcss.config.js⁠)

5. Create ‎⁠App.jsx⁠ with split panel layout (flex row)

6. Create ‎⁠Editor.jsx⁠ — CodeMirror with lang-markdown + dark theme

7. Create ‎⁠Preview.jsx⁠ — react-markdown + remark-gfm + attach ref for PDF

8. Create ‎⁠Toolbar.jsx⁠ — buttons to insert markdown syntax into the editor

9. Create ‎⁠useMarkdown.js⁠ — ‎⁠content⁠ state, update handler

10. Create ‎⁠exportPdf.js⁠ — function to take Preview ref then trigger html2pdf

11. Create ‎⁠ExportButton.jsx⁠ — file name input + export button

12. Add dark mode toggle (state + Tailwind ‎⁠dark:⁠ classes)

13. Add auto-save: ‎⁠useEffect⁠ → ‎⁠localStorage.setItem⁠

14. Load from localStorage on init

15. Polish: responsive layout, scrollable panels, typography styling for preview

Notes for Agent

- Make sure ‎⁠html2pdf.js⁠ is imported with: ‎⁠import html2pdf from 'html2pdf.js'⁠

- Preview panel must use ‎⁠forwardRef⁠ so the ref can be accessed from outside

- For Tailwind dark mode, set ‎⁠darkMode: 'class'⁠ in ‎⁠tailwind.config.js⁠

- CodeMirror theme: use ‎⁠oneDark⁠ for dark mode, ‎⁠githubLight⁠ (install ‎⁠@uiw/codemirror-theme-github⁠) for light mode

- Avoid SSR issues — this is a pure client-side Vite app

Tinggal copy semua itu Bang Jan, langsung kasih ke agent lo. Mau ada yang ditambahin sebelum dieksekusi?

