import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
export declare class AppController {
    private readonly destRepo;
    constructor(destRepo: Repository<Destination>);
    root(): Promise<{
        status: string;
        service: string;
        version: string;
        stack: string;
        cached_count: number;
        docs: string;
        endpoints: {
            search: string;
            stats: string;
            top: string;
            clear: string;
            health: string;
        };
    }>;
}
