import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import LocationForm from './observerlocation/LocationForm';
import TimeZoneForm from './timezone/TimeZoneForm';

const useStyles = makeStyles(theme => ({
  drawer: {
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
}));

export default function UserDrawer (props ) {

  const { opened, setOpened } = props;

  const classes = useStyles();

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpened(open);
  };

  return (
    <Drawer className={classes.drawer} anchor="right" variant="persistent" open={opened} onClose={toggleDrawer(false)} classes={{paper: classes.drawerPaper}}>
      <div className={classes.drawerHeader}>
        <IconButton onClick={toggleDrawer(false)}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <Divider />
      <LocationForm />
      <Divider />
      <TimeZoneForm />
    </Drawer>
  );
}