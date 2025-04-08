import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/core/config/response';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { AddFundDto } from './dto/create-wallet.dto';

@Controller('wallet')
@ApiTags('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch wallet balance',
  })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Error fetching balance' })
  async getBalances(@Req() req: any) {
    const user = req.user as { userId: string };
    const data = await this.walletService.getBalances(user.userId);
    return successResponse({
      message: 'Balance retrieved successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post('fund')
  @ApiOperation({ summary: 'Initiate wallet funding' })
  @ApiBody({ type: AddFundDto })
  @ApiResponse({ status: 200, description: 'Redirect to Paystack for payment' })
  @ApiResponse({ status: 400, description: 'Error initializing payment' })
  async fundWallet(@Req() req: any, @Body() body: { amount: number }) {
    const { userId, email } = req.user;
    const data = await this.walletService.fundWallet(
      userId,
      email,
      body.amount,
    );
    return successResponse({
      message: 'Redirect to Paystack for payment',
      code: HttpStatus.OK,
      status: 'success',
      data: data,
    });
  }
}
