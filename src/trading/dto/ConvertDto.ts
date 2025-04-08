import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class ConvertDto {
  @ApiProperty({ example: 'NGN' })
  @IsString({})
  from: 'NGN' | 'USD' | 'EUR';

  @ApiProperty({ example: 'USD' })
  @IsString()
  to: 'NGN' | 'USD' | 'EUR';

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  amount: number;
}
