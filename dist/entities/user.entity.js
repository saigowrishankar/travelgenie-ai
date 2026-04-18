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
exports.RateLimitUser = void 0;
const typeorm_1 = require("typeorm");
let RateLimitUser = class RateLimitUser {
};
exports.RateLimitUser = RateLimitUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RateLimitUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'user_ip', length: 64 }),
    __metadata("design:type", String)
], RateLimitUser.prototype, "userIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'searches_today', default: 0 }),
    __metadata("design:type", Number)
], RateLimitUser.prototype, "searchesToday", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_searches', default: 0 }),
    __metadata("design:type", Number)
], RateLimitUser.prototype, "totalSearches", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'window_start', type: 'timestamptz' }),
    __metadata("design:type", Date)
], RateLimitUser.prototype, "windowStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_pro', default: false }),
    __metadata("design:type", Boolean)
], RateLimitUser.prototype, "isPro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_seen', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], RateLimitUser.prototype, "lastSeen", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RateLimitUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RateLimitUser.prototype, "updatedAt", void 0);
exports.RateLimitUser = RateLimitUser = __decorate([
    (0, typeorm_1.Entity)('rate_limit_users')
], RateLimitUser);
//# sourceMappingURL=user.entity.js.map