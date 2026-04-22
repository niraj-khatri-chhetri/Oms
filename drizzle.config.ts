import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/core/database/schema',
  out: './src/core/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: false,
});
