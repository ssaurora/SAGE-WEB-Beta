"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GovernanceManifestTab } from "@/components/pages/governance-manifest-tab";

type GovernanceEvidenceTabsProps = {
  requiredActions: string[];
  missingRequiredInputs: string[];
  failureSummary?: string | null;
  suggestedFixes: string[];
  manifestSummary: {
    analysisType: string;
    modelName: string;
    requiredInputsReady: string;
    runtimeProfile: string;
  };
  artifacts: string[];
  lifecycleEvents: string[];
  auditSummary: string;
};

type TabKey = "blocking" | "manifest" | "artifacts" | "timeline" | "audit";

const tabOptions: Array<{ key: TabKey; label: string }> = [
  { key: "blocking", label: "Blocking" },
  { key: "manifest", label: "Manifest" },
  { key: "artifacts", label: "Artifacts" },
  { key: "timeline", label: "Timeline" },
  { key: "audit", label: "Audit" },
];

export function GovernanceEvidenceTabs({
  requiredActions,
  missingRequiredInputs,
  failureSummary,
  suggestedFixes,
  manifestSummary,
  artifacts,
  lifecycleEvents,
  auditSummary,
}: GovernanceEvidenceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("blocking");

  const timelinePreview = useMemo(
    () => lifecycleEvents.slice(0, 3),
    [lifecycleEvents],
  );
  const hasMoreTimeline = lifecycleEvents.length > timelinePreview.length;

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {tabOptions.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              size="sm"
              variant={activeTab === tab.key ? "default" : "outline"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "blocking" ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Required Actions
              </p>
              {requiredActions.length === 0 ? (
                <p className="text-sm text-muted-foreground">当前无必做动作</p>
              ) : (
                <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                  {requiredActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Missing Required Inputs
              </p>
              {missingRequiredInputs.length === 0 ? (
                <p className="text-sm text-muted-foreground">无缺失输入</p>
              ) : (
                <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                  {missingRequiredInputs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Suggested Fixes
              </p>
              {suggestedFixes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  当前无建议修复项
                </p>
              ) : (
                <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                  {suggestedFixes.map((fix) => (
                    <li key={fix}>{fix}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Failure Summary
              </p>
              {failureSummary ? (
                <p className="rounded-md border border-amber-500/50 bg-amber-500/5 p-3 text-sm text-muted-foreground">
                  {failureSummary}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">无失败摘要</p>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "manifest" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Analysis Type
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {manifestSummary.analysisType}
                </p>
              </div>
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Model
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {manifestSummary.modelName}
                </p>
              </div>
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Required Inputs
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {manifestSummary.requiredInputsReady}
                </p>
              </div>
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Runtime Profile
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {manifestSummary.runtimeProfile}
                </p>
              </div>
            </div>

            <details className="rounded-md border p-3">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                展开 manifest 树状详情
              </summary>
              <div className="mt-3">
                <GovernanceManifestTab
                  parameters={[
                    {
                      key: "analysisType",
                      value: manifestSummary.analysisType,
                      type: "parameter",
                      isEditable: false,
                      description: "Analysis Type",
                      children: [],
                    },
                    {
                      key: "modelName",
                      value: manifestSummary.modelName,
                      type: "parameter",
                      isEditable: false,
                      description: "Model",
                      children: [],
                    },
                    {
                      key: "requiredInputs",
                      value: manifestSummary.requiredInputsReady,
                      type: "input",
                      isEditable: false,
                      description: "Required Inputs",
                      children: missingRequiredInputs.map((input) => ({
                        key: `input-${input}`,
                        value: "missing",
                        type: "input",
                        isEditable: false,
                        description: input,
                        children: [],
                      })),
                    },
                    {
                      key: "runtimeProfile",
                      value: manifestSummary.runtimeProfile,
                      type: "parameter",
                      isEditable: false,
                      description: "Runtime Profile",
                      children: [],
                    },
                  ]}
                />
              </div>
            </details>
          </div>
        ) : null}

        {activeTab === "artifacts" ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Artifacts
            </p>
            {artifacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无工件</p>
            ) : (
              <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {artifacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {activeTab === "timeline" ? (
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Timeline Preview
              </p>
              <div className="space-y-2">
                {timelinePreview.map((event) => (
                  <p
                    key={event}
                    className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
                  >
                    {event}
                  </p>
                ))}
              </div>
            </div>
            {hasMoreTimeline ? (
              <details className="rounded-md border p-3">
                <summary className="cursor-pointer text-sm font-medium text-foreground">
                  查看完整时间线
                </summary>
                <div className="mt-3 space-y-2">
                  {lifecycleEvents.map((event) => (
                    <p
                      key={event}
                      className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
                    >
                      {event}
                    </p>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        ) : null}

        {activeTab === "audit" ? (
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Audit Summary
              </p>
              <p className="rounded-md border p-3 text-sm text-muted-foreground">
                {auditSummary}
              </p>
            </div>
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                查看完整审计
              </summary>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{auditSummary}</p>
              </div>
            </details>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
