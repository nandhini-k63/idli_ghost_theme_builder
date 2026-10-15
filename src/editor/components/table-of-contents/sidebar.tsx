import React from "react";
import { BuilderBlock } from "@/types/theme";
import { TOCProps, defaultProps } from "./schema";
import { BackgroundControls } from "../shared/BackgroundControls";
import { Zap } from "lucide-react";

const Switch = ({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors ${
      checked ? "bg-blue-600" : "bg-gray-200 dark:bg-neutral-700"
    }`}
  >
    <div
      className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${
        checked ? "translate-x-3.5" : "translate-x-0"
      }`}
    />
  </button>
);

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = { ...defaultProps, ...block.props } as TOCProps;

  return (
    <div className="flex flex-col gap-5 text-brand-ink">
      {/* Ghost Engine Info */}
      <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-md flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
          <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            Dynamic Post Scanner
          </span>
        </div>
        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-normal">
          In Ghost themes, this component dynamically detects all headings inside <code className="px-1 py-0.5 bg-amber-100/60 dark:bg-amber-900/60 rounded font-mono text-[10px]">.gh-content</code> at runtime and auto-highlights the reader&apos;s current scroll position.
        </p>
      </div>

      {/* General Settings */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          General Options
        </h4>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">TOC Title</label>
          <input
            type="text"
            value={p.title || ""}
            onChange={(e) => onChangeProps({ title: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs bg-brand-canvas-soft focus:outline-none"
            placeholder="e.g. Table of Contents"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">Heading Depth</label>
          <select
            value={p.headingSelector || "h2-h3"}
            onChange={(e) => onChangeProps({ headingSelector: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs bg-brand-canvas-soft focus:outline-none"
          >
            <option value="h2">H2 Headings Only (Broad overview)</option>
            <option value="h2-h3">H2 and H3 Subheadings (Recommended)</option>
            <option value="h2-h3-h4">H2, H3, and H4 (Detailed documentation)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">Layout Presentation</label>
          <select
            value={p.layoutMode || "inline-card"}
            onChange={(e) => onChangeProps({ layoutMode: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs bg-brand-canvas-soft focus:outline-none"
          >
            <option value="inline-card">Inline Article Card</option>
            <option value="sticky-sidebar">Sticky Sidebar Column</option>
          </select>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-col gap-3 border-t border-brand-hairline pt-4">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          Interactive Features
        </h4>

        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-body">Show Numbered Prefixes (1., 1.1)</span>
          <Switch
            checked={!!p.numbered}
            onChange={(val) => onChangeProps({ numbered: val })}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-body">Collapsible Accordion</span>
          <Switch
            checked={!!p.collapsible}
            onChange={(val) => onChangeProps({ collapsible: val })}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-body">Show Reading Progress Meter</span>
          <Switch
            checked={!!p.showReadingProgress}
            onChange={(val) => onChangeProps({ showReadingProgress: val })}
          />
        </div>
      </div>

      {/* Background Styling */}
      {onChangeStyles && (
        <div className="border-t border-brand-hairline pt-4">
          <BackgroundControls styles={block.styles || {}} onChangeStyles={onChangeStyles} />
        </div>
      )}
    </div>
  );
};
