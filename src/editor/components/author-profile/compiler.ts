import { BuilderBlock } from "@/types/theme";
import { resolveAuthorProfileProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveAuthorProfileProps(block.props);
  const isBanner = p.layoutStyle === "banner";

  const containerMargin =
    p.alignment === "left"
      ? "0 auto 0 0"
      : p.alignment === "right"
      ? "0 0 0 auto"
      : "0 auto";

  const textAlign = p.alignment;

  const metaJustify =
    p.alignment === "left"
      ? "flex-start"
      : p.alignment === "right"
      ? "flex-end"
      : "center";

  const wrapperId = `author-profile-${block.id}`;

  if (isBanner) {
    return `{{#author}}
<style>
  #${wrapperId} {
    text-align: ${textAlign};
    padding: 4rem 1rem 2.5rem 1rem;
    max-width: ${p.maxWidth};
    margin: ${containerMargin};
    box-sizing: border-box;
  }
  #${wrapperId} .author-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 1.25rem auto;
    border: 2px solid var(--color-hairline, #ebebeb);
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    ${p.alignment === "left" ? "margin-left: 0; margin-right: auto;" : p.alignment === "right" ? "margin-left: auto; margin-right: 0;" : "margin-left: auto; margin-right: auto;"}
  }
  #${wrapperId} .author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .author-name {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
  }
  #${wrapperId} .author-bio {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-muted, #666);
    max-width: 600px;
    margin: 0 auto 1.25rem auto;
    ${p.alignment === "left" ? "margin-left: 0; margin-right: auto;" : p.alignment === "right" ? "margin-left: auto; margin-right: 0;" : "margin-left: auto; margin-right: auto;"}
  }
  #${wrapperId} .author-meta {
    font-size: 0.8125rem;
    color: var(--color-muted, #666);
    display: flex;
    flex-wrap: wrap;
    justify-content: ${metaJustify};
    gap: 1rem;
    align-items: center;
  }
  #${wrapperId} .author-meta a {
    color: var(--ghost-accent-color, var(--color-accent));
    text-decoration: none;
  }
  #${wrapperId} .author-post-count {
    font-family: monospace;
    background: var(--color-bg, #fafafa);
    border: 1px solid var(--color-hairline, #ebebeb);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }
  @media (max-width: 640px) {
    #${wrapperId} {
      padding: 2rem 1rem 1.5rem 1rem !important;
      max-width: 100% !important;
      text-align: center !important;
    }
    #${wrapperId} .author-avatar {
      margin: 0 auto 1rem auto !important;
    }
    #${wrapperId} .author-meta {
      justify-content: center !important;
    }
  }
</style>
<header id="${wrapperId}" class="author-header">
  {{#if profile_image}}
  <div class="author-avatar">
    <img src="{{img_url profile_image size="m"}}" alt="{{name}}" />
  </div>
  {{/if}}
  <h1 class="author-name">{{name}}</h1>
  {{#if bio}}
  <p class="author-bio">{{bio}}</p>
  {{/if}}
  <div class="author-meta">
    {{#if location}}<span>📍 {{location}}</span>{{/if}}
    {{#if website}}<a href="{{website}}" target="_blank" rel="noopener">🔗 Website</a>{{/if}}
    {{#if twitter}}<a href="{{social_url type="twitter"}}" target="_blank" rel="noopener">Twitter</a>{{/if}}
    {{#if facebook}}<a href="{{social_url type="facebook"}}" target="_blank" rel="noopener">Facebook</a>{{/if}}
    <span class="author-post-count">{{plural count.posts empty="0 posts" singular="% post" plural="% posts"}}</span>
  </div>
</header>
{{/author}}`;
  }

  // Card mode
  const cardFlexDir =
    p.alignment === "center"
      ? "column"
      : p.alignment === "right"
      ? "row-reverse"
      : "row";

  const cardAlignItems =
    p.alignment === "center"
      ? "center"
      : "center";

  const mobileAlignItems =
    p.alignment === "center"
      ? "center"
      : p.alignment === "right"
      ? "flex-end"
      : "flex-start";

  return `{{#foreach authors}}
<style>
  #${wrapperId} {
    width: 100%;
    max-width: ${p.maxWidth};
    margin: 2rem ${containerMargin};
    box-sizing: border-box;
  }
  #${wrapperId} .author-card {
    display: flex;
    flex-direction: ${cardFlexDir};
    align-items: ${cardAlignItems};
    text-align: ${textAlign};
    gap: 1.25rem;
    padding: 1.25rem;
    background: var(--color-bg, #fff);
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    text-decoration: none;
    color: inherit;
  }
  #${wrapperId} .author-card-avatar {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid var(--color-hairline, #ebebeb);
    flex-shrink: 0;
  }
  #${wrapperId} .author-card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .author-card-initial {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--ghost-accent-color, var(--color-accent));
    background: var(--color-canvas-soft, #f5f5f5);
  }
  #${wrapperId} .author-card-content {
    flex: 1;
    min-width: 0;
  }
  #${wrapperId} .author-card-eyebrow {
    display: block;
    font-size: 0.625rem;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #737373);
    font-weight: 600;
  }
  #${wrapperId} .author-card-name {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    margin: 0.25rem 0 0 0;
  }
  #${wrapperId} .author-card-name a {
    text-decoration: none;
    color: inherit;
  }
  #${wrapperId} .author-card-bio {
    font-size: 0.75rem;
    color: var(--color-muted, #737373);
    margin: 0.25rem 0 0 0;
    line-height: 1.5;
  }
  @media (max-width: 640px) {
    #${wrapperId} {
      max-width: 100% !important;
    }
    #${wrapperId} .author-card {
      flex-direction: column !important;
      text-align: ${textAlign} !important;
      align-items: ${mobileAlignItems} !important;
    }
  }
  html.dark #${wrapperId} .author-card {
    background: var(--color-bg, #111);
    border-color: var(--color-hairline, #333);
  }
</style>
<section id="${wrapperId}">
  <div class="author-card">
  {{#if profile_image}}
  <div class="author-card-avatar">
    <img src="{{img_url profile_image size="s"}}" alt="{{name}}" />
  </div>
  {{else}}
  <div class="author-card-avatar author-card-initial">
    <span>{{name}}</span>
  </div>
  {{/if}}
  <div class="author-card-content">
    <span class="author-card-eyebrow">Written by</span>
    <h4 class="author-card-name"><a href="{{url}}">{{name}}</a></h4>
    {{#if bio}}<p class="author-card-bio">{{bio}}</p>{{/if}}
  </div>
  </div>
</section>
{{/foreach}}`;
};
