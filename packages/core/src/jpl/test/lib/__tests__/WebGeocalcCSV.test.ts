import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { readRectangularCoordsFromWebGeocalcCSVFile } from "../WebGeocalcCSV";


describe("WebGeocalcCSV", () => {

  it("should parse csv file with rectangular coords", async () => {
    const testFileName = path.join(__dirname, 'WGC_StateVector_20250612141620.csv');
    const testFileContent = readFileSync(testFileName).toString();

    const { targetBodyName, observerBodyName, kernels, data } = await readRectangularCoordsFromWebGeocalcCSVFile(testFileContent);

    expect(targetBodyName).toBe("Moon");
    expect(observerBodyName).toBe("Earth Moon Barycenter");
    expect(kernels).toStrictEqual(['pds/wgc/mk/latest_lsk_v0004.tm', 'generic_kernels/spk/planets/de440.bsp']);

    expect(data.length).toBe(97);

    expect(data[0].tbd).toEqual(new Date(Date.parse('2019-10-08 00:00:00+00')));
    expect(data[0].distance).toEqual(397285.26142517);
    expect(data[0].speed).toEqual(0.96187241);
    expect(data[0].x).toEqual(254540.96497079);
    expect(data[0].y).toEqual(-273181.21487730);
    expect(data[0].z).toEqual(-135707.40560327);
    expect(data[0].speed_x).toEqual(0.75402996);
    expect(data[0].speed_y).toEqual(0.57379654);
    expect(data[0].speed_z).toEqual(0.16551402);
    expect(data[0].target_tbd).toEqual(new Date(Date.parse('2019-10-08 00:00:00+00')));
    expect(data[0].light_time).toEqual(1.32520099);
  });

});
