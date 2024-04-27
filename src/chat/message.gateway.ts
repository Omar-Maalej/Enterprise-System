import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './dto/message.model';
import { CreateMessageDto } from './dto/create-message.dto';

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
    { id: 1, user: 'aymen', content: 'Hello GL3' },
    { id: 2, user: 'GL3', content: 'f54z4f5zf456a??;!!!' },
    { id: 3, user: 'aymen', content: 'Na9sssssou mel 7essss !!!' },
  ];
  @SubscribeMessage('message')
  handleMessage(): string {
    console.log('connectiong to message');

    return 'Hello world!';
  }
  @SubscribeMessage('allMessages')
  getAllMessages(@ConnectedSocket() client: Socket): any {
    //console.log(client);
    return this.messges;
  }

  @SubscribeMessage('addMessage')
  addMessage(
    client: any,
    @MessageBody() createMessageDto: CreateMessageDto,
  ): any {
    const id = this.messges[this.messges.length - 1].id + 1;
    const { user, content } = createMessageDto;
    const newMessage = { id, user, content };
    this.messges.push(newMessage);
    this.server.emit('new-message', newMessage);
    return this.messges;
  }
}
