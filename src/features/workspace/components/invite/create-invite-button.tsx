'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { usePathname } from 'next/navigation';
import { queryClient } from '@/lib/api-setting/react-query';
import { useWorkspaceStore } from '@/store';
import { WORKSPACE_ROLES } from '@/utils/constants/organization-const';
import { usePermissions } from '@/hooks/workspace/use-workspace-has-permission';
import { useUserSession } from '@/hooks/use-client-session';
import { useAddWorkspaceInviteModal } from '@/components/ui/modal/workspace-invite-modal';

const createInviteSchema = z.object({
  email: z.email().min(1).trim(),
  role: z.enum(['owner', 'moderator', 'member', 'viewer'])
});

type CreateInviteForm = z.infer<typeof createInviteSchema>;

export function CreateInviteButton() {
  const pathname = usePathname();
  const { user } = useUserSession();
  const { hasPermission } = usePermissions();
  const { refreshActiveWorkspace, activeWorkspace } = useWorkspaceStore();
  const { setShowAddWorkspaceInviteModal, AddWorkspaceInviteModal } =
    useAddWorkspaceInviteModal();

  // Workspace permission
  const canUpdate = hasPermission('organization', 'update');

  const [open, setOpen] = useState(false);

  const form = useForm<CreateInviteForm>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: '',
      role: 'member'
    }
  });

  const { isSubmitting } = form.formState;

  async function handleCreateInvite(data: CreateInviteForm) {
    if (!canUpdate) {
      return toast.error('Unauthorized action!');
    }

    await authClient.organization.inviteMember(data, {
      onError: (error) => {
        toast.error(error.error.message || 'Failed to invite user');
      },
      onSuccess: async (context) => {
        form.reset();
        setOpen(false);
        if (activeWorkspace?.id) {
          await refreshActiveWorkspace({ slug: activeWorkspace.slug });
        }
      }
    });
  }

  const isMember = pathname.endsWith(`/settings/members`);

  if (!canUpdate) {
    return null;
  }

  return isMember ? (
    <>
      <AddWorkspaceInviteModal />
      <Button
        variant='outline'
        onClick={() => setShowAddWorkspaceInviteModal(true)}
      >
        Invite member
      </Button>
    </>
  ) : null;
}
