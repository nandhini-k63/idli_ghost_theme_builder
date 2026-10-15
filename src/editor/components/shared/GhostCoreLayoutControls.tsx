"use client";

import React from "react";
import { AlignLeft, AlignCenter, AlignRight, Smartphone, Columns as ColumnsIcon } from "lucide-react";

export type HorizontalAlignment = "left" | "center" | "right";

interface AlignmentControlProps {
  label?: string;
  alignment: HorizontalAlignment;
  onChange: (align: HorizontalAlignment) => void;
}

export function AlignmentControl({
  label = "Alignment",
  alignment = "left",
  onChange,
}: AlignmentControlProps) {
  const options: { id: HorizontalAlignment; label: string; icon: React.ReactNode }[] = [
    { id: "left", label: "Left", icon: <AlignLeft size={13} /> },
    { id: "center", label: "Center", icon: <AlignCenter size={13} /> },
    { id: "right", label: "Right", icon: <AlignRight size={13} /> },
  ];

  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-sans font-semibold text-brand-body dark:text-zinc-300">
          {label}
        </label>
        <span className="text-[10px] font-mono capitalize text-brand-mute">
          {alignment}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft dark:bg-neutral-800 p-0.5 rounded border border-brand-hairline dark:border-neutral-700">
        {options.map((opt) => {
          const isActive = alignment === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-sm text-xs font-sans font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-neutral-900 text-brand-ink dark:text-white shadow-xs font-semibold"
                  : "text-brand-mute hover:text-brand-ink dark:hover:text-white"
              }`}
              title={`Align ${opt.label}`}
            >
              {opt.icon}
              <span className="text-[10px]">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ColumnsControlProps {
  label?: string;
  columns: number;
  options?: number[];
  onChange: (cols: number) => void;
}

export function ColumnsControl({
  label = "Columns Layout",
  columns,
  options = [1, 2, 3, 4],
  onChange,
}: ColumnsControlProps) {
  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-sans font-semibold text-brand-body dark:text-zinc-300 flex items-center gap-1.5">
          <ColumnsIcon size={12} className="text-brand-mute" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] font-mono text-brand-mute">
          {columns} {columns === 1 ? "Col" : "Cols"}
        </span>
      </div>
      <div className="flex bg-brand-canvas-soft dark:bg-neutral-800 p-0.5 rounded border border-brand-hairline dark:border-neutral-700 gap-1">
        {options.map((cols) => {
          const isActive = columns === cols;
          return (
            <button
              key={cols}
              type="button"
              onClick={() => onChange(cols)}
              className={`flex-1 py-1 text-[11px] font-sans font-medium rounded-sm transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-neutral-900 text-brand-ink dark:text-white shadow-xs font-semibold"
                  : "text-brand-mute hover:text-brand-ink dark:hover:text-white"
              }`}
            >
              {cols} {cols === 1 ? "Col" : "Cols"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ResponsiveToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ResponsiveToggle({
  label,
  description,
  checked,
  onChange,
}: ResponsiveToggleProps) {
  return (
    <div className="flex items-start justify-between gap-2 py-1 select-none">
      <div className="flex flex-col">
        <span className="text-[11px] font-sans font-medium text-brand-body dark:text-zinc-300 flex items-center gap-1.5">
          <Smartphone size={12} className="text-brand-mute shrink-0" />
          <span>{label}</span>
        </span>
        {description && (
          <span className="text-[10px] text-brand-mute leading-normal mt-0.5">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors cursor-pointer ${
          checked ? "bg-brand-primary dark:bg-white" : "bg-gray-200 dark:bg-neutral-700"
        }`}
        aria-label={label}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform ${
            checked
              ? "translate-x-3.5 bg-white dark:bg-neutral-900"
              : "translate-x-0 bg-white dark:bg-neutral-400"
          }`}
        />
      </button>
    </div>
  );
}

interface MaxWidthControlProps {
  label?: string;
  maxWidth: string;
  onChange: (val: string) => void;
  options?: { label: string; value: string }[];
}

export function MaxWidthControl({
  label = "Container Width",
  maxWidth,
  onChange,
  options,
}: MaxWidthControlProps) {
  const presets = options || [
    { label: "Narrow (680px)", value: "680px" },
    { label: "Medium (820px)", value: "820px" },
    { label: "Wide (1024px)", value: "1024px" },
    { label: "Full (100%)", value: "100%" },
  ];

  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-sans font-semibold text-brand-body dark:text-zinc-300">
          {label}
        </label>
        <span className="text-[10px] font-mono text-brand-mute">{maxWidth}</span>
      </div>
      <select
        value={presets.some((p) => p.value === maxWidth) ? maxWidth : "custom"}
        onChange={(e) => {
          if (e.target.value !== "custom") onChange(e.target.value);
        }}
        className="w-full px-2.5 py-1.5 border border-brand-hairline dark:border-neutral-700 rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft dark:bg-neutral-800 text-brand-ink dark:text-white"
      >
        {presets.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
        {!presets.some((p) => p.value === maxWidth) && (
          <option value="custom">Custom ({maxWidth})</option>
        )}
      </select>
    </div>
  );
}
