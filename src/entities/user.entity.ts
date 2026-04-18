// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('rate_limit_users')
export class RateLimitUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'user_ip', length: 64 })
  userIp: string;

  @Column({ name: 'searches_today', default: 0 })
  searchesToday: number;

  @Column({ name: 'total_searches', default: 0 })
  totalSearches: number;

  @Column({ name: 'window_start', type: 'timestamptz' })
  windowStart: Date;

  @Column({ name: 'is_pro', default: false })
  isPro: boolean;

  @Column({ name: 'last_seen', type: 'timestamptz', nullable: true })
  lastSeen: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
