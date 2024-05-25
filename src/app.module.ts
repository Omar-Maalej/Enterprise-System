import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { MessagesGateway } from './chat/message.gateway';
// import { MessageController } from './chat/message.controller';
// import { MessageService } from './chat/message.service';
import * as dotenv from 'dotenv';
import { RedisModule } from 'nestjs-ioredis';
import { SseModule } from './sse/sse.module';
import { PostsModule } from './posts/posts.module';



dotenv.config();

@Module({
  imports: [UsersModule,
    SseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile : 'src/schema.gql'
  }),
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
    }), 
    RedisModule.forRoot({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB),
    })
    ,AuthModule, MessagesModule, RoomsModule, PostsModule,
  ],
  // controllers: [AppController, MessageController],
  controllers: [AppController],
  // providers: [AppService,MessagesGateway, MessageService],
  providers: [AppService],
})
export class AppModule {}
