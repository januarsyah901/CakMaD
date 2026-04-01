import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Preview = forwardRef(({ content }, ref) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-white dark:bg-dark-900 p-8 shadow-inner">
      <div 
        ref={ref} 
        className="markdown-preview bg-white dark:bg-dark-900 min-h-full"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
