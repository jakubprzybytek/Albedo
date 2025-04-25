import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import EphemerisBrowser from '@/components/Ephemeris/EphemerisBrowser';

function Ephemeris(): JSX.Element {
  return (
    <MainLayout title="States">
      <EphemerisBrowser />
    </MainLayout>
  );
}

export default Ephemeris;
