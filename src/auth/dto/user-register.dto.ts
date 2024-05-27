import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UserRegisterDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

   
}