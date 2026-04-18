// src/search/destination-cache.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Destination } from '../entities/destination.entity';
import { SearchLog } from '../entities/search-log.entity';

@Injectable()
export class DestinationCacheService {
  private readonly cacheDays: number;

  constructor(
    @InjectRepository(Destination)
    private readonly destRepo: Repository<Destination>,
    @InjectRepository(SearchLog)
    private readonly logRepo: Repository<SearchLog>,
    private readonly config: ConfigService,
  ) {
    this.cacheDays = config.get<number>('CACHE_TTL_DAYS', 7);
  }

  normalizeKey(destination: string): string {
    return destination.toLowerCase().trim();
  }

  /** Returns cached data if valid (not expired), null otherwise. */
  async get(key: string): Promise<Record<string, any> | null> {
    const now = new Date();
    const record = await this.destRepo.findOne({
      where: {
        destinationKey: key,
        expiresAt: MoreThan(now),
      },
    });

    if (!record) return null;

    // Bump search count + last_searched
    await this.destRepo.update(record.id, {
      searchCount: record.searchCount + 1,
      lastSearched: now,
    });

    return record.data;
  }

  /** Upsert destination data into PostgreSQL. */
  async set(
    key: string,
    destinationName: string,
    data: Record<string, any>,
  ): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.cacheDays * 86400_000);

    const existing = await this.destRepo.findOne({
      where: { destinationKey: key },
    });

    if (existing) {
      await this.destRepo.update(existing.id, {
        destinationName,
        data,
        expiresAt,
        lastSearched: now,
        searchCount: existing.searchCount + 1,
      });
    } else {
      await this.destRepo.save(
        this.destRepo.create({
          destinationKey: key,
          destinationName,
          data,
          expiresAt,
          lastSearched: now,
          searchCount: 1,
        }),
      );
    }
  }

  /** Log a search event. */
  async log(
    destination: string,
    userIp: string,
    cacheHit: boolean,
    responseMs: number,
  ): Promise<void> {
    try {
      await this.logRepo.save(
        this.logRepo.create({ destination, userIp, cacheHit, responseMs }),
      );
    } catch {
      // non-critical — never fail a search because of a log write
    }
  }
}
