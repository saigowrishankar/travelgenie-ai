// src/entities/search-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('search_logs')
export class SearchLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 255 })
  destination: string;

  @Column({ name: 'user_ip', length: 64 })
  userIp: string;

  @Column({ name: 'cache_hit', default: false })
  cacheHit: boolean;

  @Column({ name: 'response_ms', default: 0 })
  responseMs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
