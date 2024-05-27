import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() newUser: CreateUserDto) {
      console.log("newUser",newUser);
      newUser.salt= await bcrypt.genSalt();
      newUser.password=await bcrypt.hash(newUser.password,newUser.salt);
      const userCreated = await this.usersService.create(newUser);
      this.eventEmitter.emit('user.created', userCreated);
      return userCreated;
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number){
      return await this.usersService.softDeleteUser(id);
  }

  @Get('restore/:id')
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.restoreUser(id);
  }

  @Get('/online-users')
  getOnlineUsers(){
    return this.usersService.getOnlineUsers();
  }


}
