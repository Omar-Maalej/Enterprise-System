import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import * as bcrypt from 'bcrypt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async create(newUser: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      console.log('new Pass', newUser.password);
      // const hashedPassword = await bcrypt.hash(newUser.password, salt);

      const userEntity = this.userRepository.create({
        ...newUser,
        // password: hashedPassword,
        salt: salt, // Ensure salt is stored correctly if needed
      });

      return await this.userRepository.save(userEntity);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('Duplicate entry')
      ) {
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async findAll(mode: boolean): Promise<User[]> {
    return await this.userRepository.find({
      withDeleted: mode,
    });
  }

  async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<any> {
    const { page = 1, limit = 10 } = paginationQuery;
    const [results, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: results,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`le user d'id ${id} n'existe pas`);
    }
    return await user;
  }

  async update(id: number, updatedUser: UpdateUserDto): Promise<User> {
    const newUser = await this.userRepository.preload({ id, ...updatedUser });
    if (newUser) {
      return await this.userRepository.save(newUser);
    } else {
      throw new NotFoundException(`le user d'id ${id} n'existe pas`);
    }
  }

  async softDeleteUser(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async restoreUser(id: number) {
    return await this.userRepository.restore(id);
  }

  async getOnlineUsers(): Promise<string[]> {
    const onlineUsers = await this.redisService.getUsersIds();
    console.log('onlineUsers', onlineUsers);
    return onlineUsers;
  }
}
