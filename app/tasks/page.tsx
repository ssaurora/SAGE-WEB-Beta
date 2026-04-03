import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTaskListViewModel } from '@/lib/api/task';
import { getTaskStateLabel, getTaskStateVariant } from '@/lib/status/task-state';

export default async function TasksPage() {
  const tasks = await getTaskListViewModel();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>任务状态与可恢复性总览（统一状态映射）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-md border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{task.id}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {task.sceneId} · {task.analysisType} · {task.modelName}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getTaskStateVariant(task.currentState)}>
                    {getTaskStateLabel(task.currentState)}
                  </Badge>
                  <Badge variant={task.canResume ? 'secondary' : 'outline'}>
                    {task.canResume ? '可恢复' : '不可恢复'}
                  </Badge>
                  <Badge variant={task.resultAvailable ? 'secondary' : 'outline'}>
                    {task.resultAvailable ? '结果可用' : '无结果'}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Updated at: {task.updatedAt}</p>
                <Link href={`/task-governance/${task.id}`} className="text-sm font-medium text-primary hover:underline">
                  查看治理详情
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
