import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config(); 

export default defineConfig({
  schema: './src/database/schema.prisma',
});
