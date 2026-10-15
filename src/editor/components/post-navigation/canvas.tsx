import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePostNavigationProps } from "./schema";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const isDark = useCanvasDarkMode();
  const p = resolvePostNavigationProps(block.props);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";

  const isSingleCol = p.columns === 1 || isMobile || (deviceMode === "tablet" && p.stackOnMobile) || p.layoutStyle === "stacked";

  const getCardAlignClass = (isNext: boolean) => {
    if (p.alignment === "left") return "text-left items-start justify-start";
    if (p.alignment === "right") return "text-right items-end justify-end";
    if (p.alignment === "center") return "text-center items-center justify-center";
    // split
    return isNext ? "text-right items-end justify-end" : "text-left items-start justify-start";
  };

  const getCardFlexClass = (isNext: boolean) => {
    if (p.alignment === "center") {
      return "flex-col items-center justify-center text-center";
    }
    if (p.alignment === "left") {
      return "flex-row items-center text-left";
    }
    if (p.alignment === "right") {
      return "flex-row-reverse items-center text-right";
    }
    // split
    return isNext ? "flex-row-reverse items-center text-right" : "flex-row items-center text-left";
  };

  const getContainerLayoutClass = () => {
    if (isSingleCol) {
      return "flex flex-col gap-4 max-w-2xl mx-auto w-full";
    }
    if (p.layoutStyle === "minimal") {
      return "flex flex-row justify-between items-center gap-6";
    }
    if (p.layoutStyle === "centered-arrows") {
      return "flex flex-row justify-between items-stretch gap-4";
    }
    if (p.layoutStyle === "image-background") {
      return "grid grid-cols-2 gap-6";
    }
    if (p.layoutStyle === "large-typography") {
      return "flex flex-row gap-8 justify-between";
    }
    return "grid grid-cols-2 gap-6";
  };

  return (
    <nav className={`w-full py-8 border-t ${isDark ? "border-white/10" : "border-brand-hairline"}`}>
      <div className={getContainerLayoutClass()}>
        {/* Prev Post */}
        {p.layoutStyle === "minimal" ? (
          <div className={`flex-1 cursor-pointer group ${getCardAlignClass(false)}`}>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
              <ArrowLeft size={11} /> Previous Post
            </span>
            <h4 className={`text-sm font-semibold leading-snug mt-1 ${isDark ? "text-white" : "text-brand-ink"} group-hover:text-brand-link transition-colors`}>
              Designing modern UI systems with Tailwind CSS
            </h4>
          </div>
        ) : p.layoutStyle === "centered-arrows" ? (
          <div className={`flex-1 flex gap-4 ${getCardFlexClass(false)} group cursor-pointer ${isDark ? "hover:bg-neutral-800/50 text-white" : "hover:bg-brand-canvas-soft text-brand-ink"} p-4 rounded-lg transition-colors`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? "bg-neutral-900 border-white/10 text-neutral-400 group-hover:text-white" : "bg-brand-canvas border-brand-hairline text-brand-mute group-hover:text-brand-ink group-hover:border-brand-hairline-strong"} border transition-all shrink-0`}>
              <ArrowLeft size={18} />
            </div>
            <div className={`flex-1 min-w-0 ${getCardAlignClass(false)}`}>
              <span className={`block text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-brand-mute"}`}>Previous</span>
              <h4 className="text-sm font-semibold leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors">Designing modern UI systems</h4>
            </div>
          </div>
        ) : p.layoutStyle === "image-background" ? (
          <div
            className={`flex-1 flex flex-col justify-end p-6 md:p-8 rounded-xl overflow-hidden relative group cursor-pointer min-h-[220px] ${getCardAlignClass(false)}`}
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors z-0"></div>
            <div className="relative z-10 w-full">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2 group-hover:text-white transition-colors">
                <ArrowLeft size={12} /> Previous Post
              </span>
              <h4 className="text-lg md:text-xl font-semibold text-white leading-tight group-hover:underline decoration-white/50 underline-offset-4">
                Designing modern UI systems with Tailwind CSS
              </h4>
              {p.showExcerpt && (
                <p className="text-xs md:text-sm text-white/80 mt-2 line-clamp-2">
                  A practical guide to tokenization and layout architectures.
                </p>
              )}
            </div>
          </div>
        ) : p.layoutStyle === "large-typography" ? (
          <div className={`flex-1 cursor-pointer group py-4 ${getCardAlignClass(false)}`}>
            <span className={`block text-sm font-semibold ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors mb-2`}>
              &larr; Previous Article
            </span>
            <h4 className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDark ? "text-white" : "text-brand-ink"} leading-tight tracking-tight group-hover:text-brand-link transition-colors`}>
              Designing modern UI systems with Tailwind CSS
            </h4>
            {p.showExcerpt && (
              <p className={`text-sm ${isDark ? "text-neutral-400" : "text-brand-body"} mt-3 line-clamp-2 max-w-lg`}>
                A practical guide to tokenization and layout architectures.
              </p>
            )}
          </div>
        ) : (
          <div className={`flex gap-4 ${getCardFlexClass(false)} p-4 ${isDark ? "bg-neutral-900 text-white border-white/10" : "bg-brand-canvas text-brand-ink border-brand-hairline"} border rounded-md shadow-level-1 hover:border-brand-hairline-strong transition-all cursor-pointer group`}>
            {p.showImage && (
              <div className={`w-14 h-14 ${isDark ? "bg-neutral-800 border-white/10" : "bg-brand-canvas-soft-2 border-brand-hairline"} border rounded-sm overflow-hidden shrink-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80"
                  alt="Previous post thumbnail"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                />
              </div>
            )}
            <div className={`flex-1 min-w-0 ${getCardAlignClass(false)}`}>
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
                <ArrowLeft size={11} /> Previous Post
              </span>
              <h4 className={`text-xs font-semibold ${isDark ? "text-white" : "text-brand-ink"} leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors`}>
                Designing modern UI systems with Tailwind CSS
              </h4>
              {p.showExcerpt && (
                <p className={`text-[11px] ${isDark ? "text-neutral-400" : "text-brand-body"} truncate mt-0.5`}>
                  A practical guide to tokenization and layout architectures.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Next Post */}
        {p.layoutStyle === "minimal" ? (
          <div className={`flex-1 cursor-pointer group ${getCardAlignClass(true)}`}>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
              Next Post <ArrowRight size={11} />
            </span>
            <h4 className={`text-sm font-semibold leading-snug mt-1 ${isDark ? "text-white" : "text-brand-ink"} group-hover:text-brand-link transition-colors`}>
              Optimizing Ghost themes for 100/100 Lighthouse
            </h4>
          </div>
        ) : p.layoutStyle === "centered-arrows" ? (
          <div className={`flex-1 flex gap-4 ${getCardFlexClass(true)} group cursor-pointer ${isDark ? "hover:bg-neutral-800/50 text-white" : "hover:bg-brand-canvas-soft text-brand-ink"} p-4 rounded-lg transition-colors`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? "bg-neutral-900 border-white/10 text-neutral-400 group-hover:text-white" : "bg-brand-canvas border-brand-hairline text-brand-mute group-hover:text-brand-ink group-hover:border-brand-hairline-strong"} border transition-all shrink-0`}>
              <ArrowRight size={18} />
            </div>
            <div className={`flex-1 min-w-0 ${getCardAlignClass(true)}`}>
              <span className={`block text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-brand-mute"}`}>Next</span>
              <h4 className="text-sm font-semibold leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors">Optimizing Ghost themes</h4>
            </div>
          </div>
        ) : p.layoutStyle === "image-background" ? (
          <div
            className={`flex-1 flex flex-col justify-end p-6 md:p-8 rounded-xl overflow-hidden relative group cursor-pointer min-h-[220px] ${getCardAlignClass(true)}`}
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors z-0"></div>
            <div className="relative z-10 w-full">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2 group-hover:text-white transition-colors">
                Next Post <ArrowRight size={12} />
              </span>
              <h4 className="text-lg md:text-xl font-semibold text-white leading-tight group-hover:underline decoration-white/50 underline-offset-4">
                Optimizing Ghost themes for 100/100 Lighthouse
              </h4>
              {p.showExcerpt && (
                <p className="text-xs md:text-sm text-white/80 mt-2 line-clamp-2">
                  Essential techniques for asset minification and responsive images.
                </p>
              )}
            </div>
          </div>
        ) : p.layoutStyle === "large-typography" ? (
          <div className={`flex-1 cursor-pointer group py-4 ${getCardAlignClass(true)}`}>
            <span className={`block text-sm font-semibold ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors mb-2`}>
              Next Article &rarr;
            </span>
            <h4 className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDark ? "text-white" : "text-brand-ink"} leading-tight tracking-tight group-hover:text-brand-link transition-colors`}>
              Optimizing Ghost themes for 100/100 Lighthouse
            </h4>
            {p.showExcerpt && (
              <p className={`text-sm ${isDark ? "text-neutral-400" : "text-brand-body"} mt-3 line-clamp-2 max-w-lg`}>
                Essential techniques for asset minification and responsive images.
              </p>
            )}
          </div>
        ) : (
          <div className={`flex gap-4 ${getCardFlexClass(true)} p-4 ${isDark ? "bg-neutral-900 text-white border-white/10" : "bg-brand-canvas text-brand-ink border-brand-hairline"} border rounded-md shadow-level-1 hover:border-brand-hairline-strong transition-all cursor-pointer group`}>
            {p.showImage && (
              <div className={`w-14 h-14 ${isDark ? "bg-neutral-800 border-white/10" : "bg-brand-canvas-soft-2 border-brand-hairline"} border rounded-sm overflow-hidden shrink-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=200&q=80"
                  alt="Next post thumbnail"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                />
              </div>
            )}
            <div className={`flex-1 min-w-0 ${getCardAlignClass(true)}`}>
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
                Next Post <ArrowRight size={11} />
              </span>
              <h4 className={`text-xs font-semibold ${isDark ? "text-white" : "text-brand-ink"} leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors`}>
                Optimizing Ghost themes for 100/100 Lighthouse
              </h4>
              {p.showExcerpt && (
                <p className={`text-[11px] ${isDark ? "text-neutral-400" : "text-brand-body"} truncate mt-0.5`}>
                  Essential techniques for asset minification and responsive images.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
