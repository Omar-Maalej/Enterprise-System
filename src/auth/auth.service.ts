import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}
      
    async register(userData: UserRegisterDto): Promise<Partial<User>> {
      const user=this.userRepository.create({
        ...userData,
      });
      user.salt= await bcrypt.genSalt();
      user.password=await bcrypt.hash(user.password,user.salt);
      try{
        await this.userRepository.save(user);
      }
      catch(error){
        throw new ConflictException('Username or email already exists');
      }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
}

}
