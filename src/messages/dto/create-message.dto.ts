import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  senderId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  receiverId?: number;

  @IsString()
  @MaxLength(500) // Adjust the max length based on your requirements
  @ApiProperty()
  messageContent: string;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  roomId?: number;
}
