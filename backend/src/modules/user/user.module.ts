import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CurrentUser } from '../../libs/helpers';

@Module({
  controllers: [UserController],
  providers: [UserService, CurrentUser],
})
export class UserModule {}
