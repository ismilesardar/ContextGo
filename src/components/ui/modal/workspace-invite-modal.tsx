'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { toast } from 'sonner';
import { CustomModal } from '../custom-model';
import { Button } from '../button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../form';
import { Input } from '../input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../select';
import { WORKSPACE_ROLES } from '@/utils/constants/organization-const';
import { LoadingSwap } from '../loading-swap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';
import { authClient } from '@/lib/auth/auth-client';
import { useWorkspaceStore } from '@/store';
import { cn } from '@/lib/utils';

const createInviteSchema = z.object({
  email: z.email().min(1).trim(),
  role: z.enum(['owner', 'moderator', 'member', 'viewer'])
});

type CreateInviteForm = z.infer<typeof createInviteSchema>;

function AddWorkspaceInviteModalHelper({
  showAddWorkspaceInviteModal,
  setShowAddWorkspaceInviteModal
}: {
  showAddWorkspaceInviteModal: boolean;
  setShowAddWorkspaceInviteModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { hasPermission } = usePermissions();
  const { refreshActiveWorkspace, activeWorkspace } = useWorkspaceStore();

  // Workspace permission
  const canUpdate = hasPermission('organization', 'update');

  const inviteForm = useForm<CreateInviteForm>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: '',
      role: 'member'
    }
  });

  const { isSubmitting, isValid } = inviteForm.formState;

  async function handleCreateInvite(data: CreateInviteForm) {
    if (!canUpdate) {
      return toast.error('Unauthorized action!');
    }

    await authClient.organization.inviteMember(data, {
      onError: (error) => {
        toast.error(error.error.message || 'Failed to invite user');
      },
      onSuccess: async (context) => {
        inviteForm.reset();
        setShowAddWorkspaceInviteModal(false);
        if (activeWorkspace?.id) {
          await refreshActiveWorkspace({ slug: activeWorkspace.slug });
        }
      }
    });
  }

  return (
    <CustomModal
      showModal={showAddWorkspaceInviteModal}
      setShowModal={setShowAddWorkspaceInviteModal}
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6'>
        <h3 className='text-lg font-medium'>Invite Teammates</h3>
        <p className='text-sm text-neutral-500'>
          Invite your team members to collaborate on your workspace.
        </p>
      </div>

      <Form
        form={inviteForm}
        className='space-y-6 px-4 py-4 sm:px-6'
        onSubmit={inviteForm.handleSubmit(handleCreateInvite)}
      >
        <FormField
          control={inviteForm.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={inviteForm.control}
          name='role'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {WORKSPACE_ROLES.map((r) => (
                      <SelectItem key={r.key} value={r.key}>
                        {r.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          type='submit'
          disabled={isSubmitting}
          className={cn(
            'w-full',
            isValid
              ? 'cursor-pointer bg-(--brand-color) hover:bg-(--brand-color)/80'
              : 'cursor-not-allowed'
          )}
        >
          {/* {isSubmitting && <Spinner />} */}
          <LoadingSwap isLoading={isSubmitting}>Invite</LoadingSwap>
        </Button>
        {/* <DialogFooter> */}
        {/* <Button
                    type='button'
                    variant='outline'
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    <LoadingSwap isLoading={isSubmitting}>Invite</LoadingSwap>
                  </Button> */}
        {/* </DialogFooter> */}
      </Form>
    </CustomModal>
  );
}

export function useAddWorkspaceInviteModal() {
  const [showAddWorkspaceInviteModal, setShowAddWorkspaceInviteModal] =
    useState(false);

  const AddWorkspaceInviteModal = useCallback(() => {
    return (
      <AddWorkspaceInviteModalHelper
        showAddWorkspaceInviteModal={showAddWorkspaceInviteModal}
        setShowAddWorkspaceInviteModal={setShowAddWorkspaceInviteModal}
      />
    );
  }, [showAddWorkspaceInviteModal, setShowAddWorkspaceInviteModal]);

  return useMemo(
    () => ({ setShowAddWorkspaceInviteModal, AddWorkspaceInviteModal }),
    [setShowAddWorkspaceInviteModal, AddWorkspaceInviteModal]
  );
}
