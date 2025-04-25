import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import StatesBrowser from "@/components/States/StatesBrowser";

function States(): JSX.Element {
  return (
    <MainLayout title="States">
      <StatesBrowser />
    </MainLayout>
  );
}

export default States;
