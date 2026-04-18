import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Destination } from '../entities/destination.entity';
import { SearchLog } from '../entities/search-log.entity';
export declare class DestinationCacheService {
    private readonly destRepo;
    private readonly logRepo;
    private readonly config;
    private readonly cacheDays;
    constructor(destRepo: Repository<Destination>, logRepo: Repository<SearchLog>, config: ConfigService);
    normalizeKey(destination: string): string;
    get(key: string): Promise<Record<string, any> | null>;
    set(key: string, destinationName: string, data: Record<string, any>): Promise<void>;
    log(destination: string, userIp: string, cacheHit: boolean, responseMs: number): Promise<void>;
}
