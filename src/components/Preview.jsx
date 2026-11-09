import { forwardRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import MermaidRenderer from './MermaidRenderer';

const remarkPlugins = [remarkGfm, remarkMath];
// Mermaid sources must stay plain text so the renderer can read them.
const rehypePlugins = [rehypeKatex, [rehypeHighlight, { detect: false, plainText: ['mermaid'] }]];

const textOf = (children) =>
  Array.isArray(children) ? children.map(textOf).join('') : typeof children === 'string' ? children : '';

const components = {
  code({ className, children, ...props }) {
    if (/language-mermaid/.test(className || '')) {
      return <MermaidRenderer chart={textOf(children).replace(/\n$/, '')} />;
    }
    // react-markdown passes the hast node; don't forward it to the DOM.
    delete props.node;
    return <code className={className} {...props}>{children}</code>;
  },
  // Mermaid diagrams render as <div>; avoid wrapping them in <pre>.
  pre({ children, node }) {
    const child = node?.children?.[0];
    const isMermaid = child?.tagName === 'code' && String(child.properties?.className || '').includes('language-mermaid');
    return isMermaid ? <>{children}</> : <pre>{children}</pre>;
  },
  a({ children, href, ...props }) {
    delete props.node;
    const external = /^https?:/i.test(href || '');
    return (
      <a href={href} {...props} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  },
};

const Preview = forwardRef(({ content, selectedFont, customCss }, ref) => (
  <div ref={ref} className="markdown-preview min-h-full" style={{ fontFamily: selectedFont }}>
    {customCss ? <style>{customCss}</style> : null}
    {content.trim() ? (
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
        {content}
      </ReactMarkdown>
    ) : (
      <p className="text-gray-400 dark:text-gray-500 not-italic">Nothing to preview yet.</p>
    )}
  </div>
));

Preview.displayName = 'Preview';

export default memo(Preview);
