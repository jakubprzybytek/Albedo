import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import ConjunctionsBrowser from '@/components/Conjunctions/ConjunctionsBrowser';

function Conjunctions(): JSX.Element {
  return (
    <MainLayout title="Conjunctions">
      <ConjunctionsBrowser />
    </MainLayout>
  );
}

export default Conjunctions;
