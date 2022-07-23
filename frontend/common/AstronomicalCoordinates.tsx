import { AstronomicalCoordinates } from "../../api/math";
import { formatHourAngle, formatDegrees } from '../utils';

type AstronomicalCoordsPropsType = {
    coords: AstronomicalCoordinates;
}

export default function AstronomicalCoords({ coords }: AstronomicalCoordsPropsType): JSX.Element {
    return (
        <>
            <span>R.A.: {formatHourAngle(coords.rightAscension)} ({coords.rightAscension.toFixed(6)}°)</span>
            <span>Dec.: {formatDegrees(coords.declination)} ({coords.declination.toFixed(6)}°)</span>
        </>
    );
}
