import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { red, orange, yellow, blue } from '@material-ui/core/colors';
import { SunIcon, MoonIcon, PlanetIcon } from './AstronomicalIcons';

const useStyles = makeStyles(theme => ({
  chip: {
    display: 'flex',
    paddingLeft: 4,
    paddingRight: 4,
  },
	label: {
		paddingLeft: 4,
	},
	icon: {
	  width: 14,
	},
	Sun: {
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
