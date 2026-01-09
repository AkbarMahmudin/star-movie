import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import {
  IS_PUBLIC_KEY,
  PERMISSIONS_KEY,
  ROLES_KEY,
} from '../../../libs/decorators';
import { RoleType } from '../../../common/enums';
import { RolePermissions } from '../../../common/constants';
import { Role, User } from '@prisma/client';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Using if you want to change your route to public not must auth
     * */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const result = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user as User & { role: Role };

    /**
     * Using if protect your route by user role (RBAC)
     * */
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles) {
      return requiredRoles.some((role) => user?.role?.name === role);
    }

    /**
     * Using if protect your route by user role permission (ACL)
     * */
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions) {
      const userPermissions = RolePermissions[user?.role?.name] || [];
      return requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );
    }

    return !!user;
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
