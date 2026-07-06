'use client';

import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Markdown({
  children,
  className,
  components
}: {
  children: string;
  className?: string;
  components?: any;
}) {
  return (
    // Wrap ReactMarkdown in a div to apply your styles
    <div
      className={cn(
        'prose prose-sm prose-neutral max-w-none min-w-0 transition-all',
        'prose-headings:leading-tight',
        'prose-a:font-medium prose-a:text-neutral-900 prose-a:underline-offset-2 prose-a:decoration-dotted prose-a:cursor-alias',
        'prose-pre:max-w-full prose-pre:overflow-x-auto',
        className
      )}
    >
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target='_blank' rel='noopener noreferrer' />
          ),
          ...components
        }}
        remarkPlugins={[remarkGfm]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
