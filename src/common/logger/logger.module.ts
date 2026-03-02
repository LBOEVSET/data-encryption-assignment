import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestContextService } from 'src/common/middleware/request-context.service';

@Global()
@Module({
  providers: [
    LoggerService, 
    LoggingInterceptor,
    JwtAuthGuard,
    RequestContextService
  ],
  exports: [
    LoggerService,
    LoggingInterceptor,
    JwtAuthGuard,
    RequestContextService
  ],
})
export class LoggerModule {}
