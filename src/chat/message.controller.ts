import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('chat')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}


    @Post()
    async create(@Body() createMessageDto: CreateMessageDto) {
        return await this.messageService.create(createMessageDto);
    }

    @Get()
    async findAll() {
        return await this.messageService.findAll();
    }
}
