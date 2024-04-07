import {  Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}
      
async login(credentials: UserLoginDto): Promise<Partial<User>> {
    const { username, password } = credentials;
    // We can log in via username or email
    const user = await this.userRepository.createQueryBuilder("user")
      .where("user.username = :username or user.email = :username",{ username: username })
      .getOne();
    console.log(username);
    if (!user)
      throw new NotFoundException('Wrong username or password');
  
    // Check password if user exists
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return {
        username: user.username,
        email: user.email,
        role: user.role
      };
    } else {
      // If password is wrong
      throw new NotFoundException('Wrong username or password');
    }
  }
}  