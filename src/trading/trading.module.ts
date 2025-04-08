import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingController } from './trading.controller';
import { TradingService } from './trading.service';
import { Wallet } from '../wallet/entities/wallet.entity';
import { FxModule } from '../fx/fx.module';
import { AuthModule } from '../auth/auth.module';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]),
    FxModule,
    AuthModule,
  ],
  controllers: [TradingController],
  providers: [TradingService],
})
export class TradingModule {}
