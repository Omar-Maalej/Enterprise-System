import { Controller, Get, Inject } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller()
export class ChatController {
  constructor(
    @Inject(ChatGateway) private readonly webSocketGateway: ChatGateway,
  ) {}

  @Get('send-message')
  sendMessage(): string {
    this.webSocketGateway.sendMessage('Hello from WebSocket!');
    return 'Message sent to WebSocket clients.';
  }
}
