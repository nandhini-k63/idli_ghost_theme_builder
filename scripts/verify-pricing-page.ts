
import { generateThemeFiles, compilePageToHbs } from "../src/components/builder/compiler";
import { INITIAL_THEME_DOCUMENT } from "../src/store/editorStore";
import { ThemeDocument } from "../src/types/theme";

// Clone the initial document and add a pricing-table block to the home page
const doc = JSON.parse(JSON.stringify(INITIAL_THEME_DOCUMENT)) as ThemeDocument;

// Add a pricing-table block
const pricingBlockId = "test-pricing-table-1";
doc.blocks[pricingBlockId] = {
  id: pricingBlockId,
  type: "pricing-table",
  props: {
    title: "Test Pricing",
    subtitle: "Choose a plan",
    columns: 3,
    cadenceMode: "both",
    cardStyle: "bordered",
    buttonVariant: "solid",
  },
  styles: { paddingTop: "4rem", paddingBottom: "4rem" },
};

// Add it to the home page sections
doc.pages.home.sections.push(pricingBlockId);

const files = generateThemeFiles(doc);

// Test 1: membership.hbs should exist
if (files["membership.hbs"]) {
  console.log("PASS: membership.hbs was auto-generated");
  const membershipContent = files["membership.hbs"] as string;
  if (membershipContent.includes("{{!< default}}")) {
    console.log("PASS: membership.hbs uses default.hbs layout");
  } else {
    console.log("FAIL: membership.hbs missing {{!< default}} wrapper");
    process.exit(1);
  }
  if (membershipContent.includes("gh-pricing-")) {
    console.log("PASS: membership.hbs contains pricing table HTML");
  } else {
    console.log("FAIL: membership.hbs missing pricing table HTML");
    process.exit(1);
  }
} else {
  console.log("FAIL: membership.hbs was NOT generated despite pricing-table block existing");
  process.exit(1);
}

// Test 2: pricing-table should NOT appear in index.hbs (home page)
const indexContent = files["index.hbs"] as string || "";
if (!indexContent.includes("gh-pricing-")) {
  console.log("PASS: pricing-table is excluded from index.hbs (home page)");
} else {
  console.log("FAIL: pricing-table incorrectly appears in index.hbs");
  process.exit(1);
}

// Test 3: membership.hbs should contain the full pricing-table compiled HTML
const membershipHbs = files["membership.hbs"] as string;
if (membershipHbs.includes('{{#get "tiers"')) {
  console.log("PASS: membership.hbs contains Ghost {{#get \"tiers\"}} helper");
} else {
  console.log("FAIL: membership.hbs missing Ghost tiers helper");
  process.exit(1);
}

console.log("\nAll pricing-table tests passed!");
