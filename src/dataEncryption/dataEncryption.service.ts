import {
  Injectable,
} from '@nestjs/common';
import * as forge from 'node-forge';
import * as fs from 'fs';

@Injectable()
export class DataEncryptionService {

  private publicKey = forge.pki.publicKeyFromPem(
    fs.readFileSync('keys/public.pem', 'utf8')
  );

  private privateKey = forge.pki.privateKeyFromPem(
    fs.readFileSync('keys/private.pem', 'utf8')
  );

  generateAESKey(): string {
    return forge.random.getBytesSync(32);
  }

  encryptAES(payload: string, key: string) {
    const iv = forge.random.getBytesSync(16);

    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(payload, 'utf8'));
    cipher.finish();

    const encrypted = cipher.output.getBytes();

    return forge.util.encode64(iv) + ':' + forge.util.encode64(encrypted);
  }

  decryptAES(data: string, key: string) {
    const [ivBase64, encryptedData] = data.split(':');

    const iv = forge.util.decode64(ivBase64);
    const encrypted = forge.util.decode64(encryptedData);

    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(encrypted));
    decipher.finish();

    return decipher.output.toString('utf8');
  }

  encryptRSA(data: string) {
    const encrypted = this.publicKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });

    return forge.util.encode64(encrypted);
  }

  decryptRSA(encryptedData: string) {
    const decoded = forge.util.decode64(encryptedData);

    return this.privateKey.decrypt(decoded, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
  }
}
