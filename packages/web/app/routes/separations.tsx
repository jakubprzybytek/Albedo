import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SeparationsBrowser from '@/components/Separations/SeparationsBrowser';

function Separations(): JSX.Element {
  return (
    <MainLayout title="Separations">
      <SeparationsBrowser />
    </MainLayout>
  );
}

export default Separations;
