import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('/register')
  signup(@Body(ValidationPipe) registerAuthDto: UserRegisterDto): Promise<void> {
    return this.authService.register(registerAuthDto);
  }


  @Post('login')
  login(
    @Body() userData: UserLoginDto
  ) {
    return this.authService.login(userData);
  }
}
