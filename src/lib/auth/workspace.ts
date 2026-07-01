// lib/workspace/with-workspace.ts
import { NextResponse } from 'next/server';
import { withAuth, ApiContext } from '@/lib/api/base-handler';
import { WorkspaceRole } from '@/lib/permissions/workspace-permissions';
import {
  getPermissionsByRole,
  PermissionAction
} from '../api/rbac/permissions';
import { auth } from './auth';
import { headers } from 'next/headers';

export interface WorkspaceContext extends ApiContext {
  workspaceId: string; // Override to make required
  permissions: PermissionAction[];
  role: WorkspaceRole;
  activeOrganization: {
    id: string;
    slug: string;
    name: string;
    role: WorkspaceRole;
  } | null;
}

export interface WithWorkspaceOptions {
  requiredPermissions?: PermissionAction[];
  requiredRoles?: WorkspaceRole[];
  requireActiveOrganization?: boolean;
}

export type WorkspaceHandler = (
  context: WorkspaceContext & {
    req: Request;
    params: Record<string, string | string[]>;
    searchParams: URLSearchParams;
    body?: any;
  }
) => Promise<Response>;

/**
 * Workspace-specific handler that extends the base auth handler
 * Use this for routes that need workspace/organization context
 */
export function withWorkspace(
  handler: WorkspaceHandler,
  options: WithWorkspaceOptions = {}
) {
  // First wrap with base auth handler
  return withAuth(async (req, { params, searchParams, apiContext, body }) => {
    let workspaceId = apiContext.workspaceId || '';
    let activeOrganization = null;
    let role: WorkspaceRole = 'viewer';
    let permissions: PermissionAction[] = [];

    // Get active organization details if available
    if (apiContext.session?.session?.activeOrganizationId) {
      try {
        const org = await auth.api.getFullOrganization({
          query: {
            organizationId: apiContext.session.session.activeOrganizationId
          },
          headers: await headers()
        });

        const member = await auth.api.getActiveMember({
          headers: await headers()
        });

        if (org && member) {
          role = (member.role as WorkspaceRole) || 'viewer';
          permissions = getPermissionsByRole(role);

          activeOrganization = {
            id: org.id,
            slug: org.slug,
            name: org.name,
            role
          };
          workspaceId = org.id;
        }
      } catch (error) {
        console.error('Failed to get organization:', error);
      }
    }

    // Check if active organization is required
    if (options.requireActiveOrganization && !activeOrganization) {
      return NextResponse.json(
        {
          error: 'No active organization selected',
          code: 'no_active_organization'
        },
        { status: 400 }
      );
    }

    // Override workspaceId from URL if provided
    const rawId = params.idOrSlug || searchParams.get('workspaceId');
    const urlWorkspaceId = Array.isArray(rawId) ? rawId[0] : rawId;
    if (urlWorkspaceId) {
      workspaceId = urlWorkspaceId;
    }

    // Check roles
    if (options.requiredRoles?.length && role) {
      if (!options.requiredRoles.includes(role)) {
        return NextResponse.json(
          {
            error: `Insufficient role. Required: ${options.requiredRoles.join(', ')}`,
            code: 'insufficient_role'
          },
          { status: 403 }
        );
      }
    }

    // Check permissions
    if (options.requiredPermissions?.length) {
      const missingPermissions = options.requiredPermissions.filter(
        (requiredPerm) => !permissions.includes(requiredPerm)
      );

      if (missingPermissions.length > 0) {
        return NextResponse.json(
          {
            error: `Missing permissions: ${missingPermissions.join(', ')}`,
            code: 'insufficient_permissions'
          },
          { status: 403 }
        );
      }
    }

    // Create full workspace context
    const workspaceContext: WorkspaceContext = {
      ...apiContext,
      workspaceId,
      permissions,
      role,
      activeOrganization
    };

    return await handler({
      req,
      params,
      searchParams,
      body,
      ...workspaceContext
    });
  });
}
