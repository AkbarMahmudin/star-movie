import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local.guard';
import { JwtGuard } from './guard/jwt.guard';
import { CurrentUser } from '../../libs/decorators';
import { UserViewModel } from '../../common/viewmodels/user.viewmodel';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @UseGuards(LocalGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Delete()
  @UseGuards(LocalGuard)
  async logout(@Request() req) {
    return req.logout();
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  getProfile(@CurrentUser() user) {
    return UserViewModel.fromEntity(user);
  }
}
