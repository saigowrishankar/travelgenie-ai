"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_service_1 = require("./rate-limit.service");
const groq_service_1 = require("./groq.service");
const destination_cache_service_1 = require("./destination-cache.service");
let SearchService = SearchService_1 = class SearchService {
    constructor(rateLimitService, geminiService, cacheService) {
        this.rateLimitService = rateLimitService;
        this.geminiService = geminiService;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(SearchService_1.name);
    }
    async search(dto, clientIp) {
        const t0 = Date.now();
        const destination = dto.destination.trim();
        const searchesRemaining = await this.rateLimitService.checkAndIncrement(clientIp);
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
        this.logger.log(`🌐 Cache MISS: "${destination}" — calling Groq API`);
        const data = await this.geminiService.fetchDestinationData(destination);
        await this.cacheService.set(key, data.name ?? destination, data);
        this.logger.log(`💾 Saved "${destination}" to PostgreSQL`);
        await this.cacheService.log(destination, clientIp, false, Date.now() - t0);
        return {
            destination,
            data,
            cached: false,
            storage: 'PostgreSQL',
            searches_remaining: searchesRemaining,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService,
        groq_service_1.GeminiService,
        destination_cache_service_1.DestinationCacheService])
], SearchService);
//# sourceMappingURL=search.service.js.map