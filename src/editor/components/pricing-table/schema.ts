export type PricingCadenceMode = "monthly" | "yearly" | "both";
export type PricingCardStyle = "bordered" | "soft" | "elevated" | "minimal";
export type PricingButtonVariant = "solid" | "outline" | "pill";

export interface PricingSampleTier {
  id: string;
  name: string;
  description: string;
  type: "free" | "paid";
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  benefits: string[];
  isPopular?: boolean;
}

export interface PricingTableProps {
  title: string;
  subtitle: string;
  columns: number;
  cadenceMode: PricingCadenceMode;
  cardStyle: PricingCardStyle;
  featuredTierId: string;
  featuredBadgeText: string;
  showDescriptions: boolean;
  showBenefits: boolean;
  buttonVariant: PricingButtonVariant;
  freeButtonText: string;
  monthlyButtonText: string;
  yearlyButtonText: string;
  sampleTiers: PricingSampleTier[];
}

export const DEFAULT_SAMPLE_TIERS: PricingSampleTier[] = [
  {
    id: "sample-free",
    name: "Free",
    description: "Full access to public posts and weekly email newsletters.",
    type: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "USD",
    benefits: [
      "Access to all public posts",
      "Weekly newsletter digest",
      "Community commenting rights",
      "No ads or sponsors",
    ],
    isPopular: false,
  },
  {
    id: "sample-silver",
    name: "Silver",
    description: "Expanded access to subscriber-only guides and deep dives.",
    type: "paid",
    monthlyPrice: 5,
    yearlyPrice: 50,
    currency: "USD",
    benefits: [
      "Everything in Free",
      "Subscriber-only articles & archive",
      "Monthly AMA and discussion boards",
      "Early access to new releases",
    ],
    isPopular: true,
  },
  {
    id: "sample-gold",
    name: "Gold",
    description: "Full publication access plus private community & perks.",
    type: "paid",
    monthlyPrice: 15,
    yearlyPrice: 150,
    currency: "USD",
    benefits: [
      "Everything in Silver",
      "Direct author access via Slack",
      "Quarterly 1-on-1 consultations",
      "Exclusive downloadable resources",
    ],
    isPopular: false,
  },
];

export const defaultProps: PricingTableProps = {
  title: "Membership Plans",
  subtitle: "Choose the plan that fits you best. Upgrade or cancel anytime.",
  columns: 3,
  cadenceMode: "both",
  cardStyle: "bordered",
  featuredTierId: "sample-silver",
  featuredBadgeText: "Most Popular",
  showDescriptions: true,
  showBenefits: true,
  buttonVariant: "solid",
  freeButtonText: "Sign up free",
  monthlyButtonText: "Subscribe monthly",
  yearlyButtonText: "Subscribe yearly",
  sampleTiers: DEFAULT_SAMPLE_TIERS,
};

export const defaultStyles: Record<string, unknown> = {
  paddingTop: "4rem",
  paddingBottom: "4rem",
};

export const resolvePricingTableProps = (props?: Record<string, unknown>): PricingTableProps => {
  return {
    ...defaultProps,
    ...props,
    sampleTiers: Array.isArray(props?.sampleTiers)
      ? (props.sampleTiers as PricingSampleTier[])
      : defaultProps.sampleTiers,
  };
};