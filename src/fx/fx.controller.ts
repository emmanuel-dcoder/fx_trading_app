import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { FxService } from './fx.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('fx')
@ApiTags('fx')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Get fx rates' })
  @ApiResponse({
    status: 200,
    description: 'Fx Rates Fetched',
  })
  @ApiResponse({
    status: 401,
    description: 'Unable to fetch rate',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getRates() {
    const data = await this.fxService.getRates();
    return successResponse({
      message: 'Fx Rates Fetched',
      code: HttpStatus.OK,
      status: 'success',
      data: data,
    });
  }

  @Get('rate/single')
  @ApiQuery({
    name: 'from',
    required: true,
    type: String,
    example: 'NGN',
    description: 'from what currency',
  })
  @ApiQuery({
    name: 'to',
    required: true,
    type: String,
    example: 'USD',
    description: 'to what currency',
  })
  @ApiResponse({
    status: 200,
    description: 'Fx Rates Fetched',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getRate(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) {
      throw new Error('Both "from" and "to" query parameters are required');
    }
    const data = await this.fxService.getRate(from, to);
    return successResponse({
      message: 'Fx Rates Fetched',
      code: HttpStatus.OK,
      status: 'success',
      data: data,
    });
  }
}
