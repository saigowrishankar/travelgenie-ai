"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const destination_entity_1 = require("../entities/destination.entity");
const search_log_entity_1 = require("../entities/search-log.entity");
const cache_controller_1 = require("./cache.controller");
const cache_stats_service_1 = require("./cache-stats.service");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([destination_entity_1.Destination, search_log_entity_1.SearchLog])],
        controllers: [cache_controller_1.CacheController],
        providers: [cache_stats_service_1.CacheStatsService],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map