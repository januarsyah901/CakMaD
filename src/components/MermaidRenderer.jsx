import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export default function MermaidRenderer({ chart }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const chartId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const renderChart = async () => {
      try {
        setError(null);
        const { svg: renderedSvg } = await mermaid.render(chartId.current, chart);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err.message || 'Syntax error in Mermaid diagram');
        // Clear the SVG on error
        setSvg('');
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm overflow-x-auto">
        <p className="font-semibold mb-1">Mermaid Render Error:</p>
        <code className="whitespace-pre-wrap">{chart}</code>
      </div>
    );
  }

  return (
    <div 
      className="flex justify-center my-6 overflow-x-auto" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
