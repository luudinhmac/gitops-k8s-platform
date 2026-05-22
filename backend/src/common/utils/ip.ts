import { Request } from 'express';

/**
 * Extracts the real client IP from Cloudflare, reverse proxy, or direct connection headers.
 */
export function getClientIp(req: Request | any): string {
  const rawIp =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-original-client-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown';

  return (typeof rawIp === 'string' ? rawIp : String(rawIp)).split(',')[0].trim();
}
