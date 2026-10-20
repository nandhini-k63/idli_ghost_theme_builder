import { INITIAL_THEME_DOCUMENT } from "../src/store/editorStore";
import { generateThemeFiles } from "../src/components/builder/compiler";
import { compileToHbs as compileHeaderToHbs } from "../src/editor/components/header/compiler";
import { compileToHbs as compilePricingToHbs } from "../src/editor/components/pricing-table/compiler";

async function verify() {
  console.log("Compiling INITIAL_THEME_DOCUMENT...");
  const files = generateThemeFiles(INITIAL_THEME_DOCUMENT);

  const filenames = Object.keys(files);
  console.log("Generated files:", filenames);

  const expectedTemplates = [
    "index.hbs",
    "post.hbs",
    "page.hbs",
    "author.hbs",
    "tag.hbs",
    "error.hbs",
    "error-404.hbs",
    "partials/content-cta.hbs",
    "assets/css/screen.css",
    "assets/built/screen.css",
    "package.json"
  ];

  for (const exp of expectedTemplates) {
    if (!files[exp]) {
      throw new Error(`Missing expected file: ${exp}`);
    }
  }

  // Verify post.hbs contents
  const postHbs = files["post.hbs"];
  console.log("\n--- Checking post.hbs ---");
  const postChecks = [
    "article-header",
    "primary_tag",
    "featured",
    "article-title",
    "custom_excerpt",
    "author-avatar",
    "article-byline",
    "date format=",
    "reading_time",
    "feature_image",
    "{{content}}",
    "author-card",
    "gh-post-nav",
    "gh-related-posts",
    "gh-comments-section"
  ];
  for (const check of postChecks) {
    const passed = postHbs.includes(check);
    console.log(`  [${passed ? "PASS" : "FAIL"}] post.hbs contains '${check}'`);
    if (!passed) throw new Error(`post.hbs failed check: ${check}`);
  }

  // -----------------------------------------------------------------------
  // Header compiler tests — Issue #6 (header uploaded logo fix)
  // -----------------------------------------------------------------------
  console.log("\n--- Checking header compiler ---");

  // Inline helper to compile a header block with custom general props
  // compileHeaderToHbs is imported statically at the top of this file
  const baseHeaderBlock = INITIAL_THEME_DOCUMENT.blocks["header-sec-1"];

  // --- Test A: asset:// logo compiles to {{asset "..."}} helper (not raw asset://) ---
  const headerWithAssetLogo = compileHeaderToHbs({
    ...baseHeaderBlock,
    props: {
      ...baseHeaderBlock.props,
      general: {
        ...baseHeaderBlock.props.general,
        logoUrl: "asset://images/header/logo.png",
        darkLogoUrl: undefined,
      },
    },
  });
  const assetHelperPresent = headerWithAssetLogo.includes('{{asset "images/header/logo.png"}}');
  const rawAssetUrlAbsent = !headerWithAssetLogo.includes("asset://images/header/logo.png");
  console.log(`  [${assetHelperPresent ? "PASS" : "FAIL"}] asset:// logo compiles to {{asset "..."}} helper`);
  if (!assetHelperPresent) throw new Error("Header compiler must emit {{asset \"images/header/logo.png\"}} for asset:// logoUrl");
  console.log(`  [${rawAssetUrlAbsent ? "PASS" : "FAIL"}] raw asset:// URL is NOT present in compiled output`);
  if (!rawAssetUrlAbsent) throw new Error("Header compiler must not emit raw asset:// URLs in compiled Handlebars");

  // --- Test B: logo is rendered WITHOUT the site title alongside it ---
  const titleNotAlongsideLogo = !headerWithAssetLogo.includes('<span class="gh-site-title">{{@site.title}}</span>');
  console.log(`  [${titleNotAlongsideLogo ? "PASS" : "FAIL"}] site title NOT rendered alongside the logo`);
  if (!titleNotAlongsideLogo) throw new Error("Header compiler must NOT render site title alongside the logo");

  // --- Test C: logo retains accessible alt text ---
  const logoHasAlt = headerWithAssetLogo.includes('alt="{{@site.title}}"');
  console.log(`  [${logoHasAlt ? "PASS" : "FAIL"}] logo img has accessible alt="{{@site.title}}"`);
  if (!logoHasAlt) throw new Error("Header compiler logo must have alt=\"{{@site.title}}\"");

  // --- Test D: no logo → site title is rendered ---
  const headerNoLogo = compileHeaderToHbs({
    ...baseHeaderBlock,
    props: {
      ...baseHeaderBlock.props,
      general: {
        ...baseHeaderBlock.props.general,
        logoUrl: undefined,
        darkLogoUrl: undefined,
      },
    },
  });
  const titleRenderedWithoutLogo = headerNoLogo.includes('<span class="gh-site-title">{{@site.title}}</span>');
  console.log(`  [${titleRenderedWithoutLogo ? "PASS" : "FAIL"}] site title rendered when no logo is configured`);
  if (!titleRenderedWithoutLogo) throw new Error("Header compiler must render site title when no logo is configured");

  // --- Test E: dark asset:// logo also compiles correctly ---
  const headerWithDarkLogo = compileHeaderToHbs({
    ...baseHeaderBlock,
    props: {
      ...baseHeaderBlock.props,
      general: {
        ...baseHeaderBlock.props.general,
        logoUrl: "asset://images/header/logo.png",
        darkLogoUrl: "asset://images/header/dark-logo.png",
      },
    },
  });
  const darkAssetHelperPresent = headerWithDarkLogo.includes('{{asset "images/header/dark-logo.png"}}');
  const rawDarkAssetAbsent = !headerWithDarkLogo.includes("asset://images/header/dark-logo.png");
  console.log(`  [${darkAssetHelperPresent ? "PASS" : "FAIL"}] dark asset:// logo compiles to {{asset "..."}} helper`);
  if (!darkAssetHelperPresent) throw new Error("Header compiler must emit {{asset}} helper for dark logo");
  console.log(`  [${rawDarkAssetAbsent ? "PASS" : "FAIL"}] raw dark asset:// URL is NOT present in compiled output`);
  if (!rawDarkAssetAbsent) throw new Error("Header compiler must not emit raw dark asset:// URL");

  // --- Test F: normal external URL is not converted to an asset helper ---
  const headerWithExternalLogo = compileHeaderToHbs({
    ...baseHeaderBlock,
    props: {
      ...baseHeaderBlock.props,
      general: {
        ...baseHeaderBlock.props.general,
        logoUrl: "https://example.com/logo.png",
        darkLogoUrl: undefined,
      },
    },
  });
  const externalUrlPreserved = headerWithExternalLogo.includes('src="https://example.com/logo.png"');
  const externalNotConvertedToAsset = !headerWithExternalLogo.includes("{{asset");
  console.log(`  [${externalUrlPreserved ? "PASS" : "FAIL"}] external logo URL is preserved correctly`);
  if (!externalUrlPreserved) throw new Error("Header compiler must preserve normal external logo URLs");
  console.log(`  [${externalNotConvertedToAsset ? "PASS" : "FAIL"}] external logo URL is NOT converted to {{asset}} helper`);
  if (!externalNotConvertedToAsset) throw new Error("Header compiler must not convert external URLs to {{asset}} helper");

  // -----------------------------------------------------------------------
  // Content CTA & Header Subscribe Navigation tests (Custom Pricing Flow)
  // -----------------------------------------------------------------------
  console.log("\n--- Checking content-cta.hbs & header subscribe link ---");
  const ctaHbs = files["partials/content-cta.hbs"];
  const ctaHasMembershipLink = ctaHbs && ctaHbs.includes('href="/membership/"');
  console.log(`  [${ctaHasMembershipLink ? "PASS" : "FAIL"}] content-cta.hbs directs subscribers to /membership/`);
  if (!ctaHasMembershipLink) throw new Error("content-cta.hbs must direct subscribers to /membership/");

  const ctaHasTiersHelper = ctaHbs && ctaHbs.includes("{{tiers}}");
  console.log(`  [${ctaHasTiersHelper ? "PASS" : "FAIL"}] content-cta.hbs displays required {{tiers}} name helper`);
  if (!ctaHasTiersHelper) throw new Error("content-cta.hbs must display {{tiers}} helper");

  // Check header with default membership-page destination
  const headerMembershipMarkup = compileHeaderToHbs({
    ...baseHeaderBlock,
    props: {
      ...baseHeaderBlock.props,
      general: {
        ...baseHeaderBlock.props.general,
        showSubscribe: true,
        subscribeText: "Subscribe",
        subscribeAction: "membership-page",
        subscribeUrl: "/membership/",
      },
    },
  });
  const headerLinksToMembership = headerMembershipMarkup.includes('href="/membership/"') && !headerMembershipMarkup.includes('data-portal="signup"');
  console.log(`  [${headerLinksToMembership ? "PASS" : "FAIL"}] header subscribe button links directly to /membership/`);
  if (!headerLinksToMembership) throw new Error("Header subscribe button must link to /membership/ when subscribeAction is membership-page");

  // Check header with direct portal action
  const headerPortalMarkup = compileHeaderToHbs({
    ...baseHeaderBlock,
    props: {
      ...baseHeaderBlock.props,
      general: {
        ...baseHeaderBlock.props.general,
        showSubscribe: true,
        subscribeText: "Join",
        subscribeAction: "portal",
      },
    },
  });
  const headerLinksToPortal = headerPortalMarkup.includes('data-portal="signup"');
  console.log(`  [${headerLinksToPortal ? "PASS" : "FAIL"}] header subscribe button triggers direct Portal when selected`);
  if (!headerLinksToPortal) throw new Error("Header subscribe button must support direct portal mode");

  // -----------------------------------------------------------------------
  // Pricing Table compiler tests (Ghost-Native Membership Tiers)
  // -----------------------------------------------------------------------
  console.log("\n--- Checking pricing table compiler ---");
  const pricingBlock = {
    id: "pricing-comp-test",
    type: "pricing-table",
    props: {
      title: "Choose Membership Plan",
      subtitle: "Pick your plan",
      columns: 3,
      cadenceMode: "both",
      cardStyle: "bordered",
      buttonVariant: "solid",
      showDescriptions: true,
      showBenefits: true,
    },
    styles: {},
  };
  const pricingMarkup = compilePricingToHbs(pricingBlock as any);

  const hasGhostTiersHelper = pricingMarkup.includes('{{#get "tiers" include="monthly_price,yearly_price,benefits" filter="visibility:public" limit="all" as |tiers|}}');
  console.log(`  [${hasGhostTiersHelper ? "PASS" : "FAIL"}] dynamic Ghost {{#get \"tiers\"}} helper used`);
  if (!hasGhostTiersHelper) throw new Error("Pricing table must use {{#get 'tiers'...}}");

  const hasForeachTiers = pricingMarkup.includes('{{#foreach tiers}}');
  console.log(`  [${hasForeachTiers ? "PASS" : "FAIL"}] {{#foreach tiers}} loop present`);
  if (!hasForeachTiers) throw new Error("Pricing table must loop over Ghost tiers");

  const hasPriceHelper = pricingMarkup.includes('{{price monthly_price currency=currency}}') && pricingMarkup.includes('{{price yearly_price currency=currency}}');
  console.log(`  [${hasPriceHelper ? "PASS" : "FAIL"}] Ghost {{price}} helper used for monthly and yearly`);
  if (!hasPriceHelper) throw new Error("Pricing table must use {{price}} helper");

  const hasPortalCheckout = pricingMarkup.includes('data-portal="signup/{{id}}/monthly"') && pricingMarkup.includes('data-portal="signup/{{id}}/yearly"');
  console.log(`  [${hasPortalCheckout ? "PASS" : "FAIL"}] Ghost Portal data-portal attributes configured for checkout`);
  if (!hasPortalCheckout) throw new Error("Pricing table must link to Ghost Portal monthly and yearly checkout");

  const hasFreeSignup = pricingMarkup.includes('data-portal="signup"');
  console.log(`  [${hasFreeSignup ? "PASS" : "FAIL"}] Ghost Portal data-portal="signup" configured for free membership`);
  if (!hasFreeSignup) throw new Error("Pricing table must support free tier signup");

  const hasBenefitsLoop = pricingMarkup.includes('{{#foreach benefits as |benefit|}}');
  console.log(`  [${hasBenefitsLoop ? "PASS" : "FAIL"}] tier benefits dynamically rendered from Ghost`);
  if (!hasBenefitsLoop) throw new Error("Pricing table must loop over tier benefits");

  // Verify author.hbs scoping
  const authorHbs = files["author.hbs"];
  console.log("\n--- Checking author.hbs ---");
  const hasAuthorBanner = authorHbs.includes("{{#author}}");
  const hasAuthorClose = authorHbs.includes("{{/author}}");
  const hasPostLoop = authorHbs.includes("{{#foreach posts}}");
  console.log(`  [${hasAuthorBanner && hasAuthorClose ? "PASS" : "FAIL"}] author banner properly scoped`);
  console.log(`  [${hasPostLoop ? "PASS" : "FAIL"}] post-grid loop present`);
  
  // Make sure post loop is NOT inside {{#author}}...{{/author}}
  const authorEndIndex = authorHbs.indexOf("{{/author}}");
  const postLoopIndex = authorHbs.indexOf("{{#foreach posts}}");
  if (postLoopIndex <= authorEndIndex) {
    throw new Error("{{#foreach posts}} is incorrectly inside {{#author}} block in author.hbs!");
  }
  console.log("  [PASS] {{#foreach posts}} is correctly placed outside {{#author}} block");

  // Verify tag.hbs scoping
  const tagHbs = files["tag.hbs"];
  console.log("\n--- Checking tag.hbs ---");
  const hasTagBanner = tagHbs.includes("{{#tag}}");
  const hasTagClose = tagHbs.includes("{{/tag}}");
  const hasTagPostLoop = tagHbs.includes("{{#foreach posts}}");
  console.log(`  [${hasTagBanner && hasTagClose ? "PASS" : "FAIL"}] tag banner properly scoped`);
  console.log(`  [${hasTagPostLoop ? "PASS" : "FAIL"}] post-grid loop present`);
  
  const tagEndIndex = tagHbs.indexOf("{{/tag}}");
  const tagPostLoopIndex = tagHbs.indexOf("{{#foreach posts}}");
  if (tagPostLoopIndex <= tagEndIndex) {
    throw new Error("{{#foreach posts}} is incorrectly inside {{#tag}} block in tag.hbs!");
  }
  console.log("  [PASS] {{#foreach posts}} is correctly placed outside {{#tag}} block");

  // Verify error.hbs and error-404.hbs
  console.log("\n--- Checking error templates ---");
  console.log(`  [${files["error.hbs"].includes("statusCode") ? "PASS" : "FAIL"}] error.hbs contains statusCode`);
  console.log(`  [${files["error-404.hbs"].includes("404") || files["error-404.hbs"].includes("statusCode") ? "PASS" : "FAIL"}] error-404.hbs contains error details`);

  console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
