import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomsService {
  
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>,
              private readonly usersService : UsersService              
){}

  async create(createRoomInput: CreateRoomInput): Promise<Room> {
    const room = this.roomRepository.create({
      ...createRoomInput,
      createdAt: new Date(),
    });
    const users = await Promise.all(createRoomInput.userIds.map(userId => this.usersService.findOne(userId)));
    if(users.length !== createRoomInput.userIds.length)
      throw new NotFoundException(`Some users not found`);

    room.users = users;
    
    return this.roomRepository.save(room);
  }


  async findAll(): Promise<Room[]> {
  /*   const rooms =  await this.roomRepository
    .createQueryBuilder('room')
    .leftJoinAndSelect('room.users', 'user')
    .getMany();
    console.log(rooms);
    return rooms; */
    // fixed with @resolveField in rooms.resolver.ts
    return this.roomRepository.find();
  }

  async findOne(id: number) : Promise<Room | null> {
    const room = await this.roomRepository.findOneBy({id});
    if(!room)
      throw new NotFoundException(`room with id ${id} doesn't exist `);
    else return room;
  }

  async update(updateRoomInput: UpdateRoomInput): Promise<Room>  {
    //console.log(updateRoomInput);
    const room = await this.roomRepository.preload({
      id: updateRoomInput.id,
      ...updateRoomInput});
    //console.log(room);
  if (room) {
    return this.roomRepository.save(room);
  } else {
    throw new NotFoundException(`room with id ${updateRoomInput.id} doesn't exist `);
  }
  }

  async addUsersToRoom(roomId: number, userIds: number[]): Promise<Room> {
    const room = await this.findOne(roomId);
    //console.log(room);
    if(!room)
      throw new NotFoundException(`room with id ${roomId} doesn't exist `);
    const users = await Promise.all(userIds.map(userId => this.usersService.findOne(userId)));
    if(users.length !== userIds.length)
      throw new NotFoundException(`Some users not found`);
    room.users = [...room.users, ...users];
    return this.roomRepository.save(room);
  }

  async removeUsersFromRoom(roomId: number, userIds: number[]): Promise<Room> {
    const room = await this.findOne(roomId);
    console.log(room);
    if(!room)
      throw new NotFoundException(`room with id ${roomId} doesn't exist `);
    const users = await Promise.all(userIds.map(userId => this.usersService.findOne(userId)));
    if(users.length !== userIds.length)
      throw new NotFoundException(`Some users not found`);
    room.users = room.users.filter(user => !userIds.includes(user.id));
    return this.roomRepository.save(room);
  }

  async remove(id: number): Promise<Room>{
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    await this.roomRepository.softDelete(id);
    return room;
    
  }

  getUsers(id: number) {
    return this.usersService.findUsersByRoomId(id);
  }
}
