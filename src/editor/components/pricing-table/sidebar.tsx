import React from "react";
import { BuilderBlock } from "@/types/theme";
import {
  resolvePricingTableProps,
  PricingTableProps,
  PricingSampleTier,
} from "./schema";
import { BackgroundControls } from "../shared/BackgroundControls";
import { SpacingControl } from "../shared/SpacingControl";
import { Info, Plus, Trash2 } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolvePricingTableProps(block.props);
  const sampleTiers: PricingSampleTier[] = p.sampleTiers || [];

  const updateProp = <K extends keyof PricingTableProps>(
    key: K,
    value: PricingTableProps[K]
  ) => {
    onChangeProps({ [key]: value });
  };

  const updateSampleTier = (
    index: number,
    patch: Partial<PricingSampleTier>
  ) => {
    const updated = [...sampleTiers];
    updated[index] = { ...updated[index], ...patch };
    updateProp("sampleTiers", updated);
  };

  const addSampleTier = () => {
    const newTier: PricingSampleTier = {
      id: `sample-${Date.now()}`,
      name: "New Tier",
      description: "Description for this membership tier.",
      type: "paid",
      monthlyPrice: 9,
      yearlyPrice: 90,
      currency: "USD",
      benefits: ["Access to exclusive content", "Direct support"],
      isPopular: false,
    };
    updateProp("sampleTiers", [...sampleTiers, newTier]);
  };

  const removeSampleTier = (index: number) => {
    const updated = sampleTiers.filter((_, i) => i !== index);
    updateProp("sampleTiers", updated);
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      {/* Ghost Membership Notice */}
      <div className="flex flex-col gap-1.5 p-2.5 rounded-md border border-brand-hairline bg-brand-canvas-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-brand-ink text-[11px]">
            <Info size={13} className="text-blue-500" />
            <span>Ghost CMS Native Plans</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
            Dynamic
          </span>
        </div>
        <p className="text-[11px] text-brand-body leading-relaxed">
          On your published website, tier names, prices, benefits, and Portal checkout links are automatically loaded from <strong>Ghost Admin &rarr; Settings &rarr; Membership &rarr; Tiers</strong>.
        </p>
      </div>

      {/* Section Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Section Title
        </label>
        <input
          type="text"
          value={p.title || ""}
          onChange={(e) => updateProp("title", e.target.value)}
          placeholder="Membership Plans"
          className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary"
        />
      </div>

      {/* Section Subtitle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Section Subtitle
        </label>
        <textarea
          rows={2}
          value={p.subtitle || ""}
          onChange={(e) => updateProp("subtitle", e.target.value)}
          placeholder="Choose the plan that fits you best..."
          className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary resize-none"
        />
      </div>

      {/* Layout Columns */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Columns Layout
        </label>
        <div className="flex bg-gray-100 dark:bg-neutral-800 p-0.5 rounded-md border border-gray-200/50 dark:border-neutral-700">
          {[1, 2, 3, 4].map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => updateProp("columns", cols)}
              className={`flex-1 py-1 text-[11px] font-medium rounded-sm transition-all ${
                (p.columns || 3) === cols
                  ? "bg-white text-gray-900 dark:bg-neutral-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {cols} Col
            </button>
          ))}
        </div>
      </div>

      {/* Cadence Mode (Monthly / Yearly / Both) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Billing Cadence Mode
        </label>
        <select
          value={p.cadenceMode || "both"}
          onChange={(e) =>
            updateProp(
              "cadenceMode",
              e.target.value as PricingTableProps["cadenceMode"]
            )
          }
          className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary"
        >
          <option value="both">Both (Monthly & Yearly Buttons)</option>
          <option value="monthly">Monthly Only</option>
          <option value="yearly">Yearly Only</option>
        </select>
      </div>

      {/* Card Style */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Card Style
        </label>
        <select
          value={p.cardStyle || "bordered"}
          onChange={(e) =>
            updateProp(
              "cardStyle",
              e.target.value as PricingTableProps["cardStyle"]
            )
          }
          className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary"
        >
          <option value="bordered">Bordered Outline</option>
          <option value="soft">Soft Canvas</option>
          <option value="elevated">Elevated Shadow</option>
          <option value="minimal">Minimal Flat</option>
        </select>
      </div>

      {/* Button Variant */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Button Style
        </label>
        <div className="flex bg-gray-100 dark:bg-neutral-800 p-0.5 rounded-md border border-gray-200/50 dark:border-neutral-700">
          {(["solid", "outline", "pill"] as const).map((variant) => (
            <button
              key={variant}
              type="button"
              onClick={() => updateProp("buttonVariant", variant)}
              className={`flex-1 py-1 text-[11px] font-medium rounded-sm capitalize transition-all ${
                (p.buttonVariant || "solid") === variant
                  ? "bg-white text-gray-900 dark:bg-neutral-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Tier Highlighting */}
      <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 flex flex-col gap-2.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Featured Plan Badge
        </label>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500">Badge Text</label>
          <input
            type="text"
            value={p.featuredBadgeText || ""}
            onChange={(e) => updateProp("featuredBadgeText", e.target.value)}
            placeholder="Most Popular"
            className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Button Labels */}
      <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 flex flex-col gap-2.5">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Action Button Labels
        </label>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500">Free Tier Button</label>
            <input
              type="text"
              value={p.freeButtonText || ""}
              onChange={(e) => updateProp("freeButtonText", e.target.value)}
              placeholder="Sign up free"
              className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500">Monthly Button</label>
            <input
              type="text"
              value={p.monthlyButtonText || ""}
              onChange={(e) => updateProp("monthlyButtonText", e.target.value)}
              placeholder="Subscribe monthly"
              className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500">Yearly Button</label>
            <input
              type="text"
              value={p.yearlyButtonText || ""}
              onChange={(e) => updateProp("yearlyButtonText", e.target.value)}
              placeholder="Subscribe yearly"
              className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300">
          Display Options
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showDescriptions}
            onChange={(e) => updateProp("showDescriptions", e.target.checked)}
            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          />
          <span className="text-xs text-gray-600 dark:text-neutral-400">
            Show Tier Descriptions
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showBenefits}
            onChange={(e) => updateProp("showBenefits", e.target.checked)}
            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          />
          <span className="text-xs text-gray-600 dark:text-neutral-400">
            Show Benefits List
          </span>
        </label>
      </div>

      {/* Spacing & Background */}
      <div className="border-t border-gray-100 dark:border-neutral-800 pt-3">
        <SpacingControl
          title="Section Spacing"
          topValue={(block.styles?.paddingTop as string) || "4rem"}
          bottomValue={(block.styles?.paddingBottom as string) || "4rem"}
          onChangeTop={(val) => onChangeStyles?.({ paddingTop: val })}
          onChangeBottom={(val) => onChangeStyles?.({ paddingBottom: val })}
        />
      </div>

      <BackgroundControls
        styles={block.styles}
        appearance={{
          backgroundColor:
            (block.styles?.backgroundColor as string) || "transparent",
        }}
        onChangeStyles={(s) => onChangeStyles?.(s)}
        updateAppearance={(_, v) => onChangeStyles?.({ backgroundColor: v })}
      />

      {/* Editor Sample Tiers Configuration */}
      <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-[11px] font-semibold text-gray-700 dark:text-neutral-300 block">
              Editor Sample Data
            </label>
            <span className="text-[10px] text-gray-400">
              Only for visual preview in editor
            </span>
          </div>
          <button
            type="button"
            onClick={addSampleTier}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary hover:underline"
          >
            <Plus size={12} /> Add Plan
          </button>
        </div>

        <div className="space-y-3">
          {sampleTiers.map((tier, idx) => (
            <div
              key={tier.id}
              className="p-2.5 rounded border border-gray-200 dark:border-neutral-800 bg-brand-canvas-soft flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-brand-ink">
                  {tier.name || `Plan #${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeSampleTier(idx)}
                  className="text-gray-400 hover:text-red-500"
                  title="Remove sample tier"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-gray-500">Plan Name</label>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateSampleTier(idx, { name: e.target.value })}
                    className="w-full border border-gray-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs bg-white dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500">Type</label>
                  <select
                    value={tier.type}
                    onChange={(e) =>
                      updateSampleTier(idx, {
                        type: e.target.value as "free" | "paid",
                      })
                    }
                    className="w-full border border-gray-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs bg-white dark:bg-neutral-800"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              {tier.type === "paid" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-500">Monthly ($)</label>
                    <input
                      type="number"
                      value={tier.monthlyPrice}
                      onChange={(e) =>
                        updateSampleTier(idx, {
                          monthlyPrice: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs bg-white dark:bg-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-500">Yearly ($)</label>
                    <input
                      type="number"
                      value={tier.yearlyPrice}
                      onChange={(e) =>
                        updateSampleTier(idx, {
                          yearlyPrice: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs bg-white dark:bg-neutral-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[9px] text-gray-500">Description</label>
                <input
                  type="text"
                  value={tier.description}
                  onChange={(e) =>
                    updateSampleTier(idx, { description: e.target.value })
                  }
                  className="w-full border border-gray-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs bg-white dark:bg-neutral-800"
                />
              </div>

              <label className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tier.isPopular || p.featuredTierId === tier.id}
                  onChange={(e) => {
                    updateSampleTier(idx, { isPopular: e.target.checked });
                    if (e.target.checked) {
                      updateProp("featuredTierId", tier.id);
                    } else if (p.featuredTierId === tier.id) {
                      updateProp("featuredTierId", "");
                    }
                  }}
                  className="rounded border-gray-300 text-brand-primary"
                />
                <span>Highlight as popular plan</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};