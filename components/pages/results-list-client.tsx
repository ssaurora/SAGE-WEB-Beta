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
	const results = vm.reports;

	const filteredResults = useMemo(() => {
		let filtered = results;

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
	}, [results, searchQuery, selectedFormat, selectedStatus, sortBy]);

	const formatStats = {
		PDF: results.filter((r) => r.format === "PDF").length,
		XLSX: results.filter((r) => r.format === "XLSX").length,
		JSON: results.filter((r) => r.format === "JSON").length,
	};

	const statusStats = {
		Published: results.filter((r) => r.status === "Published").length,
		Draft: results.filter((r) => r.status === "Draft").length,
		Archived: results.filter((r) => r.status === "Archived").length,
	};

	return (
		<div className="space-y-4">
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">Total Results</p>
							<p className="mt-1 text-2xl font-bold">{results.length}</p>
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
						Displaying {filteredResults.length} of {results.length} results
					</CardDescription>
				</CardHeader>
				<CardContent>
					{filteredResults.length === 0 ? (
						<div className="rounded-md border border-dashed p-8 text-center">
							<FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
							<p className="mt-2 text-sm text-muted-foreground">
								No results found matching your filters
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{filteredResults.map((result) => (
								<Link
									key={result.id}
									href={`/results/${result.id}?from=${TASK_CONTEXT_FROM.Results}&taskId=${result.taskId}`}
									className="block"
								>
									<div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0 flex-1">
												<div className="flex flex-wrap items-center gap-2">
													<FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
													<h3 className="truncate font-medium">{result.name}</h3>
													<Badge variant={statusVariant(result.status)}>
														{statusLabel(result.status)}
													</Badge>
													<Badge variant="outline" className="text-xs">
														{result.format}
													</Badge>
												</div>
												<div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
													<div>
														<span className="font-medium">Scene:</span>{" "}
														{result.sceneId}
													</div>
													<div>
														<span className="font-medium">Task:</span>{" "}
														{result.taskId}
													</div>
													<div>
														<span className="font-medium">Type:</span>{" "}
														{result.analysisType}
													</div>
												</div>
												<div className="mt-1 text-xs text-muted-foreground">
													Generated: {new Date(result.generatedAt).toLocaleString()}
													{result.pageCount && ` · ${result.pageCount} pages`}
													{result.fileSize && ` · ${result.fileSize}`}
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
