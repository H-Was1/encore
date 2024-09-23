import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationClient = postgres("postgresql://encore_owner:xD3VMy0hTNYW@ep-broad-boat-a2194xw7.eu-central-1.aws.neon.tech/encore?sslmode=require", { max: 1 });

async function main() {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/drizzle/migrations",
  });

  await migrationClient.end();
}
main();
