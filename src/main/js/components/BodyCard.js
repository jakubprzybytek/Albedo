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
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
	avatar: {
		backgroundColor: red[500],
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

export default function BodyCard(props) {

  const { bodyInfo } = props;
  
	const [expanded, setExpanded] = React.useState(false);

	const classes = useStyles();
	
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar className={classes.avatar}>{bodyInfo.bodyDetails.bodyType.charAt(0)}</Avatar>}
        title={bodyInfo.bodyDetails.name}
        subheader={bodyInfo.bodyDetails.bodyType} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Lorem ipsum.
        </Typography>
      </CardContent>
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
            <Typography>Orbit elements:</Typography>
            <List dense={true}>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Epoch: </Typography>
                    {bodyInfo.orbitElements.epoch}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Eccentricity (e): </Typography>
                    {bodyInfo.orbitElements.eccentricity}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Semimajor axis (a): </Typography>
                    {bodyInfo.orbitElements.semiMajorAxis + " AU"}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean motion (n): </Typography>
                    {bodyInfo.orbitElements.meanMotion + '°/day'}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Argument of perihelion (ω): </Typography>
                    {bodyInfo.orbitElements.argumentOfPerihelion + '°'}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Longitude of ascending node (Ω): </Typography>
                    {bodyInfo.orbitElements.longitudeOfAscendingNode + "°"}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Inclination (i): </Typography>
                    {bodyInfo.orbitElements.inclination + '°'}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean anomaly epoch (T): </Typography>
                    {bodyInfo.orbitElements.meanAnomalyEpoch + ' JDE'}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean anomaly at epoch (M): </Typography>
                    {bodyInfo.orbitElements.meanAnomalyAtEpoch + '°'}
                  </React.Fragment>} />
              </ListItem>
            </List>
            <Typography>Magnitude System:</Typography>
            <List dense={true}>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Absolute Magnitude (H): </Typography>
                    {bodyInfo.magnitudeParameters.H}
                  </React.Fragment>} />
              </ListItem>
              <ListItem>
                <ListItemText className={classes.listItem} secondary={<React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Slope parameter (G): </Typography>
                    {bodyInfo.magnitudeParameters.G}
                  </React.Fragment>} />
              </ListItem>
            </List>
            <Link href='https://minorplanetcenter.net/data' className={classes.link}>Source</Link>
          </CardContent>
        </Collapse>
      </React.Fragment>}
    </Card>
  );
}
