import React from 'react';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import connectSettings from '../actions/EventsListSettingsConnect';
import { SettingsExpansionPanel, SettingsExpansionSummary } from '../settings/SettingsExpansionPanel';

export function EclipseEventsSettingsDrawer(props) {

  const { settingsSection, submitSettingsSectionUpdate } = props;

  function updateSettings(fieldName, value) {
    submitSettingsSectionUpdate({ ...settingsSection, [fieldName]: value });
  }

  return (
    <SettingsExpansionPanel color={grey[400]}>
      <SettingsExpansionSummary checked={settingsSection.enabled} setChecked={value => updateSettings('enabled', value)}>
        <Typography>Eclipses</Typography>
      </SettingsExpansionSummary>
    </SettingsExpansionPanel>
  );
}

export default connectSettings('eclipses')(EclipseEventsSettingsDrawer);
