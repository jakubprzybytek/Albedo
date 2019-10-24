import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { yellow } from '@material-ui/core/colors';
import { formatHourAngle, formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
	card: {
		maxWidth: 345,
	},
	avatar: {
		backgroundColor: yellow[500],
	},
  listItem: {
    marginTop: '0px',
    marginBottom: '0px'
  },
  inline: {
    display: 'inline',
    fontSize: '0.8rem',
  },
}));

export default function CatalogueEntryCard(props) {

  const { catalogueEntry } = props;

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader avatar={<Avatar className={classes.avatar}>CE</Avatar>}
        title={catalogueEntry.name}
        subheader="Catalogue Entry" />
      <CardContent>
        <Typography>{catalogueEntry.type}</Typography>
        <List dense={true}>
          <ListItem>
            <ListItemText className={classes.listItem} secondary={<React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">RA: </Typography>
              {formatHourAngle(catalogueEntry.coordinates.rightAscension)}
            </React.Fragment>} />
            </ListItem>
          <ListItem>
            <ListItemText className={classes.listItem} secondary={<React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Dec: </Typography>
              {formatDegrees(catalogueEntry.coordinates.declination)}
              </React.Fragment>} />
            </ListItem>
        </List>
        <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Coordinates for mean equatorial and equinox of J2000</Typography>
      </CardContent>
    </Card>
  );
}
