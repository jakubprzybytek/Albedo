import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import EclipsesBrowser from '@/components/Eclipses/EclipsesBrowser';

function Conjunctions(): JSX.Element {
  return (
    <MainLayout title="Eclipses">
      <EclipsesBrowser />
    </MainLayout>
  );
}

export default Conjunctions;
