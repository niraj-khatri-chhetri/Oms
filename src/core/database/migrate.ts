import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import 'dotenv/config';

async function main() {
     const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
     });

     const db = drizzle(pool);

     console.log('Starting migrations...\n');

     try {
          const start = Date.now();

          await migrate(db, {
               migrationsFolder: './src/core/database/migrations',
          });

          const duration = ((Date.now() - start) / 1000).toFixed(2);

          console.log(`\n:white_check_mark: Migrations completed in ${duration}s`);
     } catch (err) {
          console.error('\n:x: Migration failed!');
          console.error(err);

          process.exit(1);
     } finally {
          await pool.end();
     }
}

main();