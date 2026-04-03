import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TasksPanel } from "@/components/pages/tasks-panel";
import { getTaskListViewModel } from "@/lib/api/task";

export default async function TasksPage() {
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
}
