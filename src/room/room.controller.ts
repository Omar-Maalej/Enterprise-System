import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDec } from 'src/decorators/user.decorator';

@UseGuards(JWTAuthGuard)
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Post('add/users')
  addUsersToRoom(@Body() body: { roomId: number; userIds: number[] }) {
    return this.roomService.addUsersToRoom(body.roomId, body.userIds);
  }

  @Post('remove/users')
  removeUsersFromRoom(@Body() body: { roomId: number; userIds: number[] }) {
    return this.roomService.removeUsersFromRoom(body.roomId, body.userIds);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get('user-rooms')
  findUserRooms(@UserDec() user: any) {
    return this.roomService.findUserRooms(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
