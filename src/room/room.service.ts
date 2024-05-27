import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create({
      ...createRoomDto,
      createdAt: new Date(),
    });

    return this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findOne(id: number): Promise<Room | null> {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) throw new NotFoundException(`room with id ${id} doesn't exist `);
    else return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomRepository.preload({
      id,
      ...updateRoomDto,
    });
    if (room) {
      return this.roomRepository.save(room);
    } else {
      throw new NotFoundException(`room with id ${id} doesn't exist `);
    }
  }

  async addUsersToRoom(roomId: number, userIds: number[]): Promise<Room> {
    const room = await this.findOne(roomId);
    //console.log(room);
    if (!room)
      throw new NotFoundException(`room with id ${roomId} doesn't exist `);
    const users = await Promise.all(
      userIds.map((userId) => this.usersService.findOne(userId)),
    );
    if (users.length !== userIds.length)
      throw new NotFoundException(`Some users not found`);
    room.users = [...room.users, ...users];
    return this.roomRepository.save(room);
  }

  async removeUsersFromRoom(roomId: number, userIds: number[]): Promise<Room> {
    const room = await this.findOne(roomId);
    console.log(room);
    if (!room)
      throw new NotFoundException(`room with id ${roomId} doesn't exist `);
    const users = await Promise.all(
      userIds.map((userId) => this.usersService.findOne(userId)),
    );
    if (users.length !== userIds.length)
      throw new NotFoundException(`Some users not found`);
    room.users = room.users.filter((user) => !userIds.includes(user.id));
    return this.roomRepository.save(room);
  }

  async remove(id: number): Promise<Room> {
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    await this.roomRepository.softDelete(id);
    return room;
  }

  getUsers(id: number) {
    // return this.usersService.findUsersByRoomId(id);
    return "test"
  }

  async findUserRooms(userId: number): Promise<Room[]> {
    return this.roomRepository
      .createQueryBuilder('room')
      .innerJoin('room.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }
  
}
