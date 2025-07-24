import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: './.env.' + (process.env.NODE_ENV || 'development') });

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true,
	casing: 'snake_case'
});
