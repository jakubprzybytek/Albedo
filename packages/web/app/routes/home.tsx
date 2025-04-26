import type { JSX } from "react";
import type { Route } from "./+types/home";
import MainLayout from "@/layouts/MainLayout";
import EventsBrowser from "@/components/Events/EventsBrowser";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home(): JSX.Element {
  return (
    <MainLayout title="Dashboard">
      <EventsBrowser />
    </MainLayout>
  );
}
