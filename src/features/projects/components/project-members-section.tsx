'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Spinner } from '@/components/ui/spinner';
import {
  useProjectMembers,
  useRemoveProjectMember,
  useUpdateProjectMemberRole
} from '../utils/use-project-members';
import { AddProjectMemberDialog } from './add-project-member-dialog';

export function ProjectMembersSection({
  projectId,
  canManage
}: {
  projectId: string;
  canManage: boolean;
}) {
  const { data: members, isLoading } = useProjectMembers(projectId);
  const updateRole = useUpdateProjectMemberRole(projectId);
  const removeMember = useRemoveProjectMember(projectId);

  return (
    <Card className='rounded-xl p-0'>
      <div className='border-border flex items-center justify-between border-b p-6'>
        <div>
          <h2 className='text-base font-semibold'>Members</h2>
          <p className='text-muted-foreground text-sm'>
            Only members granted access below can see or open this project.
          </p>
        </div>
        {canManage && members && (
          <AddProjectMemberDialog
            projectId={projectId}
            existingMembers={members}
          />
        )}
      </div>

      <div className='divide-border divide-y'>
        {isLoading && (
          <div className='flex justify-center p-6'>
            <Spinner />
          </div>
        )}

        {!isLoading && members?.length === 0 && (
          <p className='text-muted-foreground p-6 text-sm'>
            No members have been granted access yet.
          </p>
        )}

        {members?.map((member) => (
          <div
            key={member.id}
            className='flex items-center justify-between gap-4 p-4'
          >
            <div className='flex min-w-0 items-center gap-3'>
              <Avatar className='size-8'>
                <AvatarImage src={member.user?.image ?? undefined} />
                <AvatarFallback>
                  {member.user?.name?.[0]?.toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0'>
                <p className='truncate text-sm font-medium'>
                  {member.user?.name}
                </p>
                <p className='text-muted-foreground truncate text-xs'>
                  {member.user?.email}
                </p>
              </div>
            </div>

            {canManage ? (
              <div className='flex shrink-0 items-center gap-2'>
                <Select
                  value={member.role}
                  onValueChange={(role) =>
                    updateRole.mutate({
                      memberId: member.id,
                      role: role as 'member' | 'viewer'
                    })
                  }
                >
                  <SelectTrigger className='w-28'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='member'>Member</SelectItem>
                    <SelectItem value='viewer'>Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8'
                  onClick={() => removeMember.mutate(member.id)}
                >
                  <Icons.userMinus className='size-4' />
                </Button>
              </div>
            ) : (
              <span className='text-muted-foreground shrink-0 text-xs capitalize'>
                {member.role}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
