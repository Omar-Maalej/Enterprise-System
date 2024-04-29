import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  // @Get()
  // findAll() {
  //   return this.messagesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messagesService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }

  @Get()
  async getMessages(@Body() body: any): Promise<Message[]> {
    const { senderId, receiverId, isRoom } = body;

    if (isRoom) {
      // to add a Guard to check if the user is a member of the room
      return this.messagesService.findMessagesRoom(receiverId);
    }
    
    return this.messagesService.findOneToOneMessage(senderId, receiverId);
  }

  @Get(':id')
  async getLastMessages(@Param('id') id: string): Promise<Message[]> {
    return this.messagesService.findLastMessages(parseInt(id));
  }


}
