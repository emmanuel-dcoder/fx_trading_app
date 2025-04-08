import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddFundDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  amount: string;
}
