import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface WorkspaceAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  workspace: {
    logo?: string | null;
    name?: string | null;
    memberCount?: number;
    plan?: string;
  } | null;
}

export function WorkspaceAvatarProfile({
  className,
  showInfo = false,
  workspace
}: WorkspaceAvatarProfileProps) {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={workspace?.logo || ''} alt={workspace?.name || ''} />
        <AvatarFallback className='rounded-lg'>
          <AvatarImage
            src='/assets/avatars/workspace.png'
            alt={workspace?.name || 'workspace'}
          />
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>
            {workspace?.name || ''}
          </span>
          <div className='flex gap-1'>
            <span className='truncate text-xs'>
              {workspace?.plan || 'Free'}
            </span>{' '}
            &#x2022;
            <span className='truncate text-xs'>
              {workspace?.memberCount || '1'} Member
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
