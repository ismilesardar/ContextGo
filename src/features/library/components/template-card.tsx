'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_LABELS } from '../utils/library-copy';
import type { LibraryTemplateSummary } from '../utils/use-library-templates';

export function TemplateCard({
  template,
  onPreview,
  onUse,
  compact = false
}: {
  template: LibraryTemplateSummary;
  onPreview: () => void;
  onUse: () => void;
  compact?: boolean;
}) {
  return (
    <Card className={compact ? 'gap-3 py-4' : 'gap-3'}>
      <CardHeader className={compact ? 'px-4' : undefined}>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='text-foreground line-clamp-1 text-base font-medium'>
            {template.title}
          </h3>
          <Badge variant='outline' className='shrink-0 text-xs'>
            {CATEGORY_LABELS[template.sourceCategory]}
          </Badge>
        </div>
        {template.description && (
          <p className='text-muted-foreground line-clamp-2 text-sm'>
            {template.description}
          </p>
        )}
      </CardHeader>
      <CardContent
        className={`flex items-center justify-between gap-2 ${compact ? 'px-4' : ''}`}
      >
        <div className='flex flex-wrap gap-1'>
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant='secondary' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>
        <div className='flex shrink-0 items-center gap-2'>
          <Button variant='outline' size='sm' onClick={onPreview}>
            Preview
          </Button>
          <Button size='sm' onClick={onUse}>
            Use
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
