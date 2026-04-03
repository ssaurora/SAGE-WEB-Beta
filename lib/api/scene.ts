import { headers } from "next/headers";
import type {
  SceneAuditPageViewModel,
  SceneOverviewPageViewModel,
  SceneResultsPageViewModel,
  SceneTaskRunsPageViewModel,
  WorkbenchPageViewModel,
} from "@/lib/mock/scene";

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

export async function getSceneOverviewViewModel(sceneId: string) {
  return fetchJson<SceneOverviewPageViewModel>(
    `/api/scenes/${sceneId}/overview`,
  );
}

export async function getSceneWorkbenchViewModel(sceneId: string) {
  return fetchJson<WorkbenchPageViewModel>(`/api/scenes/${sceneId}/workbench`);
}

export async function getSceneTaskRunsViewModel(sceneId: string) {
  return fetchJson<SceneTaskRunsPageViewModel>(
    `/api/scenes/${sceneId}/task-runs`,
  );
}

export async function getSceneResultsViewModel(sceneId: string) {
  return fetchJson<SceneResultsPageViewModel>(`/api/scenes/${sceneId}/results`);
}

export async function getSceneAuditViewModel(sceneId: string) {
  return fetchJson<SceneAuditPageViewModel>(`/api/scenes/${sceneId}/audit`);
}
