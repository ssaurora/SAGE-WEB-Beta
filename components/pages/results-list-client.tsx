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
import type { ResultListViewModel } from "@/lib/contracts/result";
import { TASK_CONTEXT_FROM } from "@/lib/navigation/task-context";

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

export function ResultsListClient({ vm }: { vm: ResultListViewModel }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<"date" | "name">("date");

	const filteredReports = useMemo(() => {
		let filtered = vm.reports;

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

		if (selectedFormat) {
			filtered = filtered.filter((r) => r.format === selectedFormat);
		}

		if (selectedStatus) {
			filtered = filtered.filter((r) => r.status === selectedStatus);
		}

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
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">Total Results</p>
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

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Search & Filter</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
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

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Results</CardTitle>
					<CardDescription>
						Displaying {filteredReports.length} of {vm.reports.length} results
					</CardDescription>
				</CardHeader>
				<CardContent>
					{filteredReports.length === 0 ? (
						<div className="rounded-md border border-dashed p-8 text-center">
							<FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
							<p className="mt-2 text-sm text-muted-foreground">
								No results found matching your filters
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{filteredReports.map((report) => (
								<Link
									key={report.id}
									href={`/results/${report.id}?from=${TASK_CONTEXT_FROM.Results}&taskId=${report.taskId}`}
									className="block"
								>
									<div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0 flex-1">
												<div className="flex flex-wrap items-center gap-2">
													<FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
													<h3 className="truncate font-medium">{report.name}</h3>
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
													Generated: {new Date(report.generatedAt).toLocaleString()}
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
