import { AstronomicalCoordinates } from "../../api/math";
import { formatHourAngle, formatDegrees } from '../utils';

type AstronomicalCoordsPropsType = {
    coords: AstronomicalCoordinates;
}

export default function AstronomicalCoords({ coords }: AstronomicalCoordsPropsType): JSX.Element {
    return (
        <>
            <div>R.A.: {formatHourAngle(coords.rightAscension)} ({coords.rightAscension.toFixed(6)}°)</div>
            <div>Dec.: {formatDegrees(coords.declination)} ({coords.declination.toFixed(6)}°)</div>
        </>
    );
}
