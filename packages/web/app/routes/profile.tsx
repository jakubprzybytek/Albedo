import type { JSX } from "react";
import MainLayout from "@/layouts/MainLayout";
import ProfileDialog from "@/components/Profile/ProfileDialog";

export default function Settings(): JSX.Element {
  return (
    <MainLayout title="Settings">
      <ProfileDialog />
    </MainLayout>
  );
}
