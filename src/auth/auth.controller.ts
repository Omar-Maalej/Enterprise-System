import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() userData: UserRegisterDto
  ): Promise<Partial<User>> {
    return this.authService.register(userData);
  }
}
