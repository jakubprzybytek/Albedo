import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import { red } from '@material-ui/core/colors';
import connectSettings from '../../actions/EventsListSettingsConnect';
import { SettingsExpansionPanel, SettingsExpansionSummary, SettingsExpansionPanelDetails, InternalCheckbox } from '../../settings/SettingsExpansionPanel';

const useStyles = makeStyles(theme => ({
  singlePaddingLeft: {
    paddingLeft: theme.spacing(1),
  },
}));

export function ConjunctionsSettingsDrawer(props) {

  const { settingsSection, submitSettingsSectionUpdate } = props;

  const classes = useStyles();

  function updateConjunctionsSettings(fieldName, value) {
    submitSettingsSectionUpdate({ ...settingsSection, [fieldName]: value });
  }

  return (
    <SettingsExpansionPanel color={red[50]}>
      <SettingsExpansionSummary checked={settingsSection.enabled} setChecked={value => updateConjunctionsSettings('enabled', value)}>
        <Typography>Conjunctions</Typography>
      </SettingsExpansionSummary>
      <SettingsExpansionPanelDetails disabled={!settingsSection.enabled}>
        <Typography variant="subtitle2" component="span">
          Show conjunctions between following object types:
            <FormGroup className={classes.singlePaddingLeft}>
            <InternalCheckbox label="Sun"
              disabled={!settingsSection.enabled} checked={settingsSection.sunEnabled} setChecked={value => updateConjunctionsSettings('sunEnabled', value)} />
            <InternalCheckbox label="Moon"
              disabled={!settingsSection.enabled} checked={settingsSection.moonEnabled} setChecked={value => updateConjunctionsSettings('moonEnabled', value)} />
          </FormGroup>
        </Typography>
      </SettingsExpansionPanelDetails>
    </SettingsExpansionPanel>
  );
}

export default connectSettings('conjunctions')(ConjunctionsSettingsDrawer);
