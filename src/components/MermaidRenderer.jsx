import { useEffect, useId, useState } from 'react';

// Mermaid is large; load it only when a document actually contains a diagram.
let mermaidPromise;
const loadMermaid = () => {
  mermaidPromise ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      // Documents are often pasted from AI tools; don't run HTML/click handlers from them.
      securityLevel: 'strict',
      fontFamily: 'inherit',
    });
    return mermaid;
  });
  return mermaidPromise;
};

export default function MermaidRenderer({ chart }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    let cancelled = false;
    // Debounce so typing inside a diagram doesn't re-render on every keystroke.
    const timer = setTimeout(async () => {
      try {
        const mermaid = await loadMermaid();
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Invalid diagram');
        // Mermaid leaves an error node in <body> when rendering fails.
        document.getElementById(`d${id}`)?.remove();
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="mermaid-error my-4 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm">
        <p className="font-medium text-red-700 dark:text-red-300">Diagram has a syntax error</p>
        <p className="mt-1 font-mono text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">{error.split('\n').slice(0, 3).join('\n')}</p>
      </div>
    );
  }

  if (!svg) {
    // PDF export re-renders from data-mermaid-source, so a diagram still loading is exported too.
    return <div className="mermaid-block my-6 h-24 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" data-mermaid-source={chart} aria-label="Rendering diagram" />;
  }

  return (
    <div
      className="mermaid-block my-6 flex justify-center overflow-x-auto"
      data-mermaid-source={chart}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
