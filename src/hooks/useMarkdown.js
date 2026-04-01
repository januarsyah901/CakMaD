import { useState, useEffect } from 'react';

const STORAGE_KEY = 'markdown_editor_content';

const DEFAULT_CONTENT = `# Welcome to your Markdown Editor! ✍️

Start typing on the left, and see the preview on the right. This editor supports real-time rendering, syntax highlighting, and PDF export!

## Features

- **Split-Pane Design**: Seamless editing and previewing experience.
- **Dark Mode**: Switch between light and dark modes instantly.
- **Rich Markdown**: Full support for GitHub Flavored Markdown (\`remark-gfm\`).

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

> "A well-crafted tool empowers the creator."

Enjoy writing!`;

export function useMarkdown() {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved : DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  return { content, setContent };
}
