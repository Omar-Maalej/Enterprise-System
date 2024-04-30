import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './dto/message.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class MessagesGateway {
    /* Permet de récupérer une référence sur socket.io Server afin d'utiliser son api telque le brodcast */
    @WebSocketServer()
    server: Server;
    messges: Message[] = [
    {id:1, user: 'aymen', content: 'Hello GL3'},
    {id:2, user: 'GL3', content: 'f54z4f5zf456a??;!!!'},
    {id:3, user: 'aymen', content: 'Na9sssssou mel 7essss !!!'},
  ];
  private readonly logger = new Logger(MessagesGateway.name);

  afterInit() {
    this.logger.log("Initialized");
    console.log('Initialized');
  }
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    console.log(sockets);

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }


  @SubscribeMessage('message')
  handleMessage( ): string {
    console.log('connectiong to message');
    
    return 'Hello world!';
  }
  @SubscribeMessage(' ')
  getAllMessages(@ConnectedSocket() client: Socket): any {
    console.log(client);
    return this.messges;
  }

  @SubscribeMessage('addMessage')
  addMessage(client: any, @MessageBody() createMessageDto: CreateMessageDto): any {
    const id = this.messges[this.messges.length - 1].id + 1;
    const {user, content} = createMessageDto;
    console.log(createMessageDto);
    console.log(createMessageDto.user);
    console.log(createMessageDto.content);

    const newMessage = {id, user, content};
    console.log(newMessage);
    this.messges.push(newMessage);
    console.log(this.messges);
    this.server.emit('new-message', newMessage)
    return this.messges;
  }
}