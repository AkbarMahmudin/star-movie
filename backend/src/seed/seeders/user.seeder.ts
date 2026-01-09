import { Injectable } from '@nestjs/common';
import { ISeeder } from './seeder.interface';
import { PrismaService } from '../../database/prisma.service';
import { RegisterSeeder } from '../../libs/decorators/register-seeder.decorator';
import { hashSync } from 'bcrypt';

// Dummy Data
import users from '../dummy/user.json';


@RegisterSeeder()
@Injectable()
export class UserSeeder implements ISeeder {
  name = 'user';

  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const userPayloads = users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      password: hashSync('BalePananggeuhanIstimew4!', 10),
      roles: {
        connect: [{ id: user.roleId }],
      },
      ...(user?.unitId && {
        unit: { connect: { id: user?.unitId } },
      }),
    }))

    await this.prisma.$transaction(async (tx) => {
      for (const { id, ...userPayload } of userPayloads) {
        await tx.user.upsert({
          create: userPayload,
          update: userPayload,
          where: {
            username: userPayload.username,
          },
        });
      }
    });

    console.log('✅ Users seeded.');
  }
}
