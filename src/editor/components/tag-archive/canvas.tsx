/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveTagArchiveProps } from "./schema";
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
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";
  const isTablet = deviceMode === "tablet";

  const p = resolveTagArchiveProps(block.props);
  const isBanner = p.layoutStyle === "banner";

  // Responsive column count
  const colCount = isMobile ? 1 : isTablet ? Math.min(p.columns ?? 3, 2) : (p.columns ?? 3);

  // Alignment style
  const alignStyle: React.CSSProperties =
    p.alignment === "center"
      ? { marginLeft: "auto", marginRight: "auto" }
      : p.alignment === "right"
      ? { marginLeft: "auto", marginRight: "0" }
      : { marginLeft: "0", marginRight: "auto" };

  const containerStyle: React.CSSProperties = {
    maxWidth: isMobile ? "100%" : (p.maxWidth || "100%"),
    ...alignStyle,
    width: "100%",
  };

  const textAlign: React.CSSProperties["textAlign"] =
    p.alignment === "center" ? "center" : p.alignment === "right" ? "right" : "left";

  const descMarginStyle: React.CSSProperties =
    p.alignment === "center"
      ? { margin: "0 auto 1rem auto" }
      : p.alignment === "right"
      ? { margin: "0 0 1rem auto" }
      : { margin: "0 auto 1rem 0" };

  if (isBanner) {
    return (
      <header
        className="tag-header w-full py-12 px-4 border-b border-brand-hairline transition-all duration-200"
        style={{ ...containerStyle, textAlign }}
      >
        {p.showImage && p.imageUrl && (
          <div
            className="w-full h-44 sm:h-56 rounded-md overflow-hidden border border-brand-hairline shadow-level-1 mb-6 bg-brand-canvas-soft transition-all duration-200"
            style={{ ...alignStyle, maxWidth: "100%" }}
          >
            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
          </div>
        )}
        <span
          className="text-[11px] font-mono uppercase tracking-wider font-bold block mb-2"
          style={{ color: "var(--ghost-accent-color, var(--color-accent, #0070f3))" }}
        >
          Topic Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink mb-3">
          #{p.title}
        </h1>
        {p.description && (
          <p className="text-sm text-brand-body leading-relaxed max-w-lg mb-4" style={descMarginStyle}>
            {p.description}
          </p>
        )}
        {p.showCount && (
          <span className="font-mono text-[11px] bg-brand-canvas-soft border border-brand-hairline px-2.5 py-1 rounded-sm font-semibold text-brand-ink inline-block">
            18 stories tagged
          </span>
        )}
      </header>
    );
  }

  const mockTags = [
    { name: "Engineering", count: 18 },
    { name: "Product Design", count: 12 },
    { name: "Architecture", count: 7 },
    { name: "Devtools", count: 5 },
    { name: "Case Studies", count: 9 },
    { name: "Systems", count: 4 },
  ].slice(0, colCount * 2);

  return (
    <div className="w-full py-8 transition-all duration-200" style={containerStyle}>
      <h3
        className="text-xs font-mono uppercase tracking-wider text-brand-mute mb-4"
        style={{ textAlign }}
      >
        {p.title || "Browse Topics"}
      </h3>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        {mockTags.map((tag) => (
          <div
            key={tag.name}
            className="p-4 border border-brand-hairline rounded-md bg-white dark:bg-neutral-900 hover:border-brand-hairline-strong shadow-level-2 flex justify-between items-center transition-all cursor-pointer"
          >
            <span className="text-xs font-bold text-brand-ink">{tag.name}</span>
            {p.showCount && (
              <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-brand-body font-semibold">
                {tag.count} posts
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
