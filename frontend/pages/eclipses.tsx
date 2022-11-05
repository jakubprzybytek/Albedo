import type { ReactElement } from 'react'
import { useTheme } from '@mui/material/styles';
import type { NextPageWithLayout } from "./_app";
import MainLayout from 'layouts/MainLayout';
import EclipsesBrowser from '../components/Eclipses/EclipsesBrowser';

const Eclipses: NextPageWithLayout = () => {
    const theme = useTheme();

    return (<EclipsesBrowser />);
};

Eclipses.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="Eclipses">
            {page}
        </MainLayout>
    )
}

export default Eclipses;
