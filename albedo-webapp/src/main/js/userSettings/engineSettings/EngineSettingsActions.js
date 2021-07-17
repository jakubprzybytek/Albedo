export const UPDATE_ENGINE_SETTINGS = 'UPDATE_ENGINE_SETTINGS';

export function updateEngineSettings(engineSettings) {
  return { type: UPDATE_ENGINE_SETTINGS, engineSettings };
};
