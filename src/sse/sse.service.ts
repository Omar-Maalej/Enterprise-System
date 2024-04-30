import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SseService {
  private clients: Response[] = [];

  addClient(client: Response) {
    this.clients.push(client);
    client.on('close', () => {
      this.clients = this.clients.filter(c => c !== client);
    });
  }

  sendEvent(data: any) {
    this.clients.forEach(client => {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}