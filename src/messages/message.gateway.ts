import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Logger } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { Room } from 'src/room/entities/room.entity';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Allowing all origins for CORS
  },
})

export class MessagesGateway {
    @WebSocketServer()
    server: Server;


    constructor(
        private readonly messagesService: MessagesService,
        private readonly redisSerice: RedisService,
    ) {
    }


    private readonly logger = new Logger(MessagesGateway.name);

    afterInit(): void {
        this.logger.log('WebSocket Gateway Initialized');
    }

    async handleConnection(client: Socket): Promise<void> {
        const userId = client.handshake.query.userId as string;
        if (!userId) {
          client.disconnect();
          return;
        }
    
        await this.redisSerice.addConnection(userId.toString(), client.id);
    
        // Emit user connected event to all connected clients
        const allUsers = await this.redisSerice.getAllConnections();
        console.log("All Users: ", allUsers);
        allUsers.forEach(user => {
          this.server.to(user).emit('userConnected', { userId });
        });
    
        this.logger.log(`User connected: ${userId}`);
    }
  
    async handleDisconnect(client: Socket): Promise<void> {
        const userId = client.handshake.query.userId as string;
        await this.redisSerice.removeConnection(userId.toString(), client.id);

        // Emit user disconnected event to all connected clients
        const allUsers = await this.redisSerice.getAllConnections();
        console.log("All Users: ", allUsers);
        allUsers.forEach(user => {
            console.log("User: ", user);
            this.server.to(user).emit('userDisconnected', { userId });
        });

        this.logger.log(`User disconnected: ${userId}`);
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

    private async broadcastDirectMessage(receiverId: number, event: string, message: any): Promise<void> {
        const sockets = await this.redisSerice.getConnections(receiverId.toString());
        const senderSockets = await this.redisSerice.getConnections(message.senderId);
        console.log("Sender Sockets: ", senderSockets);
        const allSockets = [...sockets, ...senderSockets];
        console.log("Sockets: ", sockets);
        allSockets.forEach(socketId => {
            console.log("Sending message to socket: ", socketId);
            this.server.to(socketId).emit(event, {...message, type: 'private'});
        });
        this.logger.debug(`Sent direct message to ${receiverId}`);
    }

    async broadcastToRoom(room: Room, event: string, message: any): Promise<void> {
        const members = room.users;
            // console.log("Members: ", members);
        members.forEach(async user => {
            this.logger.debug(`Sending message to room ${room.id} and ${user.id}`);

            const sockets = await this.redisSerice.getConnections(user.id.toString());
            sockets.forEach(socketId => {
                this.logger.debug(`Sending message to room ${room.id} and ${socketId}`);
                this.server.to(socketId).emit(event, {...message, type: 'room'});
            });
        });
    }

    @SubscribeMessage('addMessage')
    async addMessage(@MessageBody() messageDto: CreateMessageDto) {
       
        const newMessage = await this.messagesService.create(messageDto);

        console.log("New Message: ", messageDto);

        if(!newMessage.roomId) {

            this.broadcastDirectMessage(messageDto.receiverId, 'new-message', newMessage);

        } else {
            
            this.broadcastToRoom(newMessage.room, 'new-message', newMessage);
        } 
        
    }
}
