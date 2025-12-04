export class Table<T> {
  private table: T[][];

  constructor(readonly columns: number, readonly rows: number, init: () => T) {
    this.table = Array.from({ length: columns }, () => Array.from({ length: rows }, () => init()));
  }

  get(column: number, row: number): T {
    if (column >= this.columns || row >= this.rows) {
      throw new Error(`Out of index: (${column}, ${row}) for table (${this.columns}, ${this.rows})`);
    }
    return this.table[column][row];
  }
}
