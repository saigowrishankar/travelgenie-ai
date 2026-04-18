import { ConfigService } from '@nestjs/config';
export declare class GeminiService {
    private readonly config;
    private readonly logger;
    private readonly apiKey;
    private readonly model;
    private readonly apiUrl;
    constructor(config: ConfigService);
    private callGroq;
    private extractJson;
    fetchDestinationData(destination: string): Promise<Record<string, any>>;
}
