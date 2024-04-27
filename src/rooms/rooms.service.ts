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
      createdAt: new Date() 
    });
    const users = await Promise.all(createRoomInput.userIds.map(userId => this.usersService.findOne(userId)));
    
    room.users = users;
    
    return this.roomRepository.save(room);
  }


  async findAll(): Promise<Room[]> {
    const rooms =  await this.roomRepository
    .createQueryBuilder('room')
    .leftJoinAndSelect('room.users', 'user')
    .getMany();
    console.log(rooms);
    return rooms;
  }

  async findOne(id: number) : Promise<Room | null> {
    const room = await this.roomRepository.findOneBy({id});
    if(!room)
      throw new NotFoundException(`room with id ${id} doesn't exist `);
    else return room;
  }

  async update(id: number, updateRoomInput: UpdateRoomInput): Promise<Room>  {
    const room = await this.roomRepository.preload({
      id: id,
      ...UpdateRoomInput});
  if (room) {
    return this.roomRepository.save(room);
  } else {
    throw new NotFoundException(`room with id ${id} doesn't exist `);
  }
  }

  async remove(id: number): Promise<Room>{
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    await this.roomRepository.softDelete(id);
    return room;
    
  }
}
