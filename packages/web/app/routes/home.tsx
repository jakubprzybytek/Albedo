import type { JSX } from "react";
import type { Route } from "./+types/home";
import MainLayout from "@/layouts/MainLayout";
import EventsBrowser from "@/components/Events/EventsBrowser";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Albedo 2.2" },
    { name: "description", content: "Albedo. Predicting astronomical events." },
  ];
}

export default function Home(): JSX.Element {
  return (
    <MainLayout title="Dashboard">
      <EventsBrowser />
    </MainLayout>
  );
}
