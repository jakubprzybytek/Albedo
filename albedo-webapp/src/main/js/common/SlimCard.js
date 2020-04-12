import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

export const SlimCardHeader = withStyles(theme => ({
    root: {
        paddingBottom: theme.spacing(1),
    },
}))(CardHeader);

export const SlimCardContent = withStyles(theme => ({
    root: {
        paddingTop: theme.spacing(1),
        '&:last-child': {
            paddingBottom: theme.spacing(2),
        }
    },
}))(CardContent);