import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports :[TypeOrmModule.forFeature([User]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
              JwtModule.register({
                secret: 'secretKey',
                signOptions: { expiresIn: 3600 },
              }),
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
