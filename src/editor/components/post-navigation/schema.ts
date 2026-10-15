import { HorizontalAlignment } from "../shared/GhostCoreLayoutControls";

export type PostNavAlignment = HorizontalAlignment | "split";

export interface PostNavigationProps {
  layoutStyle: "split" | "stacked" | "minimal" | "centered-arrows" | "image-background" | "large-typography";
  showExcerpt: boolean;
  showImage: boolean;
  columns: 1 | 2;
  alignment: PostNavAlignment;
  stackOnMobile: boolean;
}

export const defaultProps: PostNavigationProps = {
  layoutStyle: "split",
  showExcerpt: false,
  showImage: true,
  columns: 2,
  alignment: "split",
  stackOnMobile: true,
};

export const defaultStyles = {};

export function resolvePostNavigationProps(props?: Record<string, unknown>): PostNavigationProps {
  const p = (props || {}) as Record<string, unknown>;
  const general = (p.general || {}) as Record<string, unknown>;

  let raw = p.layoutStyle ?? p.layout ?? general.layoutStyle ?? general.layout;
  if (typeof raw === "object" && raw !== null && "desktop" in raw) {
    raw = (raw as { desktop?: unknown }).desktop;
  }

  let layoutStyle: PostNavigationProps["layoutStyle"] = "split";
  if (typeof raw === "string" && raw.trim().length > 0) {
    const l = raw.toLowerCase();
    if (l.includes("minimal")) layoutStyle = "minimal";
    else if (l.includes("stacked")) layoutStyle = "stacked";
    else if (l.includes("centered") || l.includes("arrow")) layoutStyle = "centered-arrows";
    else if (l.includes("image") || l.includes("editorial")) layoutStyle = "image-background";
    else if (l.includes("large") || l.includes("typography") || l.includes("modern")) layoutStyle = "large-typography";
    else if (l.includes("split") || l.includes("card")) layoutStyle = "split";
  }

  const columns: 1 | 2 =
    p.columns === 1 || general.columns === 1 || layoutStyle === "stacked" ? 1 : 2;

  const rawAlign = p.alignment ?? general.alignment;
  const alignment: PostNavAlignment =
    rawAlign === "left" || rawAlign === "center" || rawAlign === "right" || rawAlign === "split"
      ? (rawAlign as PostNavAlignment)
      : defaultProps.alignment;

  const stackOnMobile =
    p.stackOnMobile !== undefined
      ? Boolean(p.stackOnMobile)
      : general.stackOnMobile !== undefined
      ? Boolean(general.stackOnMobile)
      : defaultProps.stackOnMobile;

  return {
    layoutStyle,
    showExcerpt: p.showExcerpt !== undefined ? Boolean(p.showExcerpt) : (general.showExcerpt !== undefined ? Boolean(general.showExcerpt) : defaultProps.showExcerpt),
    showImage: p.showImage !== undefined ? Boolean(p.showImage) : (general.showImage !== undefined ? Boolean(general.showImage) : defaultProps.showImage),
    columns,
    alignment,
    stackOnMobile,
  };
}
