import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { PricingTableProps, defaultProps } from "./schema";
import { getBackgroundStyle } from "../shared/background";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { useEditorStore } from "@/store/editorStore";
import { Check, Sparkles, Zap } from "lucide-react";

export const CanvasElement = ({ block }: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const p = { ...defaultProps, ...block.props } as PricingTableProps;
  const bgStyle = getBackgroundStyle(block.styles);
  const tiers = p.tiers && p.tiers.length > 0 ? p.tiers : defaultProps.tiers;

  // ── Responsive device mode ──────────────────────────────────────────────
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";
  const isTablet = deviceMode === "tablet";

  // Compute column count based on tier count AND device mode
  const desktopCols = tiers.length === 2 ? 2 : tiers.length >= 4 ? 4 : 3;
  const tabletCols = Math.min(desktopCols, 2);
  const mobileCols = 1;
  const activeCols = isMobile ? mobileCols : isTablet ? tabletCols : desktopCols;

  // max-width based on column count (desktop)
  const maxWidthMap: Record<number, string> = { 1: "32rem", 2: "48rem", 3: "64rem", 4: "90rem" };
  const maxWidth = maxWidthMap[desktopCols] ?? "64rem";

  return (
    <div
      style={bgStyle}
      className="w-full py-16 px-6 border border-brand-hairline rounded-md relative select-none font-sans"
    >
      {p.useDynamicTiers && (
        <div className="flex items-center justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
            <Zap size={12} className="text-emerald-500 fill-emerald-500 animate-pulse" />
            Dynamic Ghost Tier Integration (Active)
          </span>
        </div>
      )}

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        {p.heading && (
          <h2 className={`font-bold tracking-tight text-brand-ink mb-3 leading-tight ${isMobile ? "text-2xl" : "text-3xl md:text-4xl"}`}>
            {p.heading}
          </h2>
        )}
        {p.subheading && (
          <p className="text-sm text-brand-body leading-relaxed">
            {p.subheading}
          </p>
        )}

        {p.showBillingToggle && (
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-brand-canvas-soft border border-brand-hairline shadow-inner">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                interval === "monthly"
                  ? "bg-brand-ink text-brand-canvas shadow-sm"
                  : "text-brand-body hover:text-brand-ink"
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setInterval("yearly")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                interval === "yearly"
                  ? "bg-brand-ink text-brand-canvas shadow-sm"
                  : "text-brand-body hover:text-brand-ink"
              }`}
            >
              Annual billing
              {p.yearlyDiscountBadge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {p.yearlyDiscountBadge}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tiers grid — driven by deviceMode, NOT Tailwind breakpoints */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${activeCols}, minmax(0, 1fr))`,
          gap: isMobile ? "1rem" : "1.5rem",
          maxWidth,
          marginLeft: "auto",
          marginRight: "auto",
          alignItems: "stretch",
        }}
      >
        {tiers.map((tier) => {
          const isFeatured = tier.isFeatured;
          const price = interval === "yearly" ? tier.yearlyPrice : tier.monthlyPrice;
          const displayPeriod =
            tier.monthlyPrice === 0 && tier.yearlyPrice === 0
              ? tier.period || "free forever"
              : interval === "yearly"
              ? "/ year"
              : "/ month";

          return (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-xl p-7 transition-all duration-300 relative ${
                isFeatured
                  ? "bg-brand-canvas border-2 border-brand-ink dark:border-white shadow-xl z-10"
                  : "bg-brand-canvas-soft border border-brand-hairline hover:border-brand-hairline-strong shadow-sm"
              }`}
              style={isFeatured && !isMobile ? { transform: "scale(1.02)" } : undefined}
            >
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-ink text-brand-canvas shadow-md flex items-center gap-1 whitespace-nowrap">
                  <Sparkles size={11} className="text-amber-400 fill-amber-400" />
                  {tier.badgeText || "Most Popular"}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-brand-ink">{tier.name}</h3>
                </div>

                <p className="text-xs text-brand-body mb-6 min-h-[32px] leading-relaxed">
                  {tier.description}
                </p>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-brand-hairline">
                  <span className="text-4xl font-extrabold text-brand-ink tracking-tight">
                    {tier.currency || "$"}{price}
                  </span>
                  <span className="text-xs font-medium text-brand-mute">
                    {displayPeriod}
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-brand-mute mb-3 font-semibold">
                    Included benefits
                  </p>
                  <ul className="space-y-2.5">
                    {tier.benefits?.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-brand-ink leading-snug">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all duration-200 text-center ${
                    isFeatured
                      ? "bg-brand-ink text-brand-canvas hover:opacity-90 shadow-sm"
                      : "bg-brand-canvas border border-brand-hairline text-brand-ink hover:bg-brand-canvas-soft"
                  }`}
                >
                  {tier.buttonText || "Choose Plan"}
                </button>
                <p className="text-[10px] text-center text-brand-mute mt-2">
                  Direct Ghost Portal ({tier.portalAction || "signup"})
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {p.ctaNote && (
        <p className="text-xs text-center text-brand-mute mt-10">
          {p.ctaNote}
        </p>
      )}
    </div>
  );
};
