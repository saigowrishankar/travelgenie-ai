"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const destination_entity_1 = require("./entities/destination.entity");
const user_entity_1 = require("./entities/user.entity");
const search_log_entity_1 = require("./entities/search-log.entity");
const search_module_1 = require("./search/search.module");
const cache_module_1 = require("./cache/cache.module");
const health_module_1 = require("./health/health.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cfg) => {
                    const url = cfg.get('DATABASE_URL');
                    if (url) {
                        return {
                            type: 'postgres',
                            url,
                            entities: [destination_entity_1.Destination, user_entity_1.RateLimitUser, search_log_entity_1.SearchLog],
                            synchronize: true,
                            ssl: url.includes('sslmode=require') || url.includes('amazonaws.com')
                                ? { rejectUnauthorized: false }
                                : false,
                            logging: cfg.get('NODE_ENV') === 'development',
                        };
                    }
                    return {
                        type: 'postgres',
                        host: cfg.get('DB_HOST', 'localhost'),
                        port: cfg.get('DB_PORT', 5432),
                        database: cfg.get('DB_NAME', 'travelgenie'),
                        username: cfg.get('DB_USER', 'travelgenie'),
                        password: cfg.get('DB_PASS', 'password'),
                        entities: [destination_entity_1.Destination, user_entity_1.RateLimitUser, search_log_entity_1.SearchLog],
                        synchronize: true,
                        logging: cfg.get('NODE_ENV') === 'development',
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([destination_entity_1.Destination]),
            search_module_1.SearchModule,
            cache_module_1.CacheModule,
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map