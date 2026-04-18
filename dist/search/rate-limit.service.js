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
exports.RateLimitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../entities/user.entity");
let RateLimitService = class RateLimitService {
    constructor(userRepo, config) {
        this.userRepo = userRepo;
        this.config = config;
        this.freeSearches = config.get('FREE_SEARCHES_PER_IP', 10);
        this.windowHours = config.get('RATE_WINDOW_HOURS', 24);
    }
    async checkAndIncrement(ip) {
        const now = new Date();
        const windowMs = this.windowHours * 3600 * 1000;
        let user = await this.userRepo.findOne({ where: { userIp: ip } });
        if (user) {
            const windowExpired = now.getTime() - user.windowStart.getTime() > windowMs;
            if (windowExpired) {
                user.searchesToday = 0;
                user.windowStart = now;
            }
        }
        else {
            user = this.userRepo.create({
                userIp: ip,
                searchesToday: 0,
                totalSearches: 0,
                windowStart: now,
                isPro: false,
            });
        }
        const remaining = this.freeSearches - user.searchesToday;
        if (remaining <= 0) {
            throw new common_1.HttpException({
                error: 'free_limit_reached',
                message: `You have used all ${this.freeSearches} free searches. Upgrade to Pro.`,
                searches_remaining: 0,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        user.searchesToday += 1;
        user.totalSearches += 1;
        user.lastSeen = now;
        await this.userRepo.save(user);
        return remaining - 1;
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.RateLimitUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map