import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { TradingService } from './trading.service';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ConvertDto } from './dto/ConvertDto';
import { successResponse } from 'src/core/config/response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('wallet')
@ApiTags('trading')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Post('convert/trade')
  @ApiOperation({
    summary: 'Trade or convert currencies',
  })
  @ApiBody({ type: ConvertDto })
  @ApiResponse({ status: 200, description: 'Trade/conversion successful' })
  @ApiResponse({ status: 400, description: 'Error during conversion/trader' })
  async convert(@Req() req: any, @Body() convertDto: ConvertDto) {
    const { userId } = req.user;
    const { from, to, amount } = convertDto;
    const data = await this.tradingService.convert(userId, from, to, amount);
    return successResponse({
      message: 'Trade/conversion successful',
      code: HttpStatus.OK,
      status: 'success',
      data: data,
    });
  }
}
