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
import Tooltip from '@material-ui/core/Tooltip';
import { teal } from '@material-ui/core/colors';
import { formatHourAngle, formatDegrees } from './../utils/Angles';

const useStyles = makeStyles(theme => ({
	card: {
		maxWidth: 345,
	},
	avatar: {
		backgroundColor: teal[500],
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
      <CardHeader avatar={<Avatar className={classes.avatar}>C</Avatar>}
        title={catalogueEntry.name}
        subheader="Catalogue Entry" />
      <CardContent>
        <Typography>{catalogueEntry.type}</Typography>
        <List dense={true}>
          <ListItem>
            <ListItemText className={classes.listItem} secondary={<React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">RA: </Typography>
              <Tooltip title={catalogueEntry.coordinates.rightAscension.toFixed(6) + "° (J2000)"}>
                <span>{formatHourAngle(catalogueEntry.coordinates.rightAscension)}</span>
              </Tooltip>
            </React.Fragment>} />
            </ListItem>
          <ListItem>
            <ListItemText className={classes.listItem} secondary={<React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Dec: </Typography>
              <Tooltip title={catalogueEntry.coordinates.declination.toFixed(6) + "° (J2000)"}>
                <span>{formatDegrees(catalogueEntry.coordinates.declination)}</span>
              </Tooltip>
            </React.Fragment>} />
          </ListItem>
          {(catalogueEntry.bMagnitude || catalogueEntry.vMagnitude) && <ListItem>
            <ListItemText className={classes.listItem} secondary={<React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Magnitude: </Typography>
              {catalogueEntry.bMagnitude && catalogueEntry.bMagnitude + " (B)"} {catalogueEntry.vMagnitude && catalogueEntry.vMagnitude + " (V)"}
            </React.Fragment>} />
          </ListItem>}
          {(catalogueEntry.majorAxisSize || catalogueEntry.minorAxisSize) && <ListItem>
            <ListItemText className={classes.listItem} secondary={<React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Size: </Typography>
              {catalogueEntry.majorAxisSize && catalogueEntry.majorAxisSize + "'"}{catalogueEntry.minorAxisSize && " x " + catalogueEntry.minorAxisSize + "'"}
            </React.Fragment>} />
          </ListItem>}
          {catalogueEntry.morphologicalType && <ListItem>
            <ListItemText className={classes.listItem} secondary={<React.Fragment>
              <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Morphological type: </Typography>
              {catalogueEntry.morphologicalType}
            </React.Fragment>} />
          </ListItem>}
        </List>
      </CardContent>
    </Card>
  );
}
