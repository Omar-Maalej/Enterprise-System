import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './dto/message.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Allowing all origins for CORS
  },
})

export class MessagesGateway {
    @WebSocketServer()
    server: Server;

    private messages: Message[] = [
        { id: 1, user: 'aymen', content: 'Hello GL3' },
        { id: 2, user: 'GL3', content: 'f54z4f5zf456a??;!!!' },
        { id: 3, user: 'aymen', content: 'Na9sssssou mel 7essss !!!' },
    ];

    private readonly logger = new Logger(MessagesGateway.name);

    afterInit(): void {
        this.logger.log('WebSocket Gateway Initialized');
    }

    async handleConnection(client: Socket): Promise<void> {
      this.logger.log(`Client connected: ${client.id}`);
      const connectedClients = await this.server.allSockets();
      const numberOfClients = connectedClients.size;
      this.logger.debug(`Total connected clients: ${numberOfClients}`);
  }
  
    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(): string {
        this.logger.debug('Handling "message" event');
        return 'Hello world!';
    }

    @SubscribeMessage('getAllMessages')
    getAllMessages(@ConnectedSocket() client: Socket): Message[] {
        this.logger.debug(`Fetching all messages for client: ${client.id}`);
        return this.messages;
    }

    @SubscribeMessage('addMessage')
    addMessage(@MessageBody() messageDto: CreateMessageDto): Message {
        const newMessage: Message = {
            id: this.messages.length + 1,
            user: messageDto.user,
            content: messageDto.content,
        };

        this.messages.push(newMessage);
        this.server.emit('new-message', newMessage);
        this.logger.debug(`New message added: ${newMessage.id}`);
        return newMessage;
    }
}
