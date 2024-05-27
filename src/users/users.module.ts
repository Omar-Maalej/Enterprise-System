import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SseModule } from 'src/sse/sse.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SseModule, JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports : [TypeOrmModule.forFeature([User]), UsersService]  
})
export class UsersModule {}
