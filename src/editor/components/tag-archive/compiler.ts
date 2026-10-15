import { BuilderBlock } from "@/types/theme";
import { resolveTagArchiveProps } from "./schema";
import { escapeHtml } from "../shared/escape";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveTagArchiveProps(block.props);
  const isBanner = p.layoutStyle === "banner";
  const wrapperId = `tag-archive-${block.id}`;

  const containerMargin =
    p.alignment === "left"
      ? "0 auto 0 0"
      : p.alignment === "right"
      ? "0 0 0 auto"
      : "0 auto";

  const textAlign = p.alignment;

  const descMargin =
    p.alignment === "left"
      ? "0 auto 1.25rem 0"
      : p.alignment === "right"
      ? "0 0 1.25rem auto"
      : "0 auto 1.25rem auto";

  if (isBanner) {
    return `{{#tag}}
<style>
  #${wrapperId} {
    text-align: ${textAlign};
    padding: 4rem 1rem 2.5rem 1rem;
    max-width: ${p.maxWidth};
    margin: ${containerMargin};
    box-sizing: border-box;
  }
  #${wrapperId} .gh-tag-eyebrow {
    font-size: 0.75rem;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ghost-accent-color, var(--color-accent));
    font-weight: 700;
    display: block;
    margin-bottom: 0.5rem;
  }
  #${wrapperId} .gh-tag-title {
    font-size: 2.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
    color: var(--color-fg, #171717);
  }
  #${wrapperId} .gh-tag-desc {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-muted, #666);
    max-width: 600px;
    margin: ${descMargin};
  }
  #${wrapperId} .gh-tag-count {
    font-family: monospace;
    font-size: 0.8125rem;
    background: var(--color-bg, #fafafa);
    border: 1px solid var(--color-hairline, #ebebeb);
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    color: var(--color-muted, #666);
  }
  #${wrapperId} .gh-tag-cover {
    margin-top: 2rem;
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
    max-height: 400px;
    margin-left: ${p.alignment === "right" ? "auto" : p.alignment === "center" ? "auto" : "0"};
    margin-right: ${p.alignment === "left" ? "auto" : p.alignment === "center" ? "auto" : "0"};
  }
  #${wrapperId} .gh-tag-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 640px) {
    #${wrapperId} {
      padding: 2rem 1rem 1.5rem 1rem !important;
      max-width: 100% !important;
      text-align: center !important;
    }
    #${wrapperId} .gh-tag-title {
      font-size: 1.875rem !important;
    }
  }
</style>
<header id="${wrapperId}" class="gh-tag-archive-header">
  <span class="gh-tag-eyebrow">Topic Archive</span>
  <h1 class="gh-tag-title">{{name}}</h1>
  {{#if description}}
  <p class="gh-tag-desc">{{description}}</p>
  {{/if}}
  ${p.showCount ? `<span class="gh-tag-count">{{plural count.posts empty="0 posts" singular="% post" plural="% posts"}}</span>` : ""}
  {{#if feature_image}}
  <div class="gh-tag-cover">
    <img src="{{img_url feature_image size="xl"}}" alt="{{name}}" />
  </div>
  {{/if}}
</header>
{{/tag}}`;
  }

  // Cloud / grid layout
  const mobileBreakpoint = 640;
  const tabletCols = Math.min(2, p.columns);
  const countMarkup = p.showCount
    ? `<span class="gh-tag-card-count">{{count.posts}} posts</span>`
    : "";

  return `<style>
  #${wrapperId} {
    padding: 1.5rem 0;
    max-width: ${p.maxWidth};
    margin: ${containerMargin};
    box-sizing: border-box;
  }
  #${wrapperId} .gh-tag-archive-title {
    font-size: 0.75rem;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #666);
    margin-bottom: 1rem;
    text-align: ${textAlign};
  }
  #${wrapperId} .gh-tag-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 0.75rem;
  }
  @media (min-width: ${mobileBreakpoint}px) {
    #${wrapperId} .gh-tag-grid {
      grid-template-columns: repeat(${tabletCols}, 1fr);
    }
  }
  @media (min-width: 768px) {
    #${wrapperId} .gh-tag-grid {
      grid-template-columns: repeat(${p.columns}, 1fr);
    }
  }
  #${wrapperId} .gh-tag-card {
    border: 1px solid var(--color-hairline, rgba(0,0,0,0.05));
    border-radius: var(--radius-sm, 4px);
    padding: 0.875rem 1rem;
    background-color: var(--color-bg, #fff);
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    color: var(--color-fg, #171717);
    transition: background-color 0.2s, border-color 0.2s;
    font-size: 0.8125rem;
    font-weight: 600;
  }
  #${wrapperId} .gh-tag-card:hover {
    background-color: var(--color-canvas-soft, #f5f5f5);
    border-color: var(--color-hairline-strong, #d4d4d4);
  }
  html.dark #${wrapperId} .gh-tag-card {
    background-color: var(--color-bg, #111);
    border-color: var(--color-hairline, #333);
    color: var(--color-fg, #fff);
  }
  html.dark #${wrapperId} .gh-tag-card:hover {
    background-color: rgba(255,255,255,0.05);
  }
  #${wrapperId} .gh-tag-card-count {
    font-size: 0.65rem;
    background-color: var(--color-canvas-soft, rgba(0,0,0,0.03));
    border: 1px solid var(--color-hairline, rgba(0,0,0,0.05));
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-sm, 4px);
    color: var(--color-muted, #666);
    font-family: monospace;
    white-space: nowrap;
  }
  @media (max-width: 640px) {
    #${wrapperId} {
      max-width: 100% !important;
    }
  }
</style>
<div id="${wrapperId}">
  <h3 class="gh-tag-archive-title">${escapeHtml(p.title || "Topics")}</h3>
  <div class="gh-tag-grid">
    {{#get "tags" limit="100"}}
      {{#foreach tags}}
        <a href="{{url}}" class="gh-tag-card">
          <span class="gh-tag-card-name">{{name}}</span>
          ${countMarkup}
        </a>
      {{/foreach}}
    {{/get}}
  </div>
</div>`;
};
