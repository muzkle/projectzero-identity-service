import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Partner } from './partner.entity';
import { User } from '../../users/entities/user.entity';

@Entity('partner_members')
export class PartnerMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  partnerId!: string;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'partnerId' })
  partner!: Partner;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'enum', enum: ['owner', 'editor'], default: 'owner' })
  role!: 'owner' | 'editor';

  @CreateDateColumn()
  createdAt!: Date;
}
