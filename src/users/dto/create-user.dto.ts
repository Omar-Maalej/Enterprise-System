import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Matches } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    salt: string;

    @IsNotEmpty()
    @IsString()
    jobtitle: string;

    @IsNotEmpty()
    @Matches(/^[01]\d{7}$/, {
      message: 'CIN must start with 0 or 1 and be an 8-digit number',
    })
    cin: string;

    @IsOptional()
    @IsString()
    picture: string;
}
