import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

// Execute production SQL against SQLite, not an in-memory object mock.
export class LocalD1 {
  constructor(path = ':memory:') {
    this.sqlite = new DatabaseSync(path);
    this.sqlite.exec(readFileSync(new URL('../migrations/0001_content.sql', import.meta.url), 'utf8'));
    this.sqlite.exec(readFileSync(new URL('../migrations/0002_content_order.sql', import.meta.url), 'utf8'));
    this.failNextBatch = false;
  }
  prepare(sql) {
    const db = this.sqlite;
    const make = args => ({
      bind: (...values) => make(values),
      first: async () => db.prepare(sql).get(...args) ?? null,
      all: async () => ({results: db.prepare(sql).all(...args)}),
      execute: () => ({meta: {changes: Number(db.prepare(sql).run(...args).changes)}}),
    });
    return make([]);
  }
  async batch(statements) {
    this.sqlite.exec('BEGIN');
    try {
      const results = statements.map((statement, index) => {
        const result = statement.execute();
        if (this.failNextBatch && index === 0) {this.failNextBatch = false; throw new Error('Storage failure after content write');}
        return result;
      });
      this.sqlite.exec('COMMIT');
      return results;
    } catch (error) {this.sqlite.exec('ROLLBACK'); throw error;}
  }
  close() {this.sqlite.close();}
}
