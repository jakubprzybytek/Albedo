import { useState } from "react";
import { Auth, API } from "aws-amplify";
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

type QueryFormParams = {
    path: string;
    params: { [key: string]: string };
    setData: (data: any) => void;
    children: JSX.Element;
};

export default function QueryForm({ path, params, setData, children }: QueryFormParams): JSX.Element {

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>();
    const [errorMessage, setErrorMessage] = useState<string | null>();

    const theme = useTheme();

    async function handleSubmit() {
        setLoading(true);

        const startTime = new Date().getTime();

        API.get('api', path + '?' + new URLSearchParams(params).toString(), {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        })
            .then(data => {
                console.log('Fetched: ' + data);
                setSuccessMessage(`Loaded in ${new Date().getTime() - startTime} ms`);
                setErrorMessage(null);
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setSuccessMessage(null);
                setErrorMessage(error.toString());
                setLoading(false);
            });
    }

    return (
        <Paper component="form" sx={{
            pt: 2, pl: 1,
            maxWidth: '800px',
            backgroundColor: theme.palette.secondaryBackground,
            '& .MuiGrid-item': { pb: 1, pr: 1 },
            '& .MuiTextField-root': { width: '100%' }
        }}>
            {children}
            <Grid container sx={{ justifyContent: 'space-between' }}>
                <Grid item>
                    {errorMessage && <Typography sx={{ color: 'red' }}>{errorMessage}</Typography>}
                    {successMessage && <Typography>{successMessage}</Typography>}
                </Grid>
                <Grid item>
                    <LoadingButton variant="contained" size="small" loading={loading}
                        onClick={handleSubmit}
                    >Submit</LoadingButton>
                </Grid>
            </Grid>
        </Paper>
    );
}