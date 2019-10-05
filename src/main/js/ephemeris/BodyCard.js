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

	const classes = useStyles();
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	return (
	<Card className={classes.card}>
		<CardHeader
			avatar={<Avatar aria-label="recipe" className={classes.avatar}>A</Avatar>}
			title={props.bodyRecord.bodyDetails.name}
			subheader="Asteroid"/>
		<CardContent>
			<Typography variant="body2" color="textSecondary" component="p">
				Lorem ipsum.
			</Typography>
		</CardContent>
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
								{props.bodyRecord.orbitElements.epoch}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Eccentricity (e): </Typography>
								{props.bodyRecord.orbitElements.eccentricity}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Semimajor axis (a): </Typography>
								{props.bodyRecord.orbitElements.semiMajorAxis + " AU"}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean motion (n): </Typography>
								{props.bodyRecord.orbitElements.meanMotion + '°/day'}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Argument of perihelion (ω): </Typography>
								{props.bodyRecord.orbitElements.argumentOfPerihelion + '°'}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Longitude of ascending node (Ω): </Typography>
								{props.bodyRecord.orbitElements.longitudeOfAscendingNode + "°"}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Inclination (i): </Typography>
								{props.bodyRecord.orbitElements.inclination + '°'}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean anomaly epoch (T): </Typography>
								{props.bodyRecord.orbitElements.meanAnomalyEpoch + ' JDE'}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Mean anomaly at epoch (M): </Typography>
								{props.bodyRecord.orbitElements.meanAnomalyAtEpoch + '°'}
							</React.Fragment>} />
					</ListItem>
				</List>
				<Typography>Magnitude System:</Typography>
				<List dense={true}>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Absolute Magnitude (H): </Typography>
								{props.bodyRecord.magnitudeParameters.H}
							</React.Fragment>} />
					</ListItem>
					<ListItem>
						<ListItemText className={classes.listItem} secondary={<React.Fragment>
								<Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Slope parameter (G): </Typography>
								{props.bodyRecord.magnitudeParameters.G}
							</React.Fragment>} />
					</ListItem>
				</List>
				<Link href='https://minorplanetcenter.net/data' className={classes.link}>Source</Link>
			</CardContent>
		</Collapse>
	</Card>
	);
}
