import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    minHeight: 48,
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end',
  },
}));

export default function SettingsDrawer(props) {

  const { opened, setOpened } = props;

  const classes = useStyles();

  return (
    <Drawer className={classes.drawer} variant="persistent" anchor="left" open={opened} classes={{ paper: classes.drawerPaper, }} >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => setOpened(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      Hello world
      </Drawer>
  );
}