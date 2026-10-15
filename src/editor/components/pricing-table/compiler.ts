import { BuilderBlock } from "@/types/theme";
import { PricingTableProps, PricingTier, defaultProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";
import { escapeHtml } from "../shared/escape";

export const generateHTML = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as PricingTableProps;
  const styles = block.styles || {};
  const wrapperId = `pricing-${block.id}`;
  const bgCss = getBackgroundCSS(styles);
  const tiers = p.tiers && p.tiers.length > 0 ? p.tiers : defaultProps.tiers;

  const renderStaticTiers = (tiersList: PricingTier[]) => {
    return `
    <div class="gh-pricing-grid gh-tiers-count-${tiersList.length}">
      ${tiersList
        .map((tier) => {
          const isFeatured = tier.isFeatured;
          const badgeHtml = isFeatured
            ? `<div class="gh-pricing-badge">${escapeHtml(tier.badgeText || "Most Popular")}</div>`
            : "";
          const benefitsHtml =
            tier.benefits && tier.benefits.length > 0
              ? `<ul class="gh-pricing-benefits">
                ${tier.benefits
                  .map(
                    (b) => `<li>
                    <svg class="gh-check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>${escapeHtml(b)}</span>
                  </li>`
                  )
                  .join("\n")}
              </ul>`
              : "";

          const isFree = tier.monthlyPrice === 0 && tier.yearlyPrice === 0;
          const portalAttr = tier.portalAction?.startsWith("signup")
            ? tier.portalAction
            : `signup/${tier.portalAction || "free"}`;

          return `
          <div class="gh-pricing-card ${isFeatured ? "is-featured" : ""}">
            ${badgeHtml}
            <div class="gh-pricing-card-inner">
              <div class="gh-pricing-top">
                <h3 class="gh-pricing-title">${escapeHtml(tier.name)}</h3>
                ${tier.description ? `<p class="gh-pricing-desc">${escapeHtml(tier.description)}</p>` : ""}
                <div class="gh-pricing-price-box">
                  ${
                    isFree
                      ? `<div class="gh-price-item">
                          <span class="gh-price-amount">${escapeHtml(tier.currency || "$")}0</span>
                          <span class="gh-price-period">free forever</span>
                        </div>`
                      : `<div class="gh-price-item gh-price-monthly">
                          <span class="gh-price-amount">${escapeHtml(tier.currency || "$")}${tier.monthlyPrice}</span>
                          <span class="gh-price-period">/ month</span>
                        </div>
                        <div class="gh-price-item gh-price-yearly" style="display: none;">
                          <span class="gh-price-amount">${escapeHtml(tier.currency || "$")}${tier.yearlyPrice}</span>
                          <span class="gh-price-period">/ year</span>
                        </div>`
                  }
                </div>
              </div>

              ${benefitsHtml}

              <div class="gh-pricing-actions">
                <a href="javascript:" data-portal="${portalAttr}" class="gh-pricing-btn ${isFeatured ? "btn-featured" : ""}">
                  ${escapeHtml(tier.buttonText || "Choose Plan")}
                </a>
              </div>
            </div>
          </div>
          `;
        })
        .join("\n")}
    </div>`;
  };

  const dynamicTiersBlock = `
  {{#get "tiers" include="monthly_price,yearly_price,benefits" limit="all" as |tiers|}}
    {{#if tiers}}
    <div class="gh-pricing-grid gh-tiers-count-{{tiers.length}}">
      {{#foreach tiers}}
        <div class="gh-pricing-card {{#if featured}}is-featured{{/if}}">
          {{#if featured}}
            <div class="gh-pricing-badge">Most Popular</div>
          {{/if}}
          <div class="gh-pricing-card-inner">
            <div class="gh-pricing-top">
              <h3 class="gh-pricing-title">{{name}}</h3>
              {{#if description}}
                <p class="gh-pricing-desc">{{description}}</p>
              {{/if}}
              <div class="gh-pricing-price-box">
                {{#if monthly_price}}
                  <div class="gh-price-item gh-price-monthly">
                    <span class="gh-price-amount">{{price monthly_price currency=currency}}</span>
                    <span class="gh-price-period">/ month</span>
                  </div>
                  <div class="gh-price-item gh-price-yearly" style="display: none;">
                    <span class="gh-price-amount">{{price yearly_price currency=currency}}</span>
                    <span class="gh-price-period">/ year</span>
                  </div>
                {{else}}
                  <div class="gh-price-item">
                    <span class="gh-price-amount">{{price 0 currency=currency}}</span>
                    <span class="gh-price-period">free forever</span>
                  </div>
                {{/if}}
              </div>
            </div>

            {{#if benefits}}
            <ul class="gh-pricing-benefits">
              {{#foreach benefits}}
                <li>
                  <svg class="gh-check-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{name}}</span>
                </li>
              {{/foreach}}
            </ul>
            {{/if}}

            <div class="gh-pricing-actions">
              {{#if monthly_price}}
                <a href="javascript:" data-portal="signup/{{id}}/monthly" data-monthly-portal="signup/{{id}}/monthly" data-yearly-portal="signup/{{id}}/yearly" class="gh-pricing-btn {{#if featured}}btn-featured{{/if}}">
                  Subscribe
                </a>
              {{else}}
                <a href="javascript:" data-portal="signup/free" class="gh-pricing-btn">
                  Join for free
                </a>
              {{/if}}
            </div>
          </div>
        </div>
      {{/foreach}}
    </div>
    {{else}}
    ${renderStaticTiers(tiers)}
    {{/if}}
  {{/get}}`;

  const contentMarkup = p.useDynamicTiers ? dynamicTiersBlock : renderStaticTiers(tiers);

  return `
<style>
  #${wrapperId} {
    ${bgCss}
    padding: 5rem 1.5rem;
    box-sizing: border-box;
    font-family: inherit;
    color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-pricing-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  #${wrapperId} .gh-pricing-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 3rem auto;
  }
  #${wrapperId} .gh-pricing-heading {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.025em;
    margin: 0 0 0.75rem 0;
    color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-pricing-subheading {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-body, #525252);
    margin: 0;
  }
  #${wrapperId} .gh-pricing-toggle-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }
  #${wrapperId} .gh-pricing-toggle {
    display: inline-flex;
    background: var(--color-canvas-soft, #f5f5f5);
    border: 1px solid var(--color-hairline, #ebebeb);
    padding: 0.25rem;
    border-radius: 9999px;
    gap: 0.25rem;
  }
  #${wrapperId} .gh-toggle-btn {
    border: none;
    background: transparent;
    padding: 0.5rem 1.25rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--color-body, #737373);
  }
  #${wrapperId} .gh-toggle-btn.is-active {
    background: var(--color-ink, #171717);
    color: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  #${wrapperId} .gh-discount-pill {
    background: #fef3c7;
    color: #92400e;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    margin-left: 0.375rem;
  }

  /* Grid Layout */
  #${wrapperId} .gh-pricing-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
    align-items: stretch;
    margin-top: 1rem;
  }
  @media (min-width: 768px) {
    #${wrapperId} .gh-pricing-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .gh-pricing-grid.gh-tiers-count-3,
    #${wrapperId} .gh-pricing-grid:not(.gh-tiers-count-2):not(.gh-tiers-count-4) {
      grid-template-columns: repeat(3, 1fr);
    }
    #${wrapperId} .gh-pricing-grid.gh-tiers-count-4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Card Styles */
  #${wrapperId} .gh-pricing-card {
    position: relative;
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  #${wrapperId} .gh-pricing-card:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  }
  #${wrapperId} .gh-pricing-card.is-featured {
    border: 2px solid var(--color-ink, #171717);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
  }
  @media (min-width: 1024px) {
    #${wrapperId} .gh-pricing-card.is-featured {
      transform: scale(1.03);
      z-index: 2;
    }
  }
  #${wrapperId} .gh-pricing-badge {
    position: absolute;
    top: -0.875rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-ink, #171717);
    color: #ffffff;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.875rem;
    border-radius: 9999px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    white-space: nowrap;
  }
  #${wrapperId} .gh-pricing-card-inner {
    padding: 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
  }
  #${wrapperId} .gh-pricing-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-pricing-desc {
    font-size: 0.8125rem;
    color: var(--color-body, #737373);
    margin: 0 0 1.5rem 0;
    min-height: 2.5rem;
    line-height: 1.5;
  }
  #${wrapperId} .gh-pricing-price-box {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-hairline, #ebebeb);
  }
  #${wrapperId} .gh-price-amount {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-price-period {
    font-size: 0.8125rem;
    color: var(--color-mute, #a3a3a3);
    margin-left: 0.375rem;
  }

  /* Benefits */
  #${wrapperId} .gh-pricing-benefits {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex-grow: 1;
  }
  #${wrapperId} .gh-pricing-benefits li {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-check-icon {
    width: 1rem;
    height: 1rem;
    color: #10b981;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  /* CTA Button */
  #${wrapperId} .gh-pricing-actions {
    margin-top: 1rem;
  }
  #${wrapperId} .gh-pricing-btn {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: center;
    border-radius: 9999px;
    font-size: 0.8125rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--color-hairline-strong, #d4d4d4);
    color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-pricing-btn:hover {
    background: var(--color-canvas-soft, #f5f5f5);
  }
  #${wrapperId} .gh-pricing-btn.btn-featured {
    background: var(--color-ink, #171717);
    color: #ffffff;
    border-color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-pricing-btn.btn-featured:hover {
    opacity: 0.9;
  }
  #${wrapperId} .gh-pricing-note {
    text-align: center;
    font-size: 0.75rem;
    color: var(--color-mute, #a3a3a3);
    margin-top: 2.5rem;
  }

  /* Dark mode */
  html.dark #${wrapperId} {
    color: #ffffff;
  }
  html.dark #${wrapperId} .gh-pricing-heading,
  html.dark #${wrapperId} .gh-pricing-title,
  html.dark #${wrapperId} .gh-price-amount,
  html.dark #${wrapperId} .gh-pricing-benefits li {
    color: #ffffff;
  }
  html.dark #${wrapperId} .gh-pricing-card {
    background: var(--color-bg, #121212);
    border-color: rgba(255, 255, 255, 0.1);
  }
  html.dark #${wrapperId} .gh-pricing-card.is-featured {
    border-color: #ffffff;
  }
  html.dark #${wrapperId} .gh-pricing-toggle {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
  html.dark #${wrapperId} .gh-toggle-btn.is-active {
    background: #ffffff;
    color: #000000;
  }
  html.dark #${wrapperId} .gh-pricing-btn {
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
  html.dark #${wrapperId} .gh-pricing-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  html.dark #${wrapperId} .gh-pricing-btn.btn-featured {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
  }
</style>

<section id="${wrapperId}" class="gh-pricing-section">
  <div class="gh-pricing-container">
    <div class="gh-pricing-header">
      ${p.heading ? `<h2 class="gh-pricing-heading">${escapeHtml(p.heading)}</h2>` : ""}
      ${p.subheading ? `<p class="gh-pricing-subheading">${escapeHtml(p.subheading)}</p>` : ""}

      ${
        p.showBillingToggle
          ? `<div class="gh-pricing-toggle-wrap">
              <div class="gh-pricing-toggle" role="tablist">
                <button type="button" class="gh-toggle-btn is-active" data-interval="monthly">
                  Monthly billing
                </button>
                <button type="button" class="gh-toggle-btn" data-interval="yearly">
                  Annual billing
                  ${p.yearlyDiscountBadge ? `<span class="gh-discount-pill">${escapeHtml(p.yearlyDiscountBadge)}</span>` : ""}
                </button>
              </div>
            </div>`
          : ""
      }
    </div>

    ${contentMarkup}

    ${p.ctaNote ? `<p class="gh-pricing-note">${escapeHtml(p.ctaNote)}</p>` : ""}
  </div>

  <script>
    (function() {
      const section = document.getElementById("${wrapperId}");
      if (!section) return;
      const toggleBtns = section.querySelectorAll(".gh-toggle-btn");
      if (!toggleBtns.length) return;

      toggleBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          toggleBtns.forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          const interval = btn.getAttribute("data-interval");
          const isYearly = interval === "yearly";

          const monthlyEls = section.querySelectorAll(".gh-price-monthly");
          const yearlyEls = section.querySelectorAll(".gh-price-yearly");

          monthlyEls.forEach((el) => {
            el.style.display = isYearly ? "none" : "";
          });
          yearlyEls.forEach((el) => {
            el.style.display = isYearly ? "" : "none";
          });

          // Update dynamic portal links for monthly/yearly
          const portalBtns = section.querySelectorAll("[data-monthly-portal]");
          portalBtns.forEach((pBtn) => {
            const nextPortal = isYearly
              ? pBtn.getAttribute("data-yearly-portal")
              : pBtn.getAttribute("data-monthly-portal");
            if (nextPortal) {
              pBtn.setAttribute("data-portal", nextPortal);
            }
          });
        });
      });
    })();
  </script>
</section>`;
};

export const compileToHbs = generateHTML;
