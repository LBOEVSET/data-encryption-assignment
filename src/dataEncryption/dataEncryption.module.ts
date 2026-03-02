import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DataEncryptionService } from './dataEncryption.service';
import { DataCryptionController } from './dataEncryption.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
  ],
  controllers: [DataCryptionController],
  providers: [DataEncryptionService],
})
export class DataEncryptionModule {}
