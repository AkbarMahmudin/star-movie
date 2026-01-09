import { Role, User } from '@prisma/client';

export class UserViewModel {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
  createdAt: string; // formatted ISO
  updatedAt: string; // formatted ISO

  static fromEntity(user: User & { role: Role }): UserViewModel {
    return {
      id: user.id,
      name: user?.name ?? '',
      email: user.email,
      role: user?.role,
      isActive: user?.isActive,
      createdAt:
        typeof user.createdAt === 'string'
          ? user.createdAt
          : user.createdAt.toISOString(),
      updatedAt:
        typeof user.updatedAt === 'string'
          ? user.updatedAt
          : user.updatedAt.toISOString(),
    };
  }

  static fromEntities(users: User[]): UserViewModel[] {
    return users.map(this.fromEntity);
  }
}
