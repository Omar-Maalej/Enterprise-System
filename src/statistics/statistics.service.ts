import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';


@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async getStatistics() {
    
    const nonDeletedUsers = await this.userRepository.count({ where: { deletedAt: null } });
    const totalUsers = await this.userRepository.count({withDeleted:true });
    const deletedUsers = totalUsers- nonDeletedUsers;
    const totalRooms = await this.roomRepository.count();

    return {
      totalUsers,
      nonDeletedUsers,
      deletedUsers,
      totalRooms,
    };
  }
}