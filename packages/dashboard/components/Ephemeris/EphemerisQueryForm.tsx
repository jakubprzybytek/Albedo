import { useState } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import { Ephemeris } from '@lambda/ephemeris';
import QueryForm from '../QueryForm';

type EphemerisQueryFormParams = {
    setEphemerides: (ephemerides: Ephemeris[]) => void;
};

export default function EphemerisQueryForm({ setEphemerides }: EphemerisQueryFormParams): JSX.Element {
    const [target, setTarget] = useState('Venus');
    const [fromTde, setFromTde] = useState<Date | null>(new Date());
    const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 1));
    const [interval, setInterval] = useState('1');

    const getParams = () => ({
        target,
        fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
        toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
        interval
    });

    return (
        <QueryForm path='/api/ephemeris' getParams={getParams} setResults={setEphemerides}>
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
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={4}>
                        <DatePicker label="From (TDE)" inputFormat="yyyy-MM-dd"
                            renderInput={(params) => <TextField size="small" {...params} />}
                            value={fromTde}
                            onChange={(newValue) => {
                                setFromTde(newValue);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <DatePicker label="To (TDE)" inputFormat="yyyy-MM-dd"
                            renderInput={(params) => <TextField size="small" {...params} />}
                            value={toTde}
                            onChange={(newValue) => {
                                setToTde(newValue);
                            }}
                        />
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