import { useState, useEffect } from "react";
import { RectangularCoordinates } from "../../api/math";
import styles from "./StatesList.module.css";

type State = {
    jde: number;
    position: RectangularCoordinates;
    velocity: RectangularCoordinates;
};

export default function StatesList(): JSX.Element {
    const [states, setStates] = useState<State[]>([]);

    console.log('Render');

    useEffect(() => {
        console.log('Start fetch');

        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/states?target=Sun&observer=Solar%20System%20Barycenter&fromTde=2019-10-09&toTde=2019-10-10&interval=0.2")
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched: ' + data);
                setStates(data);
            });
    }, []);

    return (
        <div>
            {states.map((state) => (
                <div key={state.jde} className={styles.paragraph}>
                    jde: {state.jde}, x: {state.position.x}, y: {state.position.y}, z:{" "}
                    {state.position.z}
                </div>
            ))}
        </div>
    );
}
