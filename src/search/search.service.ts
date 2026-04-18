// src/search/search.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { GeminiService } from './groq.service';
import { DestinationCacheService } from './destination-cache.service';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly rateLimitService: RateLimitService,
    private readonly geminiService: GeminiService,  // ✅ fixed: no more stray "GeminiService: any" class prop
    private readonly cacheService: DestinationCacheService,
  ) { }

  async search(dto: SearchDto, clientIp: string) {
    const t0 = Date.now();
    const destination = dto.destination.trim();

    // 1 · Rate limit
    const searchesRemaining = await this.rateLimitService.checkAndIncrement(clientIp);

    // 2 · Cache lookup — hits PostgreSQL first, no API call if found
    const key = this.cacheService.normalizeKey(destination);
    const cached = dto.force_refresh ? null : await this.cacheService.get(key);

    if (cached) {
      this.logger.log(`✅ Cache HIT: "${destination}" served from PostgreSQL`);
      await this.cacheService.log(destination, clientIp, true, Date.now() - t0);
      return {
        destination,
        data: cached,
        cached: true,
        storage: 'PostgreSQL',
        searches_remaining: searchesRemaining,
      };
    }

    // 3 · Cache MISS — call AI
    this.logger.log(`🌐 Cache MISS: "${destination}" — calling Groq API`);
    const data = await this.geminiService.fetchDestinationData(destination); // ✅ fixed

    // 4 · Save to PostgreSQL for future requests
    await this.cacheService.set(key, data.name ?? destination, data);
    this.logger.log(`💾 Saved "${destination}" to PostgreSQL`);

    // 5 · Log
    await this.cacheService.log(destination, clientIp, false, Date.now() - t0);

    return {
      destination,
      data,
      cached: false,
      storage: 'PostgreSQL',
      searches_remaining: searchesRemaining,
    };
  }
}
