// src/cache/cache.controller.ts
import { Controller, Get, Delete } from '@nestjs/common';
import { CacheStatsService } from './cache-stats.service';

@Controller('api')
export class CacheController {
  constructor(private readonly statsService: CacheStatsService) {}

  @Get('cache/stats')
  getStats() {
    return this.statsService.getStats();
  }

  @Get('stats/top')
  getTop() {
    return this.statsService.getTopDestinations();
  }

  @Delete('cache/clear')
  clearCache() {
    return this.statsService.clearCache();
  }
}
