import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import SystemInfoForm from './SystemInfoForm';
import SystemInfoCard from './SystemInfoCard';

const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2)
  },
}));

export default function SystemInfoPanel() {

  const [systemInfo, setSystemInfo] = React.useState({});

  const jsonConnection = useJsonConnection(setSystemInfo);

  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.area}>
        <SystemInfoForm jsonConnection={jsonConnection} />
      </div>
      <SystemInfoCard systemInfo={systemInfo} />
    </React.Fragment>
  );
}
