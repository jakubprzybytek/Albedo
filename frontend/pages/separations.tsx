import type { ReactElement } from 'react'
import { useTheme } from '@mui/material/styles';
import type { NextPageWithLayout } from "./_app";
import MainLayout from 'layouts/MainLayout';
import SeparationsBrowser from '../components/Separations/SeparationsBrowser';

const Conjunctions: NextPageWithLayout = () => {
    const theme = useTheme();

    return (<SeparationsBrowser />);
};

Conjunctions.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="Separations">
            {page}
        </MainLayout>
    )
}

export default Conjunctions;
