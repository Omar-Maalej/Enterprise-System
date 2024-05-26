import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), UsersModule, JwtModule],
  controllers: [RoomController],
  providers: [RoomService, UsersService, AdminGuard],
})
export class RoomModule {}
