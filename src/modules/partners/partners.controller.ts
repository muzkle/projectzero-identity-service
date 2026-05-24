import { Controller, Post, Body, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PartnersService } from './partners.service';
import { CreatePartnerRequestBodyDto } from './dto/partner.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@projectzero/contracts';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';

@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Post('request')
  @UseGuards(AuthGuard('jwt'))
  request(@CurrentUser() user: JwtPayload, @Body() dto: CreatePartnerRequestBodyDto) {
    return this.partnersService.requestPartner(user.sub, dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@CurrentUser() user: JwtPayload) {
    return this.partnersService.findByUserId(user.sub);
  }

  @Get(':id')
  @UseGuards(InternalServiceGuard)
  findOne(@Param('id') id: string) {
    return this.partnersService.findById(id);
  }

  @Patch(':id/stripe-connect')
  @UseGuards(InternalServiceGuard)
  updateStripeConnect(
    @Param('id') id: string,
    @Body() body: { stripeConnectAccountId: string },
  ) {
    return this.partnersService.updateStripeAccount(id, body.stripeConnectAccountId);
  }
}
