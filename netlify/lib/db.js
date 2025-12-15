import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

console.log("postgresql://neondb_owner:npg_DkhZ9Kr7NPVI@ep-cool-unit-a26hfchq-pooler.eu-central-1.aws.neon.tech/metrash?sslmode=require&channel_binding=require")
const client = neon('postgresql://neondb_owner:npg_DkhZ9Kr7NPVI@ep-cool-unit-a26hfchq-pooler.eu-central-1.aws.neon.tech/metrash?sslmode=require&channel_binding=require');
export const db = drizzle(client);
