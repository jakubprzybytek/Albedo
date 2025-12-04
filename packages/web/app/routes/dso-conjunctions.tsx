import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DsoConjunctionsBrowser from '@/components/DsoConjunctions/DsoConjunctionsBrowser';

function DsoConjunctions(): JSX.Element {
  return (
    <MainLayout title="DSO Conjunctions">
      <DsoConjunctionsBrowser />
    </MainLayout>
  );
}

export default DsoConjunctions;
