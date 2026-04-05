import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataStateCard } from "@/components/pages/data-state-card";
import { TasksPanel } from "@/components/pages/tasks-panel";
import { getTaskListViewModel } from "@/lib/api/task";

export default async function TasksPage() {
  try {
    const tasks = await getTaskListViewModel();

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              任务状态与可恢复性总览（支持搜索与快速筛选）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TasksPanel tasks={tasks} />
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return (
      <div className="space-y-4">
        <DataStateCard
          title="Tasks load failed"
          description="任务列表暂时不可用，请稍后重试或刷新页面。"
          tone="error"
          actionHref="/tasks"
          actionLabel="重试"
        />
      </div>
    );
  }
}
