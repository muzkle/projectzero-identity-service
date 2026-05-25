import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PartnersModule } from './modules/partners/partners.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './infrastructure/health/health.module';
import { User } from './modules/users/entities/user.entity';
import { Partner } from './modules/partners/entities/partner.entity';
import { PartnerMember } from './modules/partners/entities/partner-member.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Partner, PartnerMember, RefreshToken],
      synchronize: process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
      ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    UsersModule,
    PartnersModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
