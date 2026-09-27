import { envConfig } from "@/config/env-conf"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"


const connectionString = envConfig.DATABASE_URL
const client = postgres(connectionString, { prepare: false })
const db = drizzle({
  client,
  logger: true
});

export default db
