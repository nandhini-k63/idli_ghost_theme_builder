import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { TOCProps, defaultProps } from "./schema";
import { getBackgroundStyle } from "../shared/background";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { ListTree, ChevronDown, ChevronUp, Zap, BookOpen } from "lucide-react";

export const CanvasElement = ({ block }: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  const p = { ...defaultProps, ...block.props } as TOCProps;
  const [isExpanded, setIsExpanded] = useState<boolean>(p.defaultExpanded ?? true);
  const bgStyle = getBackgroundStyle(block.styles);

  const mockHeadings = [
    { level: 2, text: "Getting Started with Ghost CMS", num: "1." },
    { level: 3, text: "Theme Architecture & File Hierarchy", num: "1.1" },
    { level: 3, text: "Configuring Native Membership Tiers", num: "1.2" },
    { level: 2, text: "Designing Dynamic Components", num: "2." },
    { level: 3, text: "AST Compilation & Handlebars Helpers", num: "2.1" },
    { level: 2, text: "Production Testing and Verification", num: "3." },
  ];

  return (
    <div
      style={bgStyle}
      className={`w-full my-6 border border-brand-hairline rounded-lg p-5 font-sans select-none transition-all duration-200 ${
        p.layoutMode === "sticky-sidebar"
          ? "max-w-xs shadow-md"
          : "max-w-2xl mx-auto shadow-sm"
      }`}
    >
      {/* Builder Indicator */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-brand-hairline">
        <div className="flex items-center gap-2">
          <ListTree size={16} className="text-brand-ink" />
          <span className="text-xs font-bold text-brand-ink uppercase tracking-wider">
            {p.title || "Table of Contents"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {p.showReadingProgress && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand-canvas border border-brand-hairline text-brand-body">
              Reading 45%
            </span>
          )}

          {p.collapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-brand-mute hover:text-brand-ink transition-colors"
              aria-label="Toggle Table of Contents"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Reading Progress Line */}
      {p.showReadingProgress && (
        <div className="w-full h-1 bg-brand-hairline rounded-full mb-3 overflow-hidden">
          <div className="h-full bg-brand-ink rounded-full transition-all duration-300 w-[45%]" />
        </div>
      )}

      {/* Dynamic Content Preview */}
      {isExpanded ? (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={11} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-mono uppercase text-brand-mute tracking-wider">
              Scans live article headings ({p.headingSelector})
            </span>
          </div>

          <ul className="space-y-1.5 text-xs text-brand-body">
            {mockHeadings.map((h, idx) => (
              <li
                key={idx}
                className={`flex items-baseline gap-2 py-0.5 rounded px-1.5 transition-colors cursor-pointer hover:bg-brand-canvas hover:text-brand-ink ${
                  h.level === 3 ? "pl-5 text-[11px]" : "font-medium text-brand-ink"
                }`}
              >
                {p.numbered && (
                  <span className="font-mono text-[10px] text-brand-mute shrink-0">
                    {h.num}
                  </span>
                )}
                <span className="truncate">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-brand-mute italic">Collapsed view (click chevron to expand)</p>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-2.5 border-t border-brand-hairline flex items-center justify-between text-[10px] text-brand-mute">
        <span className="flex items-center gap-1">
          <BookOpen size={11} />
          Auto-scrollspy enabled
        </span>
        <span>Auto-hides on short posts (&lt; 2 headings)</span>
      </div>
    </div>
  );
};
