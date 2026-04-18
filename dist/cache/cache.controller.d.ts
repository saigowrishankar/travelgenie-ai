import { CacheStatsService } from './cache-stats.service';
export declare class CacheController {
    private readonly statsService;
    constructor(statsService: CacheStatsService);
    getStats(): Promise<{
        storage: string;
        active_cache: number;
        expired_entries: number;
        total_searches: number;
        cache_hit_rate: string;
        api_calls_saved: number;
        top_5_destinations: {
            name: string;
            searches: number;
        }[];
    }>;
    getTop(): Promise<{
        top_destinations: {
            destination_name: string;
            search_count: number;
            cached_at: Date;
        }[];
    }>;
    clearCache(): Promise<{
        message: string;
    }>;
}
