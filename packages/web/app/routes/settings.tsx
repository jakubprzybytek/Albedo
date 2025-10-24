import type { JSX } from "react";
import MainLayout from "@/layouts/MainLayout";
import SettingsDialog from "@/components/Settings/SettingsDialog";

export default function Settings(): JSX.Element {
  return (
    <MainLayout title="Settings">
      <SettingsDialog />
    </MainLayout>
  );
}
