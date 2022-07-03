import { useState } from "react";
import { GetStatesReturnType } from '@lambda/states/getStates';
import Box from '@mui/material/Box';
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

    function handleSubmit() {
        const params = new URLSearchParams({
            target,
            observer,
            fromTde: fromTde?.toISOString() || '',
            toTde: toTde?.toISOString() || '',
            interval
        });

        fetch(process.env.NEXT_PUBLIC_API_URL + '/api/states?' + params.toString())
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched: ' + data);
                setStates(data);
            });
    }

    return (
        <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }}>
            <div>
                <TextField label="Target" size="small"
                    value={target}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTarget(event.target.value);
                    }}
                />
                <TextField label="Observer" size="small"
                    value={observer}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setObserver(event.target.value);
                    }}
                />
                <DatePicker label="From (TDE)"
                    renderInput={(params) => <TextField size="small" {...params} />}
                    value={fromTde}
                    onChange={(newValue) => {
                        setFromTde(newValue);
                    }}
                />
                <DatePicker label="To  (TDE)"
                    renderInput={(params) => <TextField size="small" {...params} />}
                    value={toTde}
                    onChange={(newValue) => {
                        setToTde(newValue);
                    }}
                />
                <TextField label="Interval" size="small" type="number"
                    value={interval}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setInterval(event.target.value);
                    }}
                />
                <Button variant="contained" size="small"
                    onClick={handleSubmit}
                >Submit</Button>
            </div>
        </Box>
    );
}