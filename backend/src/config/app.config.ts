import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.ENV,
  name: process.env.APP_NAME,
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  port: +(process?.env?.PORT ?? '3000') || 3000,
  salt: process.env.BCRYPT_SALT_ROUNDS || 10,
}));
