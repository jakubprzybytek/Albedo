import { JplBodyId } from "..";
import { readMultipleSpkCollections, printSpkCollections } from "./testDataGenerator";

const from = new Date('2022-01-01');
const to = new Date('2026-12-31');
//const to = new Date('2022-01-02');

const de440spk = readMultipleSpkCollections('/home/ec2-user/jpl/de440.bsp', from, to, [
    { body: JplBodyId.Sun, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.MercuryBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Mercury, centerBody: JplBodyId.MercuryBarycenter },
    { body: JplBodyId.EarthMoonBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Earth, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.Moon, centerBody: JplBodyId.EarthMoonBarycenter },
    { body: JplBodyId.VenusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Venus, centerBody: JplBodyId.VenusBarycenter },
]);

const mar097spk = readMultipleSpkCollections('/home/ec2-user/jpl/mar097.bsp', from, to, [
    { body: JplBodyId.MarsBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Mars, centerBody: JplBodyId.MarsBarycenter },
]);

const jup365spk = readMultipleSpkCollections('/home/ec2-user/jpl/jup365.bsp', from, to, [
    { body: JplBodyId.JupiterBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Jupiter, centerBody: JplBodyId.JupiterBarycenter },
]);

const sat450spk = readMultipleSpkCollections('/home/ec2-user/jpl/sat454.bsp', from, to, [
    { body: JplBodyId.SaturnBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Saturn, centerBody: JplBodyId.SaturnBarycenter },
]);

const ura116spk = readMultipleSpkCollections('/home/ec2-user/jpl/ura116.bsp', from, to, [
    { body: JplBodyId.UranusBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Uranus, centerBody: JplBodyId.UranusBarycenter },
]);

const nep101spk = readMultipleSpkCollections('/home/ec2-user/jpl/nep105.bsp', from, to, [
    { body: JplBodyId.NeptuneBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Neptune, centerBody: JplBodyId.NeptuneBarycenter },
]);

const plu058spk = readMultipleSpkCollections('/home/ec2-user/jpl/plu060.bsp', from, to, [
    { body: JplBodyId.PlutoBarycenter, centerBody: JplBodyId.SolarSystemBarycenter },
    { body: JplBodyId.Pluto, centerBody: JplBodyId.PlutoBarycenter },
]);
printSpkCollections('de440.full.ts', [...de440spk, ...mar097spk, ...jup365spk, ...sat450spk, ...ura116spk, ...nep101spk, ...plu058spk], from, to);
