import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/messages/entities/message.entity';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Logger } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Allowing all origins for CORS
  },
})

export class MessagesGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly messagesService: MessagesService) {}


    // private messages: Message[] = [
    //     { id: 1, user: 'aymen', content: 'Hello GL3' },
    //     { id: 2, user: 'GL3', content: 'f54z4f5zf456a??;!!!' },
    //     { id: 3, user: 'aymen', content: 'Na9sssssou mel 7essss !!!' },
    // ];

    private readonly logger = new Logger(MessagesGateway.name);

    afterInit(): void {
        this.logger.log('WebSocket Gateway Initialized');
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);
      
        const userId = client.handshake.query.userId;
        if (!userId) {
          client.disconnect();
          this.logger.warn(`Disconnected client ${client.id} due to missing user ID`);
          return;
        }
      
        client.data.userId = userId;
      
        const connectedClients = await this.server.allSockets();
        const numberOfClients = connectedClients.size;
        this.logger.debug(`Total connected clients: ${numberOfClients}`);
        this.logger.debug(`User ID ${userId} associated with client ${client.id}`);
      }
      
  
    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(): string {
        this.logger.debug('Handling "message" event');
        return 'Hello world!';
    }

    // @SubscribeMessage('getAllMessages')
    // getAllMessages(@ConnectedSocket() client: Socket): Message[] {
    //     this.logger.debug(`Fetching all messages for client: ${client.id}`);
    //     return this.messages;
    // }

    @SubscribeMessage('getAllMessages')
    getAllMessages(@ConnectedSocket() client: Socket): any {
        this.logger.debug(`Fetching all messages for client: ${client.id}`);
        return "Hello from getAllMessages!"
    }

    @SubscribeMessage('addMessage')
    async addMessage(@MessageBody() messageDto: CreateMessageDto): Promise<Message> {
       
        const clients = await this.server.fetchSockets();
        const targetClients = clients.filter(client => client.data.userId === messageDto.receiverId
            || client.data.userId === messageDto.senderId);

        


        const newMessage = await this.messagesService.create(messageDto);
        
        // this.logger.debug(`Adding new message: ${newMessage.id}`);

        this.logger.debug(`Sending message to ${targetClients.length} clients`);
        targetClients.forEach(client => {
            this.logger.debug(`Sending message to client: ${client.data.userId}`);
        });

        if(targetClients.length > 0){
            targetClients.forEach(client => {
                client.emit('new-message', newMessage);
            });
        }

        return newMessage;
    }
}
