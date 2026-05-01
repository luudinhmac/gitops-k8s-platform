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
    const url = req.url;
    
    // 1. Skip tracking for internal health checks and counters endpoint
    const isInternal = url.includes('/health') || url.includes('/stats/counters');
    
    if (!isInternal) {
      // Get real IP from Traefik header or fallback
      let identifier = (req.header('x-forwarded-for') || req.ip || 'unknown').split(',')[0].trim();
      
      // Normalize local IP (Windows IPv6 to IPv4)
      if (identifier === '::1' || identifier === '::ffff:127.0.0.1') {
        identifier = '127.0.0.1';
      }

      this.statsService.updateUserActivity(identifier);
      this.monitoringService.trackRequest(identifier);

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
