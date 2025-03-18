import type { ReactElement } from 'react';
import { Amplify, ResourcesConfig } from "aws-amplify";
import { fetchAuthSession } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { pl } from 'date-fns/locale/pl';
import '@aws-amplify/ui-react/styles.css';
import '../styles/globals.css';

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

console.log(`User pool: ${process.env.NEXT_PUBLIC_USER_POOL_ID}`);
console.log(`User client pool: ${process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID}`);
console.log(`Identity pool: ${process.env.NEXT_PUBLIC_IDENTITY_POOL_ID}`);

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
        },
        // region: process.env.NEXT_PUBLIC_AWS_REGION,
    },
    API: {
        REST: {
            AlbedoAPI: {
                endpoint: process.env.NEXT_PUBLIC_API_URL || '',
                region: process.env.NEXT_PUBLIC_AWS_REGION,
            },
        },
    },
} satisfies ResourcesConfig, {
    API: {
        REST: {
            headers: async () => {
                return {
                    Authorization: `Bearer ${(await fetchAuthSession()).tokens?.accessToken.toString()}`,
                };
            },
        },
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

    // return getLayout(<ThemeProvider theme={theme}>
    //     <Component {...pageProps} />
    // </ThemeProvider>);
    return getLayout(<ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
            <Component {...pageProps} />
        </LocalizationProvider>
    </ThemeProvider>);
}

export default withAuthenticator(MyApp);
