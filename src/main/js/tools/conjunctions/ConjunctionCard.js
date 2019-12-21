import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { yellow } from '@material-ui/core/colors';
import { format } from 'date-fns';
import { formatDegrees } from '../../utils/Angles';
import { BodyChip, CatalogueEntryChip } from '../../components/Chips';

const useStyles = makeStyles(theme => ({
	card: {
		maxWidth: 345,
	},
	cardHeader: {
		paddingBottom: 0,
	},
	avatar: {
		backgroundColor: yellow[500],
	},
  listItem: {
    marginTop: '0px',
    marginBottom: '0px'
  },
  inline: {
    display: 'inline-flex',
    flexWrap: 'wrap',
  },
}));

export default function ConjunctionCard(props) {

  const { conjunction } = props;

  const classes = useStyles();

  function RelativeDistanceInformation() {
    if (conjunction.secondObjectType === 'Body') {
      if (conjunction.first.ephemeris.distanceFromEarth > conjunction.second.ephemeris.distanceFromEarth) {
        return (<Typography className={classes.inline}>
          <BodyChip bodyDetails={conjunction.first.bodyDetails} /><span> is behind </span><BodyChip bodyDetails={conjunction.second.bodyDetails} />
        </Typography>)
      } else {
        return (<Typography className={classes.inline}>
          <BodyChip bodyDetails={conjunction.second.bodyDetails} /><span> is behind </span><BodyChip bodyDetails={conjunction.first.bodyDetails} />
        </Typography>)
      }
    } else {
      return (<Typography className={classes.inline}>
        <CatalogueEntryChip catalogueEntry={conjunction.second} /><span> is behind </span><BodyChip bodyDetails={conjunction.first.bodyDetails} />
      </Typography>)
    }
  }

  return (
    <Card className={classes.card}>
      <CardHeader className={classes.cardHeader} title="Conjunction" subheader={conjunction.time && format(Date.parse(conjunction.time), "yyyy-MM-dd HH:mm:ss") + " (TDE)"} />
      <CardContent>
        <RelativeDistanceInformation />
        <Typography>Separation</Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {conjunction.separation && formatDegrees(conjunction.separation)}
        </Typography>
      </CardContent>
    </Card>
  );
}
