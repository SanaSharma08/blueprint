"use client";
import WireframeCanvas from "@/components/wireframe/WireframeCanvas";
import dagre from "@dagrejs/dagre";
import { useCallback, useMemo, useState } from "react";
import {
  MousePointer2,
  Sparkles,
  Maximize2,
} from "lucide-react";
import {
addEdge,
Background,
BackgroundVariant,
Controls,
MiniMap,
ReactFlow,
useEdgesState,
useNodesState,
useReactFlow,
type Connection,
type Edge,
type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ArchitectureNode from "@/components/canvas/ArchitectureNode";

const initialNodes: Node[] = [
{
id: "user",
type: "architecture",
position: { x: 80, y: 160 },
data: {
label: "Customer",
description: "People using the application",
category: "user",
},
},
{
id: "app",
type: "architecture",
position: { x: 380, y: 160 },
data: {
label: "Web Application",
description: "Main user-facing application",
category: "application",
},
},
{
id: "orders",
type: "architecture",
position: { x: 700, y: 80 },
data: {
label: "Order Service",
description: "Creates and manages customer orders",
category: "service",
},
},
{
id: "payments",
type: "architecture",
position: { x: 700, y: 270 },
data: {
label: "Payment Service",
description: "Handles payment processing",
category: "service",
},
},
{
id: "database",
type: "architecture",
position: { x: 1020, y: 160 },
data: {
label: "Application Database",
description: "Stores users, orders and transactions",
category: "database",
},
},
];

const initialEdges: Edge[] = [
{
id: "user-app",
source: "user",
target: "app",
animated: true,
},
{
id: "app-orders",
source: "app",
target: "orders",
},
{
id: "app-payments",
source: "app",
target: "payments",
},
{
id: "orders-db",
source: "orders",
target: "database",
},
{
id: "payments-db",
source: "payments",
target: "database",
},
];

function CanvasToolbar() {
  const { fitView } = useReactFlow();

  return (
    <aside className="absolute bottom-4 left-4 top-20 z-10 hidden w-14 flex-col items-center rounded-xl border border-black/10 bg-white/90 py-3 shadow-sm backdrop-blur-xl md:flex">
      <ToolButton
        icon={<MousePointer2 size={17} />}
        active
        title="Select"
      />

      <div className="my-3 h-px w-7 bg-black/10" />

      <ToolButton
        icon={<Maximize2 size={17} />}
        title="Fit canvas"
        onClick={() =>
          fitView({
            padding: 0.2,
            duration: 400,
          })
        }
      />
    </aside>
  );
}

export default function Home() {
  const [wireframe, setWireframe] = useState<any>(null);
const [isGeneratingUI, setIsGeneratingUI] = useState(false);
const [viewMode, setViewMode] = useState<"architecture" | "wireframe">(
  "architecture"
);
  const [selectedNode, setSelectedNode] = useState<any>(null);
const [prompt, setPrompt] = useState("");
const [wireframePrompt, setWireframePrompt] = useState("");
const [isGenerating, setIsGenerating] = useState(false);
const [error, setError] = useState("");
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

const generateWireframeFromPrompt = async () => {
  if (!wireframePrompt.trim() || isGeneratingUI) return;

  setIsGeneratingUI(true);
  setError("");

  try {
    const response = await fetch("/api/wireframe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        node: {
          id: "prompt-screen",
          type: "application",
          label: "Custom Screen",
          description: wireframePrompt,
        },
        architecture: {
          nodes: [],
          edges: [],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate UI");
    }

    setWireframe(data);
  } catch (err) {
    console.error(err);
    setError("Couldn't generate the wireframe. Try again.");
  } finally {
    setIsGeneratingUI(false);
  }
};

const moveWireframeElement = (
  id: string,
  x: number,
  y: number
) => {
  setWireframe((current: any) => {
    if (!current) return current;

    return {
      ...current,
      elements: current.elements.map(
        (element: any) =>
          element.id === id
            ? {
                ...element,
                x,
                y,
              }
            : element
      ),
    };
  });
};

const generateWireframe = async () => {
  if (!selectedNode || isGeneratingUI) return;

  setIsGeneratingUI(true);
  setError("");

  try {
    const response = await fetch("/api/wireframe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        node: {
          id: selectedNode.id,
          type: selectedNode.data.type,
          label: selectedNode.data.label,
          description: selectedNode.data.description,
        },

        architecture: {
          nodes: nodes.map((node) => ({
            id: node.id,
            type: node.data.type,
            label: node.data.label,
            description: node.data.description,
          })),

          edges: edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
            label: edge.label || "",
          })),
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate UI");
    }

    setWireframe(data);
    setViewMode("wireframe");
    setSelectedNode(null);
  } catch (err) {
    console.error(err);
    setError("Couldn't generate the wireframe. Try again.");
  } finally {
    setIsGeneratingUI(false);
  }
};

