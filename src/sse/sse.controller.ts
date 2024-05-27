import { Controller, Sse, Res, Param, UseGuards, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { SseService } from './sse.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('events')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  // @UseGuards(JWTAuthGuard)
  @Sse('subscribe')
  subscribe(@Req() req: Request, @Res() res: Response): Observable<any> {
    // const user: any = req.user;
    const userId :any = req.query.userId;
    const role :any  = req.query.role;
    const userToSse = {
      userId: userId,
      role: role,
    };

    this.sseService.addClient(userToSse, res);

    return new Observable((subscriber) => {
      res.on('close', () => {
        subscriber.complete();
        this.sseService.removeClient(userToSse, res);
      });
    });
  }
}