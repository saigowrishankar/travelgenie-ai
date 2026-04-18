import { DataSource } from 'typeorm';
export declare class HealthController {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    health(): Promise<{
        timestamp: string;
        error?: string;
        status: string;
        postgres: string;
    }>;
}
