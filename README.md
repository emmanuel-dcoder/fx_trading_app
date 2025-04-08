<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Fx Trading App API

# Overview

TFx Trading App API allows users to register , get verified and is able to get real time FX exchange rates and can also convert rates and trade. The API is deployed on Render and includes comprehensive documentation via Swagger and Postman.

## Features

1. **Authenticaton**:

   - Register users
   - verify users
   - resend otp
   - Login

2. **Wallet**:

   - Initial wallet of 0 for NGN, USD & EUR
   - Retrieve wallet.
   - fund wallet using paystack.

3. **Fx Exchange**:

   - Fetch real time exchange rate.
   - Fetch real time for individual exchange rate.

4. **Trading/Conversion**:

   - Trade and covert rates

5. **Transaction**:
   - Retrieve transaction regarding funding wallet and trading

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) via `@nestjs/jwt` and `passport-jwt`
- **Validation**: `class-validator` and `class-transformer`
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Deployment**: Render
- **Version Control**: GitHub

---

## Base URL

The API is hosted at:  
**`https://fx-trading-app.onrender.com`**

## API Documentation

### Swagger Documentation

Explore the interactive Swagger UI for detailed endpoint descriptions, request/response schemas, and testing:  
[**Swagger Docs**](https://fx-trading-app.onrender.com/docs)

## GitHub Repository

The source code is available at:  
[**GitHub Repo**](https://github.com/codewithemmy/Music-booking-app)

---

## Compile and run the project

```bash
#install dependencies
$ npm install

# development
$ npm run start:dev

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Environment Variables

- `PORT`: Server port (default: 5000).
- `POSTGRES_USER`: posgres user name.
- `POSTGRES_PASSWORD`: postgres password.
- `POSTGRES_DATABASE`: postgres database basae e.g neon.
- `POSTGRES_PORT`: postgres port number e.g 5432.
- `POSTGRES_HOST`: posgres host name.
- `SECRET_KEY`: Jwt secret key.
- `JWT_EXPIRY`: Jwt jwt expiry.
- `MAIL_USER`: smpt gmail user name.
- `MAIL_PASSWORD`: smpt gmail password.
- `MAIL_PASSWORD`: smpt host name.
- `REDIS_HOST`: redis host name e.g local.
- `REDIS_PORT`: redis port number 6379.
- `EXCHANGE_RATE_API_KEY`: exchange rate secret key.
- `PAYSTACK_SK_KEY`: paystack payment key.
- `PAYSTACK_BASE_URL`: paystack base url i.e https://api.paystack.co.

## Docker Compose

version: '3.8'
services:
redis:
image: redis:latest
ports: - '6379:6379'
volumes: - redis-data:/data
command: redis-server --requirepass redis_password
volumes:
redis-data:

### Docker Compose

This project uses Docker Compose to manage a Redis instance for caching FX rates. Below is a detailed breakdown of its setup and usage.

#### What It Does

- **Purpose**: Runs a Redis server to cache exchange rates for endpoints like `/fx/rates` and `/fx/rate`. Cached data expires after 5 minutes, ensuring fresh rates while minimizing API requests.
- **Benefits**: Speeds up response times (e.g., <1ms from Redis vs. 100-500ms from the API) and reduces costs or rate limits from the ExchangeRate-API.

#### Configuration Breakdown

The `docker-compose.yml` file is defined as follows:

```yaml
version: '3.8'
services:
  redis:
    image: redis:latest
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    command: redis-server --requirepass redis_password
volumes:
  redis-data:
```

## Endpoints

Below is a summary of the key endpoints. Refer to the Swagger or Postman documentation for full details.

| **Endpoint**            | **Method** | **Description**               | **Protected** |
| ----------------------- | ---------- | ----------------------------- | ------------- |
| `/auth/register`        | POST       | User Registeration            | No            |
| `/auth/verify`          | POST       | User otp verification         | No            |
| `/auth/resend-otp`      | POST       | Resend user otp               | No            |
| `/auth/login`           | POST       | User Login                    | No            |
| `/wallet`               | GET        | User Multi wallet             | Yes (JWT)     |
| `/wallet/fund`          | POST       | Fund user wallet              | Yes (JWT)     |
| `/fx/rates`             | GET        | Fetch all exchange rates      | Yes (JWT)     |
| `/fx/rate/single`       | GET        | Fetch specific exchange rates | Yes (JWT)     |
| `/wallet/convert/trade` | POST       | Trade or convert currencies   | Yes (JWT)     |
| `/transactions`         | GET        | Fetch all transactions        | Yes (JWT)     |

- **Protected Endpoints**: Require a Bearer token in the `Authorization` header, obtained from `/auth/login`.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
