declare module "@anclatechs/sql-buns" {
  import type { Pool as MySQLPool } from "mysql2/promise";
  import type { Pool as PgPool } from "pg";
  import type { Database as SQLiteDB } from "sqlite";

  // The sql-buns pool proxy is derived from MySQLPool | PgPool | SQLiteDB:
  export type DatabasePool = MySQLPool | PgPool | SQLiteDB;

  /**
   * Database connection pool proxy.
   * - MySQL: behaves like mysql2.Pool
   * - Postgres: behaves like pg.Pool
   * - SQLite: behaves like sqlite.Database (async methods wrapped in Proxy)
   */
  export const pool: DatabasePool;

  /**
   * Utility Function: Fetch a single row or throw if not found.
   */
  export function getSingleRow<T = any>(
    sql: string,
    params?: any[]
  ): Promise<T>;

  /**
   * Utility Function: Insert a row and return it.
   */
  export function createRowAndReturn<T = any>(
    tableName: string,
    sql: string,
    params: any[],
    existingConnection?: any
  ): Promise<T>;


  /**
 * Executes multiple SQL statements in a single transaction.
 * Works consistently across PostgreSQL, MySQL, and SQLite. 
 *
 * Each command object: { sql: string, params?: array }
 *
 * Returns a unified JSON response:
 * {
 *   success: boolean,
 *   engine: string,
 *   executed: [
 *     { sql, changes, lastInsertId, message }
 *   ],
 *   error?: string
 * }
 * 
 */
export function batchTransaction<T = any>(
  queries: { sql: string; params?: any[] }[],
  existingConnection?: any
): Promise<{
  success: boolean;
  engine: string;
  executed: T[];
  error: any;
}>;

  export class RecordDoesNotExist extends Error {}
  export class NonUniqueRecordError extends Error {}
  export class UnsupportedSQLEngineError extends Error {}

}
