import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class RegisterBodyDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(2)
  displayName!: string;

  @IsOptional()
  @IsBoolean()
  isMinor?: boolean;
}

export class LoginBodyDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshBodyDto {
  @IsString()
  refreshToken!: string;
}
