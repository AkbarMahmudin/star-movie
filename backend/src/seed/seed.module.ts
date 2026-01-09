import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SeedCommand } from './seed.command';
import { PrismaService } from '../database/prisma.service';
import { GenerateSeederCommand } from './generate-seeder.command';
import { SeederRegistry } from './seeders/seeder.registry';
import './seeders';

@Module({})
export class SeedModule {
  static register(): DynamicModule {
    const seederClasses = SeederRegistry.getSeeders();

    const providers: Provider[] = [
      PrismaService,
      SeedCommand,
      GenerateSeederCommand,
      ...seederClasses,
      {
        provide: 'SEEDERS',
        useFactory: (...instances: any[]) => instances,
        inject: seederClasses,
      },
    ];

    return {
      module: SeedModule,
      providers,
    };
  }
}
