import { describe, it, expect } from "vitest";
import { getBarycenterIdForBodyId, JplBodyId } from '../JplBody';

describe('getBarycenterIdForBodyId', () => {
  describe('barycenter bodies (< Sun)', () => {
    it('should return the same ID for barycenter bodies', () => {
      expect(getBarycenterIdForBodyId(JplBodyId.SolarSystemBarycenter)).toBe(JplBodyId.SolarSystemBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.MercuryBarycenter)).toBe(JplBodyId.MercuryBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.VenusBarycenter)).toBe(JplBodyId.VenusBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.EarthMoonBarycenter)).toBe(JplBodyId.EarthMoonBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.MarsBarycenter)).toBe(JplBodyId.MarsBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.JupiterBarycenter)).toBe(JplBodyId.JupiterBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.SaturnBarycenter)).toBe(JplBodyId.SaturnBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.UranusBarycenter)).toBe(JplBodyId.UranusBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.NeptuneBarycenter)).toBe(JplBodyId.NeptuneBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.PlutoBarycenter)).toBe(JplBodyId.PlutoBarycenter);
    });
  });

  describe('planetary bodies (Sun to < Pluto)', () => {
    it('should return barycenter ID by dividing by 100', () => {
      // Mercury system (199 -> 1 -> MercuryBarycenter)
      expect(getBarycenterIdForBodyId(JplBodyId.Mercury)).toBe(JplBodyId.MercuryBarycenter);
      
      // Venus system (299 -> 2 -> VenusBarycenter)  
      expect(getBarycenterIdForBodyId(JplBodyId.Venus)).toBe(JplBodyId.VenusBarycenter);
      
      // Earth-Moon system (301, 399 -> 3 -> EarthMoonBarycenter)
      expect(getBarycenterIdForBodyId(JplBodyId.Moon)).toBe(JplBodyId.EarthMoonBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Earth)).toBe(JplBodyId.EarthMoonBarycenter);
      
      // Mars system (401, 402, 499 -> 4 -> MarsBarycenter)
      expect(getBarycenterIdForBodyId(JplBodyId.Phobos)).toBe(JplBodyId.MarsBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Deimos)).toBe(JplBodyId.MarsBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Mars)).toBe(JplBodyId.MarsBarycenter);
      
      // Jupiter system (501, 599 -> 5 -> JupiterBarycenter)
      expect(getBarycenterIdForBodyId(JplBodyId.Io)).toBe(JplBodyId.JupiterBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Jupiter)).toBe(JplBodyId.JupiterBarycenter);
      
      // Saturn system (601, 699 -> 6 -> SaturnBarycenter)
      expect(getBarycenterIdForBodyId(JplBodyId.Mimas)).toBe(JplBodyId.SaturnBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Saturn)).toBe(JplBodyId.SaturnBarycenter);
      
      // Uranus system (706, 799 -> 7 -> UranusBarycenter)
      expect(getBarycenterIdForBodyId(JplBodyId.Cordelia)).toBe(JplBodyId.UranusBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Uranus)).toBe(JplBodyId.UranusBarycenter);
      
      // Neptune system (801, 899 -> 8 -> NeptuneBarycenter)
      expect(getBarycenterIdForBodyId(JplBodyId.Triton)).toBe(JplBodyId.NeptuneBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Neptune)).toBe(JplBodyId.NeptuneBarycenter);

      expect(getBarycenterIdForBodyId(JplBodyId.Pluto)).toBe(JplBodyId.PlutoBarycenter);
      expect(getBarycenterIdForBodyId(JplBodyId.Charon)).toBe(JplBodyId.PlutoBarycenter);
    });
  });
});
