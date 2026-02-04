import { createClient } from 'redis';
import { envConfig } from 'src/core/config/env.config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export type AppRedisClient = ReturnType<typeof createClient> | null;

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: async (): Promise<AppRedisClient> => {
    if (!envConfig.redis.enabled) {
      console.warn('Redis disabled via config');
      return null;
    }

    try {
      const client = createClient({
        url: `redis://${envConfig.redis.host}:${envConfig.redis.port}`,
      });

      client.on('error', (err) => {
        console.error('Redis runtime error:', err);
      });

      await client.connect();
      console.log('Redis connected');

      return client;
    } catch (err) {
      console.error('Redis connection failed, continuing without cache');
      return null;
    }
  },
};
