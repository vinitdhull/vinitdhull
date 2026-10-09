import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");

// 1. Check all anchor IDs
const hrefMatches = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
console.log("Checked anchor links:", hrefMatches);
let missing = false;
for (const id of hrefMatches) {
  if (id === "top") continue;
  const hasId = html.includes(`id="${id}"`);
  if (!hasId) {
    console.error("MISSING ID TARGET:", id);
    missing = true;
  } else {
    console.log("Target found:", id);
  }
}

// 2. Check all images have alt
const imgTags = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
console.log("Total img tags:", imgTags.length);
for (const img of imgTags) {
  if (!img.includes("alt=")) {
    console.error("MISSING ALT:", img);
    missing = true;
  }
}

// 3. Check for external links security
const extLinks = [...html.matchAll(/<a[^>]+target="_blank"[^>]*>/g)].map((m) => m[0]);
console.log("Total external links:", extLinks.length);
for (const link of extLinks) {
  if (!link.includes('rel="noreferrer"')) {
    console.error("Link missing rel=noreferrer:", link);
    missing = true;
  }
}

if (!missing) {
  console.log("ALL INTEGRITY CHECKS PASSED PERFECTLY!");
} else {
  process.exit(1);
}
