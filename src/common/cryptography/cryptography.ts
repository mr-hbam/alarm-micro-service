// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

const CRYPTO_KEY = '8Q8VMUE3BJZV87GT';
const IV = 'd139cb9a2cd17092e79e1861cf9d7023';
const SALT =
  '38dce0391b49efba88dbc8c39ebf868f0267eb110bb0012ab27dc52a528d61b1d1ed9d76f400ff58e3240028442b1eab9bb84e111d9dadd997982dbde9dbd25e';
export const encrypt = (text: string, isMagicSalt?: boolean) => {
  const iv = Buffer.from(IV, 'hex');
  const salt = isMagicSalt ? Buffer.from(SALT, 'hex') : randomBytes(64);
  const key = pbkdf2Sync(`${CRYPTO_KEY}`, salt, 2145, 32, 'sha512');
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

export const decrypt = (encdata?: string) => {
  if (encdata) {
    // base64 decoding
    const bData = Buffer.from(encdata, 'base64');

    // convert data to buffers
    const salt = bData.slice(0, 64);
    const iv = bData.slice(64, 80);
    const tag = bData.slice(80, 96);
    const text = bData.slice(96);

    if (
      salt.length === 0 ||
      iv.length === 0 ||
      tag.length === 0 ||
      text.length === 0
    ) {
      // One empty param makes Node crash
      throw Error('Length 0, cannot decrypt');
    }

    // derive key using; 32 byte key length
    const key = pbkdf2Sync(`${CRYPTO_KEY}`, salt, 2145, 32, 'sha512');

    // AES 256 GCM Mode
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted =
      decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');

    return decrypted;
  }

  return '-';
};
