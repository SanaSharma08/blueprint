"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Home,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";

type WireframeElementProps = {
  element: {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
  };

  onMove: (id: string, x: number, y: number) => void;
};

export default function WireframeElement({
  element,
  onMove,
}: WireframeElementProps) {
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);

    const startX = event.clientX;
    const startY = event.clientY;

    const initialX = element.x;
    const initialY = element.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      onMove(element.id, initialX + dx, initialY + dy);
    };

    const handlePointerUp = () => {
      setDragging(false);

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const baseStyle = {
    position: "absolute" as const,
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
  };

  const commonClasses = `
    select-none
    ${dragging ? "ring-2 ring-blue-500 ring-offset-1" : ""}
  `;

  const dragClasses = `
    cursor-grab
    active:cursor-grabbing
    ${commonClasses}
  `;

  switch (element.type) {
    case "navbar":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`flex items-center justify-between border-b border-neutral-200 bg-white px-6 ${dragClasses}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
              B
            </div>

            <span className="text-sm font-semibold text-neutral-900">
              Blueprint
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <span className="text-xs text-neutral-500">Dashboard</span>
            <span className="text-xs text-neutral-500">Analytics</span>
            <span className="text-xs text-neutral-500">Projects</span>
          </div>

          <div className="flex items-center gap-3">
            <Bell size={15} className="text-neutral-500" />

            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-100" />
              <span className="text-xs font-medium text-neutral-700">
                Sana
              </span>
              <ChevronDown size={13} className="text-neutral-400" />
            </div>
          </div>
        </div>
      );

    case "sidebar":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`border-r border-neutral-200 bg-white p-4 ${dragClasses}`}
        >
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
              B
            </div>

            <span className="text-sm font-semibold text-neutral-900">
              Dashboard
            </span>
          </div>

          <div className="space-y-1">
            <SidebarItem
              icon={<LayoutDashboard size={15} />}
              text="Overview"
              active
            />

            <SidebarItem
              icon={<ShoppingBag size={15} />}
              text="Orders"
            />

            <SidebarItem
              icon={<Users size={15} />}
              text="Customers"
            />

            <SidebarItem
              icon={<CreditCard size={15} />}
              text="Payments"
            />

            <SidebarItem
              icon={<Wallet size={15} />}
              text="Revenue"
            />
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-5">
            <SidebarItem
              icon={<Settings size={15} />}
              text="Settings"
            />
          </div>
        </div>
      );

    case "header":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`flex items-center justify-between border-b border-neutral-200 bg-white px-7 ${dragClasses}`}
        >
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
              {element.text || "Analytics Dashboard"}
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Monitor your business performance and activity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600">
              Export
            </button>

            <button className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white">
              Create Report
            </button>
          </div>
        </div>
      );

    case "card":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`rounded-xl border border-neutral-200 bg-white p-5 shadow-sm ${dragClasses}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              {element.text || "Total Revenue"}
            </span>

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
              <Wallet size={14} className="text-blue-600" />
            </div>
          </div>

          <div className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
            ₹12,50,000
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-600">
              +18.4%
            </span>

            <span className="text-xs text-neutral-400">
              vs last month
            </span>
          </div>
        </div>
      );

    case "button":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`flex items-center justify-center rounded-lg bg-black px-4 text-xs font-medium text-white shadow-sm ${dragClasses}`}
        >
          {element.text || "Continue"}
        </div>
      );

    case "input":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 shadow-sm ${dragClasses}`}
        >
          <Search size={14} className="text-neutral-400" />

          <span className="text-xs text-neutral-400">
            {element.text || "Search..."}
          </span>
        </div>
      );

    case "table":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm ${dragClasses}`}
        >
          <div className="border-b border-neutral-200 px-5 py-4">
            <div className="text-sm font-semibold text-neutral-900">
              Recent Transactions
            </div>

            <div className="mt-1 text-xs text-neutral-400">
              Latest payment activity
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {[
            ["Rahul Sharma", "₹25,000", "Completed", "28 Sep"],
            ["Neha Kapoor", "₹1,25,000", "Completed", "27 Sep"],
            ["Aarav Mehta", "₹42,500", "Pending", "26 Sep"],
            ["Priya Singh", "₹85,000", "Completed", "25 Sep"],
          ].map(([name, amount, status, date]) => (
            <div
              key={name}
              className="grid grid-cols-4 items-center border-b border-neutral-100 px-5 py-3 text-xs"
            >
              <span className="font-medium text-neutral-700">
                {name}
              </span>

              <span className="text-neutral-600">
                {amount}
              </span>

              <span
                className={
                  status === "Completed"
                    ? "flex items-center gap-1 text-emerald-600"
                    : "text-amber-600"
                }
              >
                {status === "Completed" && (
                  <CheckCircle2 size={12} />
                )}
                {status}
              </span>

              <span className="text-neutral-400">
                {date}
              </span>
            </div>
          ))}
        </div>
      );

    case "text":
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`flex items-center text-sm font-medium text-neutral-700 ${dragClasses}`}
        >
          {element.text || "Section heading"}
        </div>
      );

    default:
      return (
        <div
          style={baseStyle}
          onPointerDown={handlePointerDown}
          className={`rounded-lg border border-dashed border-neutral-300 bg-neutral-50 ${dragClasses}`}
        />
      );
  }
}

function SidebarItem({
  icon,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs ${
        active
          ? "bg-blue-50 font-medium text-blue-700"
          : "text-neutral-500"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}