import { Test, TestingModule } from '@nestjs/testing';
import { DataEncryptionService } from '../src/dataEncryption/dataEncryption.service';
import * as fs from 'fs';
import * as forge from 'node-forge';

describe('DataEncryptionService (node-forge)', () => {
  let service: DataEncryptionService;

  beforeAll(() => {
    // ensure keys exist for test
    if (!fs.existsSync('keys')) {
      fs.mkdirSync('keys');
    }

    if (!fs.existsSync('keys/private.pem')) {
      const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

      fs.writeFileSync(
        'keys/private.pem',
        forge.pki.privateKeyToPem(keypair.privateKey),
      );

      fs.writeFileSync(
        'keys/public.pem',
        forge.pki.publicKeyToPem(keypair.publicKey),
      );
    }
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataEncryptionService],
    }).compile();

    service = module.get<DataEncryptionService>(DataEncryptionService);
  });

  it('should generate AES key of 32 bytes', () => {
    const key = service.generateAESKey();
    expect(key).toBeDefined();
    expect(key.length).toBe(32);
  });

  it('should encrypt and decrypt AES correctly', () => {
    const key = service.generateAESKey();
    const payload = 'Hello AES';

    const encrypted = service.encryptAES(payload, key);
    const decrypted = service.decryptAES(encrypted, key);

    expect(decrypted).toBe(payload);
  });

  it('should encrypt and decrypt RSA correctly', () => {
    const key = service.generateAESKey();

    const encrypted = service.encryptRSA(key);
    const decrypted = service.decryptRSA(encrypted);

    expect(decrypted).toBe(key);
  });

  it('should support hybrid encryption flow', () => {
    const payload = 'Hybrid Encryption Test';

    const aesKey = service.generateAESKey();

    const encryptedData = service.encryptAES(payload, aesKey);
    const encryptedKey = service.encryptRSA(aesKey);

    const decryptedKey = service.decryptRSA(encryptedKey);
    const decryptedPayload = service.decryptAES(encryptedData, decryptedKey);

    expect(decryptedPayload).toBe(payload);
  });

  it('should fail AES decrypt with wrong key', () => {
    const key1 = service.generateAESKey();
    const key2 = service.generateAESKey();

    const encrypted = service.encryptAES('test', key1);

    expect(() => service.decryptAES(encrypted, key2)).toThrow();
  });
});
