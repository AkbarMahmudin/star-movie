import { Injectable } from '@nestjs/common';
import { ISeeder } from './seeder.interface';
import { PrismaService } from '../../database/prisma.service';
import { RegisterSeeder } from '../../libs/decorators/register-seeder.decorator';
import { Role } from '../../common/enums/role.enum';

@RegisterSeeder()
@Injectable()
export class RoleSeeder implements ISeeder {
  name = 'role';

  constructor(private readonly prisma: PrismaService) {}

  async run() {
    console.log('⏳  Seeding RoleSeeder...');

    const roles = Object.values(Role).map((val, index) => ({
      id: index + 1,
      name: val,
    }));

    for (const role of roles) {
      await this.prisma.role.upsert({
        create: role,
        update: role,
        where: {
          id: role.id,
        },
      });
    }

    console.log('✅  RoleSeeder seeded.');
  }
}
