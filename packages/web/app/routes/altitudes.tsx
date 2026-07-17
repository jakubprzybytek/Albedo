import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import AltitudesBrowser from '@/components/Altitudes/AltitudesBrowser';

export default function Altitudes(): JSX.Element {
  return <MainLayout title="Altitudes"><AltitudesBrowser /></MainLayout>;
}