import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { SlimCardHeader, SlimCardContent } from '../../common/SlimCard';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2)
  },
  sectionTitle: {
    textAlign: 'center',
  },
  smallFont: {
    fontSize: '0.8rem',
  },
}));

export function JplRepositoriesKernelInfo(props) {

  const { kernelInfo } = props;

  const classes = useStyles();

  return (
    <Card>
      <SlimCardHeader title={'Kernel'} subheader='SPK' />
      <SlimCardContent>
        <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Details</Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Observer: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {kernelInfo.observerBody}
          </Typography>
        </Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Target: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {kernelInfo.targetBody}
          </Typography>
        </Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Reference Frame: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {kernelInfo.referenceFrame}
          </Typography>
        </Typography>
      </SlimCardContent>
      <SlimCardContent>
        <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Kernel File</Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Kernel File Name: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {kernelInfo.kernelFileName}
          </Typography>
        </Typography>
      </SlimCardContent>
      <SlimCardContent>
        <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Data</Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Position Chebyshev Records: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {kernelInfo.positionChebyshevRecords}
          </Typography>
        </Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Position and Velocity Chebyshev Records: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {kernelInfo.positionAndVelocityChebyshevRecords}
          </Typography>
        </Typography>
      </SlimCardContent>
    </Card>
  );
}
