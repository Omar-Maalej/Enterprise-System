import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { EventEnum } from './enum/event.enum';

@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() newUser: CreateUserDto) {
    console.log('newUser', newUser);
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(newUser.password, newUser.salt);
    const userCreated = await this.usersService.create(newUser);
    this.eventEmitter.emit(EventEnum.USER_CREATED, userCreated);
    return userCreated;
  }

  @Get()
  findAll(@Query('mode') mode: string) {
    const withDeleted = mode === 'withDeleted' ? true : false;
    return this.usersService.findAll(withDeleted);
  }

  @Get('/pagination')
  findAllPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.usersService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userUpdated = this.usersService.update(id, updateUserDto);
    this.eventEmitter.emit(EventEnum.USER_UPDATED, userUpdated);
    return userUpdated;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    this.eventEmitter.emit(EventEnum.USER_DELETED, id);
    return await this.usersService.softDeleteUser(id);
  }

  @Get('restore/:id')
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.restoreUser(id);
  }

  @Post('/online-users')
  async getOnlineUsers() {
    return await this.usersService.getOnlineUsers();
  }

}
