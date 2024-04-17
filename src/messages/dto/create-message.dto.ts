import { IsBoolean, IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
    @IsInt()
    @IsNotEmpty()
    senderId: number;

    @IsInt()
    @IsOptional()
    receiverId?: number;

    @IsInt()
    @IsOptional()
    roomId?: number;

    @IsString()
    @IsNotEmpty()
    messageContent: string;

    @IsBoolean()
    isRoom: boolean;
}
