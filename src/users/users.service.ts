import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(newUser: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async findAll() :Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number) :Promise<User> {
    const user=await this.userRepository.findOne({where: {id}});
    if (!user){
      throw new NotFoundException(`le user d'id ${id} n'existe pas` );
   }
   return await user;
  }

  async update(id: number, updatedUser:UpdateUserDto): Promise<User> {
    const  newUser = await this.userRepository.preload({id,...updatedUser,});
    if (newUser) {
      return await this.userRepository.save(newUser);
    } else {
      throw new NotFoundException('user inexistant');
    }
}
 
  async softDeleteUser(id: number) {
   return await this.userRepository.softDelete(id);
} 

 async restoreUser(id: number) {
  return await this.userRepository.restore(id);
}
}