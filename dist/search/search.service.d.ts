import { RateLimitService } from './rate-limit.service';
import { GeminiService } from './groq.service';
import { DestinationCacheService } from './destination-cache.service';
import { SearchDto } from './dto/search.dto';
export declare class SearchService {
    private readonly rateLimitService;
    private readonly geminiService;
    private readonly cacheService;
    private readonly logger;
    constructor(rateLimitService: RateLimitService, geminiService: GeminiService, cacheService: DestinationCacheService);
    search(dto: SearchDto, clientIp: string): Promise<{
        destination: string;
        data: Record<string, any>;
        cached: boolean;
        storage: string;
        searches_remaining: number;
    }>;
}
