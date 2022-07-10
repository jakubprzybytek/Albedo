import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import '../styles/globals.css';
import { Amplify } from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

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

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#2e9cca',
//         },
//         secondary: {
//             main: '#aaabb8',
//         },
//         text: {
//             primary: '#aaabb8',
//             secondary: '#2e9cca',
//         },
//         background: {
//             default: '#25274d'
//         },
//         secondaryBackground: '#464866'
//     },
// });

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#f76c6c',
//         },
//         secondary: {
//             main: '#f8e9a1',
//         },
//         text: {
//             primary: '#f8e9a1',
//             secondary: '#a8d0e6',
//         },
//         background: {
//             default: '#24305e'
//         },
//         secondaryBackground: '#374785'
//     },
// });

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#f8e9a1',
//         },
//         text: {
//             primary: '#a8d0e6',
//             secondary: '#a8d0e6',
//         },
//         background: {
//             default: '#24305e'
//         },
//         secondaryBackground: '#374785'
//     },
// });

const theme = createTheme({
    palette: {
        background: {
            default: '#aaabb8',
        },
        secondaryBackground: '#eeeeee'
    }
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
