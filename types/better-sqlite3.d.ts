declare module "better-sqlite3" {
  namespace Database {
    interface Statement {
      all(...parameters: unknown[]): unknown[];
      get(...parameters: unknown[]): unknown;
      run(...parameters: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    }

    interface Database {
      pragma(source: string): unknown;
      exec(source: string): void;
      prepare(source: string): Statement;
      transaction<T extends (...args: never[]) => unknown>(fn: T): T;
    }
  }

  const Database: {
    new (filename: string): Database.Database;
  };

  export = Database;
}
