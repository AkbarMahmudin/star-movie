import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { clsOptions } from './config';
import { SeedModule } from './seed/seed.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from './config/config.module';
import { ModulesModule } from './modules/modules.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    ModulesModule,
    SharedModule,
    ConfigModule,
    ClsModule.forRoot(clsOptions),
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
