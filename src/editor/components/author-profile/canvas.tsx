/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveAuthorProfileProps } from "./schema";
import { MapPin, Globe } from "lucide-react";
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
  const p = resolveAuthorProfileProps(block.props);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";
  const isBanner = p.layoutStyle === "banner";
  const authorInitial = (p.name || "A").charAt(0);

  const alignStyle: React.CSSProperties =
    p.alignment === "left"
      ? { marginLeft: 0, marginRight: "auto" }
      : p.alignment === "right"
      ? { marginLeft: "auto", marginRight: 0 }
      : { marginLeft: "auto", marginRight: "auto" };

  const textAlignClass =
    p.alignment === "center" ? "text-center" : p.alignment === "right" ? "text-right" : "text-left";

  const flexJustify =
    p.alignment === "center" ? "justify-center" : p.alignment === "right" ? "justify-end" : "justify-start";

  if (isBanner) {
    const avatarMarginClass =
      p.alignment === "left" ? "mr-auto ml-0" : p.alignment === "right" ? "ml-auto mr-0" : "mx-auto";

    const bioMarginStyle: React.CSSProperties =
      p.alignment === "center"
        ? { margin: "0 auto 1rem auto" }
        : p.alignment === "right"
        ? { margin: "0 0 1rem auto" }
        : { margin: "0 auto 1rem 0" };

    return (
      <header
        className={`author-header w-full ${textAlignClass} ${
          isMobile ? "py-8 px-4" : "py-12 px-6"
        } border-b border-brand-hairline transition-all duration-200`}
        style={{ maxWidth: isMobile ? "100%" : p.maxWidth, ...alignStyle }}
      >
        <div
          className={`w-24 h-24 rounded-full overflow-hidden ${avatarMarginClass} mb-4 border-2 border-brand-hairline shadow-level-1`}
        >
          {p.avatarUrl ? (
            <img src={p.avatarUrl} alt={p.name || "Author"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-brand-canvas-soft-2 flex items-center justify-center font-bold text-2xl text-brand-primary">
              {authorInitial}
            </div>
          )}
        </div>
        <h1 className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold tracking-tight text-brand-ink mb-2`}>
          {p.name || "Author Name"}
        </h1>
        {p.bio && (
          <p className="text-sm text-brand-body leading-relaxed max-w-lg mb-4" style={bioMarginStyle}>
            {p.bio}
          </p>
        )}
        <div className={`flex flex-wrap items-center gap-3 text-xs text-brand-mute ${flexJustify}`}>
          {p.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {p.location}
            </span>
          )}
          {p.website && (
            <span
              className="flex items-center gap-1"
              style={{ color: "var(--ghost-accent-color, var(--color-accent, #0070f3))" }}
            >
              <Globe size={12} /> {p.website.replace(/^https?:\/\//, "")}
            </span>
          )}
          {p.twitter && (
            <span
              className="flex items-center gap-1 font-mono text-[11px]"
              style={{ color: "var(--ghost-accent-color, var(--color-accent, #0070f3))" }}
            >
              𝕏 {p.twitter}
            </span>
          )}
          <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm font-semibold text-brand-ink">
            12 posts
          </span>
        </div>
      </header>
    );
  }

  // Card layout style:
  // When alignment is 'center': stack vertically and center avatar and text
  // When alignment is 'right': avatar on right (flex-row-reverse), text right-aligned
  // When alignment is 'left': avatar on left (flex-row), text left-aligned
  // When mobile + stackOnMobile: stack vertically, align based on alignment (start / center / end)
  const shouldStack = p.alignment === "center" || (isMobile && p.stackOnMobile);

  const cardLayoutClass = shouldStack
    ? p.alignment === "center"
      ? "flex-col items-center text-center"
      : p.alignment === "right"
      ? "flex-col items-end text-right"
      : "flex-col items-start text-left"
    : p.alignment === "right"
    ? "flex-row-reverse items-center text-right"
    : "flex-row items-center text-left";

  return (
    <section
      className={`author-card w-full flex gap-4 ${cardLayoutClass} my-8 p-5 border border-brand-hairline rounded-md bg-white dark:bg-neutral-900 shadow-level-1 transition-all duration-200`}
      style={{ maxWidth: isMobile ? "100%" : p.maxWidth, ...alignStyle }}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden border border-brand-hairline shrink-0 shadow-xs">
        {p.avatarUrl ? (
          <img src={p.avatarUrl} alt={p.name || "Author"} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-brand-canvas-soft-2 flex items-center justify-center font-bold text-lg text-brand-primary">
            {authorInitial}
          </div>
        )}
      </div>
      <div className={`flex-1 min-w-0 ${textAlignClass}`}>
        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          Written by
        </span>
        <h4 className="text-sm font-bold text-brand-ink mt-0.5">{p.name || "Author Name"}</h4>
        {p.bio && (
          <p className="text-xs text-brand-body leading-relaxed mt-1 line-clamp-2">{p.bio}</p>
        )}
      </div>
    </section>
  );
};
