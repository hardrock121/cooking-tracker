// Type declarations for sql.js
declare module "sql.js" {
  export default class Database {
    exec(sql: string): any[];
    close(): void;
  }
}
