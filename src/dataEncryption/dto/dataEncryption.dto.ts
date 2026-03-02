import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EncryptionDto {
  @ApiProperty({
    example: "ABCDEFG_ENCRYPTION_TEXT",
    description: "Plain text to encrypt"
  })
  @IsString()
  payload!: string;
}

export class DecryptionDto {
  @ApiProperty({
    example: "KfkYbJjASkM3ebY7bprZr2DJhg7nD2fTFNgXlpe+yuln4IqEXQlEikZKLHajNOeNn3ut5SNhdeYgkIBKgkMSyyjuUPlmjsTUxU/Z/QQRPEMpmu47idTcj1MuNFApqqsOTSOFol2gyb5+YFocr8pKfEOZcnSMExwoDBTol/mwClmDpECAaVpGfobtQqUQ0EMDMXnqbBeXe4a9ZoMwa4mvJGcZ8AGqCgM8EYZZaHGLNA2m4UW6KLhgv81r6ufR7xA4b5YFrz/INH1n2BbBtL6ZIIsO8EiuMJ021UhXgh02jauzViX0EnbuWCQJOA5v35rD7QHdnUNQoEhJjmF70yu2jg==",
    description: "Encrypted data to decrypt"
  })
  @IsString()
  data1!: string;

  @ApiProperty({
    example: "OVzqfjwGSkJMBLF9IsxEug==:njqw+4EWuOkYZRuviXK1x+i+APCQkKoB4nvE2s7S0Rc=",
    description: "Encrypted key to decrypt"
  })
  @IsString()
  data2!: string;
}