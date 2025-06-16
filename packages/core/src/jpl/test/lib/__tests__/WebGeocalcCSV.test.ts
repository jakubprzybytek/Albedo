import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { readRectangularCoordsFromWebGeocalcCSVFile } from "../WebGeocalcCSV";


describe("WebGeocalcCSV", () => {

  it("should parse scv file", async () => {
    const testFileName = path.join(__dirname, 'WGC_StateVector_20250612141620.csv');
    const testFileContent = readFileSync(testFileName).toString();

    const { targetBodyName, observerBodyName, kernels, data } = await readRectangularCoordsFromWebGeocalcCSVFile(testFileContent);

    expect(targetBodyName).toBe("Moon");
    expect(observerBodyName).toBe("Earth Moon Barycenter");
    expect(kernels).toStrictEqual(['pds/wgc/mk/latest_lsk_v0004.tm', 'generic_kernels/spk/planets/de440.bsp']);

    expect(data.length).toBe(97);
  });

});
