import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useJsonConnection from '../../api/JsonConnection';
import CometsCatalogueForm from './CometsCatalogueForm';
import CometsCatalogueTable from './CometsCatalogueTable';


const useStyles = makeStyles(theme => ({
  area: {
    marginBottom: theme.spacing(2),
    backgroundColor: '0',
  },
}));

export default function DsoCataloguePanel() {

  const [rows, setRows] = React.useState([]);

  const jsonConnection = useJsonConnection(setRows);

  const classes = useStyles();

  return (
    <div>
      <div className={classes.area}>
        <CometsCatalogueForm jsonConnection={jsonConnection} />
      </div>
      <CometsCatalogueTable rows={rows} />
    </div>
  );
}
