// src/search/search.controller.ts
import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';

@Controller('api')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('search')
  async search(@Body() dto: SearchDto, @Req() req: Request) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '0.0.0.0';

    return this.searchService.search(dto, clientIp);
  }
}
