import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { SearchLog } from '../entities/search-log.entity';
export declare class CacheStatsService {
    private readonly destRepo;
    private readonly logRepo;
    constructor(destRepo: Repository<Destination>, logRepo: Repository<SearchLog>);
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
    getTopDestinations(): Promise<{
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
