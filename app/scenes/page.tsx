import { ScenesListClient } from "@/components/pages/scenes-list-client";
import { getScenesListViewModel } from "@/lib/api/scenes";

export default async function ScenesListPage() {
  const vm = await getScenesListViewModel();

  return (
    <div className="space-y-4">
      <ScenesListClient items={vm.items} />
    </div>
  );
}
