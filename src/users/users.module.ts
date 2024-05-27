// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SseModule } from 'src/sse/sse.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SseModule, JwtModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  exports: [TypeOrmModule.forFeature([User]), UsersService],
})
export class UsersModule {}
