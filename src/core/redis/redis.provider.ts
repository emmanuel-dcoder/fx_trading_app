import { createClient } from 'redis';
import { envConfig } from 'src/core/config/env.config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({
      url: `redis://${envConfig.redis.host}:${envConfig.redis.port}`,
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    await client.connect();
    return client;
  },
};
