import { NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { RequestContextService } from './request-context.service';

export function requestIdMiddleware(
  requestContext: RequestContextService,
) {
  return (req, res, next: NextFunction) => {
    const requestId = randomUUID();

    requestContext.run(() => {
      requestContext.set('requestId', requestId);
      next();
    }, new Map());
  };
}
