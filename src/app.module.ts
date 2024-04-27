import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MessagesGateway } from './chat/message.gateway';
import { MessageController } from './chat/message.controller';
import { MessageService } from './chat/message.service';
import * as dotenv from 'dotenv';


dotenv.config();

@Module({
  imports: [UsersModule, 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }), AuthModule,
  ],
  controllers: [AppController, MessageController],
  providers: [AppService,MessagesGateway, MessageService],
})
export class AppModule {}
