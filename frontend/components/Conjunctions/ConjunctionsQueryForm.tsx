import { useState } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import { Conjunction } from '@lambda/conjunctions';
import QueryForm from '../QueryForm';

type ConjunctionsQueryFormParams = {
    setConjunctions: (conjunctions: Conjunction[]) => void;
};

export default function ConjunctionsQueryForm({ setConjunctions }: ConjunctionsQueryFormParams): JSX.Element {
    const [fromTde, setFromTde] = useState<Date | null>(new Date());
    const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 1));

    const getParams = () => ({
        fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
        toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
    });

    return (
        <QueryForm path='/api/conjunctions' getParams={getParams} setResults={setConjunctions}>
            <>
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
                </Grid>
            </>
        </QueryForm>
    );
}