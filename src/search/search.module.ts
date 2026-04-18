// src/search/search.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from '../entities/destination.entity';
import { RateLimitUser } from '../entities/user.entity';
import { SearchLog } from '../entities/search-log.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { RateLimitService } from './rate-limit.service';
import { GeminiService } from './groq.service';
import { DestinationCacheService } from './destination-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Destination, RateLimitUser, SearchLog])],
  controllers: [SearchController],
  providers: [SearchService, RateLimitService, GeminiService, DestinationCacheService],
  exports: [DestinationCacheService],
})
export class SearchModule { }
