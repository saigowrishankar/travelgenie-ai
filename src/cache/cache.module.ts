// src/cache/cache.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from '../entities/destination.entity';
import { SearchLog } from '../entities/search-log.entity';
import { CacheController } from './cache.controller';
import { CacheStatsService } from './cache-stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Destination, SearchLog])],
  controllers: [CacheController],
  providers: [CacheStatsService],
})
export class CacheModule { }
