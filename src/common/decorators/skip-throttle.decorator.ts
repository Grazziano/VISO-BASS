import { SetMetadata } from '@nestjs/common';

export const SKIP_THROTTLE_KEY = 'skipThrottle';
export const SkipThrottle = (skip = true) =>
  SetMetadata(SKIP_THROTTLE_KEY, skip);
