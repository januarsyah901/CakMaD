# 📝 Modern Markdown PDF Editor

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8-purple.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blue.svg)

A professional, distraction-free Markdown editor built with React and Vite. Edit your documents with a real-time preview and export them to high-quality PDFs with customizable options.

## ✨ Features

- **🚀 Performance-First**: Built with Vite 8 for blazing-fast development and build cycles.
- **📁 Multi-Document Management**: 
  - Sidebar file explorer to manage all your documents.
  - Tabbed interface to work on multiple files simultaneously.
  - Documents are automatically saved to `localStorage`.
- **📥 Import & Export**:
  - Drag & Drop `.md` files directly into the editor.
  - Save your work as native Markdown files.
  - High-quality PDF export with customizable page size and margins.
- **👁️ Real-Time Preview**: Live rendering with GitHub Flavored Markdown (GFM) support.
- **🛠️ Rich Editor**:
  - Powered by CodeMirror with Markdown syntax highlighting.
  - Toolbar for quick formatting (Bold, Italic, Headers, etc.).
  - Scroll Synchronization between editor and preview.
- **🎨 Premium UI/UX**:
  - Sleek Dark/Light mode support.
  - Resizable panels for a flexible workspace.
  - Distraction-free **Focus Mode**.
  - Live word and character count.
  - Toast notifications for user feedback.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Editor**: [@uiw/react-codemirror](https://uiwjs.github.io/react-codemirror/)
- **Markdown Parsing**: [react-markdown](https://github.com/remarkjs/react-markdown) & [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **PDF Export**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
- **Panels**: [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

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

4. Build for production:
   ```bash
   npm run build
   ```

## 📝 Usage Tips

- **Focus Mode**: Press `Ctrl + Shift + F` or click the expand icon to hide all UI elements except the editor.
- **File Management**: Click the `+` icon in the sidebar to create a new document. Your files will persist even if you refresh the browser.
- **Drag & Drop**: Simply drag any `.md` file from your computer into the editor area to open it instantly.

## 📄 License

This project is private and for personal use.

---

Built with ❤️ by **Bang Jan**
