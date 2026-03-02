import {
  Injectable,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class DataEncryptionService {

  private publicKey: string = fs.readFileSync('keys/public.pem', 'utf8');
  private privateKey: string = fs.readFileSync('keys/private.pem', 'utf8');

  generateAESKey(): Buffer {
    return crypto.randomBytes(32);
  }

  encryptAES(payload: string, key: Buffer) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(payload, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return iv.toString('base64') + ':' + encrypted;
  }

  decryptAES(data: string, key: Buffer) {
    const [ivBase64, encryptedData] = data.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
  
  encryptRSA(data: Buffer) {
    return crypto.publicEncrypt(
      {
        key: this.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      data,
    ).toString('base64');
  }

  decryptRSA(encryptedData: string) {
    return crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptedData, 'base64'),
    );
  }

}
