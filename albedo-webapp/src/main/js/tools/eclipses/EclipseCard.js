import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { yellow } from '@material-ui/core/colors';
import { format } from 'date-fns';
import { formatDegrees } from '../../utils/Angles';

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

function EclipseDrawing(props) {

  const { eclipse } = props;

  const sunRadius = eclipse.sun.ephemeris.angularSize / 2.0;
  const moonRadius = eclipse.moon.ephemeris.angularSize / 2.0;
  const longestDimention = (sunRadius / 2 + eclipse.separation + moonRadius) * 1.5;
  const scale = 500 / longestDimention;

  const positionAngle = eclipse.positionAngle * Math.PI / 180.0;
  const x = eclipse.separation * Math.sin(positionAngle) / 2 * scale;
  const y = eclipse.separation * Math.cos(positionAngle) / 2 * scale;

  const classes = useStyles();

  return (
    <svg viewBox="0 0 500 500" style={{ backgroundColor: 'lightblue' }}>
      <g>
          <circle cx={250 - x} cy={250 - y} r={sunRadius * scale} stroke="orange" strokeWidth="2" fill='yellow'></circle>
          <circle cx={250 + x} cy={250 + y} r={moonRadius * scale} stroke="grey" strokeWidth="2" fill='#585858'></circle>
      </g>
    </svg>
  );
}

export default function EclipseCard(props) {

  const { eclipse } = props;

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader className={classes.cardHeader} title="Sun Eclipse" subheader={eclipse.localTime && format(Date.parse(eclipse.localTime), "yyyy-MM-dd HH:mm:ss") + " (TDE)"} />
      <CardContent>
        <Typography>
          <span>Separation: </span>
          <Typography component="span" color="textSecondary">
            {eclipse.separation && formatDegrees(eclipse.separation)}
          </Typography>
        </Typography>
        <Typography>
          <span>Position Angle: </span>
          <Typography component="span" color="textSecondary">
            {eclipse.positionAngle && eclipse.positionAngle.toFixed(1) + '°'}
          </Typography>
        </Typography>
        <EclipseDrawing eclipse={eclipse} />
      </CardContent>
    </Card>
  );
}
