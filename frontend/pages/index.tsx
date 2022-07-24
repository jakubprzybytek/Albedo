import type { ReactElement } from 'react'
import { useTheme } from '@mui/material/styles';
import type { NextPageWithLayout } from "./_app";
import MainLayout from 'layouts/MainLayout';
import EventsBrowser from 'components/Events/EventsBrowser';

const Home: NextPageWithLayout = () => {
    const theme = useTheme();

    return (
        <>
            <EventsBrowser />
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
