import type { ReactElement } from 'react'
import { useTheme } from '@mui/material/styles';
import type { NextPageWithLayout } from "../_app";
import MainLayout from 'layouts/MainLayout';
import EphemerisBrowser from "../../components/Ephemeris/EphemerisBrowser";

const Home: NextPageWithLayout = () => {
    const theme = useTheme();

    return (
        <>
            <EphemerisBrowser />
        </>
    );
};

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export default Home;
