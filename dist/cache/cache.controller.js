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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheController = void 0;
const common_1 = require("@nestjs/common");
const cache_stats_service_1 = require("./cache-stats.service");
let CacheController = class CacheController {
    constructor(statsService) {
        this.statsService = statsService;
    }
    getStats() {
        return this.statsService.getStats();
    }
    getTop() {
        return this.statsService.getTopDestinations();
    }
    clearCache() {
        return this.statsService.clearCache();
    }
};
exports.CacheController = CacheController;
__decorate([
    (0, common_1.Get)('cache/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CacheController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('stats/top'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CacheController.prototype, "getTop", null);
__decorate([
    (0, common_1.Delete)('cache/clear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CacheController.prototype, "clearCache", null);
exports.CacheController = CacheController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [cache_stats_service_1.CacheStatsService])
], CacheController);
//# sourceMappingURL=cache.controller.js.map