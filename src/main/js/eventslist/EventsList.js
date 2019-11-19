import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { red, orange, yellow, grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 800,
  },
   listSection: {
     backgroundColor: 'inherit',
   },
   ul: {
     backgroundColor: 'inherit',
     padding: 0,
   },
   subheader: {
     backgroundColor: grey[200],
   },
}));

export default function EventsList(props) {

  const { a } = props;
  
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <List dense={true} className={classes.list} subheader={<li />}>
        {[0, 1, 2, 3, 4].map(sectionId => (
          <li key={`section-${sectionId}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.subheader}>2019.11.21 {`I am sticky ${sectionId}`}</ListSubheader>
              {[0, 1, 2].map(item => (
                <ListItem key={`item-${sectionId}-${item}`}>
                  <ListItemText primary={`Item ${item}`} />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Paper>
  );
}
