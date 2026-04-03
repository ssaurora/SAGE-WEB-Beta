import { ScenesListClient } from "@/components/pages/scenes-list-client";
import { getScenesListViewModel } from "@/lib/api/scenes";

export default async function ScenesListPage() {
  const vm = await getScenesListViewModel();

  return <ScenesListClient items={vm.items} />;
}
