import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSceneTaskRunsViewModel } from '@/lib/api/scene';
import { getTaskStateLabel, getTaskStateVariant } from '@/lib/status/task-state';

export default async function SceneTaskRunsPage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  const vm = await getSceneTaskRunsViewModel(sceneId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scene Task Runs</CardTitle>
          <CardDescription>{vm.sceneId} · 场景任务运行记录与状态联动</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {vm.items.map((task) => (
            <div key={task.taskId} className="rounded-md border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{task.taskId}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {task.analysisType} · {task.modelName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
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
                <Link href={`/task-governance/${task.taskId}`} className="text-sm font-medium text-primary hover:underline">
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
