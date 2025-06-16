import path from "node:path";
import { describe, it } from "vitest";
import { JplBodyId } from "@jpl";
import { States } from "../States";
import { kernelRepository } from "@jpl/data/de440.testData";
import { loadWcgSTateVectorCsv } from "@astro/utils/WcgStateVectorCsvReader";
import { RectangularCoordinates } from "@math";

describe("States", () => {
  const states = new States(kernelRepository.stateSolver2());

  it("should compare results with csv file", () => {
    const wgcStateVectorFile = loadWcgSTateVectorCsv(path.join(__dirname, 'WGC_StateVector_20250612141620.csv'));

    for (const stateRow of wgcStateVectorFile) {
      const position = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, stateRow.es);
      const diff = position.subtract(new RectangularCoordinates(stateRow.x, stateRow.y, stateRow.z));
      // console.log(`csv: ${JSON.stringify(stateRow)}, state: ${JSON.stringify(position)}, diff: ${diff.length()}`); 
      console.log(`ES: ${stateRow.es}, diff: ${diff.length()}`); 
    }
  });
});
