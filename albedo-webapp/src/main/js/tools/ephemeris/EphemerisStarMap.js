import React from 'react';
import Paper from '@material-ui/core/Paper';
import { D3Celestial, D3CelestialFeaturesCollections, D3CelestialPoint } from '../../utils/D3CelestialWrapper';

export default function EphemerisStarMap(props) {

  const { ephemerisList } = props;

  const config = {
    projection: "airy",
    center: [150, 0],
    background: { fill: "#fff", stroke: "#000", opacity: 1, width: 1 },
    datapath: "/d3-celestial/data/",
    form: true,
    stars: {
      colors: false,
      names: false,
      style: { fill: "#000", opacity:1 },
      limit: 6,
      size: 5
    },
    dsos: { show: false },
    mw: {
      style: { fill:"#996", opacity: 0.1 }
    },
    lines: {
      graticule: { show: true, stroke: "#cccccc", width: 0.6, opacity: 0.8,      // Show graticule lines
        // grid values: "outline", "center", or [lat,...] specific position
        lon: {pos: ["center"], fill: "#555", font: "10px Helvetica, Arial, sans-serif"},
        // grid values: "outline", "center", or [lon,...] specific position
        lat: {pos: ["center"], fill: "#555", font: "10px Helvetica, Arial, sans-serif"}},
      equatorial: { show: true, stroke: "#aaaaaa", width: 1.3, opacity: 0.7 },    // Show equatorial plane
      ecliptic: { show: true, stroke: "#66cc66", width: 1.3, opacity: 0.7 },      // Show ecliptic plane
      galactic: { show: false, stroke: "#cc6666", width: 1.3, opacity: 0.7 },     // Show galactic plane
      supergalactic: { show: false, stroke: "#cc66cc", width: 1.3, opacity: 0.7 } // Show supergalactic plane
    },
  };

  return (
    <Paper>
      <D3Celestial config={config}>
        <D3CelestialFeaturesCollections>
          {ephemerisList.map(ephemeris =>
            (<D3CelestialPoint key={ephemeris.localTime}
              ra={ephemeris.coordinates.rightAscension}
              dec={ephemeris.coordinates.declination}
              time={ephemeris.localTime.substring(0, 10)} />)
          )}
        </D3CelestialFeaturesCollections>
      </D3Celestial>
    </Paper>
  );
}
