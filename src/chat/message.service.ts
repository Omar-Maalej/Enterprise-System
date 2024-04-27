import { Injectable } from '@nestjs/common';
import { Message } from './dto/message.model';
import { CreateMessageDto } from './dto/create-message.dto';


@Injectable()
export class MessageService {

    messges: Message[] = [
        {id:1, user: 'aymen', content: 'Hello GL3'},
        {id:2, user: 'GL3', content: 'f54z4f5zf456a??;!!!'},
        {id:3, user: 'aymen', content: 'Na9sssssou mel 7essss !!!'},
      ];
    
    async create(message: CreateMessageDto) {
        const id = this.messges[this.messges.length - 1].id + 1;
        const {user, content} = message;
        const newMessage = {id, user, content};
        this.messges.push(newMessage);
        return await newMessage;
    }
    
    async findAll() {
        return await this.messges;
    }
}
