import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);

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
  async getMessages(@Request() req): Promise<Message[]> {
    
    const { senderId, receiverId, isRoom } = req.query;
    this.logger.log(`senderId: ${senderId}, receiverId: ${receiverId}, isRoom: ${isRoom}`);
    this.logger.debug(`type of isRoom: ${typeof isRoom}`);

    if (isRoom == "true") {
      //TODO a Guard to check if the user is a member of the room
      this.logger.debug(`isRoom is true`);
      return this.messagesService.findMessagesRoom(receiverId);
    } else {
      this.logger.debug(`isRoom is false`);
      return this.messagesService.findOneToOneMessage(senderId, receiverId);

    }
    
  }

  @Get(':id')
  async getLastMessages(@Param('id') id: string): Promise<Message[]> {
    return this.messagesService.findLastMessages(parseInt(id));
  }


}
