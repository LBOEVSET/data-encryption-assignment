import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { THROTTLE_CONFIG } from 'throttler.config';
import { DataEncryptionModule } from './dataEncryption/dataEncryption.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core/constants';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    DataEncryptionModule,
    LoggerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
      {
        name: 'default',
        ...THROTTLE_CONFIG.DEFAULT,
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
