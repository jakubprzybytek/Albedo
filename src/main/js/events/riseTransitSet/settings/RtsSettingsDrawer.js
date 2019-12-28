import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import { blue } from '@material-ui/core/colors';
import connectSettings from '../../actions/EventsListSettingsConnect';
import { SettingsExpansionPanel, SettingsExpansionSummary, SettingsExpansionPanelDetails, InternalCheckbox } from '../../settings/SettingsExpansionPanel';

const useStyles = makeStyles(theme => ({
  singlePaddingLeft: {
    paddingLeft: theme.spacing(1),
  },
}));

export function RtsSettingsDrawer(props) {

  const { settingsSection, submitSettingsSectionUpdate } = props;

  const classes = useStyles();

  function updateRtsSettings(fieldName, value) {
    submitSettingsSectionUpdate({ ...settingsSection, [fieldName]: value });
  }

  return (
    <SettingsExpansionPanel color={blue[50]}>
      <SettingsExpansionSummary checked={settingsSection.enabled} setChecked={value => updateRtsSettings('enabled', value)}>
        <Typography>Rise, Transit &amp; Set</Typography>
      </SettingsExpansionSummary>
      <SettingsExpansionPanelDetails disabled={!settingsSection.enabled}>
        <Typography variant="subtitle2" component="span">
          Show times of rise, transit and set for:
            <FormGroup className={classes.singlePaddingLeft}>
            <InternalCheckbox label="Sun (incl. civil, nautical, astr.)"
              disabled={!settingsSection.enabled} checked={settingsSection.sunEnabled} setChecked={value => updateRtsSettings('sunEnabled', value)} />
            <InternalCheckbox label="Moon"
              disabled={!settingsSection.enabled} checked={settingsSection.moonEnabled} setChecked={value => updateRtsSettings('moonEnabled', value)} />
          </FormGroup>
        </Typography>
      </SettingsExpansionPanelDetails>
    </SettingsExpansionPanel>
  );
}

export default connectSettings('rts')(RtsSettingsDrawer);