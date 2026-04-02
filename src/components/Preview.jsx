import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import MermaidRenderer from './MermaidRenderer';

const Preview = forwardRef(({ content, selectedFont, customCss }, ref) => {
  return (
    <div 
      ref={ref} 
      className="markdown-preview bg-white dark:bg-dark-900 min-h-full"
      style={{ fontFamily: selectedFont }}
    >
      {/* Dynamic Style for Custom CSS */}
      <style>{customCss}</style>

      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            
            if (!inline && lang === 'mermaid') {
              return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
