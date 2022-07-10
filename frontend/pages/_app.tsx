import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
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

export type NextPageWithLayout = NextPage & {
    getLayout: (page: ReactElement) => ReactElement
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const theme = createTheme({
    palette: {
        background: {
            default: '#aaabb8',
        },
        secondaryBackground: '#eeeeee'
    }
});

function MyApp(props: AppPropsWithLayout | undefined) {
    if (props === undefined) {
        return <></>;
    }

    const { Component, pageProps } = props;
    const getLayout = Component.getLayout ?? ((page) => page)

    return getLayout(<ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Component {...pageProps} />
        </LocalizationProvider>
    </ThemeProvider>);
}

export default withAuthenticator(MyApp);
