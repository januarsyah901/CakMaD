import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_CONTENT = `# Welcome to Cak MaD

Write on the left, read on the right. Everything is saved in this browser as you type.
Replace this text with your own, or paste Markdown from ChatGPT, Claude or Gemini.

## Formatting

**Bold**, *italic*, ~~strikethrough~~, \`inline code\` and [links](https://example.com).
Select text and press **Ctrl+B**, **Ctrl+I** or **Ctrl+K** to wrap it.

- [x] Task lists
- [ ] Tables, math and diagrams below

## Tables

| Feature | Syntax |
| :--- | :--- |
| Table | pipes and dashes |
| Math | \`$...$\` or \`$$...$$\` |
| Diagram | a \`mermaid\` code block |

## Math

Inline $E = mc^2$, or a block:

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

## Diagram

\`\`\`mermaid
graph LR
    Paste --> Edit --> Preview --> PDF
\`\`\`

## Code

\`\`\`js
const greet = (name) => \`Hello, \${name}\`;
\`\`\`

Press **Ctrl+E** to export a PDF, **Ctrl+S** to download the .md file, and **Ctrl+/** for every shortcut.
`;

export const createNewDocument = (title = "Untitled", content = DEFAULT_CONTENT, settings = {}) => {
  return {
    id: uuidv4(),
    title,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPinned: false,
    settings: {
      font: 'sans-serif',
      paperSize: 'a4',
      margin: 'Normal',
      ...settings
    }
  };
};
