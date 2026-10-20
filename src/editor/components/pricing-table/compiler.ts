import { BuilderBlock } from "@/types/theme";
import { resolvePricingTableProps, PricingTableProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";
import { escapeHtml } from "../shared/escape";

export const compileToHbs = (block: BuilderBlock): string => {
  const p: PricingTableProps = resolvePricingTableProps(block.props);
  const styles = block.styles || {};
  const bgCSS = getBackgroundCSS(styles);

  const blockId = block.id || "pricing-table";
  const columns = Math.min(Math.max(1, p.columns || 3), 4);
  const cardStyle = p.cardStyle || "bordered";
  const cadenceMode = p.cadenceMode || "both";
  const buttonVariant = p.buttonVariant || "solid";
  const badgeText = escapeHtml(p.featuredBadgeText || "Most Popular");
  const freeBtnText = escapeHtml(p.freeButtonText || "Sign up free");
  const monthlyBtnText = escapeHtml(p.monthlyButtonText || "Subscribe monthly");
  const yearlyBtnText = escapeHtml(p.yearlyButtonText || "Subscribe yearly");

  // Grid styling based on column count
  let gridColsDesktop = "repeat(3, minmax(0, 1fr))";
  if (columns === 1) gridColsDesktop = "minmax(0, 480px)";
  else if (columns === 2) gridColsDesktop = "repeat(2, minmax(0, 1fr))";
  else if (columns === 4) gridColsDesktop = "repeat(4, minmax(0, 1fr))";

  // Card border / shadow based on cardStyle
  let cardBg = "var(--color-bg, #ffffff)";
  let cardBorder = "1px solid rgba(0, 0, 0, 0.08)";
  let cardShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";

  if (cardStyle === "soft") {
    cardBg = "var(--color-canvas-soft, #f8fafc)";
    cardBorder = "1px solid rgba(0, 0, 0, 0.05)";
    cardShadow = "none";
  } else if (cardStyle === "elevated") {
    cardBg = "var(--color-bg, #ffffff)";
    cardBorder = "1px solid rgba(0, 0, 0, 0.06)";
    cardShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)";
  } else if (cardStyle === "minimal") {
    cardBg = "transparent";
    cardBorder = "1px solid rgba(0, 0, 0, 0.08)";
    cardShadow = "none";
  }

  // Button radius
  const btnRadius = buttonVariant === "pill" ? "9999px" : "var(--radius-md, 8px)";

  return `<style>
  #gh-pricing-${blockId} {
    ${bgCSS}
    padding-top: ${(styles.paddingTop as string) || "4rem"};
    padding-bottom: ${(styles.paddingBottom as string) || "4rem"};
    position: relative;
    width: 100%;
  }
  #gh-pricing-${blockId} .pricing-container {
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  #gh-pricing-${blockId} .pricing-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 3rem;
  }
  #gh-pricing-${blockId} .pricing-title {
    font-family: var(--gh-font-heading, var(--font-heading));
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 0.75rem 0;
    color: var(--color-fg, #111827);
  }
  #gh-pricing-${blockId} .pricing-subtitle {
    font-family: var(--gh-font-body, var(--font-body));
    font-size: 1.05rem;
    color: var(--color-muted, #64748b);
    line-height: 1.6;
    margin: 0;
  }
  #gh-pricing-${blockId} .pricing-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: stretch;
    justify-content: center;
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    #gh-pricing-${blockId} .pricing-grid {
      grid-template-columns: ${columns > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 480px)"};
    }
  }
  @media (min-width: 1024px) {
    #gh-pricing-${blockId} .pricing-grid {
      grid-template-columns: ${gridColsDesktop};
    }
  }
  #gh-pricing-${blockId} .pricing-card {
    background-color: ${cardBg};
    border: ${cardBorder};
    box-shadow: ${cardShadow};
    border-radius: var(--radius-lg, 12px);
    padding: 2.25rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  #gh-pricing-${blockId} .pricing-card:hover {
    transform: translateY(-2px);
  }
  #gh-pricing-${blockId} .pricing-card.is-popular {
    border-color: var(--ghost-accent-color, var(--color-accent, #111827));
    border-width: 2px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  }
  #gh-pricing-${blockId} .pricing-badge {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--ghost-accent-color, var(--color-accent, #111827));
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.3rem 0.85rem;
    border-radius: 9999px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
  }
  #gh-pricing-${blockId} .tier-name {
    font-family: var(--gh-font-heading, var(--font-heading));
    font-size: 1.35rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--color-fg, #111827);
  }
  #gh-pricing-${blockId} .tier-description {
    font-family: var(--gh-font-body, var(--font-body));
    font-size: 0.875rem;
    color: var(--color-muted, #64748b);
    line-height: 1.5;
    margin: 0 0 1.5rem 0;
    min-height: 2.6rem;
  }
  #gh-pricing-${blockId} .tier-price-box {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    margin-bottom: 1.75rem;
  }
  #gh-pricing-${blockId} .tier-price-amount {
    font-family: var(--gh-font-heading, var(--font-heading));
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-fg, #111827);
  }
  #gh-pricing-${blockId} .tier-price-period {
    font-size: 0.875rem;
    color: var(--color-muted, #64748b);
  }
  #gh-pricing-${blockId} .pricing-actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 2rem;
  }
  #gh-pricing-${blockId} .btn-tier-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: ${btnRadius};
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.1s ease;
    text-align: center;
    box-sizing: border-box;
  }
  #gh-pricing-${blockId} .btn-tier-primary {
    background-color: var(--ghost-accent-color, var(--color-accent, #111827));
    color: #ffffff !important;
    border: none;
  }
  #gh-pricing-${blockId} .btn-tier-secondary {
    background-color: transparent;
    color: var(--color-fg, #111827) !important;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
  #gh-pricing-${blockId} .btn-tier-secondary:hover {
    border-color: var(--color-fg, #111827);
    background-color: rgba(0, 0, 0, 0.02);
  }
  #gh-pricing-${blockId} .btn-tier-outline {
    background-color: transparent;
    color: var(--ghost-accent-color, var(--color-accent, #111827)) !important;
    border: 2px solid var(--ghost-accent-color, var(--color-accent, #111827));
  }
  #gh-pricing-${blockId} .btn-tier-cta:hover {
    opacity: 0.9;
  }
  #gh-pricing-${blockId} .tier-benefits-wrapper {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 1.5rem;
  }
  #gh-pricing-${blockId} .tier-benefits-title {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #64748b);
    margin: 0 0 0.85rem 0;
  }
  #gh-pricing-${blockId} .tier-benefits-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  #gh-pricing-${blockId} .tier-benefit-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--color-fg, #334155);
  }
  #gh-pricing-${blockId} .benefit-check-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    margin-top: 0.15rem;
    color: #10b981;
  }
  html.dark #gh-pricing-${blockId} .pricing-title {
    color: #ffffff;
  }
  html.dark #gh-pricing-${blockId} .pricing-card {
    background-color: var(--color-canvas-soft, #1e293b);
    border-color: rgba(255, 255, 255, 0.1);
  }
  html.dark #gh-pricing-${blockId} .pricing-card.is-popular {
    border-color: var(--ghost-accent-color, var(--color-accent, #6366f1));
  }
  html.dark #gh-pricing-${blockId} .tier-name,
  html.dark #gh-pricing-${blockId} .tier-price-amount {
    color: #ffffff;
  }
  html.dark #gh-pricing-${blockId} .tier-benefit-item {
    color: #cbd5e1;
  }
  html.dark #gh-pricing-${blockId} .tier-benefits-wrapper {
    border-color: rgba(255, 255, 255, 0.1);
  }
  html.dark #gh-pricing-${blockId} .btn-tier-secondary {
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff !important;
  }
</style>

<div id="gh-pricing-${blockId}" class="gh-pricing-section">
  <div class="pricing-container">
    ${
      p.title || p.subtitle
        ? `<div class="pricing-header">
      ${p.title ? `<h2 class="pricing-title">${escapeHtml(p.title)}</h2>` : ""}
      ${p.subtitle ? `<p class="pricing-subtitle">${escapeHtml(p.subtitle)}</p>` : ""}
    </div>`
        : ""
    }

    {{#get "tiers" include="monthly_price,yearly_price,benefits" filter="visibility:public" limit="all" as |tiers|}}
    <div class="pricing-grid">
      {{#foreach tiers}}
      <div class="pricing-card{{#if (match type "paid")}}{{#if (match @index 1)}} is-popular{{/if}}{{/if}}">
        {{#if (match type "paid")}}
          {{#if (match @index 1)}}
            <span class="pricing-badge">${badgeText}</span>
          {{/if}}
        {{/if}}

        <div class="pricing-card-top">
          <h3 class="tier-name">{{name}}</h3>
          ${
            p.showDescriptions
              ? `{{#if description}}
            <p class="tier-description">{{description}}</p>
          {{/if}}`
              : ""
          }

          <div class="tier-price-box">
            {{#if (match type "free")}}
              <span class="tier-price-amount">Free</span>
              <span class="tier-price-period">forever</span>
            {{else}}
              ${
                cadenceMode === "yearly"
                  ? `{{#if yearly_price}}
                <span class="tier-price-amount">{{price yearly_price currency=currency}}</span>
                <span class="tier-price-period">/ year</span>
              {{else if monthly_price}}
                <span class="tier-price-amount">{{price monthly_price currency=currency}}</span>
                <span class="tier-price-period">/ month</span>
              {{else}}
                <span class="tier-price-amount">Free</span>
              {{/if}}`
                  : `{{#if monthly_price}}
                <span class="tier-price-amount">{{price monthly_price currency=currency}}</span>
                <span class="tier-price-period">/ month</span>
              {{else if yearly_price}}
                <span class="tier-price-amount">{{price yearly_price currency=currency}}</span>
                <span class="tier-price-period">/ year</span>
              {{else}}
                <span class="tier-price-amount">Free</span>
              {{/if}}`
              }
            {{/if}}
          </div>

          <div class="pricing-actions">
            {{#if (match type "free")}}
              <a href="javascript:" data-portal="signup" class="btn-tier-cta ${
                buttonVariant === "outline" ? "btn-tier-outline" : "btn-tier-primary"
              }">${freeBtnText}</a>
            {{else}}
              ${
                cadenceMode === "both"
                  ? `{{#if monthly_price}}
                <a href="javascript:" data-portal="signup/{{id}}/monthly" class="btn-tier-cta ${
                  buttonVariant === "outline" ? "btn-tier-outline" : "btn-tier-primary"
                }">${monthlyBtnText}</a>
              {{/if}}
              {{#if yearly_price}}
                <a href="javascript:" data-portal="signup/{{id}}/yearly" class="btn-tier-cta btn-tier-secondary">${yearlyBtnText}</a>
              {{/if}}
              {{#unless monthly_price}}
                {{#unless yearly_price}}
                  <a href="javascript:" data-portal="signup" class="btn-tier-cta btn-tier-primary">${freeBtnText}</a>
                {{/unless}}
              {{/unless}}`
                  : cadenceMode === "yearly"
                  ? `{{#if yearly_price}}
                <a href="javascript:" data-portal="signup/{{id}}/yearly" class="btn-tier-cta ${
                  buttonVariant === "outline" ? "btn-tier-outline" : "btn-tier-primary"
                }">${yearlyBtnText}</a>
              {{else if monthly_price}}
                <a href="javascript:" data-portal="signup/{{id}}/monthly" class="btn-tier-cta ${
                  buttonVariant === "outline" ? "btn-tier-outline" : "btn-tier-primary"
                }">${monthlyBtnText}</a>
              {{else}}
                <a href="javascript:" data-portal="signup" class="btn-tier-cta btn-tier-primary">${freeBtnText}</a>
              {{/if}}`
                  : `{{#if monthly_price}}
                <a href="javascript:" data-portal="signup/{{id}}/monthly" class="btn-tier-cta ${
                  buttonVariant === "outline" ? "btn-tier-outline" : "btn-tier-primary"
                }">${monthlyBtnText}</a>
              {{else if yearly_price}}
                <a href="javascript:" data-portal="signup/{{id}}/yearly" class="btn-tier-cta ${
                  buttonVariant === "outline" ? "btn-tier-outline" : "btn-tier-primary"
                }">${yearlyBtnText}</a>
              {{else}}
                <a href="javascript:" data-portal="signup" class="btn-tier-cta btn-tier-primary">${freeBtnText}</a>
              {{/if}}`
              }
            {{/if}}
          </div>
        </div>

        ${
          p.showBenefits
            ? `{{#if benefits}}
        <div class="tier-benefits-wrapper">
          <p class="tier-benefits-title">What's included</p>
          <ul class="tier-benefits-list">
            {{#foreach benefits as |benefit|}}
            <li class="tier-benefit-item">
              <svg class="benefit-check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>{{benefit}}</span>
            </li>
            {{/foreach}}
          </ul>
        </div>
        {{/if}}`
            : ""
        }
      </div>
      {{/foreach}}
    </div>
    {{else}}
    <div style="text-align: center; padding: 3rem 1rem; color: var(--color-muted);">
      <p style="margin: 0 0 1rem 0;">Membership tiers are not currently configured for this site.</p>
      <a href="javascript:" data-portal="signup" class="btn-tier-cta btn-tier-primary" style="display: inline-block; width: auto; padding: 0.6rem 1.5rem;">Join for Free</a>
    </div>
    {{/get}}
  </div>
</div>`;
};