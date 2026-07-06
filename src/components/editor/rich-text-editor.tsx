'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown } from '@tiptap/markdown';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconBlockquote,
  IconCode,
  IconLink,
  IconLinkOff
} from '@tabler/icons-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const STRIPPED_ATTRIBUTES = [
  'style',
  'class',
  'id',
  'bgcolor',
  'color',
  'face',
  'width',
  'height',
  'align'
];

/**
 * Pasted HTML often carries the source site's own inline styles (e.g. a
 * dark "black background" code box). Strip presentational attributes so
 * pasted content adopts the editor's own styling instead of the source's.
 */
function sanitizePastedHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.body.querySelectorAll('*').forEach((el) => {
    STRIPPED_ATTRIBUTES.forEach((attr) => el.removeAttribute(attr));
  });
  return doc.body.innerHTML;
}

/**
 * Shared rich text editor used by every resource type (Contexts today,
 * Instructions/Skills/Prompt Templates/Checklists later). Content is
 * persisted as Markdown so it's directly usable as an AI instruction file.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing…',
  className
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: 'text-primary underline underline-offset-4' }
      }),
      Markdown
    ],
    content: value,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
          'min-h-[280px] max-h-[60vh] overflow-y-auto overflow-x-hidden break-words px-4 py-3',
          'prose-p:my-2 prose-headings:mt-3 prose-headings:mb-1 prose-headings:leading-tight',
          'prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-blockquote:my-2 prose-pre:my-2',
          'prose-pre:max-w-full prose-pre:overflow-x-auto'
        )
      },
      transformPastedHTML: sanitizePastedHtml
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getMarkdown());
    }
  });

  return (
    <div
      className={cn(
        'border-input overflow-hidden rounded-md border',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        className
      )}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', previousUrl ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const items: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = [
    {
      icon: IconH2,
      label: 'Heading 2',
      isActive: editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      icon: IconH3,
      label: 'Heading 3',
      isActive: editor.isActive('heading', { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run()
    },
    {
      icon: IconBold,
      label: 'Bold',
      isActive: editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run()
    },
    {
      icon: IconItalic,
      label: 'Italic',
      isActive: editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run()
    },
    {
      icon: IconStrikethrough,
      label: 'Strikethrough',
      isActive: editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run()
    },
    {
      icon: IconList,
      label: 'Bullet list',
      isActive: editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run()
    },
    {
      icon: IconListNumbers,
      label: 'Ordered list',
      isActive: editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run()
    },
    {
      icon: IconBlockquote,
      label: 'Quote',
      isActive: editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run()
    },
    {
      icon: IconCode,
      label: 'Code block',
      isActive: editor.isActive('codeBlock'),
      onClick: () => editor.chain().focus().toggleCodeBlock().run()
    },
    {
      icon: editor.isActive('link') ? IconLinkOff : IconLink,
      label: 'Link',
      isActive: editor.isActive('link'),
      onClick: setLink
    }
  ];

  return (
    <div className='border-input bg-muted/40 flex flex-wrap items-center gap-1 border-b p-1.5'>
      {items.map(({ icon: Icon, label, isActive, onClick }) => (
        <Button
          key={label}
          type='button'
          variant={isActive ? 'secondary' : 'ghost'}
          size='icon'
          className='size-8'
          aria-label={label}
          onClick={onClick}
        >
          <Icon className='size-4' />
        </Button>
      ))}
    </div>
  );
}
