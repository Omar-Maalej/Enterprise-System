import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: 3600 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService], // Export JwtService
})
export class AuthModule {}
