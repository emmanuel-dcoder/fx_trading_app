import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Transaction } from './entities/transaction.entity';
import { envConfig } from 'src/core/config/env.config';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private tranasactionRepo: Repository<Transaction>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
  ) {}

  async getHistory(userId: string) {
    try {
      const transactions = await this.tranasactionRepo.find({
        where: { user: { id: userId } },
        order: { created_at: 'DESC' },
      });
      return { transactions };
    } catch (error) {
      throw new HttpException(
        error?.message || 'fetching transaction failed',
        error?.status || 500,
      );
    }
  }

  verifyWebhookSignature(body: any, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', envConfig.paystack.key)
      .update(JSON.stringify(body))
      .digest('hex');

    return hash === signature;
  }

  async handlePaystackEvent(event: any) {
    //verify transaction
    const transaction = await this.tranasactionRepo.findOne({
      where: { paystack_reference: event.data.reference },
      relations: ['user'],
    });

    if (!transaction) throw new BadRequestException('Invalid transaction');

    if (transaction.status === 'confirmed')
      throw new BadRequestException('Like duplicate transaction');

    if (event.event === 'charge.success') {
      const wallet = await this.walletRepo.findOne({
        where: { user: { id: transaction.user.id }, currency: 'NGN' },
      });

      wallet.balance = Number(wallet.balance) + Number(transaction.amount);
      transaction.status = 'confirmed';
      await this.tranasactionRepo.save(transaction);
      await this.walletRepo.save(wallet);
    } else {
      transaction.status = 'failed';
      await this.tranasactionRepo.save(transaction);
    }

    return { message: 'Payment verified' };
  }
}
