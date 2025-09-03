require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Reset DB
const DB_PATH = path.resolve(
  __dirname,
  "..",
  process.env.DATABASE_NAME || "database.sqlite"
);

if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

const {
  pool,
  getSingleRow,
  createRowAndReturn,
  RecordDoesNotExist,
} = require("sql-buns");

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
