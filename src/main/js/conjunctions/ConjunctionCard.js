import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { yellow } from '@material-ui/core/colors';
import { format } from 'date-fns';
import { formatDegrees } from './../utils/Angles';

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

export default function ConjunctionCard(props) {

  const { conjunction } = props;

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title="Conjunction"
        subheader={conjunction.time && format(Date.parse(conjunction.time), "yyyy-MM-dd HH:mm:ss") + " (TDE)"} />
      <CardContent>
        <Typography>Separation</Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {conjunction.separation && formatDegrees(conjunction.separation)}
        </Typography>
      </CardContent>
    </Card>
  );
}
