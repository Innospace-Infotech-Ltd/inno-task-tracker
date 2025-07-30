export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export enum Permission {
  // Task permissions
  CREATE_TASK = 'create:task',
  READ_TASK = 'read:task',
  UPDATE_TASK = 'update:task',
  DELETE_TASK = 'delete:task',

  // User permissions
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',

  // Admin permissions
  MANAGE_ROLES = 'manage:roles',
  VIEW_ANALYTICS = 'view:analytics',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
  ],
  [UserRole.MANAGER]: [
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.DELETE_TASK,
    Permission.READ_USER,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.ADMIN]: [
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.DELETE_TASK,
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_ROLES,
    Permission.VIEW_ANALYTICS,
  ],
};
