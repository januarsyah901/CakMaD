# 📝 Cak MaD Editor

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8-purple.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blue.svg)

**Cak MaD Editor** is a professional, high-performance Markdown editor designed for developers and content creators. Built with React and Vite, it offers a seamless writing experience with real-time preview, advanced content rendering (Math, Mermaid, Tables), and high-quality PDF export capabilities.

## ✨ Key Features

- **🚀 Ultra-Fast Performance**: Powered by Vite 8 for near-instant development and build cycles.
- **⚡ Content Power-ups (New in v1.3)**:
  - **Table Editor GUI**: A visual modal for creating and inserting complex Markdown tables effortlessly.
  - **Multimedia Integration**: Paste images directly or drag & drop. Automatic Base64 conversion (2MB limit).
  - **Scientific Writing**: Native support for **LaTeX** (Inline `$formula$` and Block `$$formula$$`) via KaTeX.
  - **Diagrams & Flowcharts**: Render **Mermaid** diagrams directly within code blocks.
  - **Custom Typography**: Choose from premium fonts: Poppins, Playfair Display, Lora, Fira Code, and systemic Times New Roman.
  - **Styling Freedom**: Per-document **Custom CSS** injection to perfectly match your preview needs.
  - **Smart Templates**: Quick starters for README, Blog, Resume, Meeting Notes, and Technical Docs.
- **📁 Advanced Workspace Management**: 
  - Persistent sidebar file list with rename/delete functionality.
  - Tabbed interface for multi-tasking across different documents.
  - Automatic `localStorage` persistence (no "save" button required for workflow).
- **📥 Import & Pro Export**:
  - Drag & Drop local `.md` files to open.
  - Enhanced PDF Export: Customizable margins, page sizes (A4/A3/Letter), and branding options.
- **🎨 Premium UI/UX**:
  - Glassmorphic design with native Dark/Light mode support.
  - Resizable split-panes with scroll synchronization.
  - **Focus Mode**: A distraction-free writing environment.

## ⌨️ Keyboard Shortcuts

Speed up your workflow with these intuitive shortcuts:

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + S` | Save current document as `.md` |
| `Ctrl + E` | Open PDF Export modal |
| `Ctrl + Alt + N` | Open Templates modal |
| `Ctrl + Shift + F` | Toggle Focus Mode |
| `ESC` | Exit Focus Mode / Close Modals |

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Editor Core**: [@uiw/react-codemirror](https://uiwjs.github.io/react-codemirror/)
- **Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown), [remark-math](https://github.com/remarkjs/remark-math), [rehype-katex](https://github.com/remarkjs/rehype-katex), [mermaid](https://mermaid.js.org/)
- **PDF Engine**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/januarsyah901/Mas-pdf.git
   cd Mas-pdf
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Usage Tips

- **Image Support**: You can copy an image from your computer or web and paste (`Ctrl+V`) it directly into the editor.
- **Math Formatting**: Use single `$` for inline math like $E=mc^2$ and double `$$` for block formulas.
- **Custom CSS**: Use the "Custom CSS" button in the footer to add specific styles (e.g., `body { color: blue; }`) that only affect the current document's preview and PDF.

## ☕ Support This Project

If you find Cak MaD Editor helpful, consider supporting its development!

[![Buy me a martabak](https://img.shields.io/badge/Buy%20me%20a%20martabak-F97316?style=for-the-badge&logo=coffee&logoColor=white)](https://saweria.co/januarsyah)

## 📄 License

This project is private and for personal use.

---
Created with ❤️ by **januarsyah901**
