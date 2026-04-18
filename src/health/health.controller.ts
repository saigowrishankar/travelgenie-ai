// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async health() {
    let dbStatus = 'error';
    let dbMessage = '';

    try {
      await this.dataSource.query('SELECT 1');
      dbStatus = 'connected';
    } catch (e) {
      dbMessage = String(e.message ?? e);
    }

    return {
      status: dbStatus === 'connected' ? 'healthy' : 'degraded',
      postgres: dbStatus,
      ...(dbMessage ? { error: dbMessage } : {}),
      timestamp: new Date().toISOString(),
    };
  }
}
