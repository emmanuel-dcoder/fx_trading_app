import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { REDIS_CLIENT } from 'src/core/redis/redis.provider';
import { envConfig } from 'src/core/config/env.config';
import type { RedisClientType } from 'redis';

@Injectable()
export class FxService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {}

  async getRate(from: string, to: string): Promise<number> {
    try {
      const key = `rate:${from}_${to}`;
      const cachedRate = await this.redisClient.get(key);
      if (cachedRate) {
        return parseFloat(cachedRate);
      }

      const rate = await this.fetchRateFromApi(from, to);
      await this.redisClient.set(key, rate.toString(), { EX: 300 });
      return rate;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async getRates() {
    try {
      const cacheKey = 'all_fx_rates';
      const cachedRates = await this.redisClient.get(cacheKey);
      if (cachedRates) {
        return JSON.parse(cachedRates);
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
      await this.redisClient.set(cacheKey, JSON.stringify(result), { EX: 300 });
      return result;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
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
