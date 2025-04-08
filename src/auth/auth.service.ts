import {
  Injectable,
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto, VerifyDto } from 'src/user/dto/create-user.dto';
import {
  AlphaNumeric,
  comparePassword,
  hashPassword,
} from 'src/core/common/utils/utility';
import { MailService } from 'src/core/mail/email';
import { ResendOtpDto } from 'src/user/dto/verify-otp.dto';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { LoginDto } from 'src/user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const existingUser = await this.userRepo.findOne({ where: { email } });
      if (existingUser) throw new BadRequestException('Email already exists');

      const otp = AlphaNumeric(4, 'num');
      const hashedPassword = await hashPassword(password);
      createUserDto.password = hashedPassword;

      const user = this.userRepo.create({
        email,
        otp,
        isVerified: true,
        ...createUserDto,
      });

      const savedUser = await this.userRepo.save(user);

      await Promise.all([
        this.walletRepo.save({
          user: { id: savedUser.id } as any,
          currency: 'NGN',
          balance: 0,
        }),
        this.walletRepo.save({
          user: { id: savedUser.id } as any,
          currency: 'EUR',
          balance: 0,
        }),
        this.walletRepo.save({
          user: { id: savedUser.id } as any,
          currency: 'USD',
          balance: 0,
        }),
      ]);

      try {
        await this.mailService.sendMailNotification(
          savedUser.email,
          'Welcome',
          { name: savedUser.first_name, otp },
          'welcome',
        );
      } catch (error) {
        console.log('Mail error:', error);
      }

      return {
        email: savedUser.email,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async verify(verifyOtpDto: VerifyDto) {
    try {
      const { email, otp } = verifyOtpDto;
      const user = await this.userRepo.findOne({
        where: { email, otp },
        select: ['id', 'email', 'first_name', 'last_name', 'otp', 'isVerified'],
      });
      if (!user) throw new BadRequestException('Invalid OTP');

      user.isVerified = true;
      await this.userRepo.save(user);

      await this.mailService.sendMailNotification(
        user.email,
        'OTP Verification',
        { name: user.first_name },
        'otp_verified',
      );
      return user;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    try {
      const { email } = resendOtpDto;
      const user = await this.userRepo.findOne({
        where: { email },
        select: ['id', 'email', 'first_name', 'last_name', 'otp', 'isVerified'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const otp = AlphaNumeric(4, 'num');
      user.otp = otp;
      await this.userRepo.save(user);

      try {
        await this.mailService.sendMailNotification(
          user.email,
          'OTP Verification',
          { name: user.first_name },
          'resend_otp',
        );
      } catch (error) {
        console.log('error:', error);
      }

      return { message: 'OTP has been resent successfully' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.userRepo.findOne({
        where: { email },
        select: [
          'id',
          'first_name',
          'last_name',
          'id',
          'email',
          'isVerified',
          'password',
        ],
      });

      if (!user || !(await comparePassword(password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      if (user && !user.isVerified) {
        throw new NotFoundException(
          'Unverified user, Request for otp to get verified',
        );
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
