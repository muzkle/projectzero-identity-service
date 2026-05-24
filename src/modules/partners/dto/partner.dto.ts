import { IsString, MinLength, Matches } from 'class-validator';

export class CreatePartnerRequestBodyDto {
  @IsString()
  @MinLength(2)
  legalName!: string;

  @IsString()
  @MinLength(2)
  displayName!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;
}
