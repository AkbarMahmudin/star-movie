import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  algorithm: process.env.JWT_ALGORITHM,
  keyFolder: process.env.JWT_KEY_FOLDER,
  expiresIn: process.env.JWT_EXPIRES_IN,
  secretKey: process.env.JWT_SECRET_KEY,
  publicKey: process.env.JWT_PUBLIC_KEY,
}));
