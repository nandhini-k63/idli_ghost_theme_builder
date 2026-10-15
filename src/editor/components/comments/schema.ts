import { HorizontalAlignment } from "../shared/GhostCoreLayoutControls";

export type CommentsAlignment = HorizontalAlignment;

export interface CommentsProps {
  heading: string;
  showCount: boolean;
  alignment: CommentsAlignment;
  maxWidth: string;
  responsivePadding: boolean;
}

export const defaultProps: CommentsProps = {
  heading: "Discussion",
  showCount: true,
  alignment: "center",
  maxWidth: "820px",
  responsivePadding: true,
};

export const defaultStyles = {};

export function resolveCommentsProps(props?: Record<string, unknown>): CommentsProps {
  const p = (props || {}) as Record<string, unknown>;
  const heading =
    typeof p.heading === "string"
      ? p.heading
      : typeof p.title === "string"
      ? p.title
      : defaultProps.heading;

  const showCount =
    p.showCount !== undefined ? Boolean(p.showCount) : defaultProps.showCount;

  const alignment: CommentsAlignment =
    p.alignment === "left" || p.alignment === "center" || p.alignment === "right"
      ? p.alignment
      : defaultProps.alignment;

  const maxWidth =
    typeof p.maxWidth === "string" && p.maxWidth.trim().length > 0
      ? p.maxWidth
      : defaultProps.maxWidth;

  const responsivePadding =
    p.responsivePadding !== undefined ? Boolean(p.responsivePadding) : defaultProps.responsivePadding;

  return {
    heading,
    showCount,
    alignment,
    maxWidth,
    responsivePadding,
  };
}
