const { readFileSync } = require("fs");
const { Client } = require("pg");
require("dotenv").config({ path: ".env.local" });

if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "REPLACE_ME") {
  console.error("Missing or placeholder DATABASE_URL in .env.local");
  process.exit(1);
}

(async () => {
  const sql = readFileSync("./scripts/db.sql", "utf8");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    await client.query(sql);
    console.log("DB schema applied");
  } catch (e) {
    console.error("DB init failed:", e);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
