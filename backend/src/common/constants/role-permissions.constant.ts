export const RolePermissions: Record<string, string[]> = {
  superadmin: ['user:create', 'user:update', 'user:delete'],
  user: ['user:read'],
};
