// import { Injectable, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';

@Injectable()
// export class SseService implements OnModuleInit {
    export class SseService {
  private clients: Response[] = [];

  constructor(private eventEmitter: EventEmitter2) {}

//   onModuleInit() {
//     this.eventEmitter.on('user.created', (data) => {
//       this.sendEvent(data);
//     });
//   }

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

  @OnEvent('user.created')
  handleUserCreatedEvent(data: any) {
    console.log('User created event received', data);
    this.sendEvent(data);
  }
}
