import { useState } from "react";
import { Auth, API } from "aws-amplify";
import { GetStatesReturnType } from '@lambda/states/getStates';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

    async function handleSubmit() {
        const params = new URLSearchParams({
            target,
            observer,
            fromTde: fromTde?.toISOString() || '',
            toTde: toTde?.toISOString() || '',
            interval
        });

        setLoading(true);

        API.get('api', '/api/states?' + params.toString(), {
            target,
            observer,
            fromTde: fromTde?.toISOString() || '',
            toTde: toTde?.toISOString() || '',
            interval,
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        })
            .then((data) => {
                console.log('Fetched: ' + data);
                setStates(data);
                setLoading(false);
            });
    }

    return (
        <Paper component="form" sx={{
            pt: 2, pl: 1,
            maxWidth: '800px',
            '& .MuiGrid-item': { pb: 1, pr: 1 },
            '& .MuiTextField-root': { width: '100%' }
        }}>
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
                    <DatePicker label="From (TDE)"
                        renderInput={(params) => <TextField size="small" />}
                        value={fromTde}
                        onChange={(newValue) => {
                            setFromTde(newValue);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <DatePicker label="To (TDE)"
                        renderInput={(params) => <TextField size="small" />}
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
            <Grid container sx={{ justifyContent: 'flex-end' }}>
                <Grid item>
                    <Button variant="contained" size="small" disabled={loading}
                        onClick={handleSubmit}
                    >Submit</Button>
                </Grid>
            </Grid>
        </Paper>
    );
}