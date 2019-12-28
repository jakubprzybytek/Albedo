import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import { blue } from '@material-ui/core/colors';
import { buildUpdateEventsListSettingsSectionsSaga } from '../../actions/EventsListSagas';
import { SettingsExpansionPanel, SettingsExpansionSummary, SettingsExpansionPanelDetails, InternalCheckbox } from '../../settings/SettingsExpansionPanel';

const useStyles = makeStyles(theme => ({
  singlePaddingLeft: {
    paddingLeft: theme.spacing(1),
  },
}));

const mapStateToProps = state => {
  return {
    rtsSettings: state.settings.rts
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitUpdateRtsSettings: (rtsSettings) => {
      dispatch(buildUpdateEventsListSettingsSectionsSaga('rts', rtsSettings));
    }
  };
};

export function RtsSettingsDrawer(props) {

  const { rtsSettings, submitUpdateRtsSettings } = props;

  const classes = useStyles();

  function updateRtsSettings(fieldName, value) {
    submitUpdateRtsSettings({ ...rtsSettings, [fieldName]: value });
  }

  return (
    <SettingsExpansionPanel color={blue[50]}>
      <SettingsExpansionSummary checked={rtsSettings.rtsEnabled} setChecked={value => updateRtsSettings('rtsEnabled', value)}>
        <Typography>Rise, Transit &amp; Set</Typography>
      </SettingsExpansionSummary>
      <SettingsExpansionPanelDetails disabled={!rtsSettings.rtsEnabled}>
        <Typography variant="subtitle2" component="span">
          Show times of rise, transit and set for:
            <FormGroup className={classes.singlePaddingLeft}>
            <InternalCheckbox label="Sun (incl. civil, nautical, astr.)"
              disabled={!rtsSettings.rtsEnabled} checked={rtsSettings.rtsSunEnabled} setChecked={value => updateRtsSettings('rtsSunEnabled', value)} />
            <InternalCheckbox label="Moon"
              disabled={!rtsSettings.rtsEnabled} checked={rtsSettings.rtsMoonEnabled} setChecked={value => updateRtsSettings('rtsMoonEnabled', value)} />
          </FormGroup>
        </Typography>
      </SettingsExpansionPanelDetails>
    </SettingsExpansionPanel>
  );
}

const GlobalStateAwareRtsSettingsDrawer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RtsSettingsDrawer);

export default GlobalStateAwareRtsSettingsDrawer;