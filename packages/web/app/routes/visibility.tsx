import type { JSX } from 'react';
import MainLayout from '@/layouts/MainLayout';
import VisibilityBrowser from '@/components/Visibility/VisibilityBrowser';

export default function Visibility(): JSX.Element {
  return <MainLayout title="Visibility"><VisibilityBrowser /></MainLayout>;
}