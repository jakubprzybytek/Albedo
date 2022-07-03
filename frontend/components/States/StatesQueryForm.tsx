import { useState } from "react";
import { GetStatesReturnType } from '@lambda/states/getStates';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from "./StatesQueryForm.module.css";

type StatesQueryFormParams = {
    setStates: (states: GetStatesReturnType) => void;
};

export default function StatesQueryForm({ setStates }: StatesQueryFormParams): JSX.Element {
    const [target, setTarget] = useState('Earth');
    const [observer, setObserver] = useState('Solar System Barycenter');
    const [fromTde, setFromTde] = useState<Date | null>(new Date('2019-10-09'));
    const [toTde, setToTde] = useState<Date | null>(new Date('2019-10-12'));
    const [interval, setInterval] = useState('1');

    const [loading, setLoading] = useState(false);

    function handleSubmit() {
        const params = new URLSearchParams({
            target,
            observer,
            fromTde: fromTde?.toISOString() || '',
            toTde: toTde?.toISOString() || '',
            interval
        });

        setLoading(true);

        fetch(process.env.NEXT_PUBLIC_API_URL + '/api/states?' + params.toString())
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched: ' + data);
                setStates(data);
                setLoading(false);
            });
    }

    return (
        <Box component="form">
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <TextField label="Target" size="small" className={styles.field}
                        value={target}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setTarget(event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Observer" size="small" className={styles.field}
                        value={observer}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setObserver(event.target.value);
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={4}>
                    <DatePicker label="From (TDE)"
                        renderInput={(params) => <TextField size="small" className={styles.field} {...params} />}
                        value={fromTde}
                        onChange={(newValue) => {
                            setFromTde(newValue);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <DatePicker label="To (TDE)"
                        renderInput={(params) => <TextField size="small" className={styles.field} {...params} />}
                        value={toTde}
                        onChange={(newValue) => {
                            setToTde(newValue);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField label="Interval" size="small" type="number" className={styles.field}
                        value={interval}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setInterval(event.target.value);
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" size="small" disabled={loading}
                        onClick={handleSubmit}
                    >Submit</Button>
                </Grid>
            </Grid>
        </Box>
    );
}