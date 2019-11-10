import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';
import { red, orange, yellow, teal } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  chip: {
    display: 'flex',
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
    backgroundColor: teal[500],
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
    <div className={classes.chip}>
      <TinyAvatar className={classes[bodyDetails.bodyType]}>{bodyDetails.bodyType == 'Sun' ? <StarIcon className={classes.icon} /> : bodyDetails.bodyType.charAt(0)}</TinyAvatar>
      <span className={classes.label}>{bodyDetails.name}</span>
    </div>
  );
}

export function CatalogueEntryChip(props) {

  const { catalogueEntry } = props;

  const classes = useStyles();

  return (
    <div className={classes.chip}>
      <TinyAvatar className={classes.CatalogueEntry}>C</TinyAvatar>
      <span className={classes.label}>{catalogueEntry.name}</span>
    </div>
  );
}
