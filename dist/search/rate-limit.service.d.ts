import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RateLimitUser } from '../entities/user.entity';
export declare class RateLimitService {
    private readonly userRepo;
    private readonly config;
    private readonly freeSearches;
    private readonly windowHours;
    constructor(userRepo: Repository<RateLimitUser>, config: ConfigService);
    checkAndIncrement(ip: string): Promise<number>;
}
