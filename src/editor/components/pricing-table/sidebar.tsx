import React from "react";
import { BuilderBlock } from "@/types/theme";
import { PricingTableProps, PricingTier, defaultProps } from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
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
  const p = { ...defaultProps, ...block.props } as PricingTableProps;
  const tiers = p.tiers && p.tiers.length > 0 ? p.tiers : defaultProps.tiers;

  const handleUpdateTier = (newTiers: PricingTier[]) => {
    onChangeProps({ tiers: newTiers });
  };

  return (
    <div className="flex flex-col gap-5 text-brand-ink">
      {/* Ghost Engine Integration */}
      <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-md flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Ghost Dynamic Tiers
            </span>
          </div>
          <Switch
            checked={!!p.useDynamicTiers}
            onChange={(val) => onChangeProps({ useDynamicTiers: val })}
          />
        </div>
        <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-normal">
          When active, the theme queries <code className="px-1 py-0.5 bg-emerald-100/60 dark:bg-emerald-900/60 rounded font-mono text-[10px]">&#123;&#123;#get &quot;tiers&quot;&#125;&#125;</code> to render live prices and perks directly from Ghost Admin.
        </p>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          Header Content
        </h4>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">Heading</label>
          <input
            type="text"
            value={p.heading || ""}
            onChange={(e) => onChangeProps({ heading: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs bg-brand-canvas-soft focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">Subheading</label>
          <textarea
            rows={2}
            value={p.subheading || ""}
            onChange={(e) => onChangeProps({ subheading: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs bg-brand-canvas-soft focus:outline-none resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">Footer Note</label>
          <input
            type="text"
            value={p.ctaNote || ""}
            onChange={(e) => onChangeProps({ ctaNote: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs bg-brand-canvas-soft focus:outline-none"
          />
        </div>
      </div>

      {/* Billing Switcher */}
      <div className="flex flex-col gap-3 border-t border-brand-hairline pt-4">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          Billing Switcher
        </h4>

        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-body">Show Monthly / Annual Toggle</span>
          <Switch
            checked={!!p.showBillingToggle}
            onChange={(val) => onChangeProps({ showBillingToggle: val })}
          />
        </div>

        {p.showBillingToggle && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">Yearly Discount Badge</label>
            <input
              type="text"
              value={p.yearlyDiscountBadge || ""}
              onChange={(e) => onChangeProps({ yearlyDiscountBadge: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs bg-brand-canvas-soft focus:outline-none"
              placeholder="e.g. Save 20%"
            />
          </div>
        )}
      </div>

      {/* Tiers Customization */}
      <div className="flex flex-col gap-3 border-t border-brand-hairline pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
            Subscription Tiers ({tiers.length})
          </h4>
        </div>

        <RepeatableList<PricingTier>
          items={tiers}
          onChange={handleUpdateTier}
          addLabel="Add Membership Tier"
          newItem={() => ({
            id: `tier-${Date.now()}`,
            name: "New Tier",
            description: "Description of the tier perks and access.",
            monthlyPrice: 10,
            yearlyPrice: 100,
            currency: "$",
            period: "month",
            isFeatured: false,
            buttonText: "Subscribe",
            portalAction: "signup",
            benefits: ["Subscriber benefit 1", "Subscriber benefit 2"],
          })}
          renderItem={(tier, update) => (
            <div className="flex flex-col gap-2.5 text-xs w-full">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Tier Name"
                  className="font-semibold text-xs px-2 py-1 border border-brand-hairline rounded bg-brand-canvas-soft w-full"
                />
                <label className="flex items-center gap-1.5 shrink-0 text-[11px] text-brand-mute cursor-pointer">
                  <span>Featured</span>
                  <Switch
                    checked={tier.isFeatured}
                    onChange={(val) => update({ isFeatured: val })}
                  />
                </label>
              </div>

              <textarea
                rows={2}
                value={tier.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Short description"
                className="text-[11px] px-2 py-1 border border-brand-hairline rounded bg-brand-canvas-soft resize-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-brand-mute block">Monthly ($)</span>
                  <input
                    type="number"
                    value={tier.monthlyPrice}
                    onChange={(e) => update({ monthlyPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs border border-brand-hairline rounded bg-brand-canvas-soft"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-brand-mute block">Yearly ($)</span>
                  <input
                    type="number"
                    value={tier.yearlyPrice}
                    onChange={(e) => update({ yearlyPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs border border-brand-hairline rounded bg-brand-canvas-soft"
                  />
                </div>
              </div>

              {tier.isFeatured && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-mute">Badge Label</span>
                  <input
                    type="text"
                    value={tier.badgeText || ""}
                    onChange={(e) => update({ badgeText: e.target.value })}
                    placeholder="e.g. Most Popular"
                    className="w-full px-2 py-1 text-xs border border-brand-hairline rounded bg-brand-canvas-soft"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-brand-mute block">Button Text</span>
                  <input
                    type="text"
                    value={tier.buttonText}
                    onChange={(e) => update({ buttonText: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-brand-hairline rounded bg-brand-canvas-soft"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-brand-mute block">Ghost Portal Link</span>
                  <input
                    type="text"
                    value={tier.portalAction}
                    onChange={(e) => update({ portalAction: e.target.value })}
                    placeholder="signup or signup/free"
                    className="w-full px-2 py-1 text-xs border border-brand-hairline rounded bg-brand-canvas-soft font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-brand-mute">Benefits (one per line)</span>
                <textarea
                  rows={3}
                  value={tier.benefits?.join("\n") || ""}
                  onChange={(e) =>
                    update({
                      benefits: e.target.value.split("\n").filter((b) => b.trim().length > 0),
                    })
                  }
                  placeholder="Benefit 1&#10;Benefit 2"
                  className="w-full px-2 py-1 text-xs border border-brand-hairline rounded bg-brand-canvas-soft resize-none"
                />
              </div>
            </div>
          )}
        />
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
