import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Para aplicações atrás de proxy (nginx, load balancer, etc.)
    // Usa o IP real do cliente em vez do IP do proxy
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
