import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [SseService],
  controllers: [SseController],
  exports: [SseService]
})
export class SseModule {}