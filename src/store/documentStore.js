import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_CONTENT = `# 🚀 Welcome to Your Markdown Editor!

## Text Formatting
You can easily write with **bold text**, *italic emphasis*, ~~strikethrough~~, and \`inline code\`.


## Code Scripts

\`\`\`javascript
// Syntax highlighting for your code
function createMagic(title) {
  return \`✨ \${title} is awesome!\`;
}
\`\`\`

## Mathematical Equations

Write inline math like $E = mc^2$, or use block equations for complex formulas:

$$
\\begin{align}
\\text{Area of Circle} &= \\pi r^2 \\\\
\\text{Volume of Sphere} &= \\frac{4}{3}\\pi r^3
\\end{align}
$$
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
