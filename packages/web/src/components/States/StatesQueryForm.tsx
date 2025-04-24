import { useState, type JSX } from "react";
import Grid from '@mui/material/GridLegacy';
import TextField from '@mui/material/TextField';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import type { StateWithPositionAndVelocity } from '@lambda/states';
import QueryForm from '../QueryForm';
import { pink, yellow } from "@mui/material/colors";

type StatesQueryFormParams = {
    setStates: (states: StateWithPositionAndVelocity[]) => void;
};

export default function StatesQueryForm({ setStates }: StatesQueryFormParams): JSX.Element {
    const [target, setTarget] = useState('Earth');
    const [observer, setObserver] = useState('Solar System Barycenter');
    const [fromTde, setFromTde] = useState<Date | null>(new Date());
    const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 1));
    const [interval, setInterval] = useState('1');

    const getParams = () => ({
        target,
        observer,
        fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
        toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
        interval
    });

    return (
        <QueryForm path='/api/states' getParams={getParams} setResults={setStates}>
            <>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Target" size="small"
                            value={target}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setTarget(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Observer" size="small"
                            value={observer}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setObserver(event.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={4}>
                        {/* <DatePicker label="From (TDE)" sx={{ '& > div': { height: 40 } }}
                            value={fromTde} onChange={(newValue) => setFromTde(newValue)} /> */}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {/* <DatePicker label="To (TDE)" sx={{ '& > div': { height: 40 } }}
                            value={toTde} onChange={(newValue) => setToTde(newValue)} /> */}
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <TextField label="Interval" size="small" type="number"
                            value={interval}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setInterval(event.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
            </>
        </QueryForm>
    );
}