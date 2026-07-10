'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RESOURCE_TYPE_LABELS } from '../../utils/library-copy';
import type { PublicAssetSummary } from '../../utils/use-public-assets';

export function PublicAssetCard({
  asset,
  currentUserId,
  onPreview,
  onUse,
  onEdit,
  onDelete
}: {
  asset: PublicAssetSummary;
  currentUserId?: string;
  onPreview: () => void;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isOwner = !!currentUserId && asset.createdById === currentUserId;

  return (
    <Card className='gap-3'>
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='text-foreground line-clamp-1 text-base font-medium'>
            {asset.title}
          </h3>
          <Badge variant='outline' className='shrink-0 text-xs'>
            {RESOURCE_TYPE_LABELS[asset.resourceType]}
          </Badge>
        </div>
        {asset.description && (
          <p className='text-muted-foreground line-clamp-2 text-sm'>
            {asset.description}
          </p>
        )}
      </CardHeader>
      <CardContent className='flex items-center justify-between gap-2'>
        <p className='text-muted-foreground text-xs'>
          by {isOwner ? 'you' : asset.createdBy.name}
        </p>
        <div className='flex shrink-0 items-center gap-2'>
          <Button variant='outline' size='sm' onClick={onPreview}>
            Preview
          </Button>
          {isOwner && (
            <>
              <Button variant='outline' size='sm' onClick={onEdit}>
                Edit
              </Button>
              <Button variant='destructive' size='sm' onClick={onDelete}>
                Delete
              </Button>
            </>
          )}
          <Button size='sm' onClick={onUse}>
            Use
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
