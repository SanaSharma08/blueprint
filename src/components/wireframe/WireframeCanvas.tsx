"use client";

import WireframeElement from "./WireframeElement";

type WireframeElementData = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
};

type WireframeCanvasProps = {
  elements: WireframeElementData[];

  onMove: (
    id: string,
    x: number,
    y: number
  ) => void;
};

export default function WireframeCanvas({
  elements,
  onMove,
}: WireframeCanvasProps) {
  return (
    <div className="h-full w-full overflow-auto bg-neutral-100">
      <div className="flex min-h-full w-max min-w-full justify-start px-8 pb-[220px] pt-8 xl:justify-center">
        <div
          className="relative mb-20 min-h-[900px] w-[1440px] shrink-0 overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          style={{
            backgroundImage:
              "linear-gradient(#f1f1f1 1px, transparent 1px), linear-gradient(90deg, #f1f1f1 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {elements.map((element) => (
            <WireframeElement
              key={element.id}
              element={element}
              onMove={onMove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}