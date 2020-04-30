import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import { red } from '@material-ui/core/colors';
import connectSettings from '../actions/EventsListSettingsConnect';
import { SettingsExpansionPanel, SettingsExpansionSummary, SettingsExpansionPanelDetails, InternalCheckbox } from '../settings/SettingsExpansionPanel';

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
          Show conjunctions between following types of objects:
            <FormGroup className={classes.singlePaddingLeft}>
            <InternalCheckbox label="Sun"
              disabled={!settingsSection.enabled} checked={settingsSection.sunEnabled} setChecked={value => updateConjunctionsSettings('sunEnabled', value)} />
            <InternalCheckbox label="Moon"
              disabled={!settingsSection.enabled} checked={settingsSection.moonEnabled} setChecked={value => updateConjunctionsSettings('moonEnabled', value)} />
            <InternalCheckbox label="Planets"
              disabled={!settingsSection.enabled} checked={settingsSection.planetsEnabled} setChecked={value => updateConjunctionsSettings('planetsEnabled', value)} />
            <InternalCheckbox label="Comets"
              disabled={!settingsSection.enabled} checked={settingsSection.cometsEnabled} setChecked={value => updateConjunctionsSettings('cometsEnabled', value)} />
            <InternalCheckbox label="Asteroids"
              disabled={!settingsSection.enabled} checked={settingsSection.asteroidsEnabled} setChecked={value => updateConjunctionsSettings('asteroidsEnabled', value)} />
            <InternalCheckbox label="Deep Space Objects"
              disabled={!settingsSection.enabled} checked={settingsSection.cataloguesDSEnabled} setChecked={value => updateConjunctionsSettings('cataloguesDSEnabled', value)} />
          </FormGroup>
        </Typography>
      </SettingsExpansionPanelDetails>
      <SettingsExpansionPanelDetails disabled={!settingsSection.enabled}>
        <Typography variant="subtitle2" component="span">
          Filter out:
            <FormGroup className={classes.singlePaddingLeft}>
            <InternalCheckbox label="Events when blinded by Sun"
              disabled={!settingsSection.enabled} checked={settingsSection.filterBlindedBySun} setChecked={value => updateConjunctionsSettings('filterBlindedBySun', value)} />
          </FormGroup>
        </Typography>
      </SettingsExpansionPanelDetails>
    </SettingsExpansionPanel>
  );
}

export default connectSettings('conjunctions')(ConjunctionsSettingsDrawer);
