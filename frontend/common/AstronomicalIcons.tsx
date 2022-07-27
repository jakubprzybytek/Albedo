import React from "react";

type IconSize = {
    width: number;
    height: number;
}

// From https://en.wikipedia.org/wiki/Astrological_symbols
function SunIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="4" stroke="#fff" d="m7,25a18,18 0 1,1 0,.1zm3,0a15,15 0 1,0 0-.1zm11,0a4,4 0 1,0 0-.1z" />
        </svg>
    )
}

function MoonIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="4" stroke="#fff" d="M 12.5,3.5 a 22.5,22.5 0 0,1 0,43 a 22.5,22.5 0 1,0 0,-43 z" />
        </svg>
    )
}

function MercuryIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <circle fill="none" stroke="#fff" strokeWidth="4" cx="25" cy="24" r="11" />
            <path fill="none" strokeWidth="4" stroke="#fff" d="M25,35v12M20,42h10M16,4.5a9.3,9.3 0 0 0 18.5,0" />
        </svg>
    )
}

function VenusIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 75 75" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="5" stroke="#fff" d="m47,59H28m9.5,10V46.2a18.3,18.3 0 1,1 .1,0" />
        </svg>
    )
}

function MarsIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="4" stroke="#fff" d="m30,21a12.2,12.2 0 1,0 2,2zl1,1 11-11m-9,0h9v9" />
        </svg>
    )
}

function JupiterIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="4" stroke="#fff" d="M15.92 20.65c-.91 0-2.73-.84-2.73-4.23s3.64-6.78 7.27-6.78 7.26 2.54 7.26 8.47S23.18 33.37 14.1 33.37m-.91 0H39.53m-5.45 8.47V8.79" />
        </svg>
    )
}

function SaturnIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="4" stroke="#fff" d="M19.79 5.92v29M14.9 10.67h12m6.89 30.25c-1 1-2 2-3 2s-3-1-3-3 1-4 3-6 4-6 4-10-2-8-6-8c-3.78 0-7 2-9 6" />
        </svg>
    )
}

function NeptuneIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="4" stroke="#fff" d="M15.12 9.15c-2.65 18.03 1.77 20.74 10.62 20.74S39.01 27.18 36.36 9.15m-10.62 1.8V44.31M18.66 37.1H32.82M10.23 11.63l5.02-3.8 3.73 5.12m2.25 2.99 4.38-4.55 4.47 4.45m2.35-2.58 3.8-5.07 4.97 3.87" />
        </svg>
    )
}

function UranusIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg viewBox="0 0 50 50" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="none" strokeWidth="4" stroke="#fff" d="M20.33 12.87l4.95-5.05 5.05 4.94m-4.9-5.43V20.47m-.01.27a10.78 10.78 0 1 0 .02 0Z" />
            <circle fill="#fff" cx="25.54" cy="31.53" r="2.7" />
        </svg>
    )
}

type PlanetIconParamType = {
    name: string;
    width: number;
    height: number;
}

export function PlanetIcon({ name, width, height }: PlanetIconParamType): JSX.Element {
    switch (name) {
        case 'Mercury':
            return (<MercuryIcon width={width} height={height} />);
        case 'Venus':
            return (<VenusIcon width={width} height={height} />);
        case 'Mars':
            return (<MarsIcon width={width} height={height} />);
        case 'Jupiter':
            return (<JupiterIcon width={width} height={height} />);
        case 'Saturn':
            return (<SaturnIcon width={width} height={height} />);
        case 'Neptune':
            return (<NeptuneIcon width={width} height={height} />);
        case 'Uranus':
            return (<UranusIcon width={width} height={height} />);
    }
    return (<>P</>);
}

export function CometIcon({ width, height }: IconSize): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height}>
            <path d="M35,79 A15,15 0 1,0 35,81 M20,65 50,5 M30,70 80,20 M95,50 35,80h-2.5" fill="none" strokeWidth="8" stroke="#fff" />
        </svg>
    )
}
