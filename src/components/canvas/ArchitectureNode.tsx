"use client";

import {
  AppWindow,
  Boxes,
  Database,
  Globe,
  UserRound,
  Workflow,
} from "lucide-react";
import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

const nodeConfig = {
  user: {
    icon: UserRound,
    label: "User",
    color: "bg-blue-50 text-blue-600",
    handle: "bg-blue-500",
  },
  application: {
    icon: AppWindow,
    label: "Application",
    color: "bg-violet-50 text-violet-600",
    handle: "bg-violet-500",
  },
  feature: {
    icon: Boxes,
    label: "Feature",
    color: "bg-amber-50 text-amber-600",
    handle: "bg-amber-500",
  },
  service: {
    icon: Workflow,
    label: "Service",
    color: "bg-emerald-50 text-emerald-600",
    handle: "bg-emerald-500",
  },
  database: {
    icon: Database,
    label: "Database",
    color: "bg-rose-50 text-rose-600",
    handle: "bg-rose-500",
  },
  external: {
    icon: Globe,
    label: "External",
    color: "bg-slate-100 text-slate-600",
    handle: "bg-slate-500",
  },
};

type ArchitectureNodeData = {
  label: string;
  description?: string;
  category?: keyof typeof nodeConfig;
};

type ArchitectureNodeType = Node<ArchitectureNodeData>;

export default function ArchitectureNode({
  data,
}: NodeProps<ArchitectureNodeType>) {
  const category =
    data.category || "feature";

  const config = nodeConfig[category];
  const Icon = config.icon;

  return (
    <div className="group relative w-[210px] overflow-visible rounded-xl border border-black/10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:border-black/20 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]">
      <Handle
        type="target"
        position={Position.Top}
        className={`!h-2.5 !w-2.5 !border-2 !border-white ${config.handle}`}
      />

      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.color}`}
          >
            <Icon size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-black/35">
              {config.label}
            </div>

            <div className="truncate text-sm font-semibold text-black/80">
              {data.label}
            </div>
          </div>
        </div>

        {data.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-black/45">
            {data.description}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={`!h-2.5 !w-2.5 !border-2 !border-white ${config.handle}`}
      />
    </div>
  );
}