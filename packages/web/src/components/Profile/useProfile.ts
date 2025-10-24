import type { Profile } from ".";

const PROFILE_STORAGE_KEY = 'profile';

const DEFAULT_PROFILE: Profile = {
    location: {
        latitude: 51,
        longitude: 17,
        altitude: 50
    }
};

export function useProfile(): [Profile, (updatedProfile: Profile) => void] {

    const storedProfile = window.sessionStorage.getItem(PROFILE_STORAGE_KEY);

    if (storedProfile === null) {

    }

    const profile = storedProfile ? JSON.parse(storedProfile) as Profile : DEFAULT_PROFILE;

    function updateProfile(updatedProfile: Profile) {
        window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    }

    return [profile, updateProfile];
}
