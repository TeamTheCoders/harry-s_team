import { neon } from '@neondatabase/serverless';
 
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}
const sql = neon("postgresql://neondb_owner:npg_c1jvWHesq6ht@ep-restless-flower-ahhmf1l9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require");

export { sql };