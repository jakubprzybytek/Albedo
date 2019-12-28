import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import { red } from '@material-ui/core/colors';
import { buildUpdateEventsListSettingsSectionsSaga } from '../../actions/EventsListSagas';
import { SettingsExpansionPanel, SettingsExpansionSummary, SettingsExpansionPanelDetails, InternalCheckbox } from '../../settings/SettingsExpansionPanel';

const useStyles = makeStyles(theme => ({
  singlePaddingLeft: {
    paddingLeft: theme.spacing(1),
  },
}));

const mapStateToProps = state => {
  return {
    conjunctionsSettings: state.settings.conjunctions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitUpdateConjunctionsSettings: (conjunctionsSettings) => {
      dispatch(buildUpdateEventsListSettingsSectionsSaga("conjunctions", conjunctionsSettings));
    }
  };
};

export function ConjunctionsSettingsDrawer(props) {

  const { conjunctionsSettings, submitUpdateConjunctionsSettings } = props;

  const classes = useStyles();

  function updateConjunctionsSettings(fieldName, value) {
    submitUpdateConjunctionsSettings({ ...conjunctionsSettings, [fieldName]: value });
  }

  return (
    <SettingsExpansionPanel color={red[50]}>
      <SettingsExpansionSummary checked={conjunctionsSettings.enabled} setChecked={value => updateConjunctionsSettings('enabled', value)}>
        <Typography>Conjunctions</Typography>
      </SettingsExpansionSummary>
      <SettingsExpansionPanelDetails disabled={!conjunctionsSettings.enabled}>
        <Typography variant="subtitle2" component="span">
          Show conjunctions between following object types:
            <FormGroup className={classes.singlePaddingLeft}>
            <InternalCheckbox label="Sun"
              disabled={!conjunctionsSettings.enabled} checked={conjunctionsSettings.sunEnabled} setChecked={value => updateConjunctionsSettings('sunEnabled', value)} />
            <InternalCheckbox label="Moon"
              disabled={!conjunctionsSettings.enabled} checked={conjunctionsSettings.moonEnabled} setChecked={value => updateConjunctionsSettings('moonEnabled', value)} />
          </FormGroup>
        </Typography>
      </SettingsExpansionPanelDetails>
    </SettingsExpansionPanel>
  );
}

const GlobalStateAwareConjunctionsSettingsDrawer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConjunctionsSettingsDrawer);

export default GlobalStateAwareConjunctionsSettingsDrawer;