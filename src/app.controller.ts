// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(Destination)
    private readonly destRepo: Repository<Destination>,
  ) { }

  @Get()
  async root() {
    let cachedCount = 0;
    try {
      cachedCount = await this.destRepo.count();
    } catch {
      // db may not be ready yet
    }
    return {
      status: 'ok',
      service: 'TravelGenie API',
      version: '2.0.0',
      stack: 'NestJS + PostgreSQL',
      cached_count: cachedCount,
      docs: '/api',
      endpoints: {
        search: 'POST /api/search',
        stats: 'GET /api/cache/stats',
        top: 'GET /api/stats/top',
        clear: 'DELETE /api/cache/clear',
        health: 'GET /health',
      },
    };
  }
}
