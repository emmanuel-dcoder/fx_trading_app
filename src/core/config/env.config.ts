import * as dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  database: {
    db_port: process.env.POSTGRES_PORT,
    db_user: process.env.POSTGRES_USER,
    db_password: process.env.POSTGRES_PASSWORD,
    db_url: process.env.DATABASE_URL,
    db_databse: process.env.POSTGRES_DATABASE,
    db_host: process.env.POSTGRES_HOST,
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.SECRET_KEY,
    expiry: process.env.JWT_EXPIRY,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  rate: {
    key: process.env.EXCHANGE_RATE_API_KEY,
  },
  paystack: {
    key: process.env.PAYSTACK_SK_KEY,
    url: process.env.PAYSTACK_BASE_URL,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    port: process.env.MAIL_PORT,
  },
};
