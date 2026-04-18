// src/entities/destination.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'destination_key', length: 255 })
  destinationKey: string; // lowercase-trimmed normalised key

  @Column({ name: 'destination_name', length: 255 })
  destinationName: string;

  @Column({ type: 'jsonb' })
  data: Record<string, any>; // full AI payload

  @Column({ name: 'search_count', default: 0 })
  searchCount: number;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'last_searched', type: 'timestamptz', nullable: true })
  lastSearched: Date;

  @CreateDateColumn({ name: 'cached_at' })
  cachedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
