import { Injectable } from '@nestjs/common';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private roomRepository: Repository<Room>){}
  
  create(createRoomInput: CreateRoomInput) {
    return 'This action adds a new room';
  }

  findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  findOne(id: number) : Promise<Room | null> {
    return this.roomRepository.findOneBy({id});
  }

  update(id: number, updateRoomInput: UpdateRoomInput) {
    return `This action updates a #${id} room`;
  }

  remove(id: number){
    return `This action removes a #${id} room`;
  }
}