const sampleWireframe = [
  {
    id: "sidebar",
    type: "sidebar",
    x: 0,
    y: 0,
    width: 240,
    height: 900,
  },
  {
    id: "header",
    type: "header",
    x: 240,
    y: 0,
    width: 1200,
    height: 80,
  },
  {
    id: "card-1",
    type: "card",
    x: 280,
    y: 130,
    width: 240,
    height: 140,
  },
  {
    id: "card-2",
    type: "card",
    x: 550,
    y: 130,
    width: 240,
    height: 140,
  },
  {
    id: "card-3",
    type: "card",
    x: 820,
    y: 130,
    width: 240,
    height: 140,
  },
  {
    id: "table",
    type: "table",
    x: 280,
    y: 320,
    width: 900,
    height: 400,
  },
];
const exportArchitecture = () => {
  const architecture = {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.data.type,
      label: node.data.label,
      description: node.data.description,
      position: node.position,
    })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      label: edge.label || "",
    })),
  };

  const blob = new Blob(
    [JSON.stringify(architecture, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "blueprint-architecture.json";
  link.click();

  URL.revokeObjectURL(url);
};

const getLayoutedElements = (
  nodes: any[],
  edges: any[]
) => {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",
    nodesep: 80,
    ranksep: 160,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: 220,
      height: 110,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - 110,
        y: position.y - 55,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};

const generateArchitecture = async () => {
  if (!prompt.trim() || isGenerating) return;

  setIsGenerating(true);
  setError("");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        currentArchitecture: {
          nodes: nodes.map((node) => ({
            id: node.id,
            type: node.data.type,
            label: node.data.label,
            description: node.data.description,
          })),
          edges: edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
            label: edge.label || "",
          })),
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate architecture");
    }

    const generatedNodes = data.nodes.map(
      (node: {
        id: string;
        type: string;
        label: string;
        description: string;
      }) => ({
        id: node.id,
        type: "architecture",
        position: {
          x: Math.random() * 700,
          y: Math.random() * 450,
        },
        data: {
          label: node.label,
          type: node.type,
          description: node.description,
        },
      })
    );

    const generatedEdges = data.edges.map(
      (edge: {
        source: string;
        target: string;
        label?: string;
      }) => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label || "",
        animated: true,
      })
    );

    const layouted = getLayoutedElements(
    generatedNodes,
    generatedEdges
  );

  setNodes(layouted.nodes);
  setEdges(layouted.edges);
  } catch (err) {
    console.error(err);
    setError("Couldn't generate the architecture. Try again.");
  } finally {
    setIsGenerating(false);
  }
};


const nodeTypes = useMemo(
() => ({
architecture: ArchitectureNode,
}),
[]
);

const onConnect = useCallback(
(connection: Connection) =>
setEdges((currentEdges) => addEdge(connection, currentEdges)),
[setEdges]
);

return ( <main className="h-[100dvh] w-full overflow-hidden bg-[#f7f7f5] text-[#171717]">
<header className="absolute left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
      B
    </div>

    <div>
      <h1 className="text-sm font-semibold tracking-tight">
        Blueprint
      </h1>

      <p className="hidden text-xs text-neutral-400 sm:block">
        AI Architecture Workspace
      </p>
    </div>
  </div>

  <div className="flex items-center gap-2">
    <button
  onClick={exportArchitecture}
  className="hidden rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium transition hover:bg-neutral-50 sm:block"
>
  Export
</button>

    <button
      onClick={() => {
        document.querySelector<HTMLInputElement>("input")?.focus();
      }}
      className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
    >
      Ask AI
    </button>
  </div>
  <div className="absolute left-1/2 hidden -translate-x-1/2 rounded-lg border border-neutral-200 bg-neutral-100 p-1 sm:flex">
  <button
    onClick={() => setViewMode("architecture")}
    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
      viewMode === "architecture"
        ? "bg-white shadow-sm"
        : "text-neutral-500"
    }`}
  >
    Architecture
  </button>

  <button
    onClick={() => {
      if (wireframe) {
        setViewMode("wireframe");
      }
    }}
    disabled={!wireframe}
    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
      viewMode === "wireframe"
        ? "bg-white shadow-sm"
        : "text-neutral-500"
    } disabled:cursor-not-allowed disabled:opacity-40`}
  >
    Wireframe
  </button>
</div>
</header>

  {/* Desktop toolbar */}
<aside className="absolute bottom-4 left-4 top-20 z-10 hidden w-14 flex-col items-center rounded-xl border border-black/10 bg-white/90 py-3 shadow-sm backdrop-blur-xl md:flex">
  <ToolButton
    icon={<MousePointer2 size={17} />}
    active
  />
