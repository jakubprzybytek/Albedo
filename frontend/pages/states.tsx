import type { ReactElement } from 'react';
import { useTheme } from '@mui/material/styles';
import type { NextPageWithLayout } from "./_app";
import MainLayout from 'layouts/MainLayout';
import StatesBrowser from "../components/States/StatesBrowser";

const Home: NextPageWithLayout = () => {
    const theme = useTheme();

    return (
        <>
            <StatesBrowser />
        </>
    );
};

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="States">
            {page}
        </MainLayout>
    )
}

export default Home;
