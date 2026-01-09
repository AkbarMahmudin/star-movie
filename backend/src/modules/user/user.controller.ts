import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserViewModel } from '../../common/viewmodels/user.viewmodel';
import { IBaseController } from '../../shared/base';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFilter } from '../../libs/filters';
import { PaginationInterceptor } from '../../libs/interceptors';
import { JwtGuard } from '../../shared/auth';
import { HashPasswordPipe } from '../../libs/pipes';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController
  implements IBaseController<CreateUserDto, UpdateUserDto, UserViewModel>
{
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(HashPasswordPipe)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserViewModel> {
    const newUser = await this.userService.create(dto);
    return UserViewModel.fromEntity(newUser);
  }

  @Get()
  @UseInterceptors(new PaginationInterceptor())
  async findAll(
    @Query() query: QueryFilter,
  ): Promise<{ count: number; data: UserViewModel[] }> {
    const [count, data] = await this.userService.findAll(query)
    return { count, data: UserViewModel.fromEntities(data) };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number | string,
  ): Promise<UserViewModel> {
    const user = await this.userService.findOne(id);
    return UserViewModel.fromEntity(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number | string) {
    return this.userService.remove(id);
  }

  @Patch(':id')
  @UsePipes(HashPasswordPipe)
  async update(
    @Param('id', ParseIntPipe) id: number | string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserViewModel> {
    const userUpdated = await this.userService.update(id, dto);
    return UserViewModel.fromEntity(userUpdated);
  }
}
