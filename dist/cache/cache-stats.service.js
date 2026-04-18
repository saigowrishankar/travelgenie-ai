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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const destination_entity_1 = require("../entities/destination.entity");
const search_log_entity_1 = require("../entities/search-log.entity");
let CacheStatsService = class CacheStatsService {
    constructor(destRepo, logRepo) {
        this.destRepo = destRepo;
        this.logRepo = logRepo;
    }
    async getStats() {
        const now = new Date();
        const [total, active, totalSearches, cacheHits] = await Promise.all([
            this.destRepo.count(),
            this.destRepo.count({ where: { expiresAt: (0, typeorm_2.MoreThan)(now) } }),
            this.logRepo.count(),
            this.logRepo.count({ where: { cacheHit: true } }),
        ]);
        const hitRate = totalSearches > 0
            ? `${((cacheHits / totalSearches) * 100).toFixed(1)}%`
            : '0%';
        const top5 = await this.destRepo.find({
            select: ['destinationName', 'searchCount'],
            order: { searchCount: 'DESC' },
            take: 5,
        });
        return {
            storage: 'PostgreSQL',
            active_cache: active,
            expired_entries: total - active,
            total_searches: totalSearches,
            cache_hit_rate: hitRate,
            api_calls_saved: cacheHits,
            top_5_destinations: top5.map((d) => ({
                name: d.destinationName,
                searches: d.searchCount,
            })),
        };
    }
    async getTopDestinations() {
        const top = await this.destRepo.find({
            select: ['destinationName', 'searchCount', 'cachedAt'],
            order: { searchCount: 'DESC' },
            take: 10,
        });
        return {
            top_destinations: top.map((d) => ({
                destination_name: d.destinationName,
                search_count: d.searchCount,
                cached_at: d.cachedAt,
            })),
        };
    }
    async clearCache() {
        const result = await this.destRepo
            .createQueryBuilder()
            .delete()
            .from(destination_entity_1.Destination)
            .execute();
        return {
            message: `Deleted ${result.affected ?? 0} cached destinations from PostgreSQL`,
        };
    }
};
exports.CacheStatsService = CacheStatsService;
exports.CacheStatsService = CacheStatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(destination_entity_1.Destination)),
    __param(1, (0, typeorm_1.InjectRepository)(search_log_entity_1.SearchLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CacheStatsService);
//# sourceMappingURL=cache-stats.service.js.map