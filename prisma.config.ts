import { defineConfig, env } from 'prisma/config';
import 'dotenv/config'; 

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // This connects to your DB using the env var
    url: env('DATABASE_URL'), 
  },
  // Optional: Configure where migrations are stored
  migrations: {
    path: 'prisma/migrations',
  },
});