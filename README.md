# SQL-Buns 🥯

SQL-Buns is a lightweight tool built for developers who love writing raw SQL but could use a few helpers to simplify their workflow.

It's not an ORM and won't get in your way. Instead of abstracting SQL, it gives you clean, reliable utilities that act as a bridge between your code and the database.

It currently supports **PostgreSQL**, **MySQL**, and **SQLite**.

<br/>

### ✨ Why SQL-Buns?

- **Direct SQL First:** You're in charge of your queries.
- **Two Sharp Tools (for now):**
  - `getSingleRow` → A function that fetches exactly one row (and throws an error if it finds zero or more than one).
  - `createRowAndReturn` → A quick way to insert a row and get the result back right away.
- It provides clear errors like `RecordDoesNotExist` and `NonUniqueRecordError`.
- **Simple Setup:** No hidden configs. Just respects your `.env` file setup.
- **Lean and Mean:** This isn't a bloated ORM; it’s just the SQL help you need.

SQL-Buns is for developers who want to keep their queries clean and avoid writing the same boilerplate code over and over.

---

### 🚀 Installation

```bash
npm install @anclatechs/sql-buns
```

### ⚙️ Setup

SQL-Buns connects to your database using environment variables.

You'll need to define the following variables in your `.env` file:

```bash
DATABASE_ENGINE=postgres  # or mysql | sqlite
DATABASE_HOST=localhost
DATABASE_USER=myuser
DATABASE_PASSWORD=secret
DATABASE_NAME=mydb
```

For SQLite, you only need to set these two variables:

```bash
DATABASE_ENGINE=sqlite
DATABASE_NAME=./database.sqlite
```

---

### 🔨 Usage

**N.B.:** Before using the library, ensure your `.env` file is initialized. This guarantees that `DATABASE_ENGINE` and your other database variables are available to SQL-Buns.

##### How to Import:

```javascript
const {
  pool,
  getSingleRow,
  createRowAndReturn,
  RecordDoesNotExist,
  NonUniqueRecordError,
} = require("@anclatechs/sql-buns");
```

Or if you like the modular path:

```javascript
const { getSingleRow } = require("@anclatechs/sql-buns/functions");
const { RecordDoesNotExist } = require("@anclatechs/sql-buns/errors");
```

---

### Simple Pool

If you want to work directly with the underlying driver, SQL-Buns also exposes a `pool` object.

- **Postgres** → uses [`pg.Pool`](https://node-postgres.com/apis/pool)
- **MySQL** → uses [`mysql2/promise` pool](https://github.com/sidorares/node-mysql2#using-promise-wrapper)
- **SQLite** → supports common methods:
  `get`, `all`, `run`, `exec`, `each`, `close`

You don’t lose any power — all native pool methods are available.

<br/>

#### PostgreSQL Example

```js
const { pool } = require("@anclatechs/sql-buns");

async function yourFunction() {
  const result = await pool.query("SELECT NOW()");
  console.log(result.rows);
}

async function yourFunctionII() {
  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");

    await connection.query("...");
    await connection.query("...");
    await connection.query("COMMIT");
  } catch (err) {
    await connection.query("ROLLBACK");
    throw err;
  } finally {
    connection.release();
  }
}
```

---

#### MySQL Example

```js
const { pool } = require("@anclatechs/sql-buns");

async function yourFunction() {
  const [rows] = await pool.query("SELECT NOW()");
  console.log(rows);
}

async function yourFunctionII() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query("...");
    await connection.query("...");
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
```

#### SQLite Example

```js
const { pool } = require("@anclatechs/sql-buns");

async function yourFunction() {
  const row = await pool.get("SELECT 1 as value");
  console.log(row.value);
}
```

<br/>

---

### Utility Functions

⚡ **Tip:** This means you can use SQL-Buns helpers (`getSingleRow`, `createRowAndReturn`) when you want safety, and you can always drop down to the raw driver when you need full flexibility.

```javascript
// Load environment variables first
require("dotenv").config();

const {
  pool,
  getSingleRow,
  createRowAndReturn,
  RecordDoesNotExist,
} = require("@anclatechs/sql-buns");
```

```javascript
...
try {
    // Insert and return row
    const user = await createRowAndReturn(
      "users",
      "INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3)",
      ["Olaronke", "Alice", "olaronke.alice@example.com"]
    );

    console.log("Inserted user:", user);

    // Fetch a single row
    const fetched = await getSingleRow(
      "SELECT * FROM users WHERE email = $1",
      ["olaronke.alice@example.com"]
    );

    console.log("Fetched user:", fetched);

  } catch (err) {
    if (err instanceof RecordDoesNotExist) {
      console.error("User not found");
    } else {
      console.error("Unexpected error:", err);
    }
  }

```

### MySQL or Sqlite

```javascript
const user = await createRowAndReturn(
  "users",
  "INSERT INTO users (first_name, last_name, email) VALUES (?, ?)",
  ["Olaronke", "Alice", "olaronke.alice@example.com"]
);
console.log("Inserted user:", user);

// Fetch a single row
const fetched = await getSingleRow("SELECT * FROM users WHERE email = ?", [
  "olaronke.alice@example.com",
]);
```

## 🛣️ Roadmap

SQL-Buns is intentionally **not an ORM** — it’s about giving you direct access with an extra-light utility belt. But we know some teams want more structure.

- **Group transaction helper** → wrap multiple SQL operations together as one atomic operation. They either all succeed or all fail. If one query breaks, nothing is saved.
  ![Planned](https://img.shields.io/badge/status-planned-blue)

- **Bulk insert with return** → inserting one row and returning it is straightforward; this will let you insert many rows at once and get them all back in a single call.
  ![Planned](https://img.shields.io/badge/status-planned-blue)

- **Optional database modeling** → Defining lightweight models on top of your queries, without locking you in.
  ![Future Consideration](https://img.shields.io/badge/status-future%20consideration-yellow)

- **Migrations management** → simple and native, so you can version and evolve your schema alongside your codebase.
  ![Future Consideration](https://img.shields.io/badge/status-future%20consideration-yellow)

We’ll keep things **lean, transparent, and optional**. Nothing heavy, nothing you can’t see through.

<br/>

---

<br/>

📜 License

[MIT](./LICENSE) — use it, hack it, ship it.

🔥 SQL-Buns keeps you close to the metal, gives you sharp tools, and stays out of your way.
