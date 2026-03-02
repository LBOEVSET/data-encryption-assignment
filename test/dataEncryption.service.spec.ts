import { Test, TestingModule } from '@nestjs/testing';
import { DataEncryptionService } from '../src/dataEncryption/dataEncryption.service';
import * as fs from 'fs';

describe('DataEncryptionService', () => {
  let service: DataEncryptionService;

  beforeAll(async () => {
    // ensure keys exist for test
    if (!fs.existsSync('keys')) {
      fs.mkdirSync('keys');
    }

    if (!fs.existsSync('keys/private.pem')) {
      const { execSync } = require('child_process');
      execSync('openssl genrsa -out keys/private.pem 2048');
      execSync('openssl rsa -in keys/private.pem -pubout -out keys/public.pem');
    }
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataEncryptionService],
    }).compile();

    service = module.get<DataEncryptionService>(DataEncryptionService);
  });

  it('should generate AES key (32 bytes)', () => {
    const key = service.generateAESKey();
    expect(key).toBeDefined();
    expect(key.length).toBe(32);
  });

  it('should encrypt and decrypt AES correctly', () => {
    const key = service.generateAESKey();
    const text = 'Hello AES';

    const encrypted = service.encryptAES(text, key);
    const decrypted = service.decryptAES(encrypted, key);

    expect(decrypted).toBe(text);
  });

  it('should encrypt and decrypt RSA correctly', () => {
    const key = service.generateAESKey();

    const encrypted = service.encryptRSA(key);
    const decrypted = service.decryptRSA(encrypted);

    expect(decrypted.equals(key)).toBe(true);
  });

  it('should support full hybrid encryption flow', () => {
    const payload = 'Hybrid encryption test';

    const aesKey = service.generateAESKey();

    const encryptedData = service.encryptAES(payload, aesKey);
    const encryptedKey = service.encryptRSA(aesKey);

    const decryptedKey = service.decryptRSA(encryptedKey);
    const decryptedPayload = service.decryptAES(encryptedData, decryptedKey);

    expect(decryptedPayload).toBe(payload);
  });
});
