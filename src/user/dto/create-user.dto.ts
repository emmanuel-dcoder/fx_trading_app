import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'insert user email to be registered',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Emmanuel' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'joseph' })
  @IsString()
  last_name: string;

  @ApiProperty({
    example: 'password@123',
    description: 'Password of the user, minimum must be six',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'insert user email to be registered',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '8764', description: 'input otp sent to email' })
  @IsString()
  otp: string;
}
