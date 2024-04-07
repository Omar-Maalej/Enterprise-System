import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UserLoginDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;


    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

   
}
