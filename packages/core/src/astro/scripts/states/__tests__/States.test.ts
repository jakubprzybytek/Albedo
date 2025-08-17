import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { CorrectionType } from "@jpl/state";
import { kernels } from "@jpl/data/kernels.testData";
import { States } from "../States";

describe("States", () => {
  const states = new States(kernels.stateSolver());

  it("should compute position for Moon w.r.t. Earth", () => {
    const position = states.position(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0), CorrectionType.NONE);

    expect(position.x).approximately(319443.56365777, 1e-5);
    expect(position.y).approximately(-217760.06303164, 1e-5);
    expect(position.z).approximately(-118976.64927161, 4e-6);
  });

  it("should compute positions for Moon w.r.t. Earth", () => {
    const fromEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);
    const toEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);

    const [position] = states.positions(JplBodyId.Moon, JplBodyId.Earth, fromEs, toEs, 1, CorrectionType.NONE);

    expect(position.es).equals(fromEs);
    expect(position.coords.x).approximately(319443.56365777, 1e-5);
    expect(position.coords.y).approximately(-217760.06303164, 1e-5);
    expect(position.coords.z).approximately(-118976.64927161, 4e-6);
  });

  it("should compute state for Moon w.r.t. Earth", () => {
    const fromEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);
    const toEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);

    const [state] = states.states(JplBodyId.Moon, JplBodyId.Earth, fromEs, toEs, 1, CorrectionType.NONE);

    expect(state.es).equals(fromEs);
    expect(state.position.x).approximately(319443.56365777, 1e-5);
    expect(state.position.y).approximately(-217760.06303164, 1e-5);
    expect(state.position.z).approximately(-118976.64927161, 4e-6);
  });
});
