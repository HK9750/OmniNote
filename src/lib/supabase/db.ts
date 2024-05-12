import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find database url");
}

const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client, { schema });
const migratedb = async () => {
  try {
    console.log("🚀 Migrating database");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("🟢 Database migrated successfully");
  } catch (error) {
    console.log(`🔴 Error migrating database,${error}`);
  }
};
migratedb();
export default db;
