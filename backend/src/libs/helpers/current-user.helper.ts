import { ClsService } from 'nestjs-cls';
import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrentUser {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  async authenticated() {
    const tokenDecode = this.cls.get('currentUser');
    if (!tokenDecode) return;

    const authUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: tokenDecode.id },
    });
    if (!authUser) return;
    return authUser;
  }
}
