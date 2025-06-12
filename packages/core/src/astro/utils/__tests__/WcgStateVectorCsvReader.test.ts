import { describe, it, expect } from "vitest";
import { parseStateRow, parseTdeAsEs, parseTdeAsJde } from "../WcgStateVectorCsvReader";

describe("WcgStateVectorCsvReader", () => {
  it("should parse TDE as JDE", () => {
    expect(parseTdeAsJde('"2019-10-08 00:00:00.000000 TDB"')).toBe(2458764.5);
    expect(parseTdeAsJde('"2019-10-08 17:00:00.000000 TDB"')).toBe(2458765.2083333335);
  });

  it("should parse TDE as ES", () => {
    expect(parseTdeAsEs('"2019-10-08 00:00:00.000000 TDB"')).toBe(623764800);
    expect(parseTdeAsEs('"2019-10-08 17:00:00.000000 TDB"')).toBe(623826000);
  });

  it("should parse state row", () => {
    const stateRowString = '"2019-10-08 00:00:00.000000 TDB",397285.26142517,0.96187241,254540.96497079,-273181.21487730,-135707.40560327,0.75402996,0.57379654,0.16551402,"2019-10-08 00:00:00.000000 TDB",1.32520099';
    expect(parseStateRow(stateRowString)).toStrictEqual({
      es: 623764800,
      x: 254540.96497079,
      y: -273181.21487730,
      z: -135707.40560327
    });
  });
});
