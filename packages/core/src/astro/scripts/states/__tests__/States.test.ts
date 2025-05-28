import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { States } from "../States";
import { kernelRepository } from "@jpl/data/de440.testData";

describe("States", () => {
  const states = new States(kernelRepository.stateSolver2());

  it("should compute position for Moon w.r.t. Earth Moon Barycenter", () => {
    const position1 = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDateTime(2019, 10, 8, 0, 0, 0));

    expect(position1.x).approximately(254540.96497079, 4e-9);
    expect(position1.y).approximately(-273181.21487730, 4e-9);
    expect(position1.z).approximately(-135707.40560327, 4e-9);

    const position2 = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDateTime(2019, 10, 10, 0, 0, 0));

    expect(position2.x).approximately(358150.55648602, 1e-9);
    expect(position2.y).approximately(-152147.13543233, 3e-9);
    expect(position2.z).approximately(-95616.13176201, 3e-9);

    const position21 = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDateTime(2019, 10, 10, 10, 0, 0));

    expect(position21.x).approximately(372169.30998271, 5e-6);
    expect(position21.y).approximately(-122610.91251927, 2e-5);
    expect(position21.z).approximately(-84778.19391465, 5e-6);

    const position22 = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDateTime(2019, 10, 10, 12, 0, 0));

    expect(position22.x).approximately(374630.13593609, 1e-9);
    expect(position22.y).approximately(-116578.77101318, 3e-9);
    expect(position22.z).approximately(-82527.05033379, 1e-9);

    const position23 = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDateTime(2019, 10, 10, 18, 0, 0));

    expect(position23.x).approximately(381313.29343020, 5e-9);
    expect(position23.y).approximately(-98266.61406715, 5e-9);
    expect(position23.z).approximately(-75619.21736306, 5e-9);

    const position24 = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDateTime(2019, 10, 10, 20, 0, 0));

    expect(position24.x).approximately(383305.66823440, 4e-6);
    expect(position24.y).approximately(-92097.03818536, 2e-5);
    expect(position24.z).approximately(-73267.54997795, 5e-6);

    const position3 = states.position(JplBodyId.Moon, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDateTime(2019, 10, 12, 0, 0, 0));

    expect(position3.x).approximately(398515.19153861, 4e-9);
    expect(position3.y).approximately(-3514.00937347, 1e-9);
    expect(position3.z).approximately(-38243.31581743, 1e-9);
  });

  it("should compute position for Moon w.r.t. Earth", () => {
    const position = states.position(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDateTime(2019, 10, 9, 0, 0, 0));
    expect(position.x).approximately(317255.79483133, 1e-7);
    expect(position.y).approximately(-220341.79779477, 2e-9);
    expect(position.z).approximately(-119833.86746624, 1e-8);

    const position2 = states.position(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0));
    expect(position2.x).approximately(319443.56365777, 1e-5);
    expect(position2.y).approximately(-217760.06303164, 1e-5);
    expect(position2.z).approximately(-118976.64927161, 4e-6);
  });
});
