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
    if (!req.url.includes('/stats/counters')) {
      // 1. Update Online Status & Track Request for DOS
      let identifier = req.ip || req.header('x-forwarded-for') || 'unknown';
      
      // Normalize local IP (Windows IPv6 to IPv4)
      if (identifier === '::1' || identifier === '::ffff:127.0.0.1') {
        identifier = '127.0.0.1';
      }

      this.statsService.updateUserActivity(identifier as string);
      this.monitoringService.trackRequest(identifier as string);

      // 2. Increment total visits only for "main" entries
      // Handle both /api/posts and /api/v1/posts
      const url = req.url;
      const isPostsList = url.endsWith('/posts') || url.includes('/posts?');
      const isPostDetail = url.includes('/posts/') && !url.includes('/like') && !url.includes('/pin') && !url.includes('/publish');

      if (req.method === 'GET' && (isPostsList || isPostDetail)) {
        // Session-based visit counting
        const hasVisited = req.cookies['visitor_session'];
        if (!hasVisited) {
          this.statsService.incrementTotalVisits();
          // Set a session cookie (expires when browser/tab is closed)
          res.cookie('visitor_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        }
      }
    }

    next();
  }
}
