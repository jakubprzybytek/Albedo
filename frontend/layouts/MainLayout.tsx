import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Head from "next/head";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Navigation from './Navigation';

type MainLayoutParams = {
    children: JSX.Element;
};

export default function MainLayout({ children }: MainLayoutParams): JSX.Element {
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Albedo 2.0</title>
                <meta name="description" content="Albedo. Predicting astronomical events." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navigation />
            <Box component="main" bgcolor={theme.palette.background.default} sx={{ minHeight: '100vh' }}>
                <Toolbar />
                {children}
            </Box>
        </>
    )
}
