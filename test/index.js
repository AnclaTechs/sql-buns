require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Reset DB
function resolveTestDbPath() {
  if (process.env.DATABASE_URL) {
    if (process.env.DATABASE_URL.startsWith("file:")) {
      const rawPath = process.env.DATABASE_URL.replace(/^file:/, "");
      return path.isAbsolute(rawPath)
        ? rawPath
        : path.resolve(process.cwd(), rawPath);
    } else {
      throw new Error(
        "Invalid DATABASE_URL for sqlite. Expected format: file:./database.sqlite"
      );
    }
  }

  const dbName = process.env.DATABASE_NAME || "database.sqlite";
  return path.resolve(process.cwd(), dbName);
}

const DB_PATH = resolveTestDbPath();

if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

const {
  pool,
  getSingleRow,
  createRowAndReturn,
  batchTransaction,
  RecordDoesNotExist,
} = require("@anclatechs/sql-buns");

async function runTests() {
  console.log("\n---- 🧩 Running Create & Return test ----");

  // Create a User table
  await pool.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

  // Insert a new row
  await createRowAndReturn("users", "INSERT INTO users (name) VALUES (?)", [
    "Uchenna",
  ]);

  console.log("\n----🧩 Running get Single row test ----");

  const row = await getSingleRow("SELECT * FROM users WHERE id = ?", [1]);
  console.log("✅ Got row:", row);

  // Get a non-existent row
  try {
    await getSingleRow("SELECT * FROM users WHERE id = ?", [99]);
  } catch (err) {
    if (err instanceof RecordDoesNotExist) {
      console.log(`✅ RecordDoesNotExist Error returned:`, err.message);
    } else {
      console.error("❌ Unexpected error:", err);
    }
  }

  console.log("\n---- 🧩 Running batch transaction test ----");

  try {
    const batchQueries = [
      { sql: "INSERT INTO users (name) VALUES (?)", params: ["Adanne"] },
      { sql: "INSERT INTO users (name) VALUES (?)", params: ["Obinna"] },
      { sql: "INSERT INTO users (name) VALUES (?)", params: ["Akugbe"] },
      { sql: "INSERT INTO users (name) VALUES (?)", params: ["Osadolor"] },
    ];

    const batchResult = await batchTransaction(batchQueries);
    if (batchResult.success) {
      console.log("✅ Batch transaction completed successfully:");
    } else {
      console.log(
        "✅ Rollback triggered successfully on error:",
        batchResult.error
      );
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

runTests();
