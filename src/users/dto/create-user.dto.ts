import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  salt: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @Matches(/^[2-9]\d{7}$/, {
    message:
      'Phone number must start with a digit between 2 and 9 and be an 8-digit number',
  })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  hireDate: string;
}
