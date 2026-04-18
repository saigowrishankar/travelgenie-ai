// src/cache/cache-stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { SearchLog } from '../entities/search-log.entity';

@Injectable()
export class CacheStatsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destRepo: Repository<Destination>,
    @InjectRepository(SearchLog)
    private readonly logRepo: Repository<SearchLog>,
  ) {}

  async getStats() {
    const now = new Date();

    const [total, active, totalSearches, cacheHits] = await Promise.all([
      this.destRepo.count(),
      this.destRepo.count({ where: { expiresAt: MoreThan(now) } }),
      this.logRepo.count(),
      this.logRepo.count({ where: { cacheHit: true } }),
    ]);

    const hitRate =
      totalSearches > 0
        ? `${((cacheHits / totalSearches) * 100).toFixed(1)}%`
        : '0%';

    const top5 = await this.destRepo.find({
      select: ['destinationName', 'searchCount'],
      order: { searchCount: 'DESC' },
      take: 5,
    });

    return {
      storage: 'PostgreSQL',
      active_cache: active,
      expired_entries: total - active,
      total_searches: totalSearches,
      cache_hit_rate: hitRate,
      api_calls_saved: cacheHits,
      top_5_destinations: top5.map((d) => ({
        name: d.destinationName,
        searches: d.searchCount,
      })),
    };
  }

  async getTopDestinations() {
    const top = await this.destRepo.find({
      select: ['destinationName', 'searchCount', 'cachedAt'],
      order: { searchCount: 'DESC' },
      take: 10,
    });

    return {
      top_destinations: top.map((d) => ({
        destination_name: d.destinationName,
        search_count: d.searchCount,
        cached_at: d.cachedAt,
      })),
    };
  }

  async clearCache() {
    // ✅ Fixed: use query builder instead of delete({}) which throws "empty criteria" error
    const result = await this.destRepo
      .createQueryBuilder()
      .delete()
      .from(Destination)
      .execute();

    return {
      message: `Deleted ${result.affected ?? 0} cached destinations from PostgreSQL`,
    };
  }
}
