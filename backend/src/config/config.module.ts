import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';
import appConfig from './app.config';
import authConfig from './jwt.config';
import fileConfig from './file.config';
import filesConfig from './files.config';

@Module({
  imports: [
    NestConfig.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, fileConfig, filesConfig],
      expandVariables: true,
    }),
  ],
})
export class ConfigModule {}
