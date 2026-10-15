/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveTagHeaderProps } from "./schema";
import { useEditorStore } from "@/store/editorStore";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

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
  const p = resolveTagHeaderProps(block.props);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";

  const alignStyle: React.CSSProperties =
    p.alignment === "left"
      ? { marginLeft: 0, marginRight: "auto" }
      : p.alignment === "right"
      ? { marginLeft: "auto", marginRight: 0 }
      : { marginLeft: "auto", marginRight: "auto" };

  const textAlignClass =
    p.alignment === "left" ? "text-left" : p.alignment === "right" ? "text-right" : "text-center";

  const badgeAlignClass =
    p.alignment === "left" ? "justify-start" : p.alignment === "right" ? "justify-end" : "justify-center";

  const descMarginStyle: React.CSSProperties =
    p.alignment === "center"
      ? { margin: "0 auto 1rem auto" }
      : p.alignment === "right"
      ? { margin: "0 0 1rem auto" }
      : { margin: "0 auto 1rem 0" };

  return (
    <header
      className={`gh-tag-header ${textAlignClass} w-full ${
        isMobile ? "py-8 px-4" : "py-16 px-6"
      } transition-all duration-200`}
      style={{ maxWidth: isMobile ? "100%" : p.maxWidth, width: "100%", ...alignStyle }}
    >
      {p.showFeatureImage && (
        <div
          className="w-full h-40 sm:h-56 rounded-md overflow-hidden border border-brand-hairline shadow-level-1 mb-6 bg-brand-canvas-soft transition-all duration-200"
          style={{ ...alignStyle, maxWidth: "100%" }}
        >
          <img
            src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&h=400&q=80"
            alt="Tag header cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1
        className={`${
          isMobile ? "text-2xl" : "text-4xl"
        } font-bold tracking-tight text-brand-ink mb-3`}
      >
        Technology
      </h1>

      {p.showDescription && (
        <p
          className={`${isMobile ? "text-sm" : "text-base"} text-brand-muted max-w-xl mb-4 leading-relaxed`}
          style={descMarginStyle}
        >
          A curated collection of architectural patterns, developer workflows, and cutting-edge engineering practices.
        </p>
      )}

      {p.showCount && (
        <div className={`flex ${badgeAlignClass}`}>
          <span className="inline-block font-mono text-xs font-semibold uppercase tracking-wider text-brand-muted bg-brand-canvas-soft border border-brand-hairline px-3 py-1 rounded-full">
            12 posts
          </span>
        </div>
      )}
    </header>
  );
};
