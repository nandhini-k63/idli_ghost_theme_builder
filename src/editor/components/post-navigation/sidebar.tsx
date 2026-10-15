import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePostNavigationProps, PostNavigationProps } from "./schema";
import { Sparkles, AlertTriangle, AlignLeft, AlignCenter, AlignRight, Split } from "lucide-react";
import {
  ColumnsControl,
  ResponsiveToggle,
} from "../shared/GhostCoreLayoutControls";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolvePostNavigationProps(block.props);

  const updateProp = <K extends keyof ReturnType<typeof resolvePostNavigationProps>>(
    key: K,
    value: ReturnType<typeof resolvePostNavigationProps>[K]
  ) => {
    const existingGeneral = (block.props?.general || {}) as Record<string, unknown>;
    const extra: Record<string, unknown> = {};
    if (key === "layoutStyle") {
      extra.layout = value;
    }
    onChangeProps({
      [key]: value,
      ...extra,
      general: {
        ...existingGeneral,
        [key]: value,
        ...extra,
      },
    });
  };

  const alignOptions = [
    { id: "split", label: "Split", icon: <Split size={12} /> },
    { id: "left", label: "Left", icon: <AlignLeft size={12} /> },
    { id: "center", label: "Center", icon: <AlignCenter size={12} /> },
    { id: "right", label: "Right", icon: <AlignRight size={12} /> },
  ] as const;

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Post Context Badge */}
      <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md p-2.5 flex items-start gap-2">
        <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-snug">
          <strong className="font-semibold block mb-0.5">Template Context</strong>
          Only works on Post or Page templates (requires ambient Ghost post context).
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Sparkles size={13} className="text-blue-600 shrink-0" />
          <span>Post Navigation</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Provides Previous and Next post links using Ghost&apos;s native navigation helpers.
        </p>
      </div>

      {/* Layout & Style */}
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-brand-ink">Layout Style</span>
          <select
            value={p.layoutStyle}
            onChange={(e) => updateProp("layoutStyle", e.target.value as PostNavigationProps["layoutStyle"])}
            className="w-full text-xs bg-brand-canvas border border-brand-hairline rounded-md px-2 py-1.5 focus:border-brand-primary outline-none"
          >
            <option value="split">Split (Side by side)</option>
            <option value="stacked">Stacked (Vertical)</option>
            <option value="minimal">Minimal (Text links)</option>
            <option value="centered-arrows">Centered Arrows</option>
            <option value="image-background">Image Background (Editorial)</option>
            <option value="large-typography">Large Typography (Modern)</option>
          </select>
        </label>

        {/* Columns Control */}
        <ColumnsControl
          label="Columns on Desktop"
          columns={p.columns}
          options={[1, 2]}
          onChange={(cols) => updateProp("columns", cols as 1 | 2)}
        />

        {/* Alignment Control */}
        <div className="flex flex-col gap-1.5 select-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-brand-body dark:text-zinc-300">
              Text Alignment
            </span>
            <span className="text-[10px] font-mono capitalize text-brand-mute">
              {p.alignment}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 bg-brand-canvas-soft dark:bg-neutral-800 p-0.5 rounded border border-brand-hairline dark:border-neutral-700">
            {alignOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateProp("alignment", opt.id)}
                className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-sm text-[11px] font-sans font-medium transition-all cursor-pointer ${
                  p.alignment === opt.id
                    ? "bg-white dark:bg-neutral-900 text-brand-ink dark:text-white shadow-xs font-semibold"
                    : "text-brand-mute hover:text-brand-ink dark:hover:text-white"
                }`}
              >
                {opt.icon}
                <span className="text-[10px]">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Mobile Stack */}
        <ResponsiveToggle
          label="Stack vertically on mobile"
          description="Collapses 2-column post cards into a clean vertical stack on mobile devices."
          checked={p.stackOnMobile}
          onChange={(val) => updateProp("stackOnMobile", val)}
        />

        {/* Feature toggles */}
        <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-brand-hairline">
          <input
            type="checkbox"
            checked={p.showImage}
            onChange={(e) => updateProp("showImage", e.target.checked)}
            className="rounded border-brand-hairline"
          />
          <span className="text-[11px] font-medium text-brand-body">Show feature image thumbnail</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showExcerpt}
            onChange={(e) => updateProp("showExcerpt", e.target.checked)}
            className="rounded border-brand-hairline"
          />
          <span className="text-[11px] font-medium text-brand-body">Show post excerpt</span>
        </label>
      </div>
    </div>
  );
};
