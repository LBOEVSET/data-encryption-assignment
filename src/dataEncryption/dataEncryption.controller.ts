import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { DataEncryptionService } from './dataEncryption.service';
import { EncryptionDto, DecryptionDto } from './dto/dataEncryption.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'data-cryption',
  version: '1',
})
export class DataCryptionController {
  constructor(
    private readonly dataEncryptionService: DataEncryptionService
) {}

  @Public()
  @Post('get-encrypt-data')
  async encrypt(@Body() dto: EncryptionDto) {
    const aesKey = this.dataEncryptionService.generateAESKey();

    const data2 = this.dataEncryptionService.encryptAES(dto.payload, aesKey);
    const data1 = this.dataEncryptionService.encryptRSA(aesKey);

    return { 
        successful: true,
        error_code: "",
        data: {
            data1,
            data2
        }
    };
  }

  @Public()
  @Post('get-decrypt-data')
  async decrypt(@Body() dto: DecryptionDto) {
    const aesKey = this.dataEncryptionService.decryptRSA(dto.data1);
    const payload = this.dataEncryptionService.decryptAES(dto.data2, aesKey);

    return { 
        successful: true,
        error_code: "",
        data: {
            payload
        }
    };
  }

}
