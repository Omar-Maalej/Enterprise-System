import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    console.log(data);
  }
}
