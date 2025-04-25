import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const QueryPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  paddingTop: theme.spacing(2),
  maxWidth: '800px',
  backgroundColor: theme.palette.grey[200],
  '& .MuiTextField-root': {
    width: '100%',
    // backgroundColor: '#fff'
  },
}));

export default QueryPanel;
