export interface TOCProps {
  title: string;
  headingSelector: "h2" | "h2-h3" | "h2-h3-h4";
  layoutMode: "inline-card" | "sticky-sidebar";
  numbered: boolean;
  collapsible: boolean;
  defaultExpanded: boolean;
  showReadingProgress: boolean;
  emptyStateBehavior: "hide" | "show-placeholder";
}

export const defaultProps: TOCProps = {
  title: "Table of Contents",
  headingSelector: "h2-h3",
  layoutMode: "inline-card",
  numbered: true,
  collapsible: true,
  defaultExpanded: true,
  showReadingProgress: true,
  emptyStateBehavior: "hide",
};

export const defaultStyles = {
  backgroundType: "solid",
  backgroundColor: "var(--color-canvas-soft)",
};
