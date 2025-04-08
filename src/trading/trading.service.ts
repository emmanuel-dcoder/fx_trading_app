import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { FxService } from '../fx/fx.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class TradingService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private fxService: FxService,
  ) {}
  async convert(
    userId: string,
    from: 'NGN' | 'USD' | 'EUR',
    to: 'NGN' | 'USD' | 'EUR',
    amount: number,
  ) {
    try {
      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than zero');
      }

      if (from === to) {
        throw new BadRequestException('Cannot convert to the same currency');
      }

      const validateWallet = await this.walletRepo.findOne({
        where: { user: { id: userId }, currency: from },
      });

      if (!validateWallet) {
        throw new BadRequestException(`Source wallet (${from}) not found`);
      }

      if (Number(validateWallet.balance) < amount) {
        throw new BadRequestException('Insufficient balance in source wallet');
      }

      const rate = await this.fxService.getRate(from, to);
      const convertedAmount = Number((amount * rate).toFixed(2));

      const toWallet = await this.walletRepo.findOne({
        where: { user: { id: userId }, currency: to },
      });

      if (!toWallet) {
        throw new BadRequestException(`Destination wallet (${to}) not found`);
      }

      // Update balances
      validateWallet.balance = Number(validateWallet.balance) - amount;
      toWallet.balance = Number(toWallet.balance) + convertedAmount;

      await this.walletRepo.save([validateWallet, toWallet]);

      await this.transactionRepo.save({
        user: { id: userId } as any,
        amount,
        type: 'converstion',
        status: 'confirmed',
        rate,
        currency: to,
      });

      return {
        message: 'Conversion successful',
        from,
        to,
        amount,
        converted: convertedAmount,
        rate,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Wallet conversion failed',
        error?.status || 500,
      );
    }
  }
}
