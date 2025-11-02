import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Para aplicações atrás de proxy (nginx, load balancer, etc.)
    // Usa o IP real do cliente em vez do IP do proxy
    const ips = Array.isArray(req.ips) ? req.ips : undefined;
    const ip = typeof req.ip === 'string' ? req.ip : 'unknown';
    const result = ips && ips.length ? String(ips[0]) : ip;
    return Promise.resolve(result);
  }
}
