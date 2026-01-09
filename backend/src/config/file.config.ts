import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
  dest: process.env.FILE_DIR || 'storage',
  maxSize: parseInt(process.env.FILE_MAX_SIZE || '5'),
  allowedMimeTypes: (
    process.env.FILE_ALLOWED_MIME_TYPES ||
    'image/png,image/jpeg,image/jpg,application/pdf'
  ).split(','),
}));
