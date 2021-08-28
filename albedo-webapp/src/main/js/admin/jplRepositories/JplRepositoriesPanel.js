import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import JplRepositoriesForm from './JplRepositoriesForm';
import JplRepositoriesTree from './JplRepositoriesTree';
import { JplRepositoriesKernelInfo } from './JplRepositoriesInfoCards';

const useStyles = makeStyles(theme => ({
  rowSection: {
    marginBottom: theme.spacing(2)
  },
  sectionColumn: {
    marginRight: theme.spacing(1)
  },
  columnSectionItem: {
    marginBottom: theme.spacing(1)
  },
  infoCards: {
    maxWidth: 350
  },
}));

export default function JplRepositoriesPanel() {

  const [ephemerisAdminInfo, setEphemerisAdminInfo] = React.useState([]);
  const [selectedKernelInfo, setSelectedKernelInfo] = React.useState();

  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.rowSection}>
        <JplRepositoriesForm setEphemerisAdminInfo={setEphemerisAdminInfo} />
      </div>
      <Grid container alignItems="flex-start">
        <div className={classes.sectionColumn}>
          <JplRepositoriesTree ephemerisAdminInfo={ephemerisAdminInfo} setSelectedKernelInfo={setSelectedKernelInfo} />
        </div>
        <Grid container item direction="column" className={classes.infoCards}>
          {selectedKernelInfo && <div className={classes.columnSectionItem}>
            <JplRepositoriesKernelInfo kernelInfo={selectedKernelInfo} />
          </div>}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
