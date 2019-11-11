import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';
import { red, orange, yellow, blue } from '@material-ui/core/colors';

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
      <TinyAvatar component="span" className={classes[bodyDetails.bodyType]}>{bodyDetails.bodyType == 'Sun' ? <StarIcon className={classes.icon} /> : bodyDetails.bodyType.charAt(0)}</TinyAvatar>
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
