import { Request } from 'express';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(dto: SearchDto, req: Request): Promise<{
        destination: string;
        data: Record<string, any>;
        cached: boolean;
        storage: string;
        searches_remaining: number;
    }>;
}
