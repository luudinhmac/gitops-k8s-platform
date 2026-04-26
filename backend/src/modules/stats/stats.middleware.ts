import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StatsService } from './stats.service';
import { MonitoringService } from '../admin-alert/monitoring.service';

@Injectable()
export class StatsMiddleware implements NestMiddleware {
  constructor(
    private statsService: StatsService,
    private monitoringService: MonitoringService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.url.includes('/api/stats/counters')) {
      // 1. Update Online Status & Track Request for DOS
      let identifier = req.ip || req.header('x-forwarded-for') || 'unknown';
      
      // Normalize local IP (Windows IPv6 to IPv4)
      if (identifier === '::1' || identifier === '::ffff:127.0.0.1') {
        identifier = '127.0.0.1';
      }

      this.statsService.updateUserActivity(identifier as string);
      this.monitoringService.trackRequest(identifier as string);

      // 2. Increment total visits only for "main" entries
      // We only count when the user hits the posts list OR a specific post
      // This avoids counting sub-calls for settings, categories, series, etc.
      const isMainContent = req.url === '/api/posts' || 
                           req.url.startsWith('/api/posts?') || 
                           (req.url.startsWith('/api/posts/') && !req.url.includes('/like') && !req.url.includes('/pin'));

      if (req.method === 'GET' && isMainContent) {
        this.statsService.incrementTotalVisits();
      }
    }

    next();
  }
}
