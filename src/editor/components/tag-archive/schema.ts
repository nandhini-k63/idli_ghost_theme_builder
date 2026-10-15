import { HorizontalAlignment } from "../shared/GhostCoreLayoutControls";

export interface TagArchiveProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  showImage?: boolean;
  showCount?: boolean;
  layoutStyle?: "banner" | "cloud";
  alignment: HorizontalAlignment;
  maxWidth: string;
  columns: 2 | 3 | 4 | 6;
}

export const defaultProps: TagArchiveProps = {
  title: "Engineering",
  description: "A comprehensive collection of software architecture patterns, developer tooling, and technical case studies.",
  imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=400&q=80",
  showImage: false,
  showCount: true,
  layoutStyle: "banner",
  alignment: "center",
  maxWidth: "820px",
  columns: 3,
};

export const defaultStyles = {};

export function resolveTagArchiveProps(raw?: Record<string, unknown>): TagArchiveProps {
  const alignment: HorizontalAlignment =
    raw?.alignment === "left" || raw?.alignment === "center" || raw?.alignment === "right"
      ? (raw.alignment as HorizontalAlignment)
      : defaultProps.alignment;

  const rawCols = Number(raw?.columns);
  const columns: 2 | 3 | 4 | 6 =
    [2, 3, 4, 6].includes(rawCols) ? (rawCols as 2 | 3 | 4 | 6) : defaultProps.columns;

  return {
    title: (raw?.title as string) || defaultProps.title,
    description: (raw?.description as string) || defaultProps.description,
    imageUrl: (raw?.imageUrl as string) || defaultProps.imageUrl,
    showImage: raw?.showImage === true,
    showCount: raw?.showCount !== false,
    layoutStyle: (raw?.layoutStyle as TagArchiveProps["layoutStyle"]) || "banner",
    alignment,
    maxWidth: typeof raw?.maxWidth === "string" && raw.maxWidth.trim().length > 0 ? raw.maxWidth : defaultProps.maxWidth,
    columns,
  };
}
