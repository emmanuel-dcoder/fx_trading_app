import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { Response } from 'express';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all transaction types',
  })
  @ApiResponse({ status: 200, description: 'Lists of transaction' })
  @ApiResponse({ status: 400, description: 'Unable to fetch transaction' })
  async getHistory(@Req() req: any) {
    const { userId } = req;
    const data = await this.transactionsService.getHistory(userId);
    return successResponse({
      message: 'Lists of transaction',
      code: HttpStatus.OK,
      status: 'success',
      data: data,
    });
  }

  //wehhook for payment
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers('x-paystack-signature') signature: string,
    @Res() res: Response,
  ) {
    const isValid = this.transactionsService.verifyWebhookSignature(
      body,
      signature,
    );
    if (isValid) {
      await this.transactionsService.handlePaystackEvent(body);
    }
    return res.sendStatus(200);
  }
}
