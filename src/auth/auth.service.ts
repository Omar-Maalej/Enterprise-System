import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from 'src/users/entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(registerAuthDto: UserRegisterDto): Promise<void> {
    const { username, password, email } = registerAuthDto;

    const user = new User();
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already taken');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
 

  async login(credentials: UserLoginDto) {
    const { username, password } = credentials;
    console.log('Entered username:', username);
    console.log('Entered password:', password);

    const user = await this.userRepository.createQueryBuilder("user")
      .where("user.username = :username or user.email = :username", { username })
      .getOne();

    if (!user) {
      throw new NotFoundException('Wrong username or password');
    }

    // Logging for debugging
    console.log('Entered username:', username);
    console.log('Entered password:', password);
    console.log('Stored hashed password:', user.password);
    


    const isPasswordValid = await bcrypt.compare(password, user.password).
      then((result) => {
        console.log('Password valid:', result);
        return result;
      });
    console.log('Password valid:',  isPasswordValid);

    if (isPasswordValid) {
      const payload = {
        id : user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      console.log('JWT payload:', payload);

      const jwt = await this.jwtService.sign(payload, {
        secret: 'secretKey',
        expiresIn: '1h'
      });
      return {
        access_token: jwt,
        userData: payload
      };
    } else {
      throw new NotFoundException('Wrong username or password');
    }
  }
}