</aside>

  {/* Canvas */}
  <section className="absolute inset-0 pt-14">
    {viewMode === "architecture" ? (
  <ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onNodeClick={(_, node) => {
    setSelectedNode(node);
  }}
  nodeTypes={nodeTypes}
  fitView
  fitViewOptions={{
    padding: 0.2,
  }}
  minZoom={0.25}
  maxZoom={1.5}
  proOptions={{
    hideAttribution: true,
  }}
>
  <CanvasToolbar />

  <Background />
  <Controls />
  <MiniMap />
</ReactFlow>
) : (
  <WireframeCanvas
  elements={wireframe?.elements || []}
  onMove={moveWireframeElement}
/>
)}
  </section>

  {/* Mobile toolbar */}
<div className="absolute bottom-4 left-4 z-20 flex items-center rounded-xl border border-black/10 bg-white/95 p-1.5 shadow-lg backdrop-blur-xl md:hidden">
  <MobileTool
    icon={<MousePointer2 size={17} />}
    active
  />
</div>

  {/* Mobile AI */}
  <button className="absolute bottom-20 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg md:hidden">
    <Sparkles size={17} />
  </button>

  {/* AI Prompt */}
{viewMode === "architecture" ? (
  <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1rem)] max-w-3xl -translate-x-1/2 sm:bottom-6 sm:w-[calc(100%-2rem)]">
    <div className="rounded-2xl border border-neutral-200 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
      <div className="mb-2 hidden gap-2 overflow-x-auto px-1 pb-1 md:flex">
        {[
          "Build an e-commerce platform",
          "Create a food delivery app",
          "Design a social media platform",
        ].map((example) => (
          <button
            key={example}
            onClick={() => setPrompt(example)}
            className="shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-semibold">
          B
        </div>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              generateArchitecture();
            }
          }}
          placeholder="Describe your product or modify the architecture..."
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-neutral-400"
        />

        <button
          onClick={generateArchitecture}
          disabled={!prompt.trim() || isGenerating}
          className="shrink-0 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isGenerating ? "Building..." : "Generate"}
        </button>
      </div>

      <div className="mt-1 px-2 text-[10px] text-neutral-400 sm:text-xs">
        Press Enter to generate · Blueprint updates the architecture using AI
      </div>

      {error && (
        <p className="px-2 pb-1 pt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  </div>
) : (
  <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1rem)] max-w-2xl -translate-x-1/2 sm:bottom-6 sm:w-[calc(100%-2rem)]">
    <div className="rounded-2xl border border-neutral-200 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-semibold">
          UI
        </div>

        <input
          value={wireframePrompt}
          onChange={(e) => setWireframePrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              generateWireframeFromPrompt();
            }
          }}
          placeholder="Describe the UI you want to design..."
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-neutral-400"
        />

        <button
          onClick={generateWireframeFromPrompt}
          disabled={!wireframePrompt.trim() || isGeneratingUI}
          className="shrink-0 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isGeneratingUI ? "Designing..." : "Generate"}
        </button>
      </div>

      <div className="mt-1 px-2 text-[10px] text-neutral-400 sm:text-xs">
        Describe a screen and Blueprint will turn it into an editable wireframe.
      </div>

      {error && (
        <p className="px-2 pb-1 pt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  </div>
)}
{selectedNode && (
  <aside className="absolute right-4 top-20 z-40 w-72 rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
          {selectedNode.data.type}
        </p>

        <h2 className="mt-1 text-sm font-semibold text-neutral-900">
          {selectedNode.data.label}
        </h2>
      </div>

      <button
        onClick={() => setSelectedNode(null)}
        className="rounded-lg px-2 py-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
      >
        ×
      </button>
    </div>

    <p className="text-xs leading-5 text-neutral-500">
      {selectedNode.data.description ||
        "No description available for this component."}
    </p>

    <div className="mt-5 border-t border-neutral-100 pt-4">
      <p className="text-[10px] uppercase tracking-wider text-neutral-400">
        Node ID
      </p>

      <p className="mt-1 break-all font-mono text-[11px] text-neutral-600">
        {selectedNode.id}
      </p>
    </div>
    {/* Wireframe generation button */}
    <button
  onClick={generateWireframe}
  disabled={isGeneratingUI}
  className="mt-4 w-full rounded-xl bg-black px-3 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
>
  {isGeneratingUI ? "Designing UI..." : "Generate UI"}
</button>
    <button
  onClick={() => {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== selectedNode.id)
    );

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) =>
          edge.source !== selectedNode.id &&
          edge.target !== selectedNode.id
      )
    );

    setSelectedNode(null);
  }}
  className="mt-4 w-full rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
>
  Delete node
</button>
  </aside>
)}
</main>

);
}

function ToolButton({
  icon,
  active = false,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
        active
          ? "bg-black text-white"
          : "text-black/45 hover:bg-black/5 hover:text-black"
      }`}
    >
      {icon}
    </button>
  );
}

function MobileTool({
icon,
active = false,
}: {
icon: React.ReactNode;
active?: boolean;
}) {
return (
<button
className={`flex h-9 w-9 items-center justify-center rounded-lg ${
        active ? "bg-black text-white" : "text-black/50"
      }`}
>
{icon} </button>
);
}
