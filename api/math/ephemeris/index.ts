
type AstronomicalCoordinates = {
    rightAscencion: number;
    declination: number;
}

type Ephemeris = {
    jde: number;
    coordinates: AstronomicalCoordinates;
}
