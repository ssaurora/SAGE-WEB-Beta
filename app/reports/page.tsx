import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataStateCard } from "@/components/pages/data-state-card";
import { ReportsPanel } from "@/components/pages/reports-panel";
import { getReportListViewModel } from "@/lib/api/report";

export default async function ReportsPage() {
  try {
    const reports = await getReportListViewModel();

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              按 Scene / Analysis Type / Model / Time 筛选并查看结果报告
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportsPanel items={reports} />
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Reports load failed"
          description="报告列表暂时不可用，请稍后重试。"
          tone="error"
          actionHref="/reports"
          actionLabel="Retry"
        />
      </div>
    );
  }
}
