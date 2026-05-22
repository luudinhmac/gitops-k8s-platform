import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const rawIp = 
      req.headers['cf-connecting-ip'] ||
      req.headers['x-original-client-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.ip ||
      'unknown';
    
    // In case there is a comma-separated chain (e.g. from X-Forwarded-For), resolve the original client
    return (typeof rawIp === 'string' ? rawIp : String(rawIp)).split(',')[0].trim();
  }
}
