import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (user?.roles?.length > 0) {
      user['role'] = user?.roles?.[0];
      // @ts-ignore
      delete user?.roles;
    }

    const isMatch = await compare(password, user?.password);

    if (user && isMatch) {
      // @ts-ignore
      delete user.password;
      return user;
    }

    return null;
  }

  login(user: Omit<User, 'password'>) {
    // TODO: Add refresh token optional
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
