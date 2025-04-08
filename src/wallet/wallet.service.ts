import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { PaystackService } from 'src/paystack/paystack.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private paystackService: PaystackService,
  ) {}

  async getBalances(user: any) {
    try {
      const wallets = await this.walletRepo.find({
        where: { user: { id: user } },
      });
      return {
        balances: wallets.map((w) => ({
          currency: w.currency,
          amount: w.balance,
        })),
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async fundWallet(userId: string, email: string, amount: number) {
    try {
      const wallet = await this.walletRepo.findOne({
        where: { user: { id: userId }, currency: 'NGN' },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const initializePaystack = await this.paystackService.initiatePayment({
        amount,
        email,
      });

      if (!initializePaystack.data) {
        throw new BadRequestException('Error initiating payment request');
      }

      await this.transactionRepo.save({
        user: { id: userId } as any,
        paystack_reference: initializePaystack.data.reference,
        currency: 'NGN',
        type: 'account-funding',
        amount,
      });

      return initializePaystack.data;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Wallet funding failed',
        error?.status || 500,
      );
    }
  }
}
