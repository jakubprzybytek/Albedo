import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Component {...pageProps} />
    </LocalizationProvider>;
}

export default MyApp;
