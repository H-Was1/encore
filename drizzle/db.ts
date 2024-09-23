import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const client = neon(
  "postgresql://encore_owner:xD3VMy0hTNYW@ep-broad-boat-a2194xw7.eu-central-1.aws.neon.tech/encore?sslmode=require"
);
export const db = drizzle(client, { schema, logger: true });
