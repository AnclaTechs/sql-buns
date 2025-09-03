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
  RecordDoesNotExist,
} = require("@anclatechs/sql-buns");

async function runTests() {
  // Create a User table
  await pool.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

  // Insert a new row
  await createRowAndReturn("users", "INSERT INTO users (name) VALUES (?)", [
    "Uchenna",
  ]);

  // Get Single
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
}

runTests();
