import { BuilderBlock } from "@/types/theme";
import { resolveTagHeaderProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveTagHeaderProps(block.props);

  const containerMargin =
    p.alignment === "left"
      ? "0 auto 0 0"
      : p.alignment === "right"
      ? "0 0 0 auto"
      : "0 auto";

  const textAlign = p.alignment;

  const badgeJustify =
    p.alignment === "left"
      ? "flex-start"
      : p.alignment === "right"
      ? "flex-end"
      : "center";

  const wrapperId = `tag-header-${block.id}`;

  return `{{#tag}}
<style>
  #${wrapperId} {
    text-align: ${textAlign};
    padding: 4rem 1rem 2.5rem 1rem;
    max-width: ${p.maxWidth};
    margin: ${containerMargin};
    box-sizing: border-box;
    width: 100%;
  }
  #${wrapperId} .gh-tag-cover {
    width: 100%;
    height: 280px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    border: 1px solid var(--color-hairline, #ebebeb);
    margin-left: ${p.alignment === "right" ? "auto" : p.alignment === "center" ? "auto" : "0"};
    margin-right: ${p.alignment === "left" ? "auto" : p.alignment === "center" ? "auto" : "0"};
  }
  #${wrapperId} .gh-tag-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    margin: 0 auto 1.25rem auto;
    margin-left: ${p.alignment === "right" ? "auto" : p.alignment === "center" ? "auto" : "0"};
    margin-right: ${p.alignment === "left" ? "auto" : p.alignment === "center" ? "auto" : "0"};
  }
  #${wrapperId} .gh-tag-count-wrap {
    display: flex;
    justify-content: ${badgeJustify};
  }
  #${wrapperId} .gh-tag-count {
    font-family: monospace;
    font-size: 0.8125rem;
    background: var(--color-bg, #fafafa);
    border: 1px solid var(--color-hairline, #ebebeb);
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    color: var(--color-muted, #666);
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
    #${wrapperId} .gh-tag-count-wrap {
      justify-content: center !important;
    }
    #${wrapperId} .gh-tag-cover,
    #${wrapperId} .gh-tag-desc {
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }
</style>
<header id="${wrapperId}" class="gh-tag-header">
  ${p.showFeatureImage ? `{{#if feature_image}}
  <div class="gh-tag-cover">
    <img src="{{img_url feature_image size="xl"}}" alt="{{name}}" />
  </div>
  {{/if}}` : ""}
  <span class="gh-tag-eyebrow">Topic Archive</span>
  <h1 class="gh-tag-title">{{name}}</h1>
  ${p.showDescription ? `{{#if description}}
  <p class="gh-tag-desc">{{description}}</p>
  {{/if}}` : ""}
  ${p.showCount ? `<div class="gh-tag-count-wrap">
    <span class="gh-tag-count">{{plural count.posts empty="0 posts" singular="% post" plural="% posts"}}</span>
  </div>` : ""}
</header>
{{/tag}}`;
};
