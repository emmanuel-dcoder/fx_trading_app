import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, VerifyDto } from 'src/user/dto/create-user.dto';
import { successResponse } from 'src/core/config/response';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResendOtpDto, VerifyOtpDto } from 'src/user/dto/verify-otp.dto';
import { LoginDto } from 'src/user/dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User Registeration' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() registerDto: CreateUserDto) {
    await this.authService.register(registerDto);
    return successResponse({
      message: 'User registered successfully, Otp sent for verification',
      code: HttpStatus.OK,
      status: 'success',
    });
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP for user' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or OTP expired' })
  async verify(@Body() verifyDto: VerifyDto) {
    const data = await this.authService.verify(verifyDto);
    return successResponse({
      message: 'OTP verified successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to user' })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP has been resent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    await this.authService.resendOtp(resendOtpDto);
    return successResponse({
      message: 'OTP has been resent',
      code: HttpStatus.OK,
      status: 'success',
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with user email and passpword' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: Object })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 401, description: 'User not found' })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return successResponse({
      message: 'Login successful',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }
}
