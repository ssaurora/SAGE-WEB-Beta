"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  Share2,
  Printer,
  Eye,
  Package2,
  Calendar,
  FileText,
} from "lucide-react";

export type ReportDetailViewModel = {
  id: string;
  name: string;
  sceneId: string;
  taskId: string;
  analysisType: string;
  generatedAt: string;
  status: "Draft" | "Published" | "Archived";
  format: "PDF" | "XLSX" | "JSON";
  pageCount?: number;
  fileSize?: string;
  generatedBy?: string;
  description?: string;
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    contentPreview?: string;
  }>;
  metadata?: Record<string, string>;
  downloadUrl?: string;
};

const statusVariant = (
  status: "Draft" | "Published" | "Archived"
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Published":
      return "default";
    case "Draft":
      return "secondary";
    case "Archived":
      return "outline";
    default:
      return "default";
  }
};

const statusLabel = (status: "Draft" | "Published" | "Archived"): string => {
  switch (status) {
    case "Published":
      return "已发布";
    case "Draft":
      return "草稿";
    case "Archived":
      return "已归档";
    default:
      return status;
  }
};

export function ReportDetailClient({ vm }: { vm: ReportDetailViewModel }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">{vm.name}</h1>
                <Badge variant={statusVariant(vm.status)}>
                  {statusLabel(vm.status)}
                </Badge>
                <Badge variant="outline">{vm.format}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {vm.description || "Report generated from task analysis"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                title="Copy link"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" title="Print">
                <Printer className="h-4 w-4" />
              </Button>
              {vm.downloadUrl && (
                <a href={vm.downloadUrl} download title="Download report">
                  <Button size="sm" variant="default">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Metadata */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Scene
              </p>
              <Link
                href={`/scenes/${vm.sceneId}`}
                className="mt-1 text-sm font-medium hover:underline"
              >
                {vm.sceneId}
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Task
              </p>
              <Link
                href={`/task-governance/${vm.taskId}`}
                className="mt-1 text-sm font-medium hover:underline"
              >
                {vm.taskId}
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Analysis Type
              </p>
              <p className="mt-1 text-sm font-medium">{vm.analysisType}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Generated
              </p>
              <p className="mt-1 text-sm font-medium">
                {new Date(vm.generatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vm.pageCount && (
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Page Count</p>
                <p className="mt-1 font-medium">{vm.pageCount} pages</p>
              </div>
            )}
            {vm.fileSize && (
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">File Size</p>
                <p className="mt-1 font-medium">{vm.fileSize}</p>
              </div>
            )}
            {vm.generatedBy && (
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Generated By</p>
                <p className="mt-1 font-medium">{vm.generatedBy}</p>
              </div>
            )}
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Format</p>
              <p className="mt-1 font-medium">{vm.format}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className="mt-1" variant={statusVariant(vm.status)}>
                {statusLabel(vm.status)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Sections */}
      {vm.sections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Report Sections</CardTitle>
            <CardDescription>
              {vm.sections.length} sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {vm.sections.map((section) => (
              <div key={section.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{section.title}</h3>
                    {section.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                    {section.contentPreview && (
                      <div className="mt-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground whitespace-pre-wrap break-words">
                        {section.contentPreview}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline" className="flex-shrink-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {vm.metadata && Object.keys(vm.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(vm.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/reports">
            <Button variant="outline">← Back to Reports</Button>
          </Link>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          {vm.downloadUrl && (
            <a href={vm.downloadUrl} download>
              <Button variant="default">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
