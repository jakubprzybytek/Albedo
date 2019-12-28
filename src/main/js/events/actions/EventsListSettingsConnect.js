import { connect } from 'react-redux';
import { buildUpdateEventsListSettingsSectionsSaga } from './EventsListSagas';

export default function connectSettings(sectionName) {
  return connect(
    state => ({ settingsSection: state.eventsList.settings[sectionName] }),
    dispatch => ({
      submitSettingsSectionUpdate: (rtsSettings) => {
        dispatch(buildUpdateEventsListSettingsSectionsSaga(sectionName, rtsSettings));
      }
    })
  );
};
