import { Controller, Post, Param, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PartnersService } from '../partners/partners.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload, UserRole } from '@projectzero/contracts';
import { ForbiddenException } from '@nestjs/common';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private partnersService: PartnersService) {}

  private assertAdmin(user: JwtPayload) {
    if (user.role !== UserRole.PLATFORM_ADMIN) {
      throw new ForbiddenException('Admin only');
    }
  }

  @Post('partners/:id/approve')
  approve(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    this.assertAdmin(user);
    return this.partnersService.approve(id);
  }

  @Get('health-check')
  healthCheck(@CurrentUser() user: JwtPayload) {
    this.assertAdmin(user);
    return { ok: true };
  }
}
