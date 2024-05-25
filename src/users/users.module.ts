import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SseModule } from 'src/sse/sse.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports : [TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
