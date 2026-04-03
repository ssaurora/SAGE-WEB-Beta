import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PlaceholderPageProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function PlaceholderPage({
  title,
  description,
  bullets,
}: PlaceholderPageProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="space-y-3 rounded-lg border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Implementation Scaffold
        </p>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Planned next focus</CardTitle>
          <CardDescription>基于总体设计与实施计划的首步拆解。</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
