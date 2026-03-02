import { Test, TestingModule } from '@nestjs/testing';
import { DataCryptionController } from '../src/dataEncryption/dataEncryption.controller';
import { DataEncryptionService } from '../src/dataEncryption/dataEncryption.service';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { CanActivate } from '@nestjs/common';

describe('DataCryptionController', () => {
  let controller: DataCryptionController;

  const mockJwtGuard: CanActivate = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataCryptionController],
      providers: [DataEncryptionService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    controller = module.get<DataCryptionController>(DataCryptionController);
  });

  it('should encrypt payload', async () => {
    const result = await controller.encrypt({ payload: 'Hello' });

    expect(result.successful).toBe(true);
    expect(result.data.data1).toBeDefined();
    expect(result.data.data2).toBeDefined();
  });

  it('should decrypt payload correctly', async () => {
    const encryptResult = await controller.encrypt({ payload: 'Secret Data' });

    const decryptResult = await controller.decrypt({
      data1: encryptResult.data.data1,
      data2: encryptResult.data.data2,
    });

    expect(decryptResult.successful).toBe(true);
    expect(decryptResult.data.payload).toBe('Secret Data');
  });
});
