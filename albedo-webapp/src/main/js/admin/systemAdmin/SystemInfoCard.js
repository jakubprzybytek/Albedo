import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { formatMemorySize } from '../../utils/Numbers';

const useStyles = makeStyles(theme => ({
  paper: {
    //    width: '800px',
  },
  table: {
    width: '100%',
  },
}));

export default function SystemInfoCard(props) {

  const { systemInfo } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <List dense={true}>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Available processors: </Typography>
            {systemInfo.availableProcessors}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Maximum available memory: </Typography>
            {formatMemorySize(systemInfo.maxMemory)}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Allocated memory: </Typography>
            {formatMemorySize(systemInfo.allocatedMemory)}
          </React.Fragment>} />
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listItem} secondary={<React.Fragment>
            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">Free memory: </Typography>
            {formatMemorySize(systemInfo.freeMemory)}
          </React.Fragment>} />
        </ListItem>
      </List>
    </Paper>
  );
}
