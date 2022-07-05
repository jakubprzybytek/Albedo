import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import '../styles/globals.css';
import { Amplify } from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react';

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

function MyApp(props: AppProps | undefined) {
    if (props === undefined) {
        return <></>;
    }

    const { Component, pageProps } = props;
    return <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Component {...pageProps} />
    </LocalizationProvider>;
}

export default withAuthenticator(MyApp);
