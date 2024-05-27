import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [EventEmitterModule.forRoot(), JwtModule],
  providers: [SseService],
  controllers: [SseController],
  exports: [SseService],
})
export class SseModule {}