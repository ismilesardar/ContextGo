import { Markdown } from '@/components/share/markdown';
import { cn } from '@/lib/utils';

export interface RichTextViewerProps {
  content: string;
  className?: string;
}

/**
 * Read-only renderer for Markdown produced by RichTextEditor. Shared across
 * every resource type's detail page.
 */
export function RichTextViewer({ content, className }: RichTextViewerProps) {
  return (
    <Markdown className={cn('dark:prose-invert', className)}>
      {content}
    </Markdown>
  );
}
