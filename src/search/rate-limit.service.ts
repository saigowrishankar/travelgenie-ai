// src/search/rate-limit.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RateLimitUser } from '../entities/user.entity';

@Injectable()
export class RateLimitService {
  private readonly freeSearches: number;
  private readonly windowHours: number;

  constructor(
    @InjectRepository(RateLimitUser)
    private readonly userRepo: Repository<RateLimitUser>,
    private readonly config: ConfigService,
  ) {
    this.freeSearches = config.get<number>('FREE_SEARCHES_PER_IP', 10);
    this.windowHours = config.get<number>('RATE_WINDOW_HOURS', 24);
  }

  /**
   * Checks the rate limit for a given IP.
   * Increments the counter and returns searches remaining after this request.
   * Throws 429 if limit is exhausted.
   */
  async checkAndIncrement(ip: string): Promise<number> {
    const now = new Date();
    const windowMs = this.windowHours * 3600 * 1000;

    let user = await this.userRepo.findOne({ where: { userIp: ip } });

    if (user) {
      const windowExpired =
        now.getTime() - user.windowStart.getTime() > windowMs;

      if (windowExpired) {
        // Reset window
        user.searchesToday = 0;
        user.windowStart = now;
      }
    } else {
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
      throw new HttpException(
        {
          error: 'free_limit_reached',
          message: `You have used all ${this.freeSearches} free searches. Upgrade to Pro.`,
          searches_remaining: 0,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    user.searchesToday += 1;
    user.totalSearches += 1;
    user.lastSeen = now;
    await this.userRepo.save(user);

    return remaining - 1;
  }
}
