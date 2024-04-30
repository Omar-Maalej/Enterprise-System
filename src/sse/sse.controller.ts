import { Controller, Sse, Res } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { SseService } from './sse.service';

@Controller('events')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('subscribe')
  subscribe(@Res() res: Response): Observable<any> {
    console.log('Client subscribed', res);
    this.sseService.addClient(res);
    return new Observable(subscriber => {
      res.on('close', () => {
        subscriber.complete();
      });
    });
  }
}
