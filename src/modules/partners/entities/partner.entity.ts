import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PartnerStatus } from '@projectzero/contracts';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  legalName!: string;

  @Column()
  displayName!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'enum', enum: PartnerStatus, default: PartnerStatus.PENDING })
  status!: PartnerStatus;

  @Column({ nullable: true })
  stripeConnectAccountId?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 15 })
  platformFeePercent!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
