import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveCommentsProps } from "./schema";
import { MessageSquare } from "lucide-react";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { useEditorStore } from "@/store/editorStore";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  const p = resolveCommentsProps(block.props);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";

  const alignStyle: React.CSSProperties =
    p.alignment === "left"
      ? { marginLeft: 0, marginRight: "auto" }
      : p.alignment === "right"
      ? { marginLeft: "auto", marginRight: 0 }
      : { marginLeft: "auto", marginRight: "auto" };

  const headerAlignClass =
    p.alignment === "left"
      ? "justify-start text-left"
      : p.alignment === "right"
      ? "justify-end text-right"
      : "justify-center text-center";

  return (
    <div
      style={{
        maxWidth: isMobile ? "100%" : p.maxWidth,
        width: "100%",
        ...alignStyle,
      }}
      className={`w-full ${
        isMobile && p.responsivePadding ? "py-4 px-2.5" : "py-8 px-4"
      } transition-all duration-200`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-2 mb-6 border-b border-brand-hairline dark:border-neutral-800 pb-3 ${headerAlignClass}`}
      >
        <MessageSquare size={18} className="text-brand-ink dark:text-white shrink-0" />
        <h3 className="text-lg font-bold text-brand-ink dark:text-white">
          {p.heading}
          {p.showCount && (
            <span className="text-brand-mute dark:text-neutral-400 font-normal ml-2">
              (3)
            </span>
          )}
        </h3>
      </div>

      {/* Mock Join Discussion Form matching Ghost Comments UI */}
      <div className="mb-6 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-brand-hairline dark:border-neutral-800 shadow-level-1">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-semibold text-xs shrink-0 select-none">
            U
          </div>
          <div className="flex-1">
            <div className="w-full px-3.5 py-2.5 border border-brand-hairline dark:border-neutral-700 rounded-lg text-xs text-brand-mute dark:text-neutral-400 bg-brand-canvas-soft dark:bg-neutral-800 select-none cursor-text">
              Join the discussion
            </div>
            <div className="mt-3 flex justify-end">
              <span className="px-3.5 py-1.5 bg-brand-primary dark:bg-white text-white dark:text-neutral-900 text-xs font-medium rounded-md shadow-xs opacity-90 select-none">
                Add comment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Member Comment Thread */}
      <div className="space-y-4">
        {/* Comment 1 */}
        <div className="flex items-start gap-3 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-brand-hairline dark:border-neutral-800 shadow-level-1">
          <div className="w-8 h-8 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
            AR
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-ink dark:text-white">
                Alex Rivera
              </span>
              <span className="text-[10px] text-brand-mute dark:text-neutral-400">
                · Just now
              </span>
            </div>
            <p className="text-xs text-brand-body dark:text-neutral-300 leading-relaxed">
              Great insights! Really excited to see how this theme evolves.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-brand-mute dark:text-neutral-400 select-none">
              <span className="flex items-center gap-1 hover:text-brand-ink dark:hover:text-white cursor-pointer">
                👍 0
              </span>
              <span className="hover:text-brand-ink dark:hover:text-white cursor-pointer">
                Reply
              </span>
            </div>
          </div>
        </div>

        {/* Comment 2 */}
        <div className="flex items-start gap-3 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-brand-hairline dark:border-neutral-800 shadow-level-1">
          <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
            AR
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-ink dark:text-white">
                Alex Rivera
              </span>
              <span className="text-[10px] text-brand-mute dark:text-neutral-400">
                · 2 hours ago
              </span>
            </div>
            <p className="text-xs text-brand-body dark:text-neutral-300 leading-relaxed">
              Clean and beautifully responsive layout. Outstanding craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-brand-mute dark:text-neutral-400 select-none">
              <span className="flex items-center gap-1 hover:text-brand-ink dark:hover:text-white cursor-pointer">
                👍 3
              </span>
              <span className="hover:text-brand-ink dark:hover:text-white cursor-pointer">
                Reply
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
