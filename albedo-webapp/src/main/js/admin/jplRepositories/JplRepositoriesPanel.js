import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import JplRepositoriesForm from './JplRepositoriesForm';
import JplRepositoriesGraph from './JplRepositoriesGraph';
import { JplRepositoriesKernelInfo, JplRepositoriesBodyInfo } from './JplRepositoriesInfoCards';

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
    maxWidth: 325
  },
}));

export default function JplRepositoriesPanel() {

  const [ephemerisAdminInfo, setEphemerisAdminInfo] = React.useState([]);
  const [selectedGraphLink, setSelectedGraphLink] = React.useState({ source:'', target: '' });
  const [selectedNode, setSelectedNode] = React.useState('');

  const classes = useStyles();

  const kernelInfo = ephemerisAdminInfo.find(graphLink => graphLink.observerBody == selectedGraphLink.source && graphLink.targetBody == selectedGraphLink.target);

  const parentBodyName = ephemerisAdminInfo.find(graphLink => graphLink.targetBody == selectedNode)?.observerBody;
  const childBodyNames = ephemerisAdminInfo
    .filter(graphLink => graphLink.observerBody == selectedNode)
    .map(bodyInfo => bodyInfo.targetBody);

  return (
    <React.Fragment>
      <div className={classes.rowSection}>
        <JplRepositoriesForm setEphemerisAdminInfo={setEphemerisAdminInfo} />
      </div>
      <Grid container alignItems="flex-start">
        <div className={classes.sectionColumn}>
          <JplRepositoriesGraph ephemerisAdminInfo={ephemerisAdminInfo} setSelectedGraphLink={setSelectedGraphLink} setSelectedNode={setSelectedNode} />
        </div>
        <Grid container item direction="column" className={classes.infoCards}>
          {kernelInfo && <div className={classes.columnSectionItem}>
            <JplRepositoriesKernelInfo kernelInfo={kernelInfo} />
          </div>}
          {selectedNode &&
            <JplRepositoriesBodyInfo bodyName={selectedNode} parentBodyName={parentBodyName} childBodyNames={childBodyNames} />
          }
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
