import { headers } from "next/headers";
import type { TaskGovernanceViewModel, TaskListItem } from "@/lib/mock/task";

async function getBaseUrl() {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Request failed: ${path} (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getTaskListViewModel() {
  return fetchJson<TaskListItem[]>("/api/tasks");
}

export async function getTaskGovernanceViewModel(taskId: string) {
  return fetchJson<TaskGovernanceViewModel>(`/api/tasks/${taskId}/governance`);
}
