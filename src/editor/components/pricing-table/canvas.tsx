import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePricingTableProps, PricingSampleTier } from "./schema";
import { useEditorStore } from "@/store/editorStore";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { getBackgroundStyle } from "../shared/background";
import { Check, Sparkles, Info } from "lucide-react";

export const CanvasElement = ({
  block,
  isSelected,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const isDark = useCanvasDarkMode();
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const p = resolvePricingTableProps(block.props);
  const tiers: PricingSampleTier[] = p.sampleTiers || [];
  const styles = block.styles || {};
  const bgStyle = getBackgroundStyle(styles);

  // Cadence toggle in editor preview if cadenceMode is 'both'
  const [activeCadence, setActiveCadence] = useState<"monthly" | "yearly">("monthly");

  const effectiveCadence = p.cadenceMode === "yearly" ? "yearly" : activeCadence;
  const columns = Math.min(Math.max(1, p.columns || 3), 4);

  const getGridColsClass = () => {
    if (deviceMode === "mobile") return "grid-cols-1";
    if (deviceMode === "tablet") return columns > 1 ? "grid-cols-2" : "grid-cols-1";
    if (columns === 1) return "grid-cols-1 max-w-md mx-auto";
    if (columns === 2) return "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";
    if (columns === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  const getCardStyleClass = (isFeatured: boolean) => {
    if (isFeatured) {
      return isDark
        ? "bg-neutral-900 border-2 border-brand-primary shadow-xl ring-1 ring-brand-primary/50 relative"
        : "bg-white border-2 border-brand-primary shadow-xl ring-1 ring-brand-primary/20 relative";
    }

    if (p.cardStyle === "soft") {
      return isDark
        ? "bg-neutral-900/60 border border-white/10"
        : "bg-brand-canvas-soft border border-brand-hairline";
    }
    if (p.cardStyle === "elevated") {
      return isDark
        ? "bg-neutral-900 border border-white/10 shadow-lg"
        : "bg-white border border-brand-hairline shadow-level-2";
    }
    if (p.cardStyle === "minimal") {
      return isDark
        ? "bg-transparent border border-white/10"
        : "bg-transparent border border-brand-hairline";
    }
    // bordered
    return isDark
      ? "bg-neutral-900 border border-white/10"
      : "bg-white border border-brand-hairline shadow-sm";
  };

  const getButtonClass = (isFeatured: boolean) => {
    const radiusClass =
      p.buttonVariant === "pill"
        ? "rounded-full"
        : "rounded-md";

    if (p.buttonVariant === "outline") {
      return `border-2 border-current font-semibold ${radiusClass} hover:opacity-85 transition-opacity`;
    }

    if (isFeatured) {
      return `text-white font-semibold shadow-md ${radiusClass} hover:opacity-90 transition-opacity`;
    }

    return `text-white font-semibold ${radiusClass} hover:opacity-90 transition-opacity`;
  };

  return (
    <div
      className={`gh-pricing-table-block w-full py-12 px-6 transition-all ${
        isSelected ? "ring-2 ring-brand-primary" : ""
      }`}
      style={bgStyle}
    >
      <div className="max-w-6xl mx-auto">
        {/* Editor Preview Banner */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-brand-mute bg-brand-canvas-soft/80 border border-brand-hairline/80 py-1.5 px-3 rounded-full w-fit mx-auto">
          <Info size={13} className="text-blue-500 shrink-0" />
          <span>Editor Preview (Live theme retrieves active membership plans dynamically from Ghost CMS)</span>
        </div>

        {/* Section Header */}
        {(p.title || p.subtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            {p.title && (
              <h2
                className={`text-3xl sm:text-4xl font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-brand-ink"
                }`}
              >
                {p.title}
              </h2>
            )}
            {p.subtitle && (
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-neutral-400" : "text-brand-mute"
                }`}
              >
                {p.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Cadence Toggle (Monthly / Yearly) */}
        {p.cadenceMode === "both" && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center p-1 rounded-full border border-brand-hairline bg-brand-canvas-soft shadow-inner">
              <button
                type="button"
                onClick={() => setActiveCadence("monthly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  effectiveCadence === "monthly"
                    ? "bg-white text-brand-ink shadow-sm dark:bg-neutral-800 dark:text-white"
                    : "text-brand-mute hover:text-brand-ink dark:hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setActiveCadence("yearly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  effectiveCadence === "yearly"
                    ? "bg-white text-brand-ink shadow-sm dark:bg-neutral-800 dark:text-white"
                    : "text-brand-mute hover:text-brand-ink dark:hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                  Save ~20%
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className={`grid gap-8 items-stretch ${getGridColsClass()}`}>
          {tiers.map((tier) => {
            const isFeatured =
              p.featuredTierId === tier.id || Boolean(tier.isPopular);

            const isFree = tier.type === "free";
            const price = isFree
              ? 0
              : effectiveCadence === "yearly"
              ? tier.yearlyPrice
              : tier.monthlyPrice;

            const intervalLabel = isFree
              ? "forever"
              : effectiveCadence === "yearly"
              ? "/ year"
              : "/ month";

            return (
              <div
                key={tier.id}
                className={`rounded-xl p-8 flex flex-col justify-between transition-all ${getCardStyleClass(
                  isFeatured
                )}`}
              >
                {/* Popular Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider text-white shadow-sm bg-brand-primary">
                      <Sparkles size={11} />
                      {p.featuredBadgeText || "Most Popular"}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-brand-ink"
                    }`}
                  >
                    {tier.name}
                  </h3>

                  {/* Plan Description */}
                  {p.showDescriptions && tier.description && (
                    <p
                      className={`text-xs leading-relaxed min-h-[32px] mb-6 ${
                        isDark ? "text-neutral-400" : "text-brand-mute"
                      }`}
                    >
                      {tier.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span
                      className={`text-4xl font-extrabold tracking-tight ${
                        isDark ? "text-white" : "text-brand-ink"
                      }`}
                    >
                      {isFree ? "Free" : `$${price}`}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-neutral-400" : "text-brand-mute"
                      }`}
                    >
                      {intervalLabel}
                    </span>
                  </div>

                  {/* Plan CTA Button */}
                  <div className="mb-8">
                    {isFree ? (
                      <button
                        type="button"
                        className={`w-full py-2.5 px-4 text-xs text-center ${getButtonClass(
                          isFeatured
                        )}`}
                        style={{
                          backgroundColor:
                            p.buttonVariant === "outline"
                              ? "transparent"
                              : "var(--ghost-accent-color, var(--color-accent, #111827))",
                          color:
                            p.buttonVariant === "outline"
                              ? "var(--ghost-accent-color, var(--color-accent, #111827))"
                              : "#ffffff",
                        }}
                      >
                        {p.freeButtonText || "Sign up free"}
                      </button>
                    ) : p.cadenceMode === "both" ? (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className={`w-full py-2 px-3 text-xs text-center ${getButtonClass(
                            isFeatured
                          )}`}
                          style={{
                            backgroundColor:
                              p.buttonVariant === "outline"
                                ? "transparent"
                                : "var(--ghost-accent-color, var(--color-accent, #111827))",
                            color:
                              p.buttonVariant === "outline"
                                ? "var(--ghost-accent-color, var(--color-accent, #111827))"
                                : "#ffffff",
                          }}
                        >
                          {p.monthlyButtonText || "Subscribe monthly"}
                        </button>
                        <button
                          type="button"
                          className={`w-full py-1.5 px-3 text-[11px] text-center opacity-85 hover:opacity-100 ${
                            p.buttonVariant === "pill" ? "rounded-full" : "rounded-md"
                          } border border-brand-hairline font-medium`}
                        >
                          {p.yearlyButtonText || "Subscribe yearly"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={`w-full py-2.5 px-4 text-xs text-center ${getButtonClass(
                          isFeatured
                        )}`}
                        style={{
                          backgroundColor:
                            p.buttonVariant === "outline"
                              ? "transparent"
                              : "var(--ghost-accent-color, var(--color-accent, #111827))",
                          color:
                            p.buttonVariant === "outline"
                              ? "var(--ghost-accent-color, var(--color-accent, #111827))"
                              : "#ffffff",
                        }}
                      >
                        {p.cadenceMode === "yearly"
                          ? p.yearlyButtonText || "Subscribe yearly"
                          : p.monthlyButtonText || "Subscribe monthly"}
                      </button>
                    )}
                  </div>

                  {/* Benefits List */}
                  {p.showBenefits && tier.benefits && tier.benefits.length > 0 && (
                    <div className="border-t border-brand-hairline pt-6">
                      <p
                        className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${
                          isDark ? "text-neutral-400" : "text-brand-mute"
                        }`}
                      >
                        What&apos;s included:
                      </p>
                      <ul className="space-y-2.5">
                        {tier.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2.5 text-xs ${
                              isDark ? "text-neutral-300" : "text-brand-body"
                            }`}
                          >
                            <span
                              className="mt-0.5 shrink-0 rounded-full p-0.5 text-emerald-500 bg-emerald-500/10"
                            >
                              <Check size={12} strokeWidth={3} />
                            </span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};