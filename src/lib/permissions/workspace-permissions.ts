import { createAccessControl } from 'better-auth/plugins/access';
import {
  defaultStatements,
  adminAc
} from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  organization: ['create', 'update', 'delete', 'read'],
  billing: ['create', 'cancel', 'delete', 'read']
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...adminAc.statements,
  organization: ['create', 'update', 'delete', 'read'],
  billing: ['create', 'cancel', 'delete', 'read']
});

export const moderator = ac.newRole({
  invitation: [...adminAc.statements.invitation],
  organization: ['update', 'read'],
  billing: ['read']
});

export const member = ac.newRole({
  organization: ['read'],
  billing: ['read']
});

export const viewer = ac.newRole({
  organization: ['read']
});

export const rolePermissionsMap = {
  owner,
  moderator: {
    organization: ['update', 'read'],
    invitation: ['create', 'cancel'],
    billing: ['read']
  },
  member: { organization: ['read'], billing: ['read'] },
  viewer: { organization: ['read'] }
};

export type WorkspaceRole = keyof typeof rolePermissionsMap;
