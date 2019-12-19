import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
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
import { SunIcon, MoonIcon, PlanetIcon, CometIcon } from './AstronomicalIcons';
import { formatHourAngle, formatDegrees, formatArcSeconds } from './../utils/Angles';
import { ElongationChip } from '../components/Chips';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
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
  inline: {
    display: 'inline',
    fontSize: '0.8rem',
  },
  link: {
    fontSize: '0.8rem',
  },
}));

function Ephemeris(props) {

  const { ephemeris } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography>Ephemeris:</Typography>
      <List dense={true}>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">RA: </Typography>
            <Tooltip title={ephemeris.coordinates.rightAscension.toFixed(6) + "° (J2000)"}>
              <span>{formatHourAngle(ephemeris.coordinates.rightAscension)}</span>
            </Tooltip>
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Dec: </Typography>
            <Tooltip title={ephemeris.coordinates.declination.toFixed(6) + "° (J2000)"}>
              <span>{formatDegrees(ephemeris.coordinates.declination)}</span>
            </Tooltip>
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Distance from Sun: </Typography>
            {ephemeris.distanceFromSun} [AU]
            </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Distance from Earth: </Typography>
            {ephemeris.distanceFromEarth} [AU]
            </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Elongation: </Typography>
            <span><ElongationChip elongation={ephemeris.elongation} /></span>
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Magnitude: </Typography>
            {ephemeris.apparentMagnitude} [mag]
            </React.Fragment>} />
        </ListItem>
        {ephemeris.angularSize && <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Angular size: </Typography>
            {formatArcSeconds(ephemeris.angularSize)}
          </React.Fragment>} />
        </ListItem>}
      </List>
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
      <Link href='https://minorplanetcenter.net/data' className={classes.link}>Source</Link>
    </React.Fragment>
  );
}

export default function BodyCard(props) {

  const { bodyInfo } = props;

  const [expanded, setExpanded] = React.useState(false);

  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.card}>
      {bodyInfo.bodyDetails.name === 'Sun' && <CardHeader avatar={<Avatar className={classes.avatarYellow}><SunIcon width={36} height={36} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
      {bodyInfo.bodyDetails.name === 'Moon' && <CardHeader avatar={<Avatar className={classes.avatarGrey}><MoonIcon width={32} height={32} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
      {bodyInfo.bodyDetails.bodyType === 'Planet' && <CardHeader avatar={<Avatar className={classes.avatarRed}><PlanetIcon planetName={bodyInfo.bodyDetails.name} width={36} height={36} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
      {bodyInfo.bodyDetails.bodyType === 'Comet' && <CardHeader avatar={<Avatar className={classes.avatarPurple}><CometIcon width={28} height={28} /></Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
      {bodyInfo.bodyDetails.bodyType === 'Asteroid' && <CardHeader avatar={<Avatar className={classes.avatarOrange}>A</Avatar>} title={bodyInfo.bodyDetails.name} subheader={bodyInfo.bodyDetails.bodyType} />}
      {bodyInfo.ephemeris && <CardContent>
        <Ephemeris ephemeris={bodyInfo.ephemeris} />
      </CardContent>}
      {(bodyInfo.orbitElements || bodyInfo.magnitudeParameters) && <React.Fragment>
        <CardActions disableSpacing>
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <OrbitElements orbitElements={bodyInfo.orbitElements} magnitudeParameters={bodyInfo.magnitudeParameters} />
          </CardContent>
        </Collapse>
      </React.Fragment>}
    </Card>
  );
}
