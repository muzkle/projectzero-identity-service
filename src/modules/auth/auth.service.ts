import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { UserRole, ErrorCode, JwtPayload } from '@muzkle/contracts';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterBodyDto, LoginBodyDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(RefreshToken) private refreshRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterBodyDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException({ code: ErrorCode.NOT_FOUND, message: 'Email already registered' });
    }
    const user = this.usersRepo.create({
      email: dto.email.toLowerCase(),
      passwordHash: await bcrypt.hash(dto.password, 10),
      displayName: dto.displayName,
      isMinor: dto.isMinor ?? false,
      role: UserRole.USER,
    });
    await this.usersRepo.save(user);
    return this.issueTokens(user);
  }

  async login(dto: LoginBodyDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException({ code: ErrorCode.INVALID_CREDENTIALS, message: 'Invalid credentials' });
    }
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    const hash = this.hashToken(refreshToken);
    const stored = await this.refreshRepo.findOne({ where: { tokenHash: hash } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException({ code: ErrorCode.UNAUTHORIZED, message: 'Invalid refresh token' });
    }
    const user = await this.usersRepo.findOne({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException();
    await this.refreshRepo.delete({ id: stored.id });
    return this.issueTokens(user);
  }

  private async issueTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshRepo.save(
      this.refreshRepo.create({
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
      }),
    );
    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: this.toUserDto(user),
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  toUserDto(user: User) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isMinor: user.isMinor,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
