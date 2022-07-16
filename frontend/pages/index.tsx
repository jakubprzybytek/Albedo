import type { ReactElement } from 'react'
import { useTheme } from '@mui/material/styles';
import type { NextPageWithLayout } from "./_app";
import MainLayout from 'layouts/MainLayout';
import StatesBrowser from "../components/States/StatesBrowser";
import EphemerisBrowser from "../components/Ephemeris/EphemerisBrowser";

const Home: NextPageWithLayout = () => {
    const theme = useTheme();

    return (
        <>
            <StatesBrowser />
            <EphemerisBrowser />
        </>
    );
};

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="Dashboard">
            {page}
        </MainLayout>
    )
}

export default Home;
