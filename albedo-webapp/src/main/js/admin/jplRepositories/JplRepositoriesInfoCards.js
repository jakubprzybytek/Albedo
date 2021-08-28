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
          <span>Kernel File Name: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {kernelInfo.kernelFileName}
          </Typography>
        </Typography>
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

export function JplRepositoriesBodyInfo(props) {

  const { bodyName, parentBodyName, childBodyNames } = props;

  const classes = useStyles();

  return (
    <Card>
      <SlimCardHeader title={'Body Info'} />
      <SlimCardContent>
        <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Selected</Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Selected: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {bodyName}
          </Typography>
        </Typography>
        <Typography variant="body2" className={classes.smallFont}>
          <span>Parent: </span>
          <Typography component="span" variant="body2" color="textSecondary">
            {parentBodyName ? parentBodyName : 'n/a'}
          </Typography>
        </Typography>
        <Typography className={classes.sectionTitle} variant="subtitle2" gutterBottom>Children</Typography>
        {childBodyNames.map(childNodyName => (
          <Typography key={childNodyName} variant="body2" className={classes.smallFont}>
            <Typography component="span" variant="body2" color="textSecondary">
              {childNodyName}
            </Typography>
          </Typography>
        ))}
        {childBodyNames.length == 0 &&
          <Typography variant="body2" className={classes.smallFont}>
            <span>n/a</span>
          </Typography>
        }
      </SlimCardContent>
    </Card>
  );
}