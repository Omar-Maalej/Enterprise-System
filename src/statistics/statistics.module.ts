import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/room/entities/room.entity';

@Module({
  imports : [TypeOrmModule.forFeature([User, Room])],
  providers: [StatisticsService],
  controllers: [StatisticsController]
})
export class StatisticsModule {}
