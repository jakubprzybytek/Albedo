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
  drawing: {
    marginTop: theme.spacing(1)
  }
}));

function EclipseDrawing({ eclipse }) {
  const eclipsedBodyRadius = eclipse.eclipsed.ephemeris.angularSize / 2.0;
  const eclipsingBodyRadius = eclipse.eclipsing.ephemeris.angularSize / 2.0;

  const { scale, x, y } = calculateScale(eclipsedBodyRadius, eclipsingBodyRadius, eclipse.separation, eclipse.positionAngle);

  const classes = useStyles();

  return (
    <svg viewBox="0 0 500 500" className={classes.drawing} style={{ backgroundColor: 'lightblue' }}>
      <g>
          <circle cx={250 - x} cy={250 - y} r={eclipsedBodyRadius * scale} stroke="orange" strokeWidth="2" fill='yellow'></circle>
          <circle cx={250 + x} cy={250 + y} r={eclipsingBodyRadius * scale} stroke="grey" strokeWidth="2" fill='#585858'></circle>
      </g>
    </svg>
  );
}

function MoonEclipseDrawing({ eclipse }) {
  const eclipsedBodyRadius = eclipse.eclipsed.ephemeris.angularSize / 2.0;
  const earthUmbraRadius = eclipse.eclipsing.earthShadow.umbraAngularSize / 2.0;
  const earthPenumbraRadius = eclipse.eclipsing.earthShadow.penumbraAngularSize / 2.0;

  const { scale, x, y } = calculateScale(eclipsedBodyRadius, earthUmbraRadius, eclipse.separation, eclipse.positionAngle);

  const classes = useStyles();

  return (
    <svg viewBox="0 0 500 500" className={classes.drawing} style={{ backgroundColor: 'darkblue' }}>
      <g>
        <circle cx={250 + x} cy={250 + y} r={earthPenumbraRadius * scale} stroke="grey" strokeWidth="2" fill='#787878'></circle>
        <circle cx={250 + x} cy={250 + y} r={earthUmbraRadius * scale} stroke="grey" strokeWidth="2" fill='#585858'></circle>
        <circle cx={250 - x} cy={250 - y} r={eclipsedBodyRadius * scale} stroke="orange" strokeWidth="2" fill='silver'></circle>
      </g>
    </svg>
  );
}

function calculateScale(firstObjectRadius, secondObjectRadius, separation, positionAngle) {
  const longestDimention = (firstObjectRadius / 2 + separation + secondObjectRadius) * 1.5;
  const scale = 500 / longestDimention;

  const positionAngleRad = positionAngle * Math.PI / 180.0;
  const x = separation * Math.sin(positionAngleRad) / 2 * scale;
  const y = separation * Math.cos(positionAngleRad) / 2 * scale;

  return { scale, x, y }
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
        {eclipse.eclipsed.bodyDetails.name === 'Sun' && <EclipseDrawing eclipse={eclipse} />}
        {eclipse.eclipsed.bodyDetails.name === 'Moon' && <MoonEclipseDrawing eclipse={eclipse} />}
      </CardContent>
    </Card>
  );
}
