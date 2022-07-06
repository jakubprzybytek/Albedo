import type { NextPage } from "next";
import { Auth } from "aws-amplify";
import Head from "next/head";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StatesBrowser from "../components/States/StatesBrowser";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Albedo 2.0</title>
                <meta name="description" content="Albedo. Predicting astronomical events." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <Button onClick={() => Auth.signOut()}>Log out</Button>
            </header>
            <Box component='main' bgcolor={theme.palette.background.default} className={styles.main}>
                <StatesBrowser />
            </Box>
        </>
    );
};

export default Home;
