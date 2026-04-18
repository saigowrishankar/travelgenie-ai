// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from './entities/destination.entity';
import { RateLimitUser } from './entities/user.entity';
import { SearchLog } from './entities/search-log.entity';
import { SearchModule } from './search/search.module';
import { CacheModule } from './cache/cache.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────────────────────────
    ConfigModule.forRoot({ isGlobal: true }),

    // ── PostgreSQL via TypeORM ───────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const url = cfg.get<string>('DATABASE_URL');
        if (url) {
          return {
            type: 'postgres',
            url,
            entities: [Destination, RateLimitUser, SearchLog],
            synchronize: true, // auto-creates tables; use migrations in prod
            ssl: url.includes('sslmode=require') || url.includes('amazonaws.com')
              ? { rejectUnauthorized: false }
              : false,
            logging: cfg.get('NODE_ENV') === 'development',
          };
        }
        return {
          type: 'postgres',
          host: cfg.get('DB_HOST', 'localhost'),
          port: cfg.get<number>('DB_PORT', 5432),
          database: cfg.get('DB_NAME', 'travelgenie'),
          username: cfg.get('DB_USER', 'travelgenie'),
          password: cfg.get('DB_PASS', 'password'),
          entities: [Destination, RateLimitUser, SearchLog],
          synchronize: true,
          logging: cfg.get('NODE_ENV') === 'development',
        };
      },
    }),

    // ── Root repo (for AppController status endpoint) ─────────────────────
    TypeOrmModule.forFeature([Destination]),

    // ── Feature modules ──────────────────────────────────────────────────────
    SearchModule,
    CacheModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
