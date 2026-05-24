import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterBodyDto, LoginBodyDto, RefreshBodyDto } from './dto/auth.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@projectzero/contracts';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterBodyDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginBodyDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshBodyDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() user: JwtPayload) {
    return { id: user.sub, email: user.email, role: user.role, partnerId: user.partnerId };
  }
}
