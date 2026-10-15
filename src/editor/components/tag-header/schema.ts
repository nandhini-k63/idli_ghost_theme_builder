import { HorizontalAlignment } from "../shared/GhostCoreLayoutControls";

export interface TagHeaderProps {
  showFeatureImage: boolean;
  showDescription: boolean;
  showCount: boolean;
  alignment: HorizontalAlignment;
  maxWidth: string;
}

export const defaultProps: TagHeaderProps = {
  showFeatureImage: true,
  showDescription: true,
  showCount: true,
  alignment: "center",
  maxWidth: "820px",
};

export const defaultStyles = {};

export function resolveTagHeaderProps(raw?: Record<string, unknown>): TagHeaderProps {
  const alignment: HorizontalAlignment =
    raw?.alignment === "left" || raw?.alignment === "center" || raw?.alignment === "right"
      ? (raw.alignment as HorizontalAlignment)
      : defaultProps.alignment;

  return {
    showFeatureImage: raw?.showFeatureImage !== false,
    showDescription: raw?.showDescription !== false,
    showCount: raw?.showCount !== false,
    alignment,
    maxWidth: typeof raw?.maxWidth === "string" && raw.maxWidth.trim().length > 0 ? raw.maxWidth : defaultProps.maxWidth,
  };
}
