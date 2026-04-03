"use client";

import { useMemo, useState } from "react";
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
import { FileText, Search, Filter, Download } from "lucide-react";

export type ReportListViewModel = {
  reports: Array<{
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
  }>;
};

const statusVariant = (
  status: "Draft" | "Published" | "Archived",
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

export function ReportsListClient({ vm }: { vm: ReportListViewModel }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  const filteredReports = useMemo(() => {
    let filtered = vm.reports;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.sceneId.toLowerCase().includes(query) ||
          r.taskId.toLowerCase().includes(query) ||
          r.analysisType.toLowerCase().includes(query),
      );
    }

    // Filter by format
    if (selectedFormat) {
      filtered = filtered.filter((r) => r.format === selectedFormat);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    // Sort
    if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
      );
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [vm.reports, searchQuery, selectedFormat, selectedStatus, sortBy]);

  const formatStats = {
    PDF: vm.reports.filter((r) => r.format === "PDF").length,
    XLSX: vm.reports.filter((r) => r.format === "XLSX").length,
    JSON: vm.reports.filter((r) => r.format === "JSON").length,
  };

  const statusStats = {
    Published: vm.reports.filter((r) => r.status === "Published").length,
    Draft: vm.reports.filter((r) => r.status === "Draft").length,
    Archived: vm.reports.filter((r) => r.status === "Archived").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="mt-1 text-2xl font-bold">{vm.reports.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {statusStats.Published}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Draft</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {statusStats.Draft}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Archived</p>
              <p className="mt-1 text-2xl font-bold text-slate-600">
                {statusStats.Archived}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Box */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, scene, task, or analysis type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Format Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              <span>Format</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["PDF", "XLSX", "JSON"].map((fmt) => (
                <Button
                  key={fmt}
                  size="sm"
                  variant={selectedFormat === fmt ? "default" : "outline"}
                  onClick={() =>
                    setSelectedFormat(selectedFormat === fmt ? null : fmt)
                  }
                >
                  {fmt} ({formatStats[fmt as keyof typeof formatStats]})
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              <span>Status</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Published", "Draft", "Archived"].map((st) => (
                <Button
                  key={st}
                  size="sm"
                  variant={selectedStatus === st ? "default" : "outline"}
                  onClick={() =>
                    setSelectedStatus(selectedStatus === st ? null : st)
                  }
                >
                  {statusLabel(st as "Draft" | "Published" | "Archived")} (
                  {statusStats[st as keyof typeof statusStats]})
                </Button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Sort By</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortBy === "date" ? "default" : "outline"}
                onClick={() => setSortBy("date")}
              >
                Latest First
              </Button>
              <Button
                size="sm"
                variant={sortBy === "name" ? "default" : "outline"}
                onClick={() => setSortBy("name")}
              >
                By Name (A-Z)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reports</CardTitle>
          <CardDescription>
            Displaying {filteredReports.length} of {vm.reports.length} reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No reports found matching your filters
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/reports/${report.id}`}
                  className="block"
                >
                  <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <h3 className="font-medium truncate">
                            {report.name}
                          </h3>
                          <Badge variant={statusVariant(report.status)}>
                            {statusLabel(report.status)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {report.format}
                          </Badge>
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                          <div>
                            <span className="font-medium">Scene:</span>{" "}
                            {report.sceneId}
                          </div>
                          <div>
                            <span className="font-medium">Task:</span>{" "}
                            {report.taskId}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {report.analysisType}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Generated:{" "}
                          {new Date(report.generatedAt).toLocaleString()}
                          {report.pageCount && ` · ${report.pageCount} pages`}
                          {report.fileSize && ` · ${report.fileSize}`}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
