import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DataStateCardProps = {
  title: string;
  description: string;
  tone?: "default" | "error";
  actionHref?: string;
  actionLabel?: string;
};

export function DataStateCard({
  title,
  description,
  tone = "default",
  actionHref,
  actionLabel,
}: DataStateCardProps) {
  return (
    <Card
      className={
        tone === "error"
          ? "border-destructive/60 bg-destructive/5"
          : "border-border bg-muted/20"
      }
    >
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {actionHref && actionLabel ? (
        <CardContent className="pt-0">
          <Link
            href={actionHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            {actionLabel}
          </Link>
        </CardContent>
      ) : null}
    </Card>
  );
}
