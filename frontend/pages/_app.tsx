import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import '../styles/globals.css';
import { Amplify } from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react';

declare module '@mui/material/styles' {
    // fix the type error when referencing the Theme object in your styled component
    interface PaletteOptions {
        secondaryBackground?: string;
    }
    // fix the type error when calling `createTheme()` with a custom theme option
    interface Palette {
        secondaryBackground?: string;
    }
}

Amplify.configure({
    Auth: {
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
        userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    },
    API: {
        endpoints: [
            {
                name: "api",
                endpoint: process.env.NEXT_PUBLIC_API_URL,
                region: process.env.NEXT_PUBLIC_AWS_REGION,
            },
        ],
    },
});

// '#25274d'
// '#464866'
// '#aaabb8'
// '#2e9cca'
// '#29648a'

const theme = createTheme({
    palette: {
        primary: {
            main: '#2e9cca',
        },
        secondary: {
            main: '#aaabb8',
        },
        text: {
            primary: '#aaabb8',
            secondary: '#2e9cca',
        },
        background: {
            default: '#25274d'
        },
        secondaryBackground: '#464866'
    },
});

function MyApp(props: AppProps | undefined) {
    if (props === undefined) {
        return <></>;
    }

    const { Component, pageProps } = props;
    return <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Component {...pageProps} />
        </LocalizationProvider>
    </ThemeProvider>;
}

export default withAuthenticator(MyApp);
