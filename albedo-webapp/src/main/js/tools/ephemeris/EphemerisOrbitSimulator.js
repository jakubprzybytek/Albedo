import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(theme => ({
  simulator: {
    position: 'relative',
    width: '100%',
    height: '1000px',
  },
  jdSlider: {
    marginLeft: '20px',
    paddingRight: '20px',
  }
}));

export default function EphemerisOrbitSimulator(props) {

  const { bodyInfo, ephemerisList } = props;

  const classes = useStyles();

  function handleSubmit() {

    const simulatorContainser = document.getElementById('spacekit-simulator');
    simulatorContainser.textContent = '';

    const viz = new Spacekit.Simulation(simulatorContainser, {
      basePath: '/spacekit',
      startDate: Date.now(),
      startPaused: true,
      debug: {
        showAxes: false,
        showGrid: false,
        showStats: false,
      }
    });
    window.viz = viz;
    // Create a background using Yale Bright Star Catalog data.
    viz.createStars();
    
    // Create our first object - the sun - using a preset space object.
    viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);
    
    // Then add some planets
    viz.createObject('mercury', Spacekit.SpaceObjectPresets.MERCURY);
    viz.createObject('venus', Spacekit.SpaceObjectPresets.VENUS);
    viz.createObject('earth', Spacekit.SpaceObjectPresets.EARTH);
    viz.createObject('mars', Spacekit.SpaceObjectPresets.MARS);
    viz.createObject('jupiter', Spacekit.SpaceObjectPresets.JUPITER);
    viz.createObject('saturn', Spacekit.SpaceObjectPresets.SATURN);
    viz.createObject('uranus', Spacekit.SpaceObjectPresets.URANUS);
    viz.createObject('neptune', Spacekit.SpaceObjectPresets.NEPTUNE);
    
    viz.createObject('comet', {
      labelText: bodyInfo.bodyDetails.name,
      theme: {
        orbitColor: 0xffff33,
        color: 0xff3333,
      },
      ecliptic: {
        displayLines: true,
        lineColor: 0x333333,
      },
      ephem: new Spacekit.Ephem({
        a: bodyInfo.orbitElements.semiMajorAxis,
        e: bodyInfo.orbitElements.eccentricity,
        i: bodyInfo.orbitElements.inclination,
        om: bodyInfo.orbitElements.longitudeOfAscendingNode,
        w: bodyInfo.orbitElements.argumentOfPerihelion,
        ma: bodyInfo.orbitElements.meanAnomalyAtEpoch,
        epoch: bodyInfo.orbitElements.meanAnomalyEpoch,
      }, 'deg'),
    });
  }

  return (
    <Paper>
      <Button onClick={handleSubmit}>
          Click me
      </Button>
      {ephemerisList.length > 0 && <React.Fragment>
        <Typography gutterBottom>
          JDE:
        </Typography>
        <div className={classes.jdSlider}>
          <Slider
            min={ephemerisList[0].jde}
            max={ephemerisList[ephemerisList.length - 1].jde}
            defaultValue={ephemerisList[0].jde}
            step={1}
            valueLabelDisplay="on"
            marks
            onChange={(event, newValue) => viz.setJd(newValue)}
          />
        </div>
      </React.Fragment>
      }
      <div id="spacekit-simulator" className={classes.simulator}></div>
    </Paper>
  );
}
