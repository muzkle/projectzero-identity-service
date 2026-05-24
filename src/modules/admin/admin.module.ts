import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PartnersModule } from '../partners/partners.module';

@Module({
  imports: [PartnersModule],
  controllers: [AdminController],
})
export class AdminModule {}
