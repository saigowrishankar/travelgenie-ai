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
exports.DestinationCacheService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const destination_entity_1 = require("../entities/destination.entity");
const search_log_entity_1 = require("../entities/search-log.entity");
let DestinationCacheService = class DestinationCacheService {
    constructor(destRepo, logRepo, config) {
        this.destRepo = destRepo;
        this.logRepo = logRepo;
        this.config = config;
        this.cacheDays = config.get('CACHE_TTL_DAYS', 7);
    }
    normalizeKey(destination) {
        return destination.toLowerCase().trim();
    }
    async get(key) {
        const now = new Date();
        const record = await this.destRepo.findOne({
            where: {
                destinationKey: key,
                expiresAt: (0, typeorm_2.MoreThan)(now),
            },
        });
        if (!record)
            return null;
        await this.destRepo.update(record.id, {
            searchCount: record.searchCount + 1,
            lastSearched: now,
        });
        return record.data;
    }
    async set(key, destinationName, data) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.cacheDays * 86400_000);
        const existing = await this.destRepo.findOne({
            where: { destinationKey: key },
        });
        if (existing) {
            await this.destRepo.update(existing.id, {
                destinationName,
                data,
                expiresAt,
                lastSearched: now,
                searchCount: existing.searchCount + 1,
            });
        }
        else {
            await this.destRepo.save(this.destRepo.create({
                destinationKey: key,
                destinationName,
                data,
                expiresAt,
                lastSearched: now,
                searchCount: 1,
            }));
        }
    }
    async log(destination, userIp, cacheHit, responseMs) {
        try {
            await this.logRepo.save(this.logRepo.create({ destination, userIp, cacheHit, responseMs }));
        }
        catch {
        }
    }
};
exports.DestinationCacheService = DestinationCacheService;
exports.DestinationCacheService = DestinationCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(destination_entity_1.Destination)),
    __param(1, (0, typeorm_1.InjectRepository)(search_log_entity_1.SearchLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], DestinationCacheService);
//# sourceMappingURL=destination-cache.service.js.map