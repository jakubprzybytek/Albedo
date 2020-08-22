import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  smallFormControlLabel: {
    marginRight: theme.spacing(1),
  },
  smallButton: {
    padding: 0,
  },
  formControl: {
    paddingLeft: 3,
  },
  fieldsAligned: {
    paddingTop: 3,
  },
  smallInternalLabel: {
    fontSize: '0.8125rem',
  },
  smallCheckbox: {
    width: '1.3rem',
  },
}));

export const SettingsExpansionPanel = withStyles({
  root: {
    '&$expanded': {
      margin: 0,
    },
    backgroundColor: props => props.color,
  },
  expanded: {},
})(Accordion);

export function SettingsExpansionSummary(props) {

  const { checked, setChecked, children } = props;

  const classes = useStyles();

  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
      <FormControlLabel className={classes.smallFormControlLabel}
        aria-label="Acknowledge"
        onClick={event => event.stopPropagation()}
        onFocus={event => event.stopPropagation()}
        control={
          <Checkbox className={classes.smallButton} color="primary" checked={checked} onChange={event => setChecked(event.target.checked)} />
        } />
      {children}
    </AccordionSummary>
  );
}

export const SettingsExpansionPanelDetails = withStyles(theme => ({
  root: {
    flexDirection: 'column',
    padding: theme.spacing(0, 1, 1, 2),
    color: props => props.disabled ? grey[500] : '',
  },
}))(AccordionDetails);

export function InternalCheckbox(props) {

  const { label, checked, setChecked, disabled } = props;

  const classes = useStyles();

  return (
    <FormControlLabel className={classes.smallFormControlLabel} classes={{ label: classes.smallInternalLabel, }} aria-label="Acknowledge"
      onClick={event => event.stopPropagation()}
      onFocus={event => event.stopPropagation()}
      control={
        <Checkbox className={classes.smallButton}
          icon={<CheckBoxOutlineBlankIcon className={classes.smallCheckbox} />}
          checkedIcon={<CheckBoxIcon className={classes.smallCheckbox} />}
          disabled={disabled}
          checked={checked} onChange={event => setChecked(event.target.checked)} />
      }
      label={label} />
  );
}
