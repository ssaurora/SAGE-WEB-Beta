"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ManifestParameter = {
  key: string;
  value: string;
  type: "input" | "parameter" | "output";
  isEditable: boolean;
  description?: string;
  children?: ManifestParameter[];
};

export type GovernanceManifestTabProps = {
  parameters: ManifestParameter[];
  title?: string;
};

function ParameterTree({
  param,
  depth = 0,
}: {
  param: ManifestParameter;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = param.children && param.children.length > 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "input":
        return "bg-blue-50 border-blue-200";
      case "parameter":
        return "bg-purple-50 border-purple-200";
      case "output":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "input":
        return "outline" as const;
      case "parameter":
        return "secondary" as const;
      case "output":
        return "default" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div style={{ marginLeft: `${depth * 16}px` }}>
      <div
        className={`rounded-md border p-3 mb-2 transition ${getTypeColor(param.type)}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="rounded hover:bg-white/50 p-0.5"
                >
                  {expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-5" />}
              <p className="font-medium text-sm">{param.key}</p>
              <Badge
                variant={getTypeBadgeVariant(param.type)}
                className="text-xs"
              >
                {param.type}
              </Badge>
              {param.isEditable && (
                <Badge variant="outline" className="text-xs">
                  Editable
                </Badge>
              )}
            </div>
            {param.description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {param.description}
              </p>
            )}
          </div>
        </div>

        {!hasChildren && (
          <div className="mt-2 rounded-sm bg-white/60 px-2 py-1">
            <p className="text-xs font-mono break-words">{param.value}</p>
          </div>
        )}
      </div>

      {expanded &&
        hasChildren &&
        param.children?.map((child) => (
          <ParameterTree key={child.key} param={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export function GovernanceManifestTab({
  parameters,
  title = "Manifest",
}: GovernanceManifestTabProps) {
  const [collapseAll, setCollapseAll] = useState(false);

  const counts = {
    inputs: parameters.filter((p) => p.type === "input").length,
    parameters: parameters.filter((p) => p.type === "parameter").length,
    outputs: parameters.filter((p) => p.type === "output").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Inputs: {counts.inputs}</Badge>
          <Badge variant="secondary">Parameters: {counts.parameters}</Badge>
          <Badge variant="default">Outputs: {counts.outputs}</Badge>
        </div>
      </div>

      <div className="space-y-3">
        {parameters.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No manifest data available.
          </p>
        ) : (
          parameters.map((param) => (
            <ParameterTree key={param.key} param={param} />
          ))
        )}
      </div>
    </div>
  );
}
