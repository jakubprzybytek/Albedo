import type { ReactElement } from 'react'
import { useTheme } from '@mui/material/styles';
import type { NextPageWithLayout } from "./_app";
import MainLayout from 'layouts/MainLayout';
import ConjunctionsBrowser from '../components/Conjunctions/ConjunctionsBrowser';

const Conjunctions: NextPageWithLayout = () => {
    const theme = useTheme();

    return (
        <>
            <ConjunctionsBrowser />
        </>
    );
};

Conjunctions.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="Conjunctions">
            {page}
        </MainLayout>
    )
}

export default Conjunctions;
