import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { red, orange, yellow, blue } from '@material-ui/core/colors';
import { SunIcon, MoonIcon, PlanetIcon } from './AstronomicalIcons';
import { format } from 'date-fns';
import { formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
  chip: {
    display: 'flex',
    paddingLeft: 4,
    paddingRight: 4,
  },
	label: {
		paddingLeft: 4,
		fontWeight: 500,
	},
	icon: {
	  width: 14,
	},
	Star: {
		backgroundColor: yellow[500],
	},
	Planet: {
		backgroundColor: red[500],
	},
  Asteroid: {
    backgroundColor: orange[500],
  },
  CatalogueEntry: {
    backgroundColor: blue[300],
  },
}));

const TinyAvatar = withStyles({
  root: {
    fontSize: '0.7rem',
    width: 18,
    height: 18,
    margin: 0,
  },
})(Avatar);

/**
 * Usage: <BodyChip bodyDetails={xxx.bodyDetails} />
**/
export function BodyChip(props) {

  const { bodyDetails } = props;

  const classes = useStyles();

  return (
    <span className={classes.chip}>
      <TinyAvatar component="span" className={classes[bodyDetails.bodyType]}>
        {bodyDetails.name === 'Sun' && <SunIcon width={14} height={14} />}
        {bodyDetails.name === 'Moon' && <MoonIcon width={12} height={12} />}
        {bodyDetails.bodyType === 'Planet' && <PlanetIcon planetName={bodyDetails.name} width={14} height={14} />}
        {bodyDetails.bodyType === 'Asteroid' && 'A'}
      </TinyAvatar>
      <span className={classes.label}>{bodyDetails.name}</span>
    </span>
  );
}

/**
 * Usage: <CatalogueEntryChip catalogueEntry={xxx} />
**/
export function CatalogueEntryChip(props) {

  const { catalogueEntry } = props;

  const classes = useStyles();

  return (
    <span className={classes.chip}>
      <TinyAvatar component="span" className={classes.CatalogueEntry}>C</TinyAvatar>
      <span className={classes.label}>{catalogueEntry.name}</span>
    </span>
  );
}

/**
 * Usage: <LocalTimeChip time={xxx} jd={yyy} />
**/
export function LocalTimeChip(props) {

  const { time, jd } = props;

  const classes = useStyles();

  return (
    <Tooltip title={"JD " + jd} className={classes.chip}>
      <span>{time.substr(time.indexOf('T') + 1, 8)}</span>
    </Tooltip>
  );
}

/**
 * Usage: <LocalDateTimeChip time={xxx} jd={yyy} />
**/
export function LocalDateTimeChip(props) {

  const { time, jd } = props;

  const classes = useStyles();

  function stripZoneInfo(zonedTime) {
    const plusIndex = zonedTime.indexOf('+');
    if (plusIndex > 0) {
      zonedTime = zonedTime.substring(0, plusIndex);
    }
    return zonedTime.replace('T', ' ').replace('Z', ' ');
  }

  return (
    <Tooltip title={"JD " + jd} className={classes.chip}>
      {/* <span className={classes.label}>{format(Date.parse(time), "yyyy-MM-dd HH:mm:ss")}</span> */}
      <span>{stripZoneInfo(time)}</span>
    </Tooltip>
  );
}

/**
 * Usage: <LowResAngleChip angle={xxx} />
**/
export function LowResAngleChip(props) {

  const { angle } = props;

  const classes = useStyles();

  return (
    <Tooltip title={formatDegrees(angle)} className={classes.chip}>
      <span className={classes.label}>{angle.toFixed(1)}°</span>
    </Tooltip>
  );
}
