import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { REDIS_CLIENT } from 'src/core/redis/redis.provider';
import type { RedisClientType } from 'redis';
import { envConfig } from 'src/core/config/env.config';

@Injectable()
export class FxService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType | null,
  ) {}

  async getRate(from: string, to: string): Promise<number> {
    try {
      const key = `rate:${from}_${to}`;

      if (this.redisClient) {
        const cached = await this.redisClient.get(key);
        if (cached) return Number(cached);
      }

      const rate = await this.fetchRateFromApi(from, to);

      if (this.redisClient) {
        await this.redisClient.set(key, rate.toString(), { EX: 300 });
      }

      return rate;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }

  async getRates() {
    try {
      const cacheKey = 'all_fx_rates';

      if (this.redisClient) {
        const cached = await this.redisClient.get(cacheKey);
        if (cached) return JSON.parse(cached);
      }

      const currencies = ['NGN', 'USD', 'EUR', 'GBP'];
      const rates: Record<string, number> = {};

      for (const from of currencies) {
        const response = await firstValueFrom(
          this.httpService.get(
            `https://v6.exchangerate-api.com/v6/${envConfig.rate.key}/latest/${from}`,
          ),
        );

        for (const to of currencies) {
          if (from !== to) {
            rates[`${from}_${to}`] = response.data.conversion_rates[to];
          }
        }
      }

      const result = { rates };

      if (this.redisClient) {
        await this.redisClient.set(cacheKey, JSON.stringify(result), {
          EX: 300,
        });
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }

  private async fetchRateFromApi(from: string, to: string): Promise<number> {
    const response = await firstValueFrom(
      this.httpService.get(
        `https://v6.exchangerate-api.com/v6/${envConfig.rate.key}/latest/${from}`,
      ),
    );
    return response.data.conversion_rates[to];
  }
}
