import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerStatus, UserRole, ErrorCode } from '@muzkle/contracts';
import { Partner } from './entities/partner.entity';
import { PartnerMember } from './entities/partner-member.entity';
import { User } from '../users/entities/user.entity';
import { CreatePartnerRequestBodyDto } from './dto/partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner) private partnersRepo: Repository<Partner>,
    @InjectRepository(PartnerMember) private membersRepo: Repository<PartnerMember>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async requestPartner(userId: string, dto: CreatePartnerRequestBodyDto) {
    const existing = await this.partnersRepo.findOne({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException({ code: ErrorCode.NOT_FOUND, message: 'Slug already taken' });
    }
    const partner = await this.partnersRepo.save(
      this.partnersRepo.create({
        legalName: dto.legalName,
        displayName: dto.displayName,
        slug: dto.slug,
        status: PartnerStatus.PENDING,
        platformFeePercent: 15,
      }),
    );
    await this.membersRepo.save(
      this.membersRepo.create({ partnerId: partner.id, userId, role: 'owner' }),
    );
    await this.usersRepo.update(userId, { role: UserRole.PARTNER_MEMBER });
    return this.toDto(partner);
  }

  async findById(id: string) {
    const partner = await this.partnersRepo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException({ code: ErrorCode.NOT_FOUND, message: 'Partner not found' });
    return this.toDto(partner);
  }

  async findByUserId(userId: string) {
    const member = await this.membersRepo.findOne({ where: { userId }, relations: ['partner'] });
    if (!member) return null;
    return this.toDto(member.partner);
  }

  async approve(partnerId: string) {
    const partner = await this.partnersRepo.findOne({ where: { id: partnerId } });
    if (!partner) throw new NotFoundException();
    partner.status = PartnerStatus.ACTIVE;
    await this.partnersRepo.save(partner);
    return this.toDto(partner);
  }

  async updateStripeAccount(partnerId: string, accountId: string) {
    await this.partnersRepo.update(partnerId, { stripeConnectAccountId: accountId });
    return this.findById(partnerId);
  }

  assertActive(partner: Partner) {
    if (partner.status !== PartnerStatus.ACTIVE) {
      throw new ForbiddenException({ code: ErrorCode.PARTNER_NOT_ACTIVE, message: 'Partner not active' });
    }
  }

  toDto(partner: Partner) {
    return {
      id: partner.id,
      legalName: partner.legalName,
      displayName: partner.displayName,
      slug: partner.slug,
      status: partner.status,
      stripeConnectAccountId: partner.stripeConnectAccountId,
      platformFeePercent: Number(partner.platformFeePercent),
      createdAt: partner.createdAt.toISOString(),
    };
  }
}
