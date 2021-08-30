import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { red, orange, yellow, grey, purple } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { SlimCardHeader, SlimCardContent } from '../common/SlimCard';
import { SunIcon, MoonIcon, PlanetIcon, CometIcon } from './AstronomicalIcons';
import { formatHourAngle, formatDegrees, formatArcSeconds } from './../utils/Angles';
import { ElongationChip } from '../components/Chips';

const useStyles = makeStyles(theme => ({
  card: {
    //maxWidth: 345,
  },
  alwaysVisible: {
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  sectionTitle: {
    textAlign: 'center',
  },
  avatarRed: {
    backgroundColor: red[500],
  },
  avatarOrange: {
    backgroundColor: orange[500],
  },
  avatarYellow: {
    backgroundColor: yellow[500],
  },
  avatarGrey: {
    backgroundColor: grey[400],
  },
  avatarPurple: {
    backgroundColor: purple[400],
  },
  listItem: {
    marginTop: '0px',
    marginBottom: '0px'
  },
  smallFont: {
    fontSize: '0.8rem',
  },
}));

function Ephemeris(props) {

  const { ephemeris } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Ephemeris</Typography>
      <Typography variant="body2" className={classes.smallFont}>
        <span>RA (α): </span>
        <Typography component="span" variant="body2" color="textSecondary">
          <Tooltip title={ephemeris.coordinates.rightAscension.toFixed(6) + "° (J2000)"}>
            <React.Fragment>{formatHourAngle(ephemeris.coordinates.rightAscension)}</React.Fragment>
          </Tooltip>
        </Typography>
      </Typography>
      <Typography variant="body2" className={classes.smallFont}>
        <span>Dec (δ): </span>
        <Typography component="span" variant="body2" color="textSecondary">
          <Tooltip title={ephemeris.coordinates.declination.toFixed(6) + "° (J2000)"}>
            <span>{formatDegrees(ephemeris.coordinates.declination)}</span>
          </Tooltip>
        </Typography>
      </Typography>
      <Typography variant="body2" className={classes.smallFont}>
        <span>Distance from Sun (d<sub>☉</sub>): </span>
        <Typography component="span" variant="body2" color="textSecondary">
          {ephemeris.distanceFromSun} AU
        </Typography>
      </Typography>
      <Typography variant="body2" className={classes.smallFont}>
        <span>Distance from Earth (d<sub>♁</sub>): </span>
        <Typography component="span" variant="body2" color="textSecondary">
          {ephemeris.distanceFromEarth} AU
        </Typography>
      </Typography>
      <Typography variant="body2" className={classes.smallFont}>
        <span>Elongation: </span>
        <Typography component="span" variant="body2" color="textSecondary">
          <ElongationChip elongation={ephemeris.elongation} />
        </Typography>
      </Typography>
      <Typography variant="body2" className={classes.smallFont}>
        <span>Magnitude: </span>
        <Typography component="span" variant="body2" color="textSecondary">
          {ephemeris.apparentMagnitude} mag
        </Typography>
      </Typography>
      {ephemeris.angularSize && <Typography variant="body2" className={classes.smallFont}>
        <span>Angular size (θ): </span>
        <Typography component="span" variant="body2" color="textSecondary">
          {formatArcSeconds(ephemeris.angularSize)}
        </Typography>
      </Typography>}
    </React.Fragment>
  );
}

function OrbitElements(props) {

  const { orbitElements, magnitudeParameters } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography>Orbit elements:</Typography>
      <List dense={true}>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Epoch: </Typography>
            {orbitElements.epoch}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Eccentricity (e): </Typography>
            {orbitElements.eccentricity}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Semimajor axis (a): </Typography>
            {orbitElements.semiMajorAxis + " AU"}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Periapsis (r<sub>pr</sub>): </Typography>
            {orbitElements.periapsis + " AU"}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Apoapsis (r<sub>ap</sub>): </Typography>
            {orbitElements.apoapsis + " AU"}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean motion (n): </Typography>
            {orbitElements.meanMotion + '°/day'}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Argument of perihelion (ω): </Typography>
            {orbitElements.argumentOfPerihelion + '°'}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Longitude of ascending node (Ω): </Typography>
            {orbitElements.longitudeOfAscendingNode + "°"}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Inclination (i): </Typography>
            {orbitElements.inclination + '°'}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean anomaly epoch (T): </Typography>
            {orbitElements.meanAnomalyEpoch + ' JDE'}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean anomaly at epoch (M): </Typography>
            {orbitElements.meanAnomalyAtEpoch + '°'}
          </React.Fragment>} />
        </ListItem>
      </List>
      <Typography>Magnitude System:</Typography>
      <List dense={true}>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Absolute Magnitude (H): </Typography>
            {magnitudeParameters.H}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Slope parameter (G): </Typography>
            {magnitudeParameters.G}
          </React.Fragment>} />
        </ListItem>
      </List>
      <Link href='https://minorplanetcenter.net/data' className={classes.smallFont}>Source</Link>
    </React.Fragment>
  );
}

const defaultBodyInfo = {
  bodyDetails: {
    name: "n/a",
    bodyType: "?"
  },
  orbitElements: {
    epoch: 'n/a',
    eccentricity: 'n/a',
    semiMajorAxis: 'n/a',
    meanMotion: 'n/a',
    argumentOfPerihelion: 'n/a',
    longitudeOfAscendingNode: 'n/a',
    inclination: 'n/a',
    meanAnomalyEpoch: 'n/a',
    meanAnomalyAtEpoch: 'n/a'
  },
  magnitudeParameters: {
    H: 'n/a',
    G: 'n/a'
  }
};

export default function BodyCard(props) {

  var { bodyInfo } = props;
  bodyInfo = {...defaultBodyInfo, ...bodyInfo};

  const [expanded, setExpanded] = React.useState(false);

  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.card}>
      <div className={classes.alwaysVisible}>
        {bodyInfo.bodyDetails.name === 'Sun' && <SlimCardHeader avatar={<Avatar className={classes.avatarYellow}><SunIcon width={36} height={36} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
        {bodyInfo.bodyDetails.name === 'Moon' && <SlimCardHeader avatar={<Avatar className={classes.avatarGrey}><MoonIcon width={32} height={32} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
        {bodyInfo.bodyDetails.bodyType === 'Planet' && <SlimCardHeader avatar={<Avatar className={classes.avatarRed}><PlanetIcon planetName={bodyInfo.bodyDetails.name} width={36} height={36} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
        {bodyInfo.bodyDetails.bodyType === 'Comet' && <SlimCardHeader avatar={<Avatar className={classes.avatarPurple}><CometIcon width={28} height={28} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
        {bodyInfo.bodyDetails.bodyType === 'Asteroid' && <SlimCardHeader avatar={<Avatar className={classes.avatarOrange}>A</Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
        {bodyInfo.ephemeris && <SlimCardContent>
          <Ephemeris ephemeris={bodyInfo.ephemeris} />
        </SlimCardContent>}
        {(bodyInfo.orbitElements || bodyInfo.magnitudeParameters) && <React.Fragment>
          <CardActions className={classes.actions} disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more">
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
        </React.Fragment>}
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <OrbitElements orbitElements={bodyInfo.orbitElements} magnitudeParameters={bodyInfo.magnitudeParameters} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
